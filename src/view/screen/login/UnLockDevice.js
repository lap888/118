import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Form, View, Text, Button, Right, Input, Title, Body, Item, Icon, Content, Container, Left } from 'native-base';
import { Actions } from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';
import DeviceInfo from 'react-native-device-info';
import { connect } from 'react-redux';
import { Header } from '../../components/Index';
import { CountDownButton } from '../../components/Index';
import { Colors, Metrics } from '../../theme/Index'
import { ParamsValidate } from '../../../utils/Index';
import { Send } from '../../../utils/Http';
import { Toast } from '../../common';

class UnLockDevice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mobile: '',
            password: '',
            vcode: '',
            msgId: '',
        };
    }
    SendVcode = (shouldStartCountting) => {
        let that = this;
        let mobile = this.state.mobile;
        // 手机号格式校验
        let msg = ParamsValidate('mobile', mobile);
        if (msg !== null) {
            Toast.tip(msg)
            return;
        }

        // 向后端发起请求
        let params = { mobile: mobile, type: "unbind" }
        Send('api/SendVcode', params).then(res => {
            if (res.code == 200) {
                that.setState({ msgId: res.data.msgId });
                Toast.tip('验证码已发送');
                setTimeout(() => { shouldStartCountting && shouldStartCountting(true) }, 1);
            } else {
                Toast.tip(res.message);
            }
        });
    }
    ResetPassword() {
        let vcode = this.state.vcode;
        let vmsg = ParamsValidate('vcode', vcode);
        if (vmsg !== null) {
            Toast.tip(vmsg)
            return false;
        }

        let password = this.state.password;
        let pmsg = ParamsValidate('password', password);
        if (pmsg !== null) {
            Toast.tip(pmsg)
            return false;
        }

        let params = { mobile: this.state.mobile, password: password, verifyCode: vcode, msgId: this.state.msgId }
        params.deviceId = DeviceInfo.getVersion();
        console.log('params', params)
        Send('api/UnbindDevice', params).then(res => {
            if (res.code == 200) {
                Toast.tip(res.message);
                setTimeout(() => Actions.popTo("Login"), 100);
            } else {
                Toast.tip(res.message)
            }
        });
    }

    changebgColor = () => {
        return this.state.mobile > 10;
    }
    render() {
        return (
            <Container>
                <Header title="解绑设备" />
                <Form>
                    <Item style={{ borderBottomWidth: StyleSheet.hairlineWidth }}>
                        <Input value={this.state.mobile} style={styles.placeholderText} placeholder="请输入正确的手机号" onChangeText={(value) => this.setState({ mobile: value })} />
                        <Text style={[styles.placeholderText, { marginRight: 20, color: "#2c2c2c" }]}>中国 +86 </Text>
                    </Item>
                    <Item style={{ borderBottomWidth: StyleSheet.hairlineWidth }}>
                        <Input style={styles.placeholderText} placeholder='请输入验证码' onChangeText={(value) => this.setState({ vcode: value })}
                            returnKeyType="done"
                            onSubmitEditing={() => this.ResetPassword()}
                        ></Input>
                        <CountDownButton
                            textStyle={{ color: 'white' }}
                            style={{}}
                            buttonStyle={{}}
                            timerCount={60}
                            timerTitle={'获取验证码'}
                            enable={this.changebgColor()}
                            onClick={
                                (shouldStartCountting) => {
                                    this.SendVcode(shouldStartCountting)
                                }}
                            timerEnd={() => { this.setState({ state: '倒计时结束' }) }}
                        />
                    </Item>
                    <Item style={{ borderBottomWidth: StyleSheet.hairlineWidth }}>
                        <Input style={styles.placeholderText} secureTextEntry placeholder='请输入登录密码' onChangeText={(value) => this.setState({ password: value })} />
                    </Item>
                    <View style={{ paddingLeft: 20, paddingRight: 10, paddingVertical: 5, backgroundColor: "#ffffff" }}>
                        <Text style={{ fontSize: 12, color: Colors.C6 }}>温馨提示:解绑一次扣除1钻石和1荣耀值，每个账号最多解绑10次。</Text>
                    </View>
                    <View style={styles.submitView}>
                        <TouchableOpacity onPress={() => { this.ResetPassword(); }}>
                            <View style={styles.submitBtn} >
                                <Text style={{ padding: 15, color: "#ffffff" }}>确定</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </Form>
            </Container>
        );
    }
}
const mapStateToProps = state => ({
    mobile: state.user.mobile
});

const mapDispatchToProps = dispatch => ({
});
export default connect(mapStateToProps, mapDispatchToProps)(UnLockDevice);
const styles = StyleSheet.create({
    header: {
        backgroundColor: '#4cc7ab',
        justifyContent: "space-between",
        alignItems: "center",
    },
    body: {
        backgroundColor: '#ffffff',
    },
    submitView: {
        height: Metrics.screenHeight * 0.3,
        justifyContent: 'center',
        alignItems: "center",
    },
    submitBtn: {
        backgroundColor: Colors.main,
        width: Metrics.screenWidth * 0.6,
        alignItems: "center",
        borderRadius: 8,
    },
    vcodeButton: {
        marginRight: 5,
        marginTop: 10,
        height: 35,
        backgroundColor: 'orange',
    },
    placeholderText: {
        fontSize: 16,
        color: Colors.black
    },
    text: {
        fontSize: 16,
        color: '#ffffff',
        padding: 5
    },
    imagestyle: {
        width: 22,
        height: 22,
        paddingLeft: 10
    },
    clearIcon: {
        width: 20,
        height: 20
    }
})
