import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, Keyboard, Image, ScrollView, PermissionsAndroid, TouchableOpacity, Modal, TextInput, Platform } from 'react-native';

import { launchImageLibrary } from 'react-native-image-picker';

import { Actions } from 'react-native-router-flux';
import Icon from "react-native-vector-icons/Ionicons";
import { BigButton, Header } from '../../components/Index';
import { Colors, Metrics } from '../../theme/Index';
import { Loading } from '../../common';
import { WEB_PATH } from '../../../config/Index';
import moment from 'moment';
import CameraRoll from "@react-native-community/cameraroll";
import QRCode from 'react-native-qrcode-svg';
import { captureRef } from 'react-native-view-shot';
import { Send } from '../../../utils/Http';
import Toast from '../../common/Toast';
class JieDian extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            data: '',
            img: '',
            deviceInfo: '',
            type: '1',
            jiedian: '',
            title: '',
            blockAdress: '',
            modalObtainedBuyListVisible: false,
            qrcodeUrl: `${WEB_PATH}?code=${this.props.code == "0" ? this.props.mobile : this.props.code}`,
            isLoading: false
        };
    }

    /**
     * 调用摄像头或手机相册
     */
    pickImage = () => {
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
                this.setState({ img: picBase })
            }
        });
    }

    submit = () => {
        if (this.state.title == '' || this.state.data == '') {
            Toast.tipBottom('标题和内容不能为空')
            return;
        }
        Send(`api/system/GetJieDian`, {}, 'get').then(res => {
            if (res.code == 200 && (res.data != "0" || res.data != 0)) {
                this.setState({ modalObtainedBuyListVisible: true, jiedian: res.data });
            } else {
                Toast.tipBottom(res.message)
            }
        });


    }

    /**
     * 取消分享
     */
    cancleObtainedBuyTransaction() {
        this.setState({ modalObtainedBuyListVisible: false });
    }
    /**
     * 保存
     */
    confirmObtainedBuyTransaction() {
        this.saveImage()
    }
    /**
     * 
     * @param {*} num 星期
     * @returns 
     */
    getWeek = (num) => {
        let week = '';
        if (num == 1) {
            week = '星期一'
        } else if (num == 2) {
            week = '星期二'
        } else if (num == 3) {
            week = '星期三'
        } else if (num == 4) {
            week = '星期四'
        } else if (num == 5) {
            week = '星期五'
        } else if (num == 6) {
            week = '星期六'
        } else {
            week = '星期日'
        }
        return week;
    }

    /**
     * 渲染二维码
     */
    renderQRCode() {
        let invitCode = this.props.rcode == "0" ? this.props.mobile : this.props.rcode;
        let qrcodeUrl = `${WEB_PATH}?code=${invitCode}`;
        return (
            <View style={{ marginTop: 20, justifyContent: 'center', alignSelf: 'center' }}>
                <QRCode
                    value={qrcodeUrl}
                    logoSize={20}
                    size={100}
                    logoMargin={5}
                    logoBorderRadius={10}
                    logo={require('../../images/logo.png')}
                />
            </View>
        )
    }
    saveImage = async () => {
        if (Platform.OS == 'ios') {
            this.snapshot()
        } else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: "NDGC想要使用您的相册存储权限",
                        message:
                            "没有您的存储权限将不能保存到相册",
                        buttonNeutral: "以后询问",
                        buttonPositive: "好的"
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log("允许");
                    this.snapshot()
                } else {
                    console.log("不允许");
                }
            } catch (err) {
                console.warn(err);
            }
        }

    };

    snapshot = () => {
        if (!this.refs.shareViewShot) return;
        captureRef(
            this.refs.shareViewShot, {
            format: 'jpg',
            quality: 1,
            result: "tmpfile"
        }).then((uri) => {
            return CameraRoll.save(uri)
        }).then((res) => {
            Toast.tipTop('已保存到相册，快去分享吧')
            this.setState({ modalObtainedBuyListVisible: false });
        }).catch((err) => console.warn('err', err))
    }
    /**
    * 渲染分享
    */
    renderModalCancleBuyList() {
        let { modalObtainedBuyListVisible } = this.state;
        return (
            <Modal animationType='slide' visible={modalObtainedBuyListVisible} transparent onRequestClose={() => { }}>
                <View style={{ flex: 1, backgroundColor: 'transparent' }}>
                    <View style={styles.modalBody1}>
                        <View style={{ flex: 1 }}>
                            <ScrollView contentContainerStyle={{ marginHorizontal: 20, marginTop: 20 }}>
                                <View ref="shareViewShot" style={{ alignItems: 'center', justifyContent: 'center', width: Metrics.screenWidth - 50, backgroundColor: Colors.activeTintColor, borderRadius: 5 }}>
                                    <Image style={{ width: 60, height: 60, marginTop: 30, borderRadius: 30 }} source={require('../../images/logo.png')}></Image>
                                    <Text style={{ fontSize: 20, marginTop: 20, fontWeight: 'bold', color: Colors.White }}>{this.props.name}·社区</Text>
                                    <Text style={{ color: Colors.White, marginTop: 10 }}>{moment(new Date()).format('YYYY-MM-DD hh:mm')} {this.getWeek(moment(new Date()).format('d'))}</Text>
                                    <View style={{ padding: 10, margin: 10, minWidth: Metrics.screenWidth - 80, backgroundColor: Colors.White, borderRadius: 5, paddingBottom: 30, marginBottom: 30 }}>
                                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ color: Colors.main, marginBottom: 10, fontSize: 18, }}>{this.state.title}</Text>
                                        </View>

                                        <Text style={{ color: Colors.main, marginBottom: 10, fontSize: 16, }}>{moment(new Date()).format('YYYY-MM-DD hh:mm:ss')}</Text>
                                        <Text>{this.state.data}</Text>
                                        <View style={{ marginVertical: 20, alignItems: 'center' }}>
                                            {this.renderQRCode()}
                                            {/* <Text style={{ color: Colors.main, marginTop: 25, fontSize: 16, }}>欢迎加入NDGC </Text>
                                            <Text style={{ color: Colors.main, marginTop: 25, fontSize: 14, color: Colors.main }}>一起畅玩 NFT DeFi GameChain</Text> */}
                                            <Text style={{ color: Colors.main, marginTop: 20, fontSize: 13, }}>邀请码:{this.props.rcode}</Text>
                                            <Text style={{ color: Colors.main, marginTop: 5, fontSize: 14 }}>扫码加入NDGC</Text>
                                            <Text style={{ color: Colors.main, marginTop: 5, fontSize: 14, color: Colors.main }}>一起畅玩 NFT DeFi GameChain</Text>
                                        </View>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                    <View style={styles.modalHeader1}>
                        <View style={styles.modalFooter1}>
                            <Text style={{ color: Colors.main, fontSize: 18, fontWeight: 'bold', marginTop: 10 }}>分享</Text>
                            <TouchableOpacity onPress={() => this.confirmObtainedBuyTransaction()}>
                                <View style={{ alignItems: 'center' }}>
                                    <Icon name="arrow-down-circle-sharp" style={styles.actionButtonIcon} />
                                    <Text style={{ color: Colors.lineColor }}>保存图片</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.cancleObtainedBuyTransaction()}>
                                <View style={[styles.publishConfirm1, { backgroundColor: Colors.Gainsboro, marginTop: 10 }]}>
                                    <Text style={styles.publishConfirmText1}>取消</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
    onRightPress() {
        Send(`api/system/CopyWriting?type=jiedian_rule`, {}, 'get').then(res => {
            Actions.push('CommonRules', { title: '当前节点', rules: res.data });
        });
    }

    /**
     * 更新检索手机号
     */
    updateSearchText() {
        Keyboard.dismiss();
        Send(`api/system/UserDeviceList?mobile=${this.state.blockAdress}`, {}, 'get').then(res => {
            if (res.code != 200) {
                Toast.tipBottom(res.message)
            } else {
                this.setState({ deviceInfo: res.data })
            }
        });
    }
    /**
     * 解绑
     */
    submitJieBang = (mobile) => {
        if (mobile == '' || mobile == undefined) {
            Toast.tipBottom('解绑设备不能为空')
            return;
        }
        Send(`api/system/JieBindDevice?mobile=${mobile}`, {}, 'get').then(res => {
            Toast.tipBottom(res.message)
        });
    }
    render() {
        const { data, img, type, isLoading, title } = this.state;
        return (
            <View style={{ flex: 1, backgroundColor: Colors.backgroundColor }}>
                {/* rightText={'查看'} onRightPress={() => this.onRightPress()} */}
                <Header title="社区" rightText={'查看'} onRightPress={() => this.onRightPress()} />
                <View style={styles.iptView2}>
                    <View style={{ flex: 1 }}>
                        <TextInput
                            // style={{ flex: 1, textAlignVertical: 'top' }}
                            placeholder={'标题'}
                            value={title}
                            // multiline={true}
                            onChangeText={(value) => this.setState({ title: value })}
                        />
                    </View>
                </View>
                <View style={styles.iptView}>
                    <View style={{ flex: 1 }}>
                        <TextInput
                            style={{ flex: 1, textAlignVertical: 'top' }}
                            placeholder={'请输入想要生成的内容'}
                            value={data}
                            multiline={true}
                            onChangeText={(value) => this.setState({ data: value })}
                        />
                    </View>
                </View>
                <BigButton style={styles.bigBtn} name={'生成社区宣传图'} onPress={this.submit} />
                {/* <ScrollView style={{ paddingTop: 10, marginTop: 20 }} >
                    <View style={styles.searchContainer}>
                        <Text style={styles.mobileText}>查询</Text>
                        <TextInput keyboardType="numeric" style={styles.mobileInput} placeholder="请输解绑手机号"
                            value={this.state.blockAdress}
                            onChangeText={blockAdress => this.setState({ blockAdress })}
                            onBlur={() => this.updateSearchText()}
                        />
                        <TouchableOpacity onPress={() => Keyboard.dismiss()}>
                            <Icon name="md-search" style={styles.searchIcon} />
                        </TouchableOpacity>
                    </View>
                    {this.state.deviceInfo != '' &&
                        <View style={{ paddingVertical: 5 }}>
                            <Text style={{ flex: 1, marginLeft: 10, color: Colors.main, marginTop: 5 }} numberOfLines={1}>绑定机型:{this.state.deviceInfo[0].systemName}</Text>
                            <Text style={{ flex: 1, marginLeft: 10, color: Colors.fontColor, marginTop: 2 }} numberOfLines={1}>绑定系统版本:{this.state.deviceInfo[0].appVersion}</Text>
                            <Text style={{ flex: 1, marginLeft: 10, color: Colors.Alipay, marginTop: 5 }} numberOfLines={1}>绑定设备号:{this.state.deviceInfo[0].uniqueId}</Text>
                            <Text style={{ flex: 1, marginLeft: 10, color: Colors.notice, marginTop: 5 }} numberOfLines={1}>解绑次数:{this.state.deviceInfo[0].unLockCount}</Text>
                            <Text style={{ flex: 1, marginLeft: 10, color: Colors.yellow, marginTop: 5 }} numberOfLines={1}>绑定手机号:{this.state.deviceInfo[0].mobile}</Text>
                            <Text style={{ flex: 1, marginLeft: 10, color: Colors.fontColor, marginTop: 5 }} numberOfLines={1}>绑定日期:{this.state.deviceInfo[0].utime}</Text>
                            <BigButton style={styles.bigBtn} name={'解绑'} onPress={() => { this.submitJieBang(this.state.blockAdress) }} />
                        </View>}
                </ScrollView> */}
                {isLoading && <Loading />}
                {this.renderModalCancleBuyList()}
            </View>
        );
    }
}

const mapStateToProps = state => ({
    logged: state.user.logged,
    userId: state.user.id,
    mobile: state.user.mobile,
    level: state.user.level,
    candyH: state.user.candyH || 0,
    candyP: state.user.candyP,
    candyNum: state.user.candyNum,
    location: state.user.location,
    warnVersion: state.router.warnVersion,
    isReaded: state.notice.isReaded,
    id: state.notice.id,
    uuid: state.user.uuid,
    isDoTask: state.user.isDoTask,
    dayNum: state.user.dayNum,
    cotton: state.user.cotton,
    level: state.user.level,
    title: state.notice.title,
    content: state.notice.content,
    userBalanceNormal: state.user.userBalanceNormal,
    userBalanceLock: state.user.userBalanceLock,
    //add
    name: state.user.name,
    avatarUrl: state.user.avatarUrl,
    rcode: state.user.rcode
});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(JieDian);

const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
    sequenceTitle: { fontSize: 14, color: Colors.C11 },
    sequenceTitleed: { fontSize: 16, color: Colors.main },
    sequence: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        width: Metrics.screenWidth,
        backgroundColor: Colors.White
    },
    searchContainer: { padding: 12, marginHorizontal: 10, borderWidth: 1, borderColor: Colors.C16, paddingTop: 8, paddingBottom: 8, borderRadius: 8, backgroundColor: Colors.White, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    mobileText: { fontSize: 15, color: Colors.C6, fontWeight: 'bold' },
    mobileInput: { padding: 8, marginLeft: 10, borderRadius: 6, backgroundColor: Colors.C8, marginRight: 10, fontSize: 15, color: Colors.C2, flex: 1, textAlignVertical: 'center', borderWidth: 1, borderColor: Colors.C16 },
    searchIcon: { fontWeight: 'bold', color: Colors.C6, fontSize: 30 },
    inviteCode: { fontSize: 12, color: Colors.C16, },

    iptView: {
        minHeight: 178,
        flexDirection: 'row',
        margin: 15,
        paddingHorizontal: 10,
        backgroundColor: Colors.White,
        borderRadius: 5
    },
    iptView2: {
        minHeight: 45,
        flexDirection: 'row',
        margin: 15,
        paddingHorizontal: 10,
        backgroundColor: Colors.White,
        borderRadius: 5
    },
    imgView: {
        width: 80,
        height: 80,
        borderRadius: 3,
        marginRight: 5,
        marginLeft: 20,
        backgroundColor: Colors.White
    },
    img: {
        width: 80,
        height: 80,
        borderRadius: 3,
    },
    bigBtn: {
        marginTop: 50,
        height: 50,
        borderRadius: 5,
        marginHorizontal: 80
    },
    modalHeader1: { flex: 1, backgroundColor: '#FFFFFF' },
    modalBody1: { flex: 3, opacity: 0.9, paddingTop: Metrics.PADDING_BOTTOM, flexDirection: "column", justifyContent: 'flex-end', backgroundColor: Colors.exchangeBg },
    modalFooter1: { marginTop: 1, alignItems: 'center' },
    publishConfirm1: { height: 40, width: Metrics.screenWidth * 0.6, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
    publishConfirmText1: { fontSize: 16, color: Colors.C12, fontWeight: 'bold' },
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
    },
    actionButtonIcon: {
        fontSize: 40,
        height: 40,
        color: Colors.Alipay,
    }
});



