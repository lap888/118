import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Platform, ScrollView } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { Icon } from 'native-base';
import { LOGOUT, UPDATE_USER_AVATAR } from '../../../../redux/ActionTypes';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Header } from '../../../components/Index';
import { API_PATH } from '../../../../config/Index';
import Cookie from 'cross-cookie';
import { Colors, Metrics } from '../../../theme/Index';
import { Send } from '../../../../utils/Http';
import Advert from '../../advert/Advert';

class UserInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: props.navigation.state.params.name || ''
        };
    }
    /**
     * 调用摄像头或手机相册
     */
    pickImage() {
        var that = this;        
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
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('用户取消了选择图片');
            } else if (response.errorCode) {
                console.log('launchImageLibrary 错误: ', response.errorMessage);
            } else {
                let picBase = 'data:image/jpeg;base64,' + response.base64;
                Send('api/ModifyUserPic', { userPic: picBase }).then(res => {
                    if (res.code == 200) {
                        that.props.updateUserAvatar(res.data);
                    }
                })
            }
        });
    }
    /**
     * 退出登录
     */
    loginOut() {
        Cookie.remove('token')
        this.props.logout();
        Advert.setUserId()
        Actions.pop();
    }
    render() {
        let { mobile, name, avatarUrl, inviterMobile, reContactTel, reWeChatNo, myContactTel, myWeChatNo } = this.props;
        return (
            <View style={styles.container}>
                <Header title="基本资料" />
                <ScrollView>
                    <View style={styles.labelContainer}>
                        <Text style={styles.lableTxt}>头像</Text>
                        <TouchableOpacity onPress={() => { }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <Image source={require('../../../images/logo.png')} style={{ width: 46, height: 46, borderRadius: 23 }} />
                                {/* <Icon name="arrow-forward" style={{ color: Colors.C6, fontSize: 20, marginLeft: 10 }} /> */}
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.labelContainer}>
                        <Text style={styles.lableTxt}>账号</Text>
                        <Text style={[styles.lableTxt, { color: Colors.C10 }]}>{mobile}</Text>
                    </View>
                    <View style={styles.labelContainer}>
                        <Text style={styles.lableTxt}>昵称</Text>
                        <TouchableOpacity onPress={() => Actions.EditUserInfo()}>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: "center" }}>
                                <Text style={[styles.lableTxt, styles.nickname]} numberOfLines={1}>{name}</Text>
                                <Icon name="arrow-forward" style={{ color: Colors.C6, fontSize: 20 }} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.labelContainer}>
                        <Text style={styles.lableTxt}>我的邀请人</Text>
                        <TouchableOpacity style={styles.btnRight} onPress={() => { }}>
                            <Text style={[styles.lableTxt, { color: Colors.C10 }]}>{inviterMobile == '19191999888' ? '社区' : inviterMobile}</Text>
                            <Icon name="arrow-forward" style={{ color: Colors.C6, fontSize: 20, marginLeft: 10 }} />
                        </TouchableOpacity>
                    </View>

                    {/* <TouchableOpacity style={styles.labelContainer} onPress={() => Actions.EditInviterUser()}>
                        <Text style={styles.lableTxt}>绑定邀请人</Text>
                        <View style={styles.btnRight}>
                            <Icon name="arrow-forward" style={{ color: Colors.C6, fontSize: 20 }} />
                        </View>
                    </TouchableOpacity> */}
                    {/* <View style={styles.labelContainer}>
                        <Text style={styles.lableTxt}>修改联系方式</Text>
                        <TouchableOpacity style={styles.btnRight} onPress={() => Actions.push('SetContact', { myContactTel, myWeChatNo })}>
                            <Text style={[styles.lableTxt, { color: Colors.C10 }]}></Text>
                            <Icon name="arrow-forward" style={{ color: Colors.C6, fontSize: 20, marginLeft: 10 }} />
                        </TouchableOpacity>
                    </View> */}
                    <TouchableOpacity style={styles.labelContainer} onPress={() => Actions.BusinessPwd()}>
                        <Text style={styles.lableTxt}>修改交易密码</Text>
                        <View style={styles.btnRight}>
                            <Icon name="arrow-forward" style={{ color: Colors.C6, fontSize: 20 }} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.labelContainer} onPress={() => Actions.EditSignInPwd()}>
                        <Text style={styles.lableTxt}>修改登录密码</Text>
                        <View style={styles.btnRight}>
                            <Icon name="arrow-forward" style={{ color: Colors.C6, fontSize: 20 }} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.labelContainer} onPress={() => Actions.ModifyAlipay()}>
                        <Text style={styles.lableTxt}>修改支付方式</Text>
                        <View style={styles.btnRight}>
                            <Icon name="arrow-forward" style={{ color: Colors.C6, fontSize: 20 }} />
                        </View>
                    </TouchableOpacity>

                    <View style={styles.signOutView}>
                        <TouchableOpacity onPress={() => { this.loginOut() }}>
                            <View style={styles.signOutBtn} >
                                <Text style={{ padding: 15, color: "#ffffff" }}>退出登录</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }
}
const mapStateToProps = state => ({
    logged: state.user.logged,
    userId: state.user.id,
    mobile: state.user.mobile,
    name: state.user.name,
    avatarUrl: state.user.avatarUrl,
    inviterMobile: state.user.inviterMobile,
    reWeChatNo: state.user.reWeChatNo,
    reContactTel: state.user.reContactTel,
    myWeChatNo: state.user.myWeChatNo,
    myContactTel: state.user.myContactTel,
});

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch({ type: LOGOUT }),
    updateUserAvatar: avatar => dispatch({ type: UPDATE_USER_AVATAR, payload: { avatar } })
});

export default connect(mapStateToProps, mapDispatchToProps)(UserInfo);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    button: { margin: 100, backgroundColor: 'orange' },
    labelContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 52,
        marginLeft: 10,
        paddingRight: 10,
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.C7
    },
    labelContainerflex: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 10,
        paddingRight: 10,
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.C7
    },
    lableTxt: { fontSize: 16, color: Colors.C11 },
    nickname: { textAlign: "right", paddingRight: 10, color: Colors.C10 },
    signOutView: { justifyContent: 'center', alignItems: "center", marginBottom: 40 },
    signOutBtn: { marginTop: 50, width: Metrics.screenWidth * 0.6, backgroundColor: Colors.C6, alignItems: "center", borderRadius: 8 },
    btnRight: { flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: "center" },
})