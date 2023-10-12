import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Animated, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { connect } from 'react-redux';
import QRCode from 'react-native-qrcode-svg';
import * as WeChat from 'react-native-wechat-lib';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { captureRef } from 'react-native-view-shot';
import { Header } from '../../components/Index';
import { Colors, Metrics } from '../../theme/Index';
import { WEB_PATH } from '../../../config/Index';
const OPTIONS = [
    { key: 0, name: "微信好友", size: 42, imageUrl: require("../../images/icon64_appwx_logo.png") },
    { key: 1, name: "朋友圈", size: 56, imageUrl: require("../../images/icon_res_download_moments.png") },
];
class Invitation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            qrcodeUrl: `${WEB_PATH}down?code=${this.props.code == "0" ? this.props.mobile : this.props.code}`,
            bottom: new Animated.Value(-156),
            opacity: new Animated.Value(0),
        }
    }
    /**
     * HeaderRight点击事件
     */
    onRightPress() {
        Animated.parallel([
            Animated.timing(this.state.bottom, {
                toValue: 0,
                duration: 400,
                useNativeDriver: false
            }),
            Animated.timing(this.state.opacity, {
                toValue: 0.81,
                duration: 400,
                useNativeDriver: false
            }),
        ]).start();
    }
    /**
     * 关闭分享Board
     */
    closeShareBoard() {
        Animated.parallel([
            Animated.timing(this.state.bottom, {
                toValue: -156,
                duration: 400,
                useNativeDriver: false
            }),
            Animated.timing(this.state.opacity, {
                toValue: 0,
                duration: 400,
                useNativeDriver: false
            }),
        ]).start();
    }
    /**
     * 获取标签截图
     */
    captureRef(key) {
        if (!this.refs.shareViewShot) return;
        captureRef(
            this.refs.shareViewShot, {
            format: 'jpg',
            quality: 0.5,
            result: "tmpfile"
        }).then(response => {
            let imagePath = response;
            if (Platform.OS === 'android') {
                imagePath = response.replace("file://", "");
            } else {
                imagePath = "file://" + response;
            }
            this.wechatShare(key, imagePath);
        }).catch(e => {
            console.log(e);
        });
    }
    /**
     * 微信分享
     * @param {*} key 
     * @param {*} imagePath 
   */
    wechatShare(key, imagePath) {
        WeChat.shareLocalImage({ imageUrl: imagePath, scene: key })
            .then((data) => {
                console.log('data', data);
            }).catch((err) => console.log('err', err))
    }

    /**
     * 渲染分享Board
     */
    renderShareBoard() {
        return (
            <Animated.View style={[Styles.shareContainer, { bottom: this.state.bottom, opacity: this.state.opacity }]}>
                <Text style={Styles.shareHeader}>分享</Text>
                <View style={Styles.shareBody}>
                    {OPTIONS.map(item => {
                        let { key, name, size, imageUrl } = item;
                        return (
                            <TouchableOpacity key={key} onPress={() => this.captureRef(key)}>
                                <View style={Styles.shareItem}>
                                    <View style={Styles.shareImage}>
                                        <Image source={imageUrl} style={{ width: size, height: size, borderRadius: size / 2 }} />
                                    </View>
                                    <Text style={Styles.shareText}>{name}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </View>
                <TouchableOpacity style={{ position: 'absolute', bottom: 0, alignSelf: 'center' }} onPress={() => this.closeShareBoard()}>
                    <View style={Styles.shareFooter}>
                        <Text style={Styles.shareFooterText}>取消</Text>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        )
    } 

    /**
     * 渲染二维码
     */
    renderQRCode() {
        let invitCode = this.props.rcode == "0" ? this.props.mobile : this.props.rcode;
        let qrcodeUrl = `${WEB_PATH}?code=${invitCode}`;
        return (
            <View ref="shareViewShot" style={{ backgroundColor: 'transparent' }}>
                <Image
                    source={require('../../images/inviter4.png')}
                    style={{ width: Metrics.screenWidth, height: Metrics.screenHeight, backgroundColor: '#4cc7ab' }}
                />
                <View style={{ position: 'absolute', bottom: 90 + (isIphoneX() ? 15 : 0), backgroundColor: 'transparent', justifyContent: 'flex-end' }}>
                    <View style={{ paddingLeft: 10, paddingRight: 5 }}>
                        <View style={{ position: 'absolute', right: 5, bottom: 85, borderWidth: 2, borderColor: Colors.main, borderRadius: 2 }}>
                            <QRCode
                                value={qrcodeUrl}
                                logoSize={30}
                                size={130}
                            />
                        </View>
                        <Image style={Styles.userPhoto} source={require('../../images/logo.png')} />
                        <Text style={Styles.layoutFont}>
                            我是【{this.props.name}】
                        </Text >
                        {/* <Text style={Styles.layoutFont}>
                            我为“好玩社区怀旧版”代言
                        </Text> */}
                        <Text style={[Styles.layoutFont, { fontSize: 18, fontWeight: "bold", color: '#cc3300' }]}>
                            扫描二维码免费下载【好玩社区】怀旧版
                        </Text>
                        <Text style={Styles.layoutFont}>
                            一花一草一世界 · 一生一世好玩吧
                        </Text>
                        {/* <Text style={[Styles.layoutFont, { marginTop: 10, color: '#cccccc' }]}>
                            好玩吧社区怀旧版经典再现
                        </Text> */}

                    </View>
                </View>
            </View>
        )
    }

    render() {
        return (
            <View style={Styles.container}>
                {/* <Header title="邀请好友" rightIcon="share-alt" rightIconSize={20} onRightPress={() => this.onRightPress()} /> */}
                <Header title="邀请好友" />
                {this.renderQRCode()}
                {this.renderShareBoard()}
            </View>
        );
    }
}
const mapStateToProps = state => ({
    logged: state.user.logged,
    mobile: state.user.mobile,
    name: state.user.name,
    avatarUrl: state.user.avatarUrl,
    rcode: state.user.rcode
});
const mapDispatchToProps = dispatch => ({

});
export default connect(mapStateToProps, mapDispatchToProps)(Invitation);

const Styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.C6 },
    layout: { flexDirection: "row", paddingLeft: 10 },
    userPhoto: { width: 80, height: 80, borderRadius: 40, marginRight: 10 },
    layoutFont: { marginTop: 6, color: '#ffffff', fontSize: 17 },
    shareContainer: { position: 'absolute', backgroundColor: '#FFFFFF', height: 156, left: 0, right: 0, borderTopLeftRadius: 10, borderTopRightRadius: 10 },
    shareHeader: { alignSelf: 'center', padding: 20, fontSize: 16, fontWeight: "400" },
    shareBody: { flexDirection: 'row', paddingTop: 20 },
    shareItem: { justifyContent: 'center', alignItems: 'center', paddingLeft: 20 },
    shareImage: { justifyContent: 'center', alignItems: 'center', width: 50, height: 50 },
    shareText: { marginTop: 6 },
    shareFooter: { alignSelf: 'center', padding: 20 },
    shareFooterText: { fontSize: 16, fontWeight: "400" },
});
