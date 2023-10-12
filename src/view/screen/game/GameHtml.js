import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Animated, SafeAreaView, BackHandler, TouchableOpacity, Image } from 'react-native';
import * as WeChat from 'react-native-wechat-lib';
// import { Toast } from 'native-base';
import WebView from 'react-native-webview';
import { Header, Loading } from '../../components/Index';
import { Colors, Metrics } from '../../theme/Index';
import TDReward from '../digg/TDReward';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux'
import { Send } from '../../../utils/Http';
import { Toast } from '../../common';

const OPTIONS = [
    { key: 0, name: "微信好友", size: 42, imageUrl: require("../../images/icon64_appwx_logo.png") },
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
    `;
let WEB_VIEW_REF = 'webview';
const URL = `https://d.yoyoba.cn/api/Game/GenAuthSdwUrl2`;
class GameHtml extends Component {
    constructor(props) {
        super(props);
        this.state = {
            height: 0,
            info: null,
            title: '',
            type: 0,
            isLoad: true,
            bottom: new Animated.Value(-156),
            opacity: new Animated.Value(0),
            url: `${URL}?id=${props.userId}`
        };
        this.addBackAndroidListener(this.props.navigator);
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
    UNSAFE_componentWillMount() {
        this.reloadTopicData();
    }

    componentWillUnmount() {
        if (Platform.OS == "android") {
            BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }
    reloadTopicData() {
        let that = this;
        that.setState({
            title: '天天福利',
            type: 5,
            thumbImage: 'https://file.yoyoba.cn//Game/pddmiandan.png',
            bannerId: 4,
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
      * 微信分享
      * @param {*} key 
      */
    wechatShare(key) {
        if (this.state.type == 5) {
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
    onLeftPress() {
        // this.refs[WEB_VIEW_REF].goBack();
        Actions.pop('Game')
    }
    H5Start = (refUrl) => {
        if (this.props.logged) {
            Actions.H5({ gUrl: refUrl })
        } else {
            Toast.tipBottom('请您先登录');
            setTimeout(() => Actions.Login(), 1000);
        }
    }
    onNavigationStateChange = (navState) => {
        if (navState.url.includes('http://www.shandw.com/mi/game/') && !navState.loading) {
            this.H5Start(navState.url)
        }
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
                <SafeAreaView>
                    {/* <Header onLeftPress={() => this.onLeftPress()} title={this.state.title} /> */}
                    <View style={{ alignItems: "center", height: Metrics.screenHeight }}>
                        <WebView
                            injectedJavaScript={BaseScript}
                            renderLoading={() => <Loading mode="center" />}
                            useWebKit={true}
                            ref={WEB_VIEW_REF}
                            onNavigationStateChange={this.onNavigationStateChange}
                            style={{ width: Metrics.screenWidth, height: this.state.height }}
                            source={Platform.OS === 'android' ? { uri: this.state.url, baseUrl: "", headers: { token: this.state.token } } : { uri: this.state.url, headers: { token: this.state.token } }}
                        />
                    </View>
                </SafeAreaView>
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
    name: state.user.name,
    logged: state.user.logged
});
const mapDispatchToProps = dispatch => ({

})
export default connect(mapStateToProps, mapDispatchToProps)(GameHtml)
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