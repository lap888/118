import React, { Component } from 'react';
import {
    View, Text, StyleSheet, DeviceEventEmitter, TouchableOpacity, ScrollView, FlatList,
    TextInput, Keyboard, NativeModules, Platform
} from 'react-native';
const AliPay = NativeModules.AliPayModule;
const AlipayIos = NativeModules.Alipay;
import { Actions } from 'react-native-router-flux';
import *as WeChat from 'react-native-wechat-lib';

import { Header } from '../../components/Index';
import { connect } from 'react-redux';
import { LOGOUT } from '../../../redux/ActionTypes';
import { Colors, Metrics } from '../../theme/Index';
import { SetAlipay } from '../../../redux/ActionTypes';
import { Send } from '../../../utils/Http';
import { Loading, Toast } from '../../common';
import Icon from 'react-native-vector-icons/AntDesign';
import { UserApi } from '../../../api';

class WalletPay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alipay: "",
            isLoading: false
        };
        this.intervalID = false
    }

    componentDidMount() {
        // WeChat_Resp
        // DeviceEventEmitter.addListener('WeChat_Resp', resp => {
        //     console.warn('res:', resp)
            // if (resp.type === 'WXLaunchMiniProgramReq.Resp') { // 从小程序回到APP的事件
            //     miniProgramCallback(resp.extMsg)
            // } else if (resp.type === 'SendMessageToWX.Resp') { // 发送微信消息后的事件
            //     sendMessageCallback(resp.country)
            // } else if (resp.type === 'PayReq.Resp') { // 支付回调
            //     payCallback(resp)
            // }
        // })
    }
    componentWillUnmount() {
        clearInterval(this.intervalID)
    }
    loginOut() {
        this.props.logout();
        Actions.Login({ relogin: "resetPwd" });
    }
    
    resetTradePed = () => {
        Keyboard.dismiss();
        let alipay = this.state.alipay;
        /* 非空校验 */
        if (alipay.length === 0) {
            Toast.tip('金额不可为空')
            return;
        }
        this.setState({isLoading: true }, () => {
            Send(`api/WallerRecharge?amount=${alipay}`, {}, 'get').then(res => {
                if (res.code == 200) {
                    let orderStr = res.data;
                    if (Platform.OS == "ios") {
                        // AlipayIos.pay(orderStr).then((response) => {
                        //     let { resultStatus, memo } = response;//JSON.parse(response);
                        //     if (resultStatus == "9000") {
                        //         this.props.modifyAlipay(alipay);
                        //         //接口更新数据
                        //         Actions.pop();
                        //     } else {
                        //         Toast.tip(memo);
                        //     }
                        // });
                        // this.wxpay(orderStr)
                        Toast.tip('充值失败')
                    } else {
                        // AliPay.payV2(orderStr, (response) => {
                        //     let { resultStatus, memo } = JSON.parse(response);
                        //     if (resultStatus == "9000") {
                        //         this.props.modifyAlipay(alipay);
                        //         //接口更新数据
                        //         Actions.pop();
                        //     } else {
                        //         Toast.tip(memo);
                        //     }
                        // });
                        this.wxpay(orderStr)
                        // console.log('orderStr: ', orderStr);
                        // Toast.tip('充值失败')
                        this.intervalID = setInterval(() => {
                            UserApi.searchWePayOrderState(orderStr.tradeNo)
                                .then((data) => {
                                    console.log('data', data);
                                    if (data === 1) {
                                        Toast.tip('充值成功');
                                        this.setState({ isLoading: false });
                                        Actions.pop();
                                    }
                                    if(data == 0 || data == 2){
                                        Toast.tip(`充值失败, ${data == 0 ? '未支付' : '已退款' }`);
                                        this.setState({ isLoading: false });
                                        Actions.pop();
                                    }
                                }).catch((err) => { console.log('err', err); this.setState({ isLoading: false }); })
                        }, 1000);
                    }
                    
                } else {
                    Toast.tip(res.message);
                    this.setState({isLoading: false});
                }
            })
        })
    }
    wxpay = (orderStr) => {
        WeChat.pay(orderStr.payStr)
        .then((data) => {
            console.warn('data', data);
        }).catch((err) => console.log('err', err))

        // WeChat.pay(orderStr, (data) => {
        //     console.log("dat==", data);
        // })

    }

    render() {
        return (
            <View style={styles.businessPwdPageView}>
                <Header title="钱包充值" />
                <View style={{ flex: 1 }}>
                    <View style={styles.pwdViewStyle}>
                        <View style={{ paddingVertical: 5, backgroundColor: "#ffffff" }}>
                            <Text style={{ color: Colors.C6, fontSize: 14, }}>
                                提示: 提现需要手续费用多少充多少
						</Text>
                        </View>
                        <TextInput style={styles.inputViewStyle}
                            placeholder="请输入充值金额"
                            autoCapitalize="none"
                            clearButtonMode="always"
                            keyboardType="numeric"
                            onChangeText={(text) => {
                                this.setState({
                                    alipay: text
                                })
                            }}
                        />
                        <TouchableOpacity style={styles.submitView} onPress={() => { this.resetTradePed() }}>
                            <View style={styles.submitBtn} >
                                <Icon name={'wechat'} size={22} color={Colors.Wxpay}/>
                                <Text style={{ color: "#ffffff", fontSize: 16 }}>    微信充值</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                {this.state.isLoading ? <Loading/> : null}
            </View>
        );
    }
}

const mapStateToProps = state => ({
    userId: state.user.id,
});

const mapDispatchToProps = dispatch => ({
    modifyAlipay: (alipay) => dispatch({ type: SetAlipay, payload: { alipay: alipay } }),
});

export default connect(mapStateToProps, mapDispatchToProps)(WalletPay);

// 样式
const styles = StyleSheet.create({
    businessPwdPageView: {
        backgroundColor: "#ffffff",
        height: Metrics.screenHeight * 1,
    },
    pwdViewStyle: {
        padding: 10,
    },
    inputViewStyle: {
        height: 48,
        paddingLeft: 10,
        marginTop: 10,
        borderRadius: 5,
        backgroundColor: Colors.backgroundColor,
    },
    submitView: {
        height: Metrics.screenHeight * 0.4,
        justifyContent: 'center',
        alignItems: "center",
    },
    submitBtn: {
        backgroundColor: Colors.main,
        width: Metrics.screenWidth * 0.6,
        justifyContent: "center",
        alignItems: 'center',
        borderRadius: 5,
        flexDirection: 'row',
        padding: 10
        
    },
})