import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { Colors } from '../../../theme/Index';
import RegExp from '../../../common/RegExp';
import { Toast } from '../../../common';
import { Header } from '../../../components/Index';
import { Send } from '../../../../utils/Http';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

class YbToSomeOne extends Component {
    constructor(props) {
        super(props);
        this.state = {
            price: '',
            amount: '',
            phone: '',
            tradePwd: '',
        };
    }

    inputOnChange = (type, value) => {
        switch (type) {
            case 'transferNum': {
                if (RegExp.integer.test(value) || value === '') {
                    this.setState({ amount: value });
                }
                break;
            }
            case 'phone':
                this.setState({ phone: value })
                break;
            case 'tradePwd':
                this.setState({ tradePwd: value })
                break;
            case 'price':
                this.setState({ price: value })
                break;

            default:
                break;
        }
    }

    btn = () => {
        const { amount, phone, tradePwd, price } = this.state;
        if (phone == '') {
            Toast.tipBottom('请输入对方手机号')
            return;
        }
        if (amount == '') {
            Toast.tipBottom('请输入转增数量')
            return;
        }
        if (price == '') {
            Toast.tipBottom('请输入转增价格')
            return;
        }
        if (tradePwd == '') {
            Toast.tipBottom('请输入您的支付密码')
            return;
        }
        Send(`api/Trade/YbToSomeOne`, this.state)
            .then((res) => {
                if (res.code == 200) {
                    Toast.tipBottom("转增成功 请到记录查看或者订单查看");
                } else {
                    Toast.tipBottom(res.message)
                }
            });
    }
    /**
       * 进入交易详情
       */
    onRightPress() {
        if (!this.props.logged) {
            Actions.push("Login");
            return;
        }
        Actions.push("BusinessPage", { businessType: 2, coinType: this.props.type, title: this.props.title });
    }
    render() {
        const { amount, phone, tradePwd, price } = this.state;
        return (
            <View style={{ backgroundColor: Colors.White }}>
                <Header title={'转增'} rightText="记录" onRightPress={() => this.onRightPress()} />
                <View style={{ paddingHorizontal: 10 }}>
                    <View style={styles.inputView}>
                        <TextInput
                            style={styles.input}
                            onChangeText={(value) => this.inputOnChange('phone', value)}
                            placeholder={'请输入对方手机号'}
                            keyboardType={'numeric'}
                            value={phone}
                        />
                    </View>
                    <View style={styles.inputView}>
                        <TextInput
                            style={styles.input}
                            onChangeText={(value) => this.inputOnChange('transferNum', value)}
                            placeholder={`请输入转增数量/ YB`}
                            keyboardType={'numeric'}
                            value={amount}
                        />
                    </View>
                    <View style={styles.inputView}>
                        <TextInput
                            style={styles.input}
                            onChangeText={(value) => this.inputOnChange('price', value)}
                            placeholder={`请输入转增价格/￥`}
                            keyboardType={'numeric'}
                            value={price}
                        />
                    </View>
                    <View style={styles.inputView}>
                        <TextInput
                            style={styles.input}
                            onChangeText={(value) => this.inputOnChange('tradePwd', value)}
                            placeholder={'交易密码'}
                            secureTextEntry={true}
                            value={tradePwd}
                        />
                    </View>
                </View>
                <TouchableOpacity style={styles.btn} onPress={this.btn}>
                    <Text style={{ fontSize: 16, color: Colors.White }}>确认转增</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const mapStateToProps = state => ({
    logged: state.user.logged,
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(YbToSomeOne);

const styles = StyleSheet.create({
    btn: { backgroundColor: Colors.C6, height: 40, marginHorizontal: 60, justifyContent: 'center', alignItems: 'center', marginTop: 20, borderRadius: 5 },
    inputView: { height: 50, borderBottomWidth: 1, borderBottomColor: Colors.C16 },
    input: {
        height: 50
    },
})
