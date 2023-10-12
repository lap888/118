import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Colors, Metrics } from '../../theme/Index';
import { ParamsValidate } from '../../../utils/Index';
import { Header } from '../../components/Index';
import { Send } from '../../../utils/Http';
import { Toast } from '../../common';

export default class SignUpPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mobile: props.mobile,
            password: '',
            nickName: '',
            invitationCode: props.invitationCode,
            msgId: props.msgId,
            verifyCode: props.verifyCode
        };
    }
    signUp() {
        // 对密码的校验
        let password = this.state.password;
        let passwordMsg = ParamsValidate('password', password);
        if (passwordMsg !== null) {
            Toast.show({
                text: passwordMsg,
                position: "top",
                textStyle: { textAlign: "center" },
            })
            return false;
        }

        // 对昵称的校验
        let nickName = this.state.nickName;
        let nickNameMsg = ParamsValidate('nickName', nickName);
        if (nickNameMsg !== null) {
            Toast.show({
                text: nickNameMsg,
                position: "top",
                textStyle: { textAlign: "center" },
            })
            return false;
        }
        const params = this.state;
        Send("api/signUp", params).then(res => {
            if (res.code == 200) {
                Toast.show({
                    text: "注册成功",
                    position: "top",
                    textStyle: { textAlign: "center" },
                });
                // 后端处理结果
                Actions.replace("Login", { mobile: params.mobile });
            } else {
                Toast.show({
                    text: res.message,
                    position: "top",
                    textStyle: { textAlign: "center" },
                });
            }
        });
    }
    render() {
        return (
            <View>
                <Header title="用户信息填写" />
                <View>
                    <View style={styles.itemView}>
                        <TextInput
                            style={styles.text}
                            placeholder="请输入正确的手机号"
                            value={this.state.mobile}
                            disabled={true} />
                    </View>
                    <View style={styles.itemView}>
                        <TextInput
                            style={styles.text}
                            placeholderTextColor={Colors.grayFont}
                            placeholder="请输入1-15位的昵称(只能是数字、字母和汉字)"
                            onChangeText={(value) => this.setState({ nickName: value })} />
                    </View>
                    <View style={styles.itemView}>
                        <TextInput
                            style={styles.text}
                            placeholderTextColor={Colors.grayFont}
                            placeholder="请输入6-16位的密码"
                            secureTextEntry={true}
                            onChangeText={(value) => this.setState({ password: value })} />
                    </View>
                </View>
                <View style={styles.signUpView}>
                    <TouchableOpacity onPress={() => { this.signUp(); }}>
                        <View style={styles.signUpBtn} >
                            <Text style={[styles.text, { padding: 15, color: "#ffffff" }]}>注册</Text>
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
        alignItems: "center",
        borderRadius: 8,
    },
    text: {
        fontSize: 16,
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