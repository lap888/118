import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, ImageBackground, StyleSheet, SafeAreaView, ScrollView, RefreshControl, Platform } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';

import { LOGOUT, UPDATE_USER_AVATAR } from '../../../redux/ActionTypes';
import { Colors, Metrics } from '../../theme/Index';
import MiningMachinery from './miningMachinery/MiningMachinery';
// import MiningMachinery from './MiningMachineryHook';
import { Loading, Toast } from '../../common';
import { Coin, TaskApi } from '../../../api';
import CurrencyApi from '../../../api/yoyoTwo/currency/CurrencyApi';
import { Header } from '../../components/Index';
import Advert from '../advert/Advert';

const PLAY_OPTIONS = [
    { key: 1, name: "广告宝", route: 'MiningMachineryShop', image: require('../../images/home2/kuangji.png'), icon: '' },
    { key: 2, name: "兑换", route: 'Substitution', image: require('../../images/home2/duihuan.png'), icon: '' },
    { key: 12, name: "城市大厅", icon: 'flash', route: 'CityShow', image: require('../../images/my/chengshidating.png') },
    { key: 3, name: "资产", route: 'Accounting', image: require('../../images/home2/zhangwu.png'), icon: '' },
    { key: 4, name: "广告中心", route: 'NOtc', image: require('../../images/home2/liulanqi.png'), icon: '' },


];

class Home2Screen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            minningList: [{}],
            bannerList: [],
            isLoading: false,
            refreshing: false,
            merber: ''
        };
    }

    componentDidMount() {
        this.onRefresh();
    }

    onRefresh = () => {
        this.getMinningList()
    }

    getMinningList = () => {
        CurrencyApi.getMinningList()
            .then((data) => {
                this.setState({
                    minningList: data,
                    refreshing: false
                })
            }).catch((err) => this.setState({ refreshing: false }))
    }

    setLoading = (value) => {
        this.setState({ isLoading: value })
    }

    repairMinning = (mid) => {
        this.setState({ isLoading: true })
        Coin.repairMinning(mid)
            .then((data) => {
                Toast.tip('修复成功')
                this.getMinningList()
                this.setState({ isLoading: false })
            }).catch((err) => { this.setState({ isLoading: false }); console.log('err', err) })
    }

    onOptionPress = (route) => {
        Actions.push(route);
    }

    vipDoTask = () => {
        const callback = () => {
            TaskApi.vipDoTask()
                .then((data) => {
                    this.onRefresh();
                }).catch((err) =>
                    setTimeout(() => {
                        Toast.tip(err.message)
                    }, 0)
                )
        }
        if (Platform.OS == "android") {
            Advert.rewardVideo((res) => {
                if (res) {
                    callback();
                } else {
                    Toast.tip(res)
                }
            })
        } else {
            this.timeout = setTimeout(() => {
                callback();
            }, 10000)
        }
    }
    onClickLevelBar() {
        if (this.props.logged) {
            Actions.push('Level');
        } else {
            Actions.push('Login');
        }
    }
    /**
     *  用户等级 卡牌图
     * */
    renderLevelCard = () => {
        let { golds, level } = this.props;
        return (
            <View style={{ height: 70, marginTop: 10, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10 }}>
                <ImageBackground resizeMode={'contain'} style={{ width: Metrics.screenWidth - 20, height: (Metrics.screenWidth - 20) / 6.74 }} source={require('../../images/my/gongxianbg.png')}>
                    <TouchableOpacity style={styles.level} onPress={() => this.onClickLevelBar()}>
                        <View style={{ flex: 1, marginLeft: 15, marginRight: 12, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={styles.levelText}>{level}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.contributionValueText}>{`贡献值${golds}`}</Text>
                            </View>
                        </View>
                        <View style={{ height: 30, width: 1, backgroundColor: Colors.White }} />
                        <View style={{ flex: 2, paddingLeft: 12, alignItems: 'center' }}>
                            {/* <Text style={styles.levelPropaganda}>{`推广越多 等级越高 手续费越低`}</Text> */}
                            <Text style={[styles.levelPropaganda, { marginTop: 4, fontSize: 11 }]}>点击查看贡献值规则</Text>
                        </View>
                    </TouchableOpacity>
                </ImageBackground>
            </View>

        )
    }

    renderOptions = () => {
        return (
            <View style={{ flexDirection: 'row', paddingHorizontal: 20, marginVertical: 5, flexWrap: 'wrap' }}>
                {
                    PLAY_OPTIONS.map((item, index) => {
                        return (
                            <TouchableOpacity key={index} style={{ width: (Metrics.screenWidth - 40) / 5, marginTop: 10 }} onPress={() => this.onOptionPress(item.route)}>
                                <View style={styles.optionItem}>
                                    <Image source={item.image} style={{ width: 36, height: 36 }} />
                                    <Text style={styles.optionTitle}>{item.name}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    })
                }
            </View>
        )
    }
    vipComponent = () => {
        return (
            <View>
                <View style={{ flexDirection: 'row', paddingHorizontal: 20, marginVertical: 10 }}>
                    <TouchableOpacity style={{ marginVertical: 10, flex: 4 }} onPress={() => Actions.push('MemberCard')}>
                        {/* <TouchableOpacity style={{ marginVertical: 10, flex: 4 }} onPress={() => { }}> */}
                        <Image resizeMode={'stretch'} style={{ width: (Metrics.screenWidth - 40) * 4 / 7, height: (Metrics.screenWidth - 40) * 4 / 7 / 1.59, borderRadius: 5 }} source={require('../../images/home2banner.jpg')} />
                    </TouchableOpacity>
                    <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity style={styles.yuan1} activeOpacity={0.8} onPress={this.vipDoTask} >
                            <View style={styles.yuan2}>
                                <Text>一键完成</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Header title={'任务中心'} />
                <View style={{ flex: 1, backgroundColor: Colors.backgroundColor }}>
                    <ScrollView style={{ paddingTop: 10 }} refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}>
                        {this.renderOptions()}
                        {this.renderLevelCard()}
                        {this.vipComponent()}
                        {/* <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 5 }}>
                            <Image source={require('../../images/home2/wodekuangji.png')} />
                        </View> */}
                        <View>
                            {this.state.minningList.map((item, index) => {
                                return (
                                    <MiningMachinery
                                        ref={(miningMachinery) => this.machinery = miningMachinery}
                                        key={index + JSON.stringify(item)}
                                        data={item}
                                        repair={this.repairMinning}
                                        setLoading={this.setLoading}
                                    />
                                )
                            })}
                        </View>
                        <View style={{ height: 20 }} />
                    </ScrollView>
                    {this.state.isLoading ? <Loading /> : null}
                </View>
            </SafeAreaView>
        );
    }
}

const mapStateToProps = state => ({
    level: state.user.level,
    golds: state.user.golds,
    logged: state.user.logged,
    userId: state.user.id,
    mobile: state.user.mobile,
    name: state.user.name,
    avatarUrl: state.user.avatarUrl,
    inviterMobile: state.user.inviterMobile,
    reWeChatNo: state.user.reWeChatNo,
    reContactTel: state.user.reContactTel,
    myWeChatNo: state.user.myWeChatNo,
    myContactTel: state.user.myContactTel,
    auditState: state.user.auditState,

});

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch({ type: LOGOUT }),
    updateUserAvatar: avatar => dispatch({ type: UPDATE_USER_AVATAR, payload: { avatar } })
});

export default connect(mapStateToProps, mapDispatchToProps)(Home2Screen);

const styles = StyleSheet.create({
    level: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    levelText: { fontSize: 18, color: Colors.White, fontWeight: 'bold' },
    contributionValueText: { marginTop: 4, fontSize: 12, color: Colors.White },
    levelPropaganda: { fontSize: 12, color: Colors.White },
    optionTouch: {
        flex: 1
    },
    optionItem: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionTitle: {
        marginTop: 8,
        fontSize: 14,
        color: Colors.grayFont
    },
    callWe: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // position: 'absolute',
        // bottom: 0,
        backgroundColor: Colors.transparent,
        marginVertical: 10
    },
    wiper: {
        height: 60,
        overflow: "hidden",
        marginVertical: 5,
        marginHorizontal: 15,
        borderRadius: 6
    },
    banner: {
        height: 60,
        width: '100%'
    },
    yuan1: {
        backgroundColor: Colors.main,
        height: 100,
        width: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    yuan2: {
        backgroundColor: Colors.backgroundColor,
        width: 85,
        height: 85,
        borderRadius: 42.5,
        justifyContent: 'center',
        alignItems: 'center'
    },
})