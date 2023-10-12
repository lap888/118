import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Platform, NativeModules, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'native-base';
import { Actions } from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';
// import Alipay from '@uiw/react-native-alipay';

import { SET_USERINFO } from '../../../redux/ActionTypes';
import { Colors, Metrics } from '../../theme/Index';
import { Header } from '../../components/Index';
import { EncryptionIdCode } from '../../../utils/Index';
import { Send } from '../../../utils/Http';
import { Toast } from '../../common';
import { OtherApi } from '../../../api';

const ZIMFacade = NativeModules.ZIMFacade;
const RNAlipayVerify = NativeModules.RNAlipayVerify;
// 实名认证
const AUTHENTICATION_STATUS = [
    { key: 0, value: "未实名认证", title: "未实名认证" },
    { key: 1, value: "提交人工审核", title: "提交人工审核" },
    { key: 2, value: "审核通过", title: "审核通过" },
    { key: 3, value: "审核未通过", title: "再次提交" },
];
class Certification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            certifyId: "",
            username: "", 		// 用户真实姓名
            alipay: "",			// 支付宝
            idCard: "",			// 身份证
            alipayTemp: ""		// 再次输入支付宝
        };
    }
    onRightPress() {
        Actions.push('CertificationManual', { auditState: this.props.auditState });
    }
    getSubmmitButtonText(auditState) {
        let element = AUTHENTICATION_STATUS.filter(item => auditState === item['key']);
        return element[0]['value'];
    }
    /**
     * 更新用户信息
     */
    updateUserInfo(golds, level, candyP) {
        if (!this.props.userId) return;
        var that = this;
        setTimeout(() => {
            let userInfoServer = { auditState: 2, golds, level, candyP };
            that.props.resetUserInfo(userInfoServer);
        }, 1000);
    }
    /**
     * 提交
     */
    verification = (certifyId) => {
        /* 发送请求 */
        let params = {
            trueName: this.state.username,
            idNum: this.state.idCard,
            alipay: this.state.alipay,
            certifyId: certifyId,
            AuthType: 0
        }
        if (this.props.logged) {
            Send("api/AuthenticationNew", params).then(res => {
                if (res.code == 200) {
                    Toast.tip('认证成功');
                    this.updateUserInfo(res.data.golds, res.data.level, res.data.candyP);
                } else {
                    Toast.tip(res.message)
                }
            });
        } else {
            Toast.tip('请先登录')
            setTimeout(() => Actions.push('Login'), 1000);
        }
    }
    /**
     * 调用刷脸SDK，返回身份验证情况
     * @param {*} url
     * @param {*} certifyId 
     */
    verify(url, certifyId) {

        if (Platform.OS == "ios") {
            RNAlipayVerify.startVerifyService(url, certifyId, (response) => {
                if (response) {
                    // 处理业务逻辑 提交后台
                    this.verification();
                } else {
                    Toast.tip('认证失败');
                }
            })
        } else {
            ZIMFacade.verify(url, certifyId, (response) => {
                if (response) {
                    // 处理业务逻辑 提交后台
                    this.verification();
                } else {
                    Toast.tip('认证失败');
                }
            });
        }
    }
    payRefund() {
        Send('api/PayRefund', {}, 'get').then(res => {
            Toast.tip('res.message');
        });
    }
    /**
     * 调用自己后台服务器接口 获取认证需要参数
     */
    getZimid = (certName, certNo) => {
        Keyboard.dismiss();
        let username = this.state.username
        let alipay = this.state.alipay
        let idCard = this.state.idCard
        if (username.length === 0 || alipay.length === 0 || idCard.length === 0) {
            Toast.tip('所有选项都为必填')
            return;
        }
        if (this.state.alipay !== this.state.alipayTemp) {
            Toast.tip('两次输入的支付宝账户不一致')
            return;
        }
        this.verification(118)
        // OtherApi.getCreateAuthUrl()
        //     .then((authInfoStr) => {
        //         console.log('authInfoStr: ', authInfoStr);
        //         return Alipay.authInfo(authInfoStr)
        //     })
        //     .then((res) => {
        //         if (res.resultStatus == '9000') {
        //             const objList = res.result.split('&');
        //             for (let i = 0; i < objList.length; i++) {
        //                 const obj = objList[i];
        //                 if (obj.split('=')[0] === 'user_id') {
        //                     this.setState({
        //                         certifyId: obj.split('=')[1]
        //                     })
        //                     this.verification(obj.split('=')[1])
        //                     return;
        //                 }
        //             }
        //             // return OtherApi.pushAuthCode(res.result)
        //         }
        //     }).catch((err) => console.log('err', err))
        // 支付宝端授权验证
        // Send("apiV2/FaceInit", { certName: certName, certNo: certNo, alipay: this.state.alipay }).then(response => {
        //     if (response.code == 200) {
        //         // certifyId
        //         that.setState({
        //             certifyId: response.data.certifyId
        //         })
        //         // 调用刷脸SDK
        //         this.verify(response.data.certifyUrl, response.data.certifyId);
        //     } else {
        //         Toast.show({
        //             text: response.message,
        //             textStyle: { color: '#FFFFFF', textAlign: 'center' },
        //             position: "top",
        //             duration: 2000
        //         });
        //     }
        // });

    }
    onIsTouchPress() {
        this.getZimid(this.state.username, this.state.idCard);
    }
    isTouch() {
        if (this.props.auditState !== 2) {
            return (
                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => this.onIsTouchPress()}>
                        <View style={[Styles.submitBtn, { backgroundColor: Colors.main }]}>
                            <Text style={Styles.submitTxt}> 提 交 </Text>
                        </View>
                    </TouchableOpacity>
                    {/* <TouchableOpacity onPress={() => this.payRefund()}>
                        <View style={[Styles.submitBtn, { backgroundColor: Colors.C16, marginTop: 20 }]}>
                            <Text style={Styles.submitTxt}>
                                申请退款
                            </Text>
                        </View>
                    </TouchableOpacity> */}
                </View>
            )
        } else {
            return (
                <View style={[Styles.submitBtn, { backgroundColor: Colors.main, flexDirection: "row" }]}>
                    <Text style={Styles.submitTxt}>
                        审核已通过
                    </Text>
                    <Icon name="check-circle" type='FontAwesome' style={{ fontSize: 18, color: '#ffffff' }} />
                </View>
            )
        }
    }
    render() {
        return (
            <View style={Styles.container}>
                {/* <Header title="实名认证" rightText="人工审核" rightStyle={{ fontSize: 12 }} onRightPress={() => { this.onRightPress() }} /> */}
                <Header title="实名认证" />
                <View style={{ flex: 1 }}>
                    <ScrollView style={{ paddingHorizontal: 10 }}>
                        <View style={{ padding: 8 }}>
                            <Text style={{ color: Colors.C6, fontSize: 14, }}>
                                {'认证状态:' + this.getSubmmitButtonText(this.props.auditState)}
                            </Text>
                        </View>
                        <View style={Styles.itemView}>
                            <Text style={{ color: "#2c2c2c" }}>姓名</Text>
                            <TextInput style={Styles.inputStyle}
                                editable={this.props.auditState !== 2}
                                placeholder="请填写姓名"
                                autoCapitalize="none"
                                defaultValue={this.props.auditState === 2 ? this.props.trueName : ""}
                                clearButtonMode="while-editing"
                                onChangeText={(text) => {
                                    this.setState({
                                        username: text
                                    });
                                }}
                                returnKeyType="next"
                            />
                        </View>
                        <View style={Styles.itemView}>
                            <Text style={{ color: "#2c2c2c" }}>身份证</Text>
                            <TextInput style={Styles.inputStyle}
                                editable={this.props.auditState !== 2}
                                placeholder="请填写身份证号"
                                keyboardType='number-pad'
                                defaultValue={this.props.auditState === 2 ? EncryptionIdCode(this.props.idNum) : ""}
                                autoCapitalize="none"
                                clearButtonMode="while-editing"
                                onChangeText={(text) => {
                                    this.setState({
                                        idCard: text
                                    });
                                }}
                                returnKeyType="next"
                            />
                        </View>
                        <View style={Styles.itemView}>
                            <Text style={{ color: "#2c2c2c" }}>支付宝</Text>
                            <TextInput style={Styles.inputStyle}
                                editable={this.props.auditState !== 2}
                                placeholder="请填写支付宝"
                                autoCapitalize="none"
                                keyboardType='number-pad'
                                defaultValue={this.props.auditState === 2 ? this.props.alipay : ""}
                                clearButtonMode="while-editing"
                                onChangeText={(text) => {
                                    this.setState({
                                        alipay: text
                                    });
                                }}
                                returnKeyType="next"
                            />
                        </View>
                        {this.props.auditState !== 2 &&
                            <View style={Styles.itemView}>
                                <Text style={{ color: "#2c2c2c" }}>确认支付宝</Text>
                                <TextInput style={Styles.inputStyle}
                                    placeholder="请再次填写支付宝"
                                    autoCapitalize="none"
                                    keyboardType='number-pad'
                                    defaultValue={this.state.alipayTemp}
                                    clearButtonMode="while-editing"
                                    onChangeText={(text) => {
                                        this.setState({
                                            alipayTemp: text
                                        });
                                    }}
                                    returnKeyType="done"
                                    onSubmitEditing={() => this.getZimid(this.state.username, this.state.idCard)}
                                />
                            </View>
                        }
                        <View style={Styles.submitView}>
                            {this.isTouch()}
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }
}
const mapStateToProps = state => ({
    logged: state.user.logged,
    userId: state.user.id,
    auditState: state.user.auditState,
    alipay: state.user.alipay,
    idNum: state.user.idNum,
    trueName: state.user.trueName
});

const mapDispatchToProps = dispatch => ({
    resetUserInfo: userInfo => dispatch({ type: SET_USERINFO, payload: { userInfo } }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Certification);
const Styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.backgroundColor },
    itemView: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: Colors.White,
        paddingHorizontal: 10,
        height: 48,
        borderRadius: 6,
        marginVertical: 1,
        marginTop: 10
    },
    inputStyle: {
        flex: 1, textAlign: 'right'
    },
    submitView: {
        alignItems: "center",
        marginTop: Metrics.screenHeight * 0.1,
    },
    submitBtn: {
        width: Metrics.screenWidth * 0.4,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
    },
    submitTxt: {
        padding: 15,
        color: "#ffffff"
    },
})