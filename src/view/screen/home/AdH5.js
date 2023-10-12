import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Animated, TouchableOpacity, NativeModules, DeviceEventEmitter, BackHandler, Image } from 'react-native';
import * as WeChat from 'react-native-wechat-lib';
import WebView from 'react-native-webview';
// import { Toast } from 'native-base';
import { Header, Loading } from '../../components/Index';
import { Colors, Metrics } from '../../theme/Index';
import TDH5 from '../digg/TDH5';
import { Send } from '../../../utils/Http';
import { connect } from 'react-redux'
import { AUTH_SECRET, API_PATH, Env, Version } from '../../../config/Index';
import Cookie from 'cross-cookie';
import CryptoJS from 'crypto-js';
import { Toast } from '../../common';

const FeiMa = NativeModules.FeiMaModule;
const { RNMobad } = NativeModules;
const OPTIONS = [
    { key: 0, name: "分享到微信", size: 42, imageUrl: require("../../images/icon64_appwx_logo.png") },
    { key: 1, name: "朋友圈", size: 56, imageUrl: require("../../images/icon_res_download_moments.png") },
];
const BaseScript =
    `
    (function () {
        var height = null;
        function changeHeight() {
          if (document.body.scrollHeight != height) {
            height = document.body.scrollHeight;
            if (window.postMessage) {
              window.postMessage(JSON.stringify({
                type: 'setHeight',
                height: height,
              }))
            }
          }
        }
        setTimeout(changeHeight, 100);
    } ())
    `
let WEB_VIEW_REF = 'webview';
class AdH5 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            info: null,
            title: '',
            type: 0,
            height: 0,
            isLoad: true,
            bottom: new Animated.Value(-156),
            opacity: new Animated.Value(0),
        };
        this.addBackAndroidListener(this.props.navigator);
    }
    Sign = (api, token, timeSpan) => {
        let params = [];
        params.push(api.toUpperCase());
        params.push(token.toUpperCase());
        params.push(timeSpan);
        params.push(AUTH_SECRET.toUpperCase());//服务端分发对应key
        params.sort();
        let utf8Params = CryptoJS.enc.Utf8.parse(params.join(''));
        let sign = CryptoJS.MD5(utf8Params).toString(CryptoJS.enc.Hex).substring(5, 29);
        return sign;
    }
    componentDidMount() {
        if (Platform.OS == "android") {
            if (this.props.ty != 4 && this.props.ty != 3) {
            }
        } else {
            if (this.props.ty != 4 && this.props.ty != 3) {
                this.emitter = DeviceEventEmitter.addListener('onAdSuccess', (info) => {
                    console.log('onAdSuccess:' + info);
                });
                // RNMobad.showAd();
                Toast.tip('ios暂时不支持')
            }
        }
    }
    UNSAFE_componentWillMount() {
        this.reloadTopicData();
    }
    componentWillUnmount() {
        if (Platform.OS == "android") {
            BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }

    /**
    * 加载之前注入javascript命令
    */
    injectedJavaScript() {
        let script = `
    (function () {
        if (window.postMessage) {
            window.postMessage(JSON.stringify({
                type: 'orientation',
                data: window.orientation,
            }))
        }
    })
    `;
        return script;
    }

    /**
     * 加载完成之后注入javascript命令
     */
    injectJavaScript() {
        let script = `
    (function () {
        if (window.postMessage) {
            window.postMessage(JSON.stringify({
                type: 'orientation',
                data: window.orientation,
            }))
        }
    })
    `;
        if (this.refs.webview) this.refs.webview.injectJavaScript(script);
    }

    /**
     * WebView 加载成功
     */
    onLoad() {
        var that = this;
        if (this.setGameLoginTimeout) return;
        this.setGameLoginTimeout =
            setTimeout(function () {
                if (that.props.type == "Ad") {
                    Send(`api/LookAdGetCandyP?id=${that.props.bannerId}`, {}, 'get').then(res => {
                        if (res.code == 20001) {
                            Toast.tipBottom(res.message)
                            // Toast.show({
                            //     text: res.message,
                            //     textStyle: { color: '#FFFFFF', textAlign: 'center' },
                            //     position: "top",
                            //     duration: 10000
                            // });
                        }
                    });
                }
            }, 1000);
    }

    reloadTopicData() {
        let that = this;
        that.setState({
            title: this.props.title,
            type: this.props.ty,
            thumbImage: this.props.thumbImage,
            bannerId: this.props.bannerId,
            isLoad: false
        })
    }
    /**
     * 渲染分享Board
     */
    renderShareBoard() {
        return (
            <Animated.View style={[styles.shareContainer, { bottom: this.state.bottom, opacity: this.state.opacity }]}>
                <View style={styles.shareBody}>
                    {OPTIONS.map(item => {
                        let { key, name, size, imageUrl } = item;
                        return (
                            <TouchableOpacity key={key} onPress={() => this.wechatShare(key)}>
                                <View style={styles.shareItem}>
                                    <View style={styles.shareImage}>
                                        <Image source={imageUrl} style={{ width: size, height: size, borderRadius: size / 2 }} />
                                    </View>
                                    <Text style={styles.shareText}>{name}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </View>
                <TouchableOpacity style={{ position: 'absolute', bottom: 0, alignSelf: 'center' }} onPress={() => this.closeShareBoard()}>
                    <View style={styles.shareFooter}>
                        <Text style={styles.shareFooterText}>取消</Text>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        )
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
                toValue: 1,
                duration: 400,
                useNativeDriver: false
            }),
        ], { useNativeDriver: false }).start();
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
        ], { useNativeDriver: false }).start();
    }
    /**
      * 微信分享
      * @param {*} key 
      */
    wechatShare(key) {
        if (this.state.type == 4) {
            Toast.tipBottom('该内容不支持分享')
            // Toast.show({
            //     text: '该内容不支持分享',
            //     textStyle: { color: '#FFFFFF', textAlign: 'center' },
            //     position: "top",
            //     duration: 10000
            // });
            return;
        }
        let pageUrl = `https://ad.yoyoba.cn/share/${this.state.bannerId}/${this.props.mobile}.html`;
        // let message = {
        //     type: 'news',
        //     title: this.state.title,
        //     description: `${this.props.name}邀请您加入118创富助手!每天做任务领糖果,糖果当钱花!2021 118创富助手强势来袭 你准备好了吗?`,
        //     thumbImage: this.state.thumbImage,
        //     webpageUrl: pageUrl,
        // }
        // if (key === 0) {
        //     WeChat.shareToSession(message, (response) => {
        //         console.log(response);
        //     });
        // } else {
        //     WeChat.shareToTimeline(message, (response) => {
        //         console.log(response);
        //     });
        // }
        let message = {
            type: 'news',
            title: this.state.title,
            description: `${this.props.name}邀请您加入118创富助手!每天做任务领糖果,糖果当钱花!2021 118创富助手强势来袭 你准备好了吗?`,
            thumbImageUrl: this.state.thumbImage,
            webpageUrl: pageUrl,
            scene: key
        }
        // let message = {
        //     type: 'news',
        //     title: this.state.title,
        //     description: `${this.props.name}邀请您加入118创富助手!每天做任务领糖果,糖果当钱花!2021 118创富助手强势来袭 你准备好了吗?`,
        //     thumbImage: this.state.thumbImage,
        //     webpageUrl: pageUrl,
        // }
        // if (key === 0) {
        //     WeChat.shareToSession(message, (response) => {
        //         console.log(response);
        //     });
        // } else {
        //     WeChat.shareToTimeline(message, (response) => {
        //         console.log(response);
        //     });
        // }
        WeChat.shareWebpage(message)
    }
    // 监听返回键事件
    addBackAndroidListener(navigator) {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }
    onBackAndroid = () => {
        if (this.state.backButtonEnabled) {
            this.refs[WEB_VIEW_REF].goBack();
            return true;
        } else {
            return false;
        }
    };
    onLeftPress() {
        this.refs[WEB_VIEW_REF].goBack();
    }
    onNavigationStateChange = (navState) => {
        // console.log('navState.canGoBack', navState.canGoBack)
        this.setState({
            backButtonEnabled: navState.canGoBack,
        });
    };
    dispalyLoading() {
        if (this.state.isLoad) {
            return (
                <Loading />
            )
        } else {
            return (
                <View>
                    {/* <Header title={this.state.title} rightIcon="share-alt" rightIconSize={20} onRightPress={() => this.onRightPress()} /> */}
                    <Header title={this.state.title} />
                    <View style={{ alignItems: "center", height: Metrics.screenHeight * 0.9 }}>
                        <WebView
                            injectedJavaScript={BaseScript}
                            useWebKit={true}
                            startInLoadingState
                            geolocationEnabled={true}
                            ref={WEB_VIEW_REF}
                            onNavigationStateChange={this.onNavigationStateChange}
                            style={{ width: Metrics.screenWidth, height: this.state.height }}
                            automaticallyAdjustContentInsets={true}
                            source={Platform.OS === 'android' ? { uri: this.props.url, baseUrl: "" } : { uri: this.props.url }}
                            decelerationRate='normal'
                            renderLoading={() => <Loading mode="center" />}
                            scalesPageToFit={true}
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                            onLoad={() => this.onLoad()}
                        />

                    </View>
                </View>
            )
        }
    }
    render() {
        return (
            <View style={styles.container}>
                {this.dispalyLoading()}
                {this.renderShareBoard()}
            </View>
        );
    }
}
const mapStateToProps = state => ({
    userId: state.user.id,
    mobile: state.user.mobile,
    name: state.user.name
});
const mapDispatchToProps = dispatch => ({

})
export default connect(mapStateToProps, mapDispatchToProps)(AdH5)
// 样式
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    shareContainer: { position: 'absolute', backgroundColor: Colors.C16, height: 156, left: 0, right: 0, borderTopLeftRadius: 10, borderTopRightRadius: 10 },
    shareHeader: { alignSelf: 'center', padding: 20, fontSize: 16, fontWeight: "400" },
    shareBody: { flexDirection: 'row', paddingTop: 20 },
    shareItem: { justifyContent: 'center', alignItems: 'center', paddingLeft: 20 },
    shareImage: { justifyContent: 'center', alignItems: 'center', width: 50, height: 50 },
    shareText: { marginTop: 6, color: Colors.White },
    shareFooter: { alignSelf: 'center', padding: 20 },
    shareFooterText: { fontSize: 16, fontWeight: "400", color: Colors.White },
})