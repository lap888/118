/*
 * @Author: top.brids 
 * @Date: 2019-12-30 09:09:54 
 * @Last Modified by: top.brids
 * @Last Modified time: 2021-08-09 11:26:02
 */

import React, { Component } from 'react';
import { View, Text, TouchableWithoutFeedback, TouchableOpacity, Image, StyleSheet, ImageBackground, Pressable } from 'react-native';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { Actions } from 'react-native-router-flux';
import { Icon } from 'native-base';
import { UPDATE_DIVIDEND_INFO } from '../../../redux/ActionTypes';
import { MathFloat } from '../../../utils/Index';
import { Metrics, Colors } from '../../theme/Index';
import { Header, ListGap } from '../../components/Index';
import { Send } from '../../../utils/Http';
import { Toast } from '../../common';

class GameDividend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            walletDrawRule: []
        };
    }


    UNSAFE_componentWillMount() {
        this.willFocusSubscription = this.props.navigation.addListener('willFocus', () => this.fetchBalance());
    }

    componentDidMount() {
        this.loadWalletDrawPRule();
    }
    loadWalletDrawPRule = () => {
        Send(`api/system/CopyWriting?type=wallet_draw_rule`, {}, 'get').then(res => {
            this.setState({
                walletDrawRule: res.data
            })
        });
    }

    componentWillUnmount() {
        if (this.willFocusSubscription) this.willFocusSubscription.remove();
    }
    /**
     * 获取提现金额信息
     */
    fetchBalance() {
        var that = this;
        Send("api/Account/WallerInfo", {}, 'get').then(res => {
            if (res.code == 200) {
                let { availableAmount, totalAmount, freezeAmount, totalOutlay, totalIncome } = res.data;
                that.props.resetDividendInfo(totalAmount, freezeAmount, availableAmount);
            } else {
                Toast.tipBottom(res.message)
                // Toast.show({
                //     text: res.message,
                //     textStyle: { color: '#FFFFFF', textAlign: 'center' },
                //     position: "bottom",
                //     duration: 2000
                // });
            }
        });
    }
    /**
     * 进入分红规则界面
     */
    toGameDividendRule() {
        Actions.push('CommonRules', { title: '钱包提现', rules: this.state.walletDrawRule });
    }
    render() {
        let { userBalanceLock, userBalanceNormal, userBalanceTotal } = this.props;
        let enableWithDraw = userBalanceNormal >= 1;
        return (
            <View style={Styles.containr}>
                <Header backgroundColor={'#F48354'} title="钱包" rightStyle={{ fontSize: 12 }} rightText={'流水明细'} onRightPress={() => Actions.push('GameDividendIncomeList')} />
                <View style={{ flex: 1 }}>
                    <ImageBackground style={{ height: 150 }} source={require('../../images/mine/wallet/walletBG.png')}>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <Text style={{ marginTop: 20, fontSize: 12, color: Colors.White }}>账户余额(元)</Text>
                            <Text style={Styles.balanceText}>{MathFloat.floor(userBalanceTotal, 2)}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 12, color: Colors.White }}>可提现金额</Text>
                                <Text style={{ fontSize: 12, color: Colors.White, marginTop: 5 }}>{MathFloat.floor(userBalanceNormal, 2)}</Text>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 12, color: Colors.White }}>冻结金额</Text>
                                <Text style={{ fontSize: 12, color: Colors.White, marginTop: 5 }}>{MathFloat.floor(userBalanceLock, 2)}</Text>
                            </View>
                        </View>
                    </ImageBackground>
                    <View style={{ flexDirection: 'row', height: 65, backgroundColor: Colors.White }}>
                        <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} disabled={!enableWithDraw} onPress={() => Actions.push('GameDividendWithDraw')}>
                            <Image source={require('../../images/mine/wallet/tixian.png')} />
                            <Text style={{ fontSize: 13, marginTop: 5 }}>{`${!enableWithDraw ? '¥100起提' : '提现'}`}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} onPress={() => {} }>
                        {/* <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => { Actions.push('WalletPay') }}> */}
                            <Image source={require('../../images/mine/wallet/chongzhi.png')} />
                            <Text style={{ fontSize: 13, marginTop: 5 }}>充值</Text>
                        </TouchableOpacity>
                    </View>
                    {/* <View style={{ marginTop: 5, backgroundColor: Colors.White }}>
                        <Pressable onPress={() => Actions.push('NewTicket')}>
                            <View style={{ flexDirection: 'row', height: 50, alignItems: 'center', paddingHorizontal: 10 }}>
                                <Image source={require('../../images/mine/wallet/juan.png')} />
                                <Text style={{ fontSize: 13, color: '#333', marginLeft: 10 }}>新人券</Text>
                            </View>
                        </Pressable>
                    </View> */}
                </View>
                <TouchableOpacity style={{ alignItems: 'center', marginBottom: 34 }} onPress={() => this.toGameDividendRule()}>
                    <Text style={Styles.rule}>规则及常见问题</Text>
                </TouchableOpacity>
            </View>
        );
    }
}
const mapStateToProps = state => ({
    userId: state.user.id,
    userBalance: state.dividend.userBalance,
    userBalanceLock: state.dividend.userBalanceLock,
    userBalanceNormal: state.dividend.userBalanceNormal,
    userBalanceTotal: state.dividend.userBalanceTotal
});

const mapDispatchToProps = dispatch => ({
    resetDividendInfo: (userBalanceTotal, userBalanceLock, userBalanceNormal) => dispatch({ type: UPDATE_DIVIDEND_INFO, payload: { userBalanceLock, userBalanceNormal, userBalanceTotal } })
});

export default connect(mapStateToProps, mapDispatchToProps)(GameDividend);

const Styles = StyleSheet.create({
    containr: { flex: 1, backgroundColor: Colors.backgroundColor },
    dividendBar: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    dividendText: { fontSize: 14, color: Colors.C8 },
    gradient: { width: Metrics.screenWidth - 30, backgroundColor: Colors.C8, borderRadius: 4, alignItems: 'center' },
    balance: { fontSize: 15, color: Colors.C11, marginTop: 30 },
    gradientHeader: { flexDirection: 'row', alignItems: 'center', marginTop: 20 },
    unit: { fontSize: 16, color: Colors.C11 },
    balanceText: { fontSize: 20, color: Colors.White, marginTop: 10 },
    withDraw: { width: Metrics.screenWidth * 0.5, marginTop: 10, paddingTop: 14, paddingBottom: 14, borderRadius: 4, justifyContent: 'center', alignItems: 'center' },
    withDrawText: { color: Colors.C8, fontSize: 13 },
    gradientBody: { flexDirection: 'row', marginTop: 20 },
    gradientBodyItem: { flex: 1, alignItems: 'center' },
    gradientBodyTitle: { fontSize: 15, color: Colors.C10 },
    gradientBodyText: { marginTop: 6, fontSize: 13, color: Colors.C10 },
    withDrawRecord: { padding: 20, paddingTop: 15, paddingBottom: 15, flexDirection: 'row', alignItems: 'center' },
    withDrawRecordText: { flex: 1, fontSize: 15, color: Colors.C11 },
    gradientFooter: { padding: 40, paddingTop: 10 },
    rule: { fontSize: 15, color: Colors.grayFont, marginTop: 20 },
});