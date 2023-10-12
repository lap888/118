import React, { Component } from 'react';
import { View, Text, Image, Modal, TextInput, ScrollView, TouchableWithoutFeedback, Keyboard, StyleSheet, InteractionManager } from 'react-native';
import { connect } from 'react-redux';
// import { Toast } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { Header } from '../../components/Index';
import { Metrics, Colors } from '../../theme/Index';
import { Send } from '../../../utils/Http';
import { Toast } from '../../common';

class GameDividendWithDraw extends Component {
    constructor(props) {
        super(props);
        this.state = {
            withdrawNumber: '',
            tradePwd: '',
            submmitWithDrawVisible: false
        };
    }
    /**
     * 提交提现申请
     */
    submmitWithDraw() {
        Keyboard.dismiss();
        let { tradePwd, withdrawNumber } = this.state;
        var that = this;
        if (!that.state.optionLoading) that.setState({ optionLoading: true });
        let p = {
            amount: withdrawNumber,
            tradePwd,
        }
        Send("api/Account/Withdraw", p).then((result) => {
            if (that.state.optionLoading) that.setState({ optionLoading: false });
            Toast.tipBottom(result.message)
            // if (result.code == 200) {
            that.setState({ submmitWithDrawVisible: false, tradePwd: '' }, () => Actions.pop());
            // }
        });
    }
    /**
     * 检查当前金额是否支持提现
     */
    checkWithDraw() {
        let withdrawNumber = this.state.withdrawNumber;
        if (withdrawNumber >= 1 && withdrawNumber <= this.props.userBalanceNormal) {
            return true;
        }
        return false;
    }
    /**
     * 渲染提现密码输入框
     */
    renderModalSubmmitWithDraw() {
        let { submmitWithDrawVisible, tradePwd, optionLoading } = this.state;
        return (
            <Modal animationType='slide' visible={submmitWithDrawVisible} transparent onRequestClose={() => { }}>
                <View style={{ flex: 1, backgroundColor: 'transparent' }}>
                    <View style={Styles.modalBody}>
                        <View style={{ marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={Styles.publishBuy}>提现申请</Text>
                        </View>
                        <View style={[Styles.modalBodyPrice, { marginTop: 40 }]}>
                            <View style={Styles.modalBodyLeft}>
                                <Text style={Styles.price}>交易密码</Text>
                            </View>
                            <View style={Styles.modalBodyRight}>
                                <View style={Styles.textInputContainer}>
                                    <TextInput style={Styles.publishTextInput} secureTextEntry placeholder="请输入交易密码" placeholderTextColor={Colors.White} underlineColorAndroid="transparent" keyboardType="numeric"
                                        value={tradePwd}
                                        onChangeText={tradePwd => this.setState({ tradePwd })}
                                        returnKeyType="done"
                                        onSubmitEditing={() => this.submmitWithDraw()}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={Styles.modalFooter}>
                            <TouchableWithoutFeedback disabled={optionLoading} onPress={() => this.setState({ submmitWithDrawVisible: false, tradePwd: '' })}>
                                <View style={[Styles.publishConfirm, { backgroundColor: Colors.LightG }]}>
                                    <Text style={Styles.publishConfirmText}>取消</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback disabled={optionLoading} onPress={() => this.submmitWithDraw()}>
                                <View style={[Styles.publishConfirm, { backgroundColor: Colors.C6 }]}>
                                    <Text style={Styles.publishConfirmText}>{optionLoading ? '提交中...' : '确定'}</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                    <View style={Styles.modalHeader} />
                </View>
            </Modal>
        )
    }
    render() {
        let { userBalanceNormal, alipay } = this.props;
        let enableWithDraw = this.checkWithDraw();
        return (
            <View style={Styles.containr}>
                <Header title="提现" />
                <ScrollView style={{ padding: 40, paddingLeft: 20, paddingRight: 20 }}>
                    <Text style={Styles.accountTitle}>到账账户</Text>
                    <View style={Styles.way}>
                        <Image style={Styles.logo} source={require('../../images/profile/biao.png')} />
                        <Text style={Styles.biao}>支付宝</Text>
                        {/* <Text style={Styles.accountText}>{'您二次认证的支付宝'}</Text> */}
                    </View>
                    <Text style={[Styles.accountTitle, { marginTop: 30 }]}>提现金额</Text>
                    <View style={Styles.way}>
                        <Text style={Styles.unit}>¥</Text>
                        <TextInput style={Styles.withdrawNumber}
                            multiline={false}
                            underlineColorAndroid='transparent'
                            keyboardType='numeric'
                            value={this.state.withdrawNumber}
                            onChangeText={text => this.setState({ withdrawNumber: (parseInt(text) || '').toString() })}
                            onSubmitEditing={() => { }}
                        />
                    </View>
                    <View style={Styles.withDrawFooter}>
                        <Text style={Styles.userBalanceNormal}>{`可提现余额¥${userBalanceNormal} `}</Text>
                        <TouchableWithoutFeedback onPress={() => this.setState({ withdrawNumber: (parseInt(userBalanceNormal)).toString() })}>
                            <View style={Styles.withDrawAll}>
                                <Text style={Styles.withDrawAllText}>全部转出</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <TouchableWithoutFeedback disabled={!enableWithDraw} onPress={() => { Keyboard.dismiss(); this.setState({ submmitWithDrawVisible: true }); }}>
                        <View style={[Styles.withDraw, { opacity: enableWithDraw ? 1 : 0.6 }]}>
                            <Text style={Styles.withDrawText}>提现</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </ScrollView>
                {this.renderModalSubmmitWithDraw()}
            </View>
        )
    }
}
const Styles = StyleSheet.create({
    containr: { flex: 1, backgroundColor: Colors.C8 },
    accountTitle: { fontSize: 15, color: Colors.C10 },
    way: { paddingTop: 15, paddingBottom: 15, flexDirection: 'row', alignItems: 'center', borderBottomWidth: StyleSheet.hairlineWidth, borderColor: Colors.C7 },
    logo: { width: 32, height: 32 },
    biao: { flex: 1, marginLeft: 6, fontSize: 18, color: Colors.C11 },
    accountText: { marginRight: 8, fontSize: 15, color: Colors.C10 },
    unit: { fontSize: 20, color: Colors.C11, fontWeight: '500' },
    withdrawNumber: { marginLeft: 10, flex: 1, fontSize: 20, color: Colors.C11, fontWeight: '500' },
    withDraw: { alignSelf: 'center', width: Metrics.screenWidth * 0.6, marginTop: 30, paddingTop: 14, paddingBottom: 14, backgroundColor: Colors.C6, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
    withDrawText: { color: Colors.C8, fontSize: 16 },
    userBalanceNormal: { fontSize: 15, color: Colors.C10 },
    withDrawFooter: { marginTop: 10, flexDirection: 'row' },
    withDrawAll: { paddingRight: 50, paddingBottom: 50 },
    withDrawAllText: { fontSize: 15, color: Colors.C6 },

    modalHeader: { flex: 1, opacity: 0.8, backgroundColor: Colors.White },
    price: { fontSize: 14, color: Colors.White },
    modalBody: { paddingTop: Metrics.PADDING_BOTTOM, flexDirection: "column", justifyContent: 'flex-end', backgroundColor: Colors.C16, width: Metrics.screenWidth },
    publishBuy: { color: Colors.White, fontSize: 20, fontWeight: 'bold' },
    modalBodyPrice: { marginTop: 12, flexDirection: 'row', alignItems: 'center' },
    modalBodyLeft: { width: Metrics.screenWidth * 0.3, alignItems: 'flex-end' },
    modalBodyRight: { width: Metrics.screenWidth * 0.7, alignItems: 'flex-start' },
    textInputContainer: { marginLeft: 10, paddingLeft: 8, width: Metrics.screenWidth * 0.7 * 0.8, height: 40, borderRadius: 6, backgroundColor: Colors.C6 },
    publishTextInput: { flex: 1, color: '#ceced0' },
    modalFooter: { flexDirection: 'row', marginTop: 20 },
    publishConfirm: { height: 60, width: Metrics.screenWidth * 0.5, justifyContent: 'center', alignItems: 'center' },
    publishConfirmText: { fontSize: 16, color: '#FFFFFF', fontWeight: 'bold' },
});
const mapStateToProps = state => ({
    userId: state.user.id,
    userBalance: state.dividend.userBalance,
    userBalanceLock: state.dividend.userBalanceLock,
    userBalanceNormal: state.dividend.userBalanceNormal,
    alipay: state.user.alipay
});

export default connect(mapStateToProps, {})(GameDividendWithDraw);