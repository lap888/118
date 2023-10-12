import React, { Component } from 'react';
import {
    View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList,
    TextInput, Keyboard
} from 'react-native';
// import { Toast } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { Actions } from 'react-native-router-flux';
import { Header } from '../../../components/Index';
import { connect } from 'react-redux';
import { LOGOUT } from '../../../../redux/ActionTypes';
import { Colors, Metrics } from '../../../theme/Index';
import { Send } from '../../../../utils/Http';
import { Toast } from '../../../common';

const verifyCountLetter = /^[0-9a-zA-Z]*$/;
class EditSignInPwd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            oldPwd: "",
            newPwd: "",
            confirmPwd: ""
        };
    }
    loginOut() {
        this.props.logout();
        Actions.Login({ relogin: "resetPwd" });
    }
    /**
     * 重置登陆密码
     */
    resetTradePed() {
        Keyboard.dismiss();

        let oldPwd = this.state.oldPwd;
        let newPwd = this.state.newPwd;
        let confirmPwd = this.state.confirmPwd;
        let pwd = "";
        let that = this;
        /* 非空校验 */
        if (oldPwd.length === 0 || newPwd.length === 0 || confirmPwd.length === 0) {
            Toast.show({
                text: "所有项都为必填项",
                position: "top",
                textStyle: { textAlign: "center" },
            })
            return;
        }

        /* 登录密码是数字或字母或数字和字母的组合校验 */
        if (!oldPwd.match(verifyCountLetter) || !newPwd.match(verifyCountLetter) || !confirmPwd.match(verifyCountLetter)) {
            return (
                Toast.show({
                    text: "密码必须是数字或字母",
                    position: "top",
                    textStyle: { textAlign: "center" },
                })
            )
        }

        /* 确认两次输入的密码是否一样 */
        if (newPwd != confirmPwd) {
            Toast.show({
                text: "两次输入密码不一样",
                position: "top",
                textStyle: { textAlign: "center" },
            })
            return;
        }

        if ((newPwd.length < 6 || newPwd.length > 16) || (confirmPwd.length < 6 || confirmPwd.length > 16) || (oldPwd.length < 6 || oldPwd.length > 16)) {
            Toast.show({
                text: "密码为6-16位",
                position: "top",
                textStyle: { textAlign: "center" },
            })
            return;
        }

        Send(`api/ModifyLoginPwd?oldPwd=${oldPwd}&newPwd=${newPwd}`, {}, 'get').then(res => {
            if (res.code == 200) {
                Toast.show({
                    text: '修改成功',
                    position: "top",
                    textStyle: { textAlign: "center" }
                })
                setTimeout(() => that.loginOut(), 1000)
            } else {
                Toast.show({
                    text: '修改失败',
                    position: "top",
                    textStyle: { textAlign: "center" }
                })
            }
        })
    }
    render() {
        return (
            <View style={styles.businessPwdPageView}>
                <Header title="修改登录密码" />
                {/* <LinearGradient colors={[Colors.C6, Colors.LightG]} start={{ x: 0, y: 0.1 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}> */}
                <View style={{ flex: 1 }}>
                    <View style={styles.pwdViewStyle}>
                        <View style={{ paddingVertical: 5, backgroundColor: "#ffffff" }}>
                            <Text style={{ color: Colors.C6, fontSize: 14, }}>
                                提示: 密码必须是数字或字母或字母和数字的组合
                            </Text>
                        </View>
                        <TextInput style={styles.inputViewStyle}
                            placeholder="请输入原密码"
                            autoCapitalize="none"
                            clearButtonMode="always"
                            secureTextEntry={true}
                            onChangeText={(text) => {
                                this.setState({
                                    oldPwd: text
                                })
                            }}
                        />
                        <TextInput style={styles.inputViewStyle}
                            placeholder="请输入新密码"
                            autoCapitalize="none"
                            secureTextEntry={true}
                            clearButtonMode="always"
                            onChangeText={(text) => {
                                this.setState({
                                    newPwd: text
                                })
                            }}
                        />
                        <TextInput style={styles.inputViewStyle}
                            placeholder="请确认新密码"
                            autoCapitalize="none"
                            secureTextEntry={true}
                            clearButtonMode="always"
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
                                <View style={styles.submitBtn} >
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
});

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch({ type: LOGOUT }),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditSignInPwd);

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
        backgroundColor: Colors.LightG,
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
})