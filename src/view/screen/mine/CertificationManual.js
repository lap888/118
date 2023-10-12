import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image, Platform, NativeModules, Keyboard } from 'react-native';
import { connect } from 'react-redux';
// import { Toast, Icon } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from "react-native-vector-icons/FontAwesome";

import { launchImageLibrary } from 'react-native-image-picker';
import { SET_USERINFO } from '../../../redux/ActionTypes';
import { Colors } from '../../theme/Index';
import { Header, PicturePreview } from '../../components/Index';
import { Send } from '../../../utils/Http';
import { Toast } from '../../common';

// 实名认证
const AUTHENTICATION_STATUS = [
    { key: 0, value: "未实名认证", title: "提交人工审核" },
    { key: 1, value: "提交人工审核", title: "审核中" },
    { key: 2, value: "审核通过", title: "审核通过" },
    { key: 3, value: "审核未通过", title: "再次提交" },
];
const ImageArray = [
    { key: "positiveUrl", title: "身份证正面照示例", temp: require('../../images/Alipay.png') },
    { key: "negativeUrl", title: "身份证反面照示例", temp: require('../../images/Alipay.png') },
    // { key: "characterUrl", title: "      人像照示例      ", temp: require('../../images/character2.png') },
];
class CertificationManual extends Component {
    constructor(props) {
        super(props);
        this.state = {
            auditState: props.auditState,
            username: "", 					// 用户真实姓名
            alipay: "",						// 支付宝
            idCard: "",						// 身份证
            alipayTemp: "",					// 再次输入支付宝
            positiveUrl: "",				// 身份证正面
            negativeUrl: "",				// 身份证反面
            characterUrl: "",				// 人像
            positiveUrlBase: "",				// 身份证正面
            negativeUrlBase: "",				// 身份证反面
            characterUrlBase: "",				// 人像
            picturePreviewList: [], 		// 预览图片
            picturePreviewModalVisible: false,	// 预览弹框
        };
    }

    /**
     * 渲染Form表单
     */
    renderForm() {
        return (
            <View>
                <View style={{ padding: 8, backgroundColor: "#ffffff" }}>
                    <Text style={{ color: Colors.C6, fontSize: 14, }}>{`${this.props.auditState !== 3 ? "温馨提示: 请填写真实信息,我们将在5个工作日内处理" : ("审核失败: " + this.state.failReason + "请完成修改之后再次提交")}`}
                    </Text>
                </View>
                <View style={Styles.itemView}>
                    <Text style={{ color: "#2c2c2c" }}>姓名</Text>
                    <TextInput style={Styles.inputStyle}
                        editable={this.props.auditState !== 1 && this.props.auditState !== 2}
                        placeholder="请填写姓名"
                        autoCapitalize="none"
                        defaultValue={this.props.auditState !== 0 ? this.state.username : ''}
                        clearButtonMode="while-editing"
                        onChangeText={(text) => this.setState({ username: text })}
                        returnKeyType="next"
                    />
                </View>
                <View style={Styles.itemView}>
                    <Text style={{ color: "#2c2c2c" }}>身份证</Text>
                    <TextInput style={Styles.inputStyle}
                        editable={this.props.auditState !== 1 && this.props.auditState !== 2}
                        placeholder="请填写身份证号"
                        defaultValue={this.props.auditState !== 0 ? this.state.idCard : ''}
                        autoCapitalize="none"
                        clearButtonMode="while-editing"
                        onChangeText={(text) => this.setState({ idCard: text })}
                        returnKeyType="next"
                    />
                </View>
                <View style={Styles.itemView}>
                    <Text style={{ color: "#2c2c2c" }}>支付宝</Text>
                    <TextInput style={Styles.inputStyle}
                        editable={this.props.auditState !== 1 && this.props.auditState !== 2}
                        placeholder="请填写支付宝"
                        autoCapitalize="none"
                        defaultValue={this.props.auditState !== 0 ? this.state.alipay : ''}
                        clearButtonMode="while-editing"
                        onChangeText={(text) => this.setState({ alipay: text })}
                        returnKeyType="next"
                    />
                </View>
                {[0, 3].indexOf(this.props.auditState) !== -1 &&
                    <View style={Styles.itemView}>
                        <Text style={{ color: "#2c2c2c" }}>确认支付宝</Text>
                        <TextInput style={Styles.inputStyle}
                            placeholder="请再次填写支付宝"
                            autoCapitalize="none"
                            defaultValue={this.state.alipayTemp}
                            clearButtonMode="while-editing"
                            onChangeText={(text) => this.setState({ alipayTemp: text })}
                        />
                    </View>
                }
            </View>
        )
    }
    /**
	 * 调起相册
	 */
    handleImagePicker(key) {
        const options = {
            cameraType: 'back',
            mediaType: 'photo',
            videoQuality: 'high',
            durationLimit: 10,
            maxWidth: 600,
            maxHeight: 600,
            quality: 1,
            includeBase64: true,
            saveToPhotos: false
        };
        let that = this;
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('用户取消了选择图片');
            } else if (response.errorCode) {
                console.log('launchImageLibrary 错误: ', response.errorMessage);
            } else {
                that.setState({ [key]: 'data:image/jpeg;base64,' + response.base64 });
            }
        });
    }
    /**
	 * 调起图片预览组件
	 */
    handelPreviewImage(uri) {
        this.setState({ picturePreviewList: [uri] }, () => {
            if (!this.state.picturePreviewModalVisible) this.setState({ picturePreviewModalVisible: true });
        });
    }
    /**
	 * 渲染截图
	 */
    renderScreenShot() {
        return (
            ImageArray.map(item => {
                return (
                    <View style={{ flexDirection: 'row', margin: 20, marginBottom: 0 }} key={item['key']}>
                        <View style={{ width: 120, alignItems: 'center' }}>
                            {this.props.auditState !== 1 && this.props.auditState !== 2 ?
                                <TouchableOpacity onPress={() => this.handleImagePicker(item['key'])}>
                                    <View style={Styles.uploadView}>
                                        <Text style={{ color: Colors.C8, fontSize: 14 }}>上传截图</Text>
                                    </View>
                                </TouchableOpacity>
                                :
                                <View style={[Styles.uploadView, { backgroundColor: Colors.C16 }]}>
                                    <Text style={{ color: Colors.C8, fontSize: 14 }}></Text>
                                </View>
                            }
                            {this.state[item['key']] ?
                                <View>
                                    <Image source={{ uri: this.state[item['key']] }} style={Styles.screenshotImg} />
                                    <TouchableOpacity style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.handelPreviewImage({ uri: this.state[item['key']] })}>
                                        <View style={{ transform: [{ rotateZ: '45deg' }] }}>
                                            <Text allowFontScaling={false} style={{ fontSize: 16, color: Colors.C6, fontWeight: '500' }}>118创富助手实名审核</Text>
                                        </View>
                                    </TouchableOpacity>
                                    {this.props.auditState !== 1 && this.props.auditState !== 2 &&
                                        <TouchableOpacity style={{ position: 'absolute', top: 10, right: 0 }} onPress={() => this.setState({ [item['key']]: '' })}>
                                            <View style={Styles.close}>
                                                <Image style={{ height: 20, width: 20 }}
                                                    source={require("../../images/close.png")}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    }
                                </View>
                                :
                                <View style={[Styles.screenshotImg, { justifyContent: 'center', alignItems: 'center' }]}>
                                    <FontAwesome name="image" color={Colors.C6} size={60} />
                                </View>
                            }
                        </View>
                        <View style={{ marginLeft: 30, alignItems: 'center' }}>
                            <Text style={{ fontSize: 16, color: Colors.C0, padding: 11 }}>{`${item['title']} `}</Text>
                            <TouchableOpacity onPress={() => this.handelPreviewImage(item['temp'])}>
                                <Image source={item['temp']} style={Styles.screenshotImg} />
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            }
            )
        )
    }
    getSubmmitButtonText(auditState) {
        let element = AUTHENTICATION_STATUS.filter(item => auditState === item['key']);
        return element[0]['title'];
    }
    /**
	 * 更新用户信息
	 */
    updateUserInfo() {
        if (!this.props.userId) return;
        var that = this;
        setTimeout(() => {
            that.props.resetUserInfo({ auditState: 1 });
        }, 1000);
    }
    /**
	 * 提交人工审核
	 */
    verification() {
        Keyboard.dismiss();

        let { username, alipay, alipayTemp, idCard, positiveUrl, negativeUrl, characterUrl } = this.state;
        if (username.length === 0 || alipay.length === 0 || idCard.length === 0 || positiveUrl.length === 0 || negativeUrl.length === 0 || characterUrl.length === 0) {
            Toast.show({
                text: "所有选项都为必填",
                position: "top",
                textStyle: { textAlign: "center" }
            })
            return;
        }

        if (alipay !== alipayTemp) {
            Toast.show({
                text: "两次输入的支付宝账户不一致",
                position: "top",
                textStyle: { textAlign: "center" }
            })
            return;
        }

        let params = {
            trueName: username,
            idNum: idCard,
            alipay: alipay,
            positiveUrl,
            negativeUrl,
            characterUrl,
            authType: 1
        }
        let that = this;

        Send("api/AdminAuth", params).then(res => {
            if (res.code == 200) {
                that.updateUserInfo();
                Toast.show({
                    text: '提交审核成功',
                    position: "top",
                    textStyle: { textAlign: "center" },
                })
            } else {
                Toast.show({
                    text: res.message,
                    position: "top",
                    textStyle: { textAlign: "center" },
                })
            }
        });
    }
    /**
	 * 渲染提交按钮
	 */
    renderSubmmitButton() {
        return (
            <View style={Styles.submitView}>
                <TouchableOpacity disabled={this.props.auditState === 1 || this.props.auditState === 2} onPress={() => this.verification()}>
                    <View style={[Styles.submitBtn, { backgroundColor: Colors.C6 }]}>
                        <Text style={Styles.submitTxt}>{this.getSubmmitButtonText(this.props.auditState)}</Text>
                    </View>
                </TouchableOpacity>
                {this.props.auditState === 1 &&
                    <Text style={{ marginTop: 6, fontSize: 12, color: Colors.White, textAlign: 'center' }}>{`请您耐心等待，我们将在5个工作日内处理`}</Text>
                }
            </View>
        )
    }
    render() {
        return (
            <View style={Styles.container}>
                <Header title="人工审核" />
                <LinearGradient colors={[Colors.C6, Colors.LightG]} start={{ x: 0, y: -0.3 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}>
                    <ScrollView style={{ margin: 5 }}>
                        {this.renderForm()}
                        {this.renderScreenShot()}
                        {this.props.auditState !== 1 && this.props.auditState !== 2 &&
                            <Text style={{ marginLeft: 20, marginTop: 15, fontSize: 14, color: Colors.White }}>{`图片要求：
                1.本人手持露脸，五官清晰可辨
                2.手持证明上信息完整清晰可辨
                3.证明有“仅供118创富助手认证”字样和日期
                4.日期必须是申请当天日期`}</Text>
                        }
                        {this.renderSubmmitButton()}
                    </ScrollView>
                </LinearGradient>
                <PicturePreview
                    data={this.state.picturePreviewList}
                    visible={this.state.picturePreviewModalVisible}
                    onClose={() => this.setState({ picturePreviewModalVisible: false })}
                />
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

export default connect(mapStateToProps, mapDispatchToProps)(CertificationManual);

const Styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    itemView: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: Colors.LightG,
        paddingHorizontal: 10,
        height: 48,
        borderRadius: 10,
        marginVertical: 1,
    },
    inputStyle: {
        flex: 1, textAlign: 'right'
    },
    submitView: {
        alignItems: "center",
        marginTop: 15,
        marginBottom: 15
    },
    submitBtn: {
        width: 260,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
    },
    submitTxt: {
        padding: 15,
        color: "#ffffff"
    },
    uploadView: {
        width: 100,
        padding: 12,
        backgroundColor: Colors.C6,
        alignItems: "center",
        borderRadius: 8,
    },
    screenshotImg: {
        marginTop: 14,
        width: 120,
        height: 180,
        resizeMode: "stretch",
        borderRadius: 10,
        borderColor: Colors.White,
        borderWidth: 1
    },
    close: {
        backgroundColor: Colors.C6,
        height: 20,
        width: 20,
        borderRadius: 13,
        position: 'absolute',
        left: -15,
        top: -4
    },
})