import React, { Component } from 'react';
import {
    View, Text, StyleSheet, Image, TouchableOpacity,
    TextInput, Keyboard
} from 'react-native';
// import { Toast } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { Actions } from 'react-native-router-flux';
import { Header, CountDownButton } from '../../../components/Index';
import moment from 'moment';
import { connect } from 'react-redux';
import { LOGOUT } from '../../../../redux/ActionTypes';
import { Colors, Metrics } from '../../../theme/Index';
import { Send } from '../../../../utils/Http';
import { Toast } from '../../../common';

const mobileRegex = /^1[3456789]\d{9}$/;
const verifyCount = /^[0-9]*$/ // 验证码和交易密码非数字校验

class BusinessPwd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tel: "",
            vcode: "",
            newPwd: "",
            confirmPwd: "",
            msgId: "",
            int: null,
        };
    }

    changebgColor = () => {
        let tel = "";
        this.state.tel.length > 0 ? tel = this.state.tel : tel = this.props.mobile
        return tel > 10;
    }
    sendVcode(shouldStartCountting) {
        Keyboard.dismiss();
        let that = this;
        let tel = this.state.tel || this.props.mobile;
        this.state.tel.length > 0 ? tel = this.state.tel : tel = this.props.mobile
        /* 校验手机号格式 */
        if (!tel.match(mobileRegex)) {
            Toast.show({
                text: "手机号格式不正确",
                position: "top",
                textStyle: { textAlign: "center" },
            })
        }
        let params = {
            mobile: tel,
            Type: 'resetPassword'

        }
        Send("api/sendVcode", params).then(res => {
            if (res.code == 200) {
                that.setState({
                    msgId: res.data.msgId,
                })
            } else {
                Toast.show({
                    text: res.message,
                    position: "top",
                    textStyle: { textAlign: "center" },
                })
            }
            setTimeout(() => { shouldStartCountting && shouldStartCountting(true) }, 10);
        });
    }

    /**
     * 重置交易密码
     */
    resetTradePed() {
        Keyboard.dismiss();
        let tel = this.state.tel || this.props.mobile;
        let vcode = this.state.vcode;
        let newPwd = this.state.newPwd;
        let confirmPwd = this.state.confirmPwd;
        let pwd = "";
        /* 为空验证 */
        if (tel.length === 0 || vcode.length === 0 || newPwd.length === 0 || confirmPwd.length === 0) {
            Toast.show({
                text: "所有项都为必填项",
                position: "top",
                textStyle: { textAlign: "center" },
            })
            return;
        }
        /* 验证码非数字验证 */
        if (!vcode.match(verifyCount)) {
            return (
                Toast.show({
                    text: "验证码必须是数字",
                    position: "top",
                    textStyle: { textAlign: "center" },
                })
            )
        }
        /* 验证码位数验证(必须为6位数字) */
        if (vcode.length !== 6) {
            return (
                Toast.show({
                    text: "验证码必须为六位",
                    position: "top",
                    textStyle: { textAlign: "center" },
                })
            )
        }
        /* 校验手机号格式 */
        if (!tel.match(mobileRegex)) {
            return (
                Toast.show({
                    text: "手机号格式不正确",
                    position: "top",
                    textStyle: { textAlign: "center" },
                })
            )
        }

        /* 密码必须为6-16位 */
        if ((newPwd.length < 6 || confirmPwd.length < 6) || (newPwd.length > 16 || confirmPwd.length > 16)) {
            return (
                Toast.show({
                    text: "交易密码为6-16位",
                    position: "top",
                    textStyle: { textAlign: "center" }
                })
            )
        }

        /* 密码和确认密码非数字验证 */
        if (!newPwd.match(verifyCount) || !confirmPwd.match(verifyCount)) {
            Toast.show({
                text: "密码必须是数字",
                position: "top",
                textStyle: { textAlign: "center" },
            })
            return;
        }

        /* 确认两次输入的密码是否一样 */
        if (newPwd != confirmPwd) {
            Toast.show({
                text: "两次输入密码不一样",
                position: "top",
                textStyle: { textAlign: "center" },
            })
            return;
        } else {
            pwd = newPwd
        }

        let params = {
            mobile: tel,
            vcode: vcode,
            msgId: this.state.msgId,
            newTradePwd: pwd,
        }

        Send("api/ModifyOtcPwd", params).then(res => {
            if (res.code == 200) {
                Toast.show({
                    text: '修改交易密码成功',
                    position: "top",
                    textStyle: { textAlign: "center" }
                })
                setTimeout(() => Actions.pop(), 1000)
            } else {
                Toast.show({
                    text: result.message,
                    position: "top",
                    textStyle: { textAlign: "center" }
                })
            }
        });

    }
    render() {
        return (
            <View style={styles.businessPwdPageView}>
                <Header title="修改交易密码" />
                {/* <LinearGradient colors={[Colors.C6, Colors.LightG]} start={{ x: 0, y: 0.1 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}> */}
                <View style={{ flex: 1 }}>
                    <View style={styles.pwdViewStyle}>
                        <View style={{ paddingVertical: 5, backgroundColor: "#ffffff" }}>
                            <Text style={styles.promptTxt}>小贴士: 新注册用户初始交易密码为 123456</Text>
                        </View>
                        <TextInput style={styles.inputViewStyle}
                            placeholder="请输入手机号码"
                            defaultValue={this.props.mobile}
                            editable={false}
                            onChangeText={(text) => {
                                this.setState({
                                    tel: text
                                })
                            }}
                        />
                        <View style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                        >
                            <TextInput style={[styles.inputViewStyle, { width: Metrics.screenWidth * 0.6 }]}
                                placeholder="请输入验证码(验证码必须是数字)"
                                autoCapitalize="none"
                                clearButtonMode="always"
                                keyboardType="numeric"
                                onChangeText={(text) => {
                                    this.setState({
                                        vcode: text
                                    })
                                }}
                            />
                            <CountDownButton
                                textStyle={{ color: 'white' }}
                                style={styles.countDownButtonStyle}
                                buttonStyle={{}}
                                timerCount={60}
                                timerTitle={'获取验证码'}
                                enable={true}
                                onClick={
                                    (shouldStartCountting) => {
                                        this.sendVcode(shouldStartCountting)
                                    }}
                                timerEnd={() => { this.setState({ state: '倒计时结束' }) }}
                            />
                        </View>
                        <TextInput style={styles.inputViewStyle}
                            placeholder="请输入新密码(密码必须是数字)"
                            autoCapitalize="none"
                            secureTextEntry={true}
                            clearButtonMode="always"
                            onChangeText={(text) => {
                                this.setState({
                                    newPwd: text
                                })
                            }}
                            keyboardType="numeric"
                        />
                        <TextInput style={styles.inputViewStyle}
                            placeholder="请确认新密码(密码必须是数字)"
                            autoCapitalize="none"
                            secureTextEntry={true}
                            clearButtonMode="always"
                            keyboardType="numeric"
                            onChangeText={(text) => {
                                this.setState({
                                    confirmPwd: text
                                })
                            }}
                            returnKeyType="done"
                            onSubmitEditing={() => this.resetTradePed()}
                        />
                        <View style={styles.submitView}>
                            <TouchableOpacity onPress={() => { this.resetTradePed() }}>
                                <View style={styles.submitBtn}>
                                    <Text style={{ padding: 15, color: "#ffffff" }}>
                                        确认
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}
const mapStateToProps = state => ({
    userId: state.user.id,
    mobile: state.user.mobile
});

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch({ type: LOGOUT }),
});

export default connect(mapStateToProps, mapDispatchToProps)(BusinessPwd);
// 样式
const styles = StyleSheet.create({
    businessPwdPageView: {
        backgroundColor: "#ffffff",
        height: Metrics.screenHeight * 1,
    },
    pwdViewStyle: {
        padding: 10,
    },
    promptTxt: {
        fontSize: 12,
        color: Colors.C6,
    },
    inputViewStyle: {
        height: 48,
        paddingLeft: 10,
        marginTop: 10,
        borderRadius: 10,
        backgroundColor: Colors.LightG,
    },
    countDownButtonStyle: {
        height: 48,
        padding: 5,
        borderRadius: 5,
        marginTop: 10,
        width: Metrics.screenWidth * 0.3,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.LightG
    },
    submitView: {
        height: Metrics.screenHeight * 0.5,
        justifyContent: 'center',
        alignItems: "center",
    },
    submitBtn: {
        backgroundColor: Colors.C6,
        width: Metrics.screenWidth * 0.6,
        alignItems: "center",
        borderRadius: 8,
    },
});