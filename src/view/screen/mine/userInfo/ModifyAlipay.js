import React, { Component } from 'react';
import {
    View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList,
    TextInput, Keyboard, NativeModules
} from 'react-native';
// import { Toast } from 'native-base';
const AliPay = NativeModules.AliPayModule;
import LinearGradient from 'react-native-linear-gradient';
import { Actions } from 'react-native-router-flux';
import { Header } from '../../../components/Index';
import { connect } from 'react-redux';
import { LOGOUT } from '../../../../redux/ActionTypes';
import { Colors, Metrics } from '../../../theme/Index';
import { SetAlipay } from '../../../../redux/ActionTypes';
import { Send } from '../../../../utils/Http';
import { Toast } from '../../../common';

class ModifyAlipay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alipay: '',
            bank: '',
            alipayUid: '',
            alipayName: '',
            pwd: ''
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
        let { alipay, pwd,bank, alipayName, alipayUid } = this.state;
        alipay = alipay == '' ? this.props.alipay : alipay;
        bank = bank == '' ? this.props.bank : bank;
        alipayUid = alipayUid == '' ? this.props.alipayUid : alipayUid;
        alipayName = alipayName == '' ? this.props.alipayName : alipayName;
        if (pwd.length === 0) {
            Toast.tipBottom('支付密码为必填项')
            return;
        }

        Send(`api/UserAli/Change`, { alipay: alipay, bank: bank, alipayUid: alipayUid, alipayName: alipayName, PayPwd: pwd }).then(res => {
            if (res.code == 200) {
                Toast.tipBottom('修改成功')
                this.props.modifyAlipay(alipay, bank, alipayUid, alipayName)
                Actions.pop();
            } else {
                Toast.tipBottom(res.message)
            }
        })
    }
    render() {
        return (
            <View style={styles.businessPwdPageView}>
                <Header title="修改支付方式" />
                <View style={styles.pwdViewStyle}>
                    <View style={{ paddingVertical: 5, backgroundColor: "#ffffff" }}>
                        <Text style={{ color: Colors.C6, fontSize: 14, }}> 提示: 修改支付方式需要消耗1GC服务费用 </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center' }}>
                        <View style={{}}><Text style={{ fontSize: 14, color: Colors.greyText, width: 80 }}>支付宝:</Text></View>
                        <TextInput style={styles.inputViewStyle}
                            placeholder={this.props.alipay == undefined || this.props.alipay == '' ? '请输入支付宝' : this.props.alipay}
                            autoCapitalize="none"
                            clearButtonMode="always"
                            onChangeText={(text) => {
                                this.setState({
                                    alipay: text
                                })
                            }}
                        />
                    </View>

                    <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center' }}>
                        <View style={{}}><Text style={{ fontSize: 14, color: Colors.greyText, width: 80 }}>银行卡号:</Text></View>
                        <TextInput style={styles.inputViewStyle}
                            placeholder={this.props.alipayUid == undefined || this.props.alipayUid == '' ? '请输入银行卡号' : this.props.alipayUid}
                            autoCapitalize="none"
                            clearButtonMode="always"
                            onChangeText={(text) => {
                                this.setState({
                                    alipayUid: text
                                })
                            }}
                        />
                    </View>

                    <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center' }}>
                        <View style={{}}><Text style={{ fontSize: 14, color: Colors.greyText, width: 80 }}>开户行:</Text></View>
                        <TextInput style={styles.inputViewStyle}
                            placeholder={this.props.bank == undefined || this.props.bank == '' ? '请输入开户行' : this.props.bank}
                            autoCapitalize="none"
                            clearButtonMode="always"
                            onChangeText={(text) => {
                                this.setState({
                                    bank: text
                                })
                            }}
                        />
                    </View>

                    <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center' }}>
                        <View style={{}}><Text style={{ fontSize: 14, color: Colors.greyText, width: 80 }}>开户人姓名:</Text></View>
                        <TextInput style={styles.inputViewStyle}
                            placeholder={this.props.alipayName == undefined || this.props.alipayName == '' ? '请输入开户人姓名' : this.props.alipayName}
                            autoCapitalize="none"
                            clearButtonMode="always"
                            onChangeText={(text) => {
                                this.setState({
                                    alipayName: text
                                })
                            }}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center' }}>
                        <View style={{}}><Text style={{ fontSize: 14, color: Colors.greyText, width: 80 }}>支付密码:</Text></View>
                        <TextInput style={styles.inputViewStyle}
                            placeholder="请输入支付密码"
                            autoCapitalize="none"
                            clearButtonMode="always"
                            secureTextEntry={true}
                            onChangeText={(text) => this.setState({ pwd: text })}
                        />
                    </View>

                    <View style={styles.submitView}>
                        <TouchableOpacity onPress={() => { this.resetTradePed() }}>
                            <View style={styles.submitBtn} >
                                <Text style={{ padding: 15, color: "#ffffff" }}> 确认 </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

const mapStateToProps = state => ({
    userId: state.user.id,
    alipay: state.user.alipay,
    bank: state.user.bank,
    alipayUid: state.user.alipayUid,//银行卡
    alipayName: state.user.alipayName,
});

const mapDispatchToProps = dispatch => ({
    modifyAlipay: (alipay, bank, alipayUid, alipayName) => dispatch({ type: SetAlipay, payload: { alipay: alipay, bank: bank, alipayUid: alipayUid, alipayName: alipayName } }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ModifyAlipay);

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
        borderRadius: 10,
        borderBottomColor: Colors.greyText,
        borderBottomWidth: 1,
        fontSize: 14,
        color: Colors.greyText,
        width: Metrics.screenWidth - 100
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