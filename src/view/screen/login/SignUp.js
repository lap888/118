import React, { Component } from 'react';
import { View, StyleSheet, Keyboard, Text, TouchableOpacity, TextInput } from 'react-native';
// import { Toast } from 'native-base';
import { Actions } from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Metrics } from '../../theme/Index';
import { ParamsValidate } from '../../../utils/Index';
import { Header, CountDownButton } from '../../components/Index';
import { Send } from '../../../utils/Http';
import { Toast } from '../../common';

export default class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mobile: '',
            vcode: '',
            state: ''
        };
    }
    SendVcode(shouldStartCountting) {
        Keyboard.dismiss();
        let that = this
        let mobile = this.state.mobile;
        // 手机号校验
        let msg = ParamsValidate('mobile', mobile);
        if (msg !== null) {
            Toast.show({
                text: msg,
                position: "top",
                textStyle: { textAlign: "center" },
            })
            return;
        }
        // 向后端发起请求 
        const params = { mobile: mobile, type: "signIn" }
        Send('api/SendVcode', params).then(res => {
            if (res.code == 200) {
                that.setState({ msgId: res.data.msgId });
                Toast.show({ text: "验证码已发送", position: "top", textStyle: { textAlign: "center" } });
                setTimeout(() => { shouldStartCountting && shouldStartCountting(true) }, 1);
            } else {
                Toast.show({ text: res.message || "验证码发送失败", position: "top", textStyle: { textAlign: "center" } });
            }
        });
    }
    ConfrimVcode() {
        Keyboard.dismiss();

        /* 手机号格式校验 */
        let mobile = this.state.mobile;
        let mobileMsg = ParamsValidate('mobile', mobile);
        if (mobileMsg !== null) {
            Toast.show({
                text: mobileMsg,
                position: "top",
                textStyle: { textAlign: "center" },
            })
            return;
        }

        /* 验证码必填检验 */
        let vcode = this.state.vcode;
        let vcodeMsg = ParamsValidate('vcode', vcode);
        if (vcodeMsg !== null) {
            Toast.show({
                text: vcodeMsg,
                position: "top",
                textStyle: { textAlign: "center" },
            })
            return;
        }

        // 验证码和手机号是否匹配
        const params = { mobile: mobile, vcode: vcode, msgId: this.state.msgId }
        Actions.replace("SignUpPage", { verifyCode: vcode, mobile: mobile, invitationCode: this.props.invitationCode, msgId: this.state.msgId });
        // Send('api/ConfirmVcode', params).then(res => {
        //     if (res.code == 200) {
        //         Actions.replace("SignUpPage", { verifyCode:vcode,mobile: mobile, invitationCode: this.props.invitationCode, msgId: this.state.msgId });
        //     } else {
        //         Toast.show({ text: "验证码不正确", position: "top", textStyle: { textAlign: "center" } });
        //     }
        // });
    }
    render() {
        return (
            <View style={{flex: 1}}>
                <Header title="注册" />
                    <View>
                        <View style={styles.itemView}>
                            <TextInput 
                                style={styles.text} 
                                placeholder="请输入正确的手机号" 
                                placeholderTextColor={Colors.grayFont} 
                                keyboardType='number-pad'
                                onChangeText={(value) => { this.setState({ mobile: value }); }} />
                            <Text style={[{ marginRight: 20, color: Colors.White }]}>中国 +86 </Text>
                        </View>
                        <View style={styles.itemView}>
                            <TextInput
                                style={styles.text}
                                placeholder="请输入验证码"
                                placeholderTextColor={Colors.grayFont}
                                onChangeText={(value) => this.setState({ vcode: value })}
                                returnKeyType="done"
                                keyboardType='number-pad'
                                onSubmitEditing={() => this.ConfrimVcode()}
                            />
                            <CountDownButton
                                textStyle={{ color: 'white' }}
                                style={{}}
                                buttonStyle={{ fontSize: 16 }}
                                timerCount={60}
                                timerTitle={'获取验证码'}
                                enable={this.state.mobile.length > 10}
                                onClick={
                                    (shouldStartCountting) => {
                                        this.SendVcode(shouldStartCountting)
                                    }}
                                timerEnd={() => { this.setState({ state: '倒计时结束' }) }}
                            />
                        </View>
                    </View>
                    <View style={styles.signUpView}>
                        <TouchableOpacity onPress={() => { this.ConfrimVcode(); }}>
                            <View style={styles.signUpBtn} >
                                <Text style={[styles.text, { padding: 15, color: "#ffffff" }]}>下一步</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    itemView: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.backgroundColor
    },
    vcodeButton: {
        margin: 5,
        // marginTop: 5,
        height: 35,
        // backgroundColor: 'red',
        backgroundColor: 'orange',
    },
    vcodeButtonColor: {
        backgroundColor: 'orange',
    },
    signUpView: {
        height: Metrics.screenHeight * 0.3,
        justifyContent: 'center',
        alignItems: "center",
    },
    signUpBtn: {
        backgroundColor: Colors.main,
        width: Metrics.screenWidth * 0.6,
        height: 50,
        alignItems: "center",
        borderRadius: 8,
    },
    text: {
        flex: 1,
        fontSize: 16,
        color: Colors.fontColor,
        height: 40,
        padding: 0,
    },
    header: {
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: '#4cc7ab',
    },
    title: {
        fontSize: 16,
        color: '#ffffff',
    },
    body: {
        backgroundColor: '#4cc7ab',
    },
    imagestyle: {
        width: 22,
        height: 22,
        paddingLeft: 10
    }
})