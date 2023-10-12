import React, { Component } from 'react';
import {
    View, Text, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback, ScrollView, FlatList,
    TextInput, Keyboard, NativeModules, Platform, Modal
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import RefreshListView, { RefreshState } from 'react-native-refresh-list-view';
import { Send } from '../../../utils/Http';
import { Header } from '../../components/Index';
// import { Toast, Icon } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { AUTH_SECRET, API_PATH, Env, Version } from '../../../config/Index';
import { Colors, Metrics } from '../../theme/Index';
import Cookie from 'cross-cookie';
import CryptoJS from 'crypto-js';
import { connect } from 'react-redux';
import { Toast } from '../../common';

class TelphoneRecharge extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: "",
            faceValue: 0,
            selectPrice: 0,
            tradePwd: '',
            faceValueArr: [],
            submmitWithDrawVisible: false,
            optionLoading: false
        };

    }
    Sign = (api, token, timeSpan) => {
        let params = [];
        params.push(api.toUpperCase());
        params.push(token.toUpperCase());
        params.push(timeSpan);
        params.push(AUTH_SECRET.toUpperCase());//服务端分发对应key
        params.sort();
        let utf8Params = CryptoJS.enc.Utf8.parse(params.join(''));
        let sign = CryptoJS.MD5(utf8Params).toString(CryptoJS.enc.Hex).substring(5, 29);
        return sign;
    }
    onRightPress() {
        Send(`api/system/CopyWriting?type=tel_recharge_rule`, {}, 'get').then(res => {
            Actions.push('CommonRules', { title: '充值规则', rules: res.data });
        });
    }
    selectPrice(type) {
        this.setState({ selectPrice: type, faceValue: type })
    }
    resetTradePed() {
        Keyboard.dismiss();
        let phone = this.state.phone;
        /* 非空校验 */
        if (phone.length === 0) {
            Toast.tipBottom('手机号不能为空')
            // Toast.show({
            //     text: "手机号不能为空",
            //     position: "bottom",
            //     textStyle: { textAlign: "center" },
            // })
            return;
        }
        if (this.state.faceValue === 0) {
            Toast.tipBottom('请选择充值金额')
            // Toast.show({
            //     text: "请选择充值金额",
            //     position: "bottom",
            //     textStyle: { textAlign: "center" },
            // })
            return;
        }
        this.setState({ submmitWithDrawVisible: true })
    }

    submmitWithDraw() {
        Keyboard.dismiss();
        let { tradePwd, phone, faceValue } = this.state;
        var that = this;
        if (!that.state.optionLoading) that.setState({ optionLoading: true });
        let p = {
            phone: phone,
            payPwd: tradePwd,
            faceValue
        }
        Send("api/Recharge/RechargeMobile", p).then((result) => {
            if (that.state.optionLoading) that.setState({ optionLoading: false });
            Toast.tipBottom(result.message)
            // Toast.show({
            //     text: result.message,
            //     position: "bottom",
            //     duration: 2000,
            // });
            if (result.code == 200) {
                that.setState({ submmitWithDrawVisible: false, tradePwd: '', phone: '', faceValue: 0 }, () => Actions.pop());
            }
        });
    }
    getFaceValues() {
        Send(`api/Recharge/QueryMobile?phone=${this.state.phone}`, {}, 'get').then((result) => {
            if (result.code == 200) {
                let arr = [];
                result.data.faceValue.map((v) => {
                    if (v.faceValue == "30" || v.faceValue == "50" || v.faceValue == "100") {
                        let data = {};
                        data.faceValue = v.faceValue;
                        data.candyNum = v.candyNum;
                        arr.push(data);
                    }
                })
                this.setState({ faceValueArr: arr })
            } else {
                Toast.tipBottom(result.message)
                // Toast.show({
                //     text: result.message,
                //     position: "bottom",
                //     duration: 2000,
                // });
            }
        });
    }

    /**
     * 渲染提现密码输入框
     */
    renderModalSubmmitWithDraw() {
        let { submmitWithDrawVisible, tradePwd, optionLoading } = this.state;
        return (
            <Modal animationType='slide' visible={submmitWithDrawVisible} transparent onRequestClose={() => { }}>
                <View style={{ flex: 1, backgroundColor: 'transparent' }}>
                    <View style={styles.modalBody}>
                        <View style={{ marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={styles.publishBuy}>交易密码</Text>
                        </View>
                        <View style={[styles.modalBodyPrice, { marginTop: 40 }]}>
                            <View style={styles.modalBodyLeft}>
                                <Text style={styles.price}>交易密码</Text>
                            </View>
                            <View style={styles.modalBodyRight}>
                                <View style={styles.textInputContainer}>
                                    <TextInput style={styles.publishTextInput} secureTextEntry placeholder="请输入交易密码" placeholderTextColor={Colors.White} underlineColorAndroid="transparent" keyboardType="numeric"
                                        value={tradePwd}
                                        onChangeText={tradePwd => this.setState({ tradePwd })}
                                        returnKeyType="done"
                                        onSubmitEditing={() => this.submmitWithDraw()}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={styles.modalFooter}>
                            <TouchableWithoutFeedback disabled={optionLoading} onPress={() => this.setState({ submmitWithDrawVisible: false, tradePwd: '' })}>
                                <View style={[styles.publishConfirm, { backgroundColor: Colors.LightG }]}>
                                    <Text style={styles.publishConfirmText}>取消</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback disabled={optionLoading} onPress={() => this.submmitWithDraw()}>
                                <View style={[styles.publishConfirm, { backgroundColor: Colors.C6 }]}>
                                    <Text style={styles.publishConfirmText}>{optionLoading ? '提交中...' : '确定'}</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                    <View style={styles.modalHeader} />
                </View>
            </Modal>
        )
    }
    render() {
        return (
            <View style={styles.businessPwdPageView}>
                <Header title="话费充值" rightText="规则" onRightPress={() => this.onRightPress()} />
                <View style={{ flex: 1, backgroundColor: Colors.backgroundColor }}>
                    <View style={styles.pwdViewStyle}>
                        <View style={{ paddingVertical: 5 }}>
                            <Text style={{ color: Colors.C6, fontSize: 14, }}>
                                提示:充值前请仔细核对自己的手机号
                            </Text>
                        </View>
                        <TextInput style={styles.inputViewStyle}
                            placeholder="请输入手机号"
                            autoCapitalize="none"
                            clearButtonMode="always"
                            keyboardType="numeric"
                            onBlur={() => this.getFaceValues()}
                            onChangeText={(text) => {
                                this.setState({
                                    phone: text
                                })
                            }}
                        />
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingLeft: 10, alignItems: 'center', width: Metrics.screenWidth * 0.9 }}>
                            {this.state.faceValueArr.map((v) => {
                                return (
                                    <TouchableOpacity key={v.faceValue} onPress={() => this.selectPrice(v.faceValue)} style={{ backgroundColor: this.state.selectPrice == v.faceValue ? Colors.C16 : Colors.White, borderColor: Colors.C16, borderWidth: 1, width: Metrics.screenWidth * 0.2, marginTop: 10, borderRadius: 10, alignItems: 'center', justifyContent: 'center', padding: 5 }}>
                                        <Text style={{ color: this.state.selectPrice == v.faceValue ? Colors.White : Colors.C16, fontSize: 13 }}>{v.faceValue}元</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                        <View style={styles.submitView}>
                            <TouchableOpacity onPress={() => { this.resetTradePed() }}>
                                <View style={styles.submitBtn} >
                                    <Text style={{ padding: 15, color: "#ffffff" }}>
                                        确认充值
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                {this.renderModalSubmmitWithDraw()}
            </View>
        );
    }
}
const mapStateToProps = state => ({
    logged: state.user.logged
});

const mapDispatchToProps = dispatch => ({
});
export default connect(mapStateToProps, mapDispatchToProps)(TelphoneRecharge);
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
        borderRadius: 10,
        marginBottom: 10,
        backgroundColor: Colors.White,
    },
    submitView: {
        height: Metrics.screenHeight * 0.4,
        justifyContent: 'center',
        alignItems: "center",
    },
    submitBtn: {
        backgroundColor: Colors.C6,
        width: Metrics.screenWidth * 0.6,
        alignItems: "center",
        borderRadius: 8,
    },
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
})