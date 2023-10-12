import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { LOGOUT, UPDATE_USER_AVATAR } from '../../../redux/ActionTypes';
import { Colors, Metrics } from '../../theme/Index';
import { Toast } from '../../common';
import { TaskApi } from '../../../api';
import CurrencyApi from '../../../api/yoyoTwo/currency/CurrencyApi';
import { Header } from '../../components/Index';
import Advert from '../advert/Advert';
import { Send } from '../../../utils/Http';

import RefreshListView, { RefreshState } from 'react-native-refresh-list-view';

const PLAY_OPTIONS = [
    { key: 1, name: "荣耀碎片", route: 'jifen', color: '#FFA500', image: require('../../images/home2/kuangji.png'), icon: '' },
    { key: 2, name: "荣耀值", route: 'xfjifen', color: '#4cc700', image: require('../../images/home2/duihuan.png'), icon: '' },
    { key: 3, name: "消费券", route: 'xfq', color: '#00BFFF', image: require('../../images/home2/zhangwu.png'), icon: '' },
];
class XfqScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            adLists: [],
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0,
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
        CurrencyApi.getVideoList()
            .then((res) => {
                if (res.code == 200) {
                    this.setState({
                        refreshing: false,
                        adLists: res.data,
                        totalPage: 5,
                        refreshState: res.data.length < 1 ? RefreshState.EmptyData : RefreshState.Idle
                    })
                } else {
                    this.setState({
                        adLists: [],
                        totalPage: 0,
                        refreshState: RefreshState.EmptyData
                    })
                }
            }).catch((err) => this.setState({ refreshing: false }))
    }


    onOptionPress = (item) => {
        Actions.push('AdFlowDetails', { data: item })
    }

    renderOptions = () => {
        return (
            <View style={{ flexDirection: 'row', paddingHorizontal: 20, marginBottom: 10, marginVertical: 5, flexWrap: 'wrap' }}>
                {
                    PLAY_OPTIONS.map((item, index) => {
                        return (
                            <TouchableOpacity key={index} style={{ width: (Metrics.screenWidth - 40) / 3, marginTop: 10 }} onPress={() => this.onOptionPress(item)}>
                                <View style={styles.optionItem}>
                                    <View style={{ flex: 1, backgroundColor: item.color, padding: 10, borderRadius: 55, width: 80, height: 80, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ color: Colors.White }}>{item.name}</Text>
                                    </View>
                                    <Text style={styles.optionTitle}>{item.name}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    })
                }
            </View>
        )
    }

    quickenTask = (item) => {
        if (!this.props.logged) {
            Actions.push("Login");
            return;
        }
        const callback = (pId) => {
            TaskApi.lookDayVideo(item.id, pId)
                .then((res) => {
                    if (res.code == 200) {
                        Toast.tip('恭喜您领取到1个荣耀碎片')
                        Actions.pop()
                    } else {
                        Toast.tipBottom(res.message)
                    }
                    // this.onRefresh()
                })
        }
        if (item.isFinish == true) {
            Toast.tip('当前打卡已经完成...')
            return;
        }
        let hTime = item.id;
        
        var nowHTime = new Date().getHours()
        if (nowHTime != hTime) {
            Toast.tip('当前时间不可进行此打卡...')
            return;
        }
        if (Platform.OS === "android") {
            Advert.rewardVideo((res) => {
                if (res) {
                    callback(res);
                } else {
                    Toast.tipBottom('打卡失败,请稍后再试...')
                }
            })
        } else {
            Toast.tip('ios暂时不支持')
        }
    }
    renderItem = (item, index) => {
        let source = require('../../images/home/icon_zuanshi.png');
        return (
            <TouchableOpacity key={index} style={[styles.miningItem, { backgroundColor: item.color, opacity: 0.8, marginTop: 10, borderRadius: 5, paddingVertical: 25 }]} onPress={() => { this.quickenTask(item) }}>
                <View style={styles.miningItemHeader}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <Image style={{ width: 40, height: 40 }} resizeMode={'contain'} source={source} />
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <Text style={styles.miningItemActivity}>{`${item.title}`}</Text>
                            <Text style={{ fontSize: 13, marginLeft: 5, marginTop: 5 }}>{`完成奖励:${1}荣耀碎片`}</Text>
                            <Text numberOfLines={3} style={styles.miningItemName}>{`${item.desc}`}</Text>
                        </View>
                    </View>
                    <View style={{ marginLeft: 10, height: 20, borderWidth: 1, borderColor: Colors.White, borderRadius: 10, paddingHorizontal: 10, alignItems: 'center' }}>
                        <Text style={{ color: Colors.White, }}>{`${item.isFinish ? '完成' : '未完成'}`}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    onRightPress() {
        Send(`api/system/CopyWriting?type=v_ad_rule`, {}, 'get').then(res => {
            Actions.push('CommonRules', { title: '说明', rules: res.data });
        });
    }
    keyExtractor = (item, index) => {
        return index.toString()
    }
    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Header title={'爱打卡'} rightText="说明" rightStyle={{ color: Colors.White }} onRightPress={() => this.onRightPress()} />
                <View style={{ backgroundColor: Colors.backgroundColor }}>
                    <RefreshListView
                        data={this.state.adLists}
                        keyExtractor={this.keyExtractor}
                        renderItem={({ item, index }) => this.renderItem(item, index)}
                        refreshState={this.state.refreshState}
                        onHeaderRefresh={this.onRefresh}
                        // 可选
                        footerRefreshingText='正在玩命加载中...'
                        footerFailureText='我擦嘞，居然失败了 =.=!'
                        footerNoMoreDataText='暂无更多数据...'
                        footerEmptyDataText='暂无更多数据...'
                    />
                </View>
            </SafeAreaView >
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

export default connect(mapStateToProps, mapDispatchToProps)(XfqScreen);

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
    miningItem: { flex: 1, marginHorizontal: 8, paddingHorizontal: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.C7 },
    miningItemHeader: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    miningItemName: { fontSize: 13, marginLeft: 5, color: Colors.White, marginTop: 5 },
    miningItemActivity: { fontSize: 16, marginLeft: 5, color: Colors.White },
})