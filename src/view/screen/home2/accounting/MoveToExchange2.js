import React, { Component } from 'react';
import { View, Text, TextInput, Pressable, TouchableOpacity, StyleSheet, ScrollView, Platform, AppState } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/AntDesign';
import { connect } from 'react-redux';

import { CandyApi, UserApi } from '../../../../api';
import { getRandom } from '../../../../utils/BaseValidate';
import { Send } from '../../../../utils/Http';
import { Loading, RegExp, Toast } from '../../../common';
import { Header } from '../../../components/Index';
import { Colors } from '../../../theme/Index';
import Advert from '../../advert/Advert';

class MoveToExchange2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            Amount: '',
            Uuid: '',
            PayPwd: '',
            isLoading: false,
            num: 0,
            appState: AppState.currentState,
        };
    }

    componentDidMount() {
        this.getNum()
        AppState.addEventListener("change", this._handleAppStateChange);
    }
    componentWillUnmount() {
        AppState.removeEventListener("change", this._handleAppStateChange);
    }

    _handleAppStateChange = nextAppState => {
        if (this.state.appState.match(/inactive|background/)) {
            clearTimeout(this.timeout);
        }
        this.setState({ appState: nextAppState, isLoading: false });
    };


    getNum = () => {
        CandyApi.getIntegral()
            .then((data) => {
                this.setState({
                    num: data.balance,
                    isLoading: false
                })
            }).catch((err) => this.setState({ isLoading: false }))
    }

    setNum = () => {
        CandyApi.setObtainIntegral()
            .then((data) => {
                this.getNum()
            }).catch((err) => this.setState({ isLoading: false }))
    }

    onRightPress() {
        Send(`api/system/CopyWriting?type=withdrawal_rule`, {}, 'get').then(res => {
            Actions.push('CommonRules', { title: '提币规则', rules: res.data });
        });
    }

    post = () => {
        const { Amount, Uuid, PayPwd, data } = this.state;
        if (Uuid == '') {
            Toast.tip('请填写转出地址')
            return;
        }
        if (Amount == '') {
            Toast.tip('请填写转让数量')
            return;
        }
        if (PayPwd == '') {
            Toast.tip('请填写支付密码')
            return;
        }
        this.setState({ isLoading: true }, () => {
            UserApi.toSmallFish({ Amount: Number(Amount), Uuid, PayPwd, CoinType: data.coinType })
                .then((data) => {
                    this.setState({ isLoading: false });
                    Toast.tip('转出成功');
                    Actions.pop();
                }).catch((err) => this.setState({ isLoading: false }))
        })
    }


    lookAd = () => {
        this.setState({ isLoading: true }, () => {
            if (Platform.OS === 'android') {
                Advert.rewardVideo((res) => {
                    if (res) {
                        this.setNum()
                    } else {
                        Toast.tip(res);
                    }
                })
            } else {
                setTimeout(() => {
                    this.setNum()
                }, 10000);
            }
        })
    }

    setAmount = (value) => {
        if (RegExp.integer.test(value) || value === '') {
            this.setState({ Amount: value })
        }
    }

    render() {
        const { data } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <Header title={`${data.coinType}提币`} rightText={'规则'} onRightPress={this.onRightPress} />
                <ScrollView style={{ paddingHorizontal: 20, marginTop: 10, flex: 1 }}>
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ fontSize: 14, color: Colors.C12 }}>提币地址</Text>
                        <View style={{ height: 50, borderBottomColor: Colors.C13, borderBottomWidth: 1, }}>
                            <TextInput
                                style={{ flex: 1 }}
                                placeholder={'区块链地址'}
                                value={this.state.Uuid}
                                onChangeText={(value) => this.setState({ Uuid: value })}
                            />
                        </View>
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ fontSize: 14, color: Colors.C12 }}>数量</Text>
                        <View style={{ flexDirection: 'row', height: 50, borderBottomColor: Colors.C13, borderBottomWidth: 1, }}>
                            <TextInput
                                style={{ flex: 1 }}
                                placeholder={`最低提${1}${data.coinType}`}
                                value={this.state.Amount}
                                keyboardType={'number-pad'}
                                onChangeText={this.setAmount}
                            />
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontSize: 13, color: Colors.C10 }}>{data.balance} | </Text>
                                <Pressable onPress={() => this.setState({ Amount: `${parseInt(data.balance)}` })}>
                                    <Text>全部</Text>
                                </Pressable>
                            </View>
                        </View>
                        <Text style={{ fontSize: 10, color: Colors.C10, marginTop: 5 }}>{`可用 ${data.balance} ${data.coinType}`}</Text>
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ fontSize: 14, color: Colors.C12 }}>交易密码</Text>
                        <View style={{ height: 50, borderBottomColor: Colors.C13, borderBottomWidth: 1, }}>
                            <TextInput
                                style={{ flex: 1 }}
                                placeholder={'请输入交易密码'}
                                secureTextEntry={true}
                                value={this.state.PayPwd}
                                onChangeText={(value) => this.setState({ PayPwd: value })}
                            />
                        </View>
                    </View>
                    <View style={{ height: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, color: Colors.grayFont }}>提币积分: <Text style={{ color: Colors.main, fontWeight: 'bold' }}>{this.state.num}</Text></Text>
                        <TouchableOpacity style={styles.addNum} onPress={this.lookAd}>
                            <Icon name={'play'} color={Colors.White} size={14} />
                            <Text style={{ fontSize: 14, color: Colors.White }}> 增加积分</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <TouchableOpacity style={styles.btnpost} onPress={this.post}>
                    <Text style={{ fontSize: 16, color: Colors.White }}>提交</Text>
                </TouchableOpacity>
                {this.state.isLoading && <Loading />}
            </View>
        );
    }
}
const mapStateToProps = state => ({
    candyNum: state.user.candyNum,
});
const mapDispatchToProps = dispatch => ({
    updateUserInfo: (userInfo) => dispatch({ type: UPDATE_USER, payload: { userInfo } })
});
export default connect(mapStateToProps, mapDispatchToProps)(MoveToExchange2);

const styles = StyleSheet.create({
    btnpost: {
        height: 40,
        marginBottom: 10,
        marginHorizontal: 30,
        backgroundColor: Colors.main,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20
    },
    btnpost2: {
        height: 40,
        marginBottom: 10,
        marginHorizontal: 30,
        backgroundColor: Colors.grayFont,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20
    },
    addNum: {
        height: 30,
        paddingHorizontal: 20,
        backgroundColor: Colors.Green,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        flexDirection: 'row'
    },

})
