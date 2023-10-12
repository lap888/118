import React, { Component } from 'react';
import { View, Text, ToastAndroid, BackHandler, TouchableWithoutFeedback, NativeModules, DeviceEventEmitter, Image, Platform, PanResponder, Linking, Alert } from 'react-native'
import { Actions } from 'react-native-router-flux';
import Icon from "react-native-vector-icons/AntDesign";
import WebView from 'react-native-webview';
import { UPDATE_USER } from '../../../redux/ActionTypes';
import { connect } from 'react-redux';
// import { Toast } from 'native-base';
import { Loading } from '../../components/Index';
import { AUTH_SECRET, API_PATH, Env, Version } from '../../../config/Index';
import { Colors, Metrics } from '../../theme/Index';
import Cookie from 'cross-cookie';
import CryptoJS from 'crypto-js';
import { Send } from '../../../utils/Http';
import Advert from '../advert/Advert';
import { Toast } from '../../common';
const FeiMa = NativeModules.FeiMaModule;
const { RNMobad } = NativeModules;
var TOUCH_BAR_SIZE = 54;

class HomeH5 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            marginLeft: 5,
            marginTop: Metrics.STATUSBAR_HEIGHT + 40,
            opacity: 0.6,
            touchBarVisible: false
        }
        this.addBackAndroidListener();
    }
    // 监听返回键事件
    addBackAndroidListener() {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }
    onBackAndroid = () => {
        if (Actions.currentScene != "Index") {
            // let time = new Date();
            // this.lastBackPressed = this.thisBackPressed;
            // this.thisBackPressed = time.getTime();
            // if (this.lastBackPressed && this.lastBackPressed + 2000 >= this.thisBackPressed) {
            //     Actions.pop();
            //     return false;
            // }
            // ToastAndroid.show('再按一次返回上一个页面', ToastAndroid.SHORT);
            Actions.pop();
            return true;
        } else {
            let time = new Date();
            this.lastBackPressed = this.thisBackPressed;
            this.thisBackPressed = time.getTime();
            if (this.lastBackPressed && this.lastBackPressed + 2000 >= this.thisBackPressed) {
                BackHandler.exitApp();
                return false;
            }
            ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
            return true;
        }
    };

    UNSAFE_componentWillMount() {
        this.panResponder = PanResponder.create({
            /***************** 要求成为响应者 *****************/
            // 单机手势是否可以成为响应者
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            // 移动手势是否可以成为响应者
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            // 拦截子组件的单击手势传递,是否拦截
            onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
            // 拦截子组件的移动手势传递,是否拦截
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

            /***************** 响应者事件回调处理 *****************/
            // 单击手势监听回调
            onPanResponderGrant: (e, gestureState) => {
                this._onPanResponderGrant(e)
            },
            // 移动手势监听回调
            onPanResponderMove: (e, gestureState) => {
                this._onPanResponderMove(e, gestureState);
            },
            // 手势动作结束回调
            onPanResponderEnd: (evt, gestureState) => {
                this._onPanResponderEnd(evt)
            },
            // 手势释放, 响应者释放回调
            onPanResponderRelease: (e) => {
                // 用户放开了所有的触摸点，且此时视图已经成为了响应者。
                // 一般来说这意味着一个手势操作已经成功完成。
            },
            // 手势申请失败,未成为响应者的回调
            onResponderReject: (e) => {
                // 申请失败,其他组件未释放响应者
                console.log('onResponderReject==>' + '响应者申请失败')
            },

            // 当前手势被强制取消的回调
            onPanResponderTerminate: (e) => {
                // 另一个组件已经成为了新的响应者，所以当前手势将被取消
            },
            onShouldBlockNativeResponder: (evt, gestureState) => {
                // 返回一个布尔值，决定当前组件是否应该阻止原生组件成为JS响应者
                // 默认返回true。目前暂时只支持android。
                return true;
            },
        })
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
                Advert.rewardVideo()
        } else {
            this.emitter = DeviceEventEmitter.addListener('onAdSuccess', (info) => {
                console.log('onAdSuccess:' + info);
            });
            Toast.tip('ios暂时不支持')
        }
        this.hideTouchBar();
    }

    componentWillUnmount() {
        // this.setGameLoginTimeout && clearTimeout(this.setGameLoginTimeout);
        this.setGameLoginTime && clearInterval(this.setGameLoginTime);
        if (Platform.OS == "android") {
            BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
        } 
    }

    doTask = () => {
        Send("api/system/DoTask", {}, 'get').then(res => {
            if (res.code == 200) {
                Send(`api/InitInfo?userId=${this.props.userId}`, {}, 'GET').then(res => {
                    if (res.code == 200) {
                        this.props.updateUserInfo(res.data);
                        Toast.tipBottom('您已完成今日任务...返回查看收益')
                        // Toast.show({
                        //     text: '您已完成今日任务...返回查看收益',
                        //     textStyle: { color: '#FFFFFF', textAlign: 'center' },
                        //     position: "top",
                        //     duration: 25000
                        // });
                        // Actions.pop();
                    } else {
                        Toast.tipBottom(res.message)
                        // Toast.show({
                        //     text: res.message,
                        //     textStyle: { color: '#FFFFFF', textAlign: 'center' },
                        //     position: "bottom",
                        //     duration: 2000
                        // });
                    }
                });
            } else {
                Toast.tipBottom(res.message)
                // Toast.show({
                //     text: res.message,
                //     textStyle: { color: '#FFFFFF', textAlign: 'center' },
                //     position: "top",
                //     duration: 2000
                // });
            }
        });
    }
    
    /*
    * 备注: 拖动小圆点的实现方法 - 使用绝对定位
    * 对小圆点设置绝对布局,
    * 通过触发开始的pageXY与moveXY的差值
    * 来变更top,left的大小,
    * position一定要为 absolute
    * */

    // 单点手势开始
    _onPanResponderGrant(e) {

        //1. 开始触发时,获取触摸点绝对位置
        this.touchX = e.nativeEvent.locationX;
        this.touchY = e.nativeEvent.locationY;
    }

    // 移动手势处理
    _onPanResponderMove(evt, g) {
        //2. 根据触发点计算真实的左侧,顶侧位移变化
        let realMarginLeft = g.moveX - this.touchX;
        let realMarginTop = g.moveY - this.touchY;

        this.setState({
            marginLeft: realMarginLeft,
            marginTop: realMarginTop
        })
    }

    // 手势结束
    _onPanResponderEnd(evt) {
        let pageX = evt.nativeEvent.pageX;

        if (pageX <= TOUCH_BAR_SIZE / 4) {
            pageX = 0;
        }

        if (pageX >= TOUCH_BAR_SIZE * 3 / 4) {
            pageX = TOUCH_BAR_SIZE - 54;
        }

        this.setState({ marginLeft: pageX }, () => {
            if (this.state.marginTop < Metrics.STATUSBAR_HEIGHT) {
                this.setState({
                    marginTop: Metrics.STATUSBAR_HEIGHT + 40
                }, () => {
                    this.hideTouchBar();
                })
            } else {
                this.hideTouchBar();
            }
        });
    }

    /**
     * 展开、收起TouchBar
     */
    expandTouchBar() {
        Actions.pop();
    }

    /**
     * 隐藏TouchBar
     */
    hideTouchBar() {
        var that = this;
        setTimeout(() => {
            that.setState({ marginLeft: 0, opacity: 0.6 });
        }, 3000);
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
                let type = that.props.taskType;
                let isDoTask = that.props.isDoTask;
                if (type == 'doTask' && isDoTask == 0) {
                    that.doTask()
                }
            }, 3000);

        if (this.setGameLoginTime) return;
        let ty = that.props.ty;
        this.setGameLoginTime = setInterval(function () {
            if (ty == 'game') {
                Send(`api/Game/PlayTiming?sdwId=${that.props.sdwId}`, {}, 'get').then(res => {
                    console.log('game==', res);
                });
            }
        }, 60000);
    }

    /**
     * WebView 加载完成
     */
    onLoadEnd() {
        this.setState({ touchBarVisible: true });
    }

    /**
     * 
     * onNavigationStateChange={(event) => {
            Linking.openURL(event.url);
        }}
     */

    render() {
        let { marginLeft, marginTop, opacity, touchBarVisible } = this.state;
        let { id, gUrl, userId, nickname, uuid, avatar } = this.props;
        gUrl = `${gUrl}?uid=${uuid}`;
        return (
            <View style={{ flex: 1, backgroundColor: Colors.C8 }}>
                <WebView
                    ref="webview"
                    source={Platform.OS === 'android' ? { uri: gUrl, baseUrl: "" } : { uri: gUrl }}
                    startInLoadingState
                    renderLoading={() => <Loading mode="center" />}
                    useWebKit={true}
                    onNavigationStateChange={(event) => {
                        if (event.canGoBack && !event.title.indexOf("http")) {
                            Linking.openURL(event.url);
                        }
                    }}
                    onLoad={() => this.onLoad()}
                    onLoadEnd={() => this.onLoadEnd()}
                />
                {touchBarVisible &&
                    <View style={{ position: 'absolute', marginLeft, marginTop, flexDirection: 'row', alignItems: 'center' }}
                        {...this.panResponder.panHandlers}>
                        <TouchableWithoutFeedback onPress={() => this.expandTouchBar()}>
                            <Image source={require('../../images/logo.png')} style={{ opacity, position: 'absolute', height: TOUCH_BAR_SIZE, width: TOUCH_BAR_SIZE, borderRadius: TOUCH_BAR_SIZE * 0.5 }} />
                        </TouchableWithoutFeedback>
                    </View>
                }
            </View>
        )
    }
}

const mapStateToProps = state => ({
    logged: state.user.logged,
    userId: state.user.id,
    nickname: state.user.name,
    uuid: state.user.uuid,
    avatar: state.user.avatarUrl
});

const mapDispatchToProps = dispatch => ({
    updateUserInfo: (userInfo) => dispatch({ type: UPDATE_USER, payload: { userInfo } })
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeH5);