import React, { Component } from 'react';
import { View, Image, Text, StyleSheet, NativeModules, TouchableOpacity, Platform, AppState } from 'react-native';
import { Actions } from 'react-native-router-flux';
import RefreshListView, { RefreshState } from 'react-native-refresh-list-view';
import DeviceInfo from 'react-native-device-info';
import CryptoJS from 'crypto-js';
import { connect } from 'react-redux';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

import { Send } from '../../../../utils/Http';
import { Header, CountDownReact } from '../../../components/Index';
import { AUTH_SECRET } from '../../../../config/Index';
import { Colors, Metrics } from '../../../theme/Index';
import Advert from '../../advert/Advert';
import { Toast } from '../../../common';
import { UPDATE_USER } from '../../../../redux/ActionTypes';
import { TaskApi } from '../../../../api';

const FeiMa = NativeModules.FeiMaModule;
const { RNMobad } = NativeModules;

class DayDoTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            transactionList: [],
            totalPage: 0,
            doTaskUrl: '',
            taskSchedule: props.taskSchedule,
            startTime: props.taskStartTime,
            endTime: props.taskEndTime,
            // startTime: props.taskStartTime.replace(/\//g,'-'),
            // endTime: props.taskEndTime.replace(/\//g,'-'),
            appState: AppState.currentState,
        };
    }

    componentDidMount() {
        this.onHeaderRefresh();
        this.interval = setInterval(() => {
            this.setState({
                progress: this.state.progress++
            })
        }, 60000)
        AppState.addEventListener("change", this._handleAppStateChange);
    }
    componentWillUnmount() {
        AppState.removeEventListener("change", this._handleAppStateChange);
    }

    _handleAppStateChange = nextAppState => {
        if (this.state.appState.match(/inactive|background/)) {
            // clearTimeout(this.timeout);
        }
        this.setState({ appState: nextAppState, isLoading: false });
    };

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    onHeaderRefresh = () => {
        this.setState({ refreshState: RefreshState.HeaderRefreshing, pageIndex: 1 })

        Send('api/System/GetBaseTask', {}, 'get').then(res => {
            if (res.code == 200) {
                this.setState({
                    transactionList: res.data,
                    refreshState: res.data.length < 1 ? RefreshState.EmptyData : RefreshState.Idle,
                    progress: this.state.progress++
                })
            } else {
                this.setState({
                    transactionList: [],
                    totalPage: 0,
                    refreshState: RefreshState.EmptyData
                })
            }
        });
    }
    onPressDayTask = (item) => {
        if (!this.props.logged) {
            Actions.push("Login");
            return;
        }
        // taskType 解释:
        // 0：用户注册及认证-- -> 进入邀请好友界面
        // 1：广告分享----------> 进入首页[最好可以定位到广告位置]
        // 2：出售糖果----------> 进入交易界面
        // 3：发布买单----------> 进入交易界面
        // 4：玩游戏------------> 进入游戏界面
        // 5：哟帮--------------> 进入YO帮界面
        if (item.taskType == 0) {
            Actions.jump("Invitation");
        } else if (item.taskType == 1) {
            Actions.jump("Home");
        } else if (item.taskType == 2 || item.taskType == 3) {
            Actions.jump("Otc");
        } else if (item.taskType == 4) {
            Actions.jump("Game");
        } else if (item.taskType == 5) {
            Actions.jump("Block");
        } else if (item.taskType == 7) {
            if (Platform.OS == "ios") {
                Toast.tipBottom('苹果用户暂不支持')
            } else {
                callback = (res) => {
                    if (res) {
                        this.doDayTask()
                    } else {
                        this.feiMaAD()
                    }
                }
                Advert.rewardVideo(callback)
            }
        }
    }

    /**
     * 开始 领取任务
     */
    startTask = () => {
        const callback = () => {
            TaskApi.startTask()
                .then((res) => {
                    if (res.code === 200) {
                        if (res.data.taskSchedule === 10000) {
                            Send(`api/InitInfo?userId=${this.props.userId}`, {}, 'GET').then(res => {
                                if (res.code == 200) {
                                    this.props.updateUserInfo(res.data);
                                    Toast.tipBottom('您已完成今日任务...返回查看收益')
                                } else {
                                    Toast.tipBottom(res.message)
                                }
                            })
                            return;
                        }
                        this.setState({
                            startTime: res.data.startTime,
                            endTime: res.data.endTime,
                            // startTime: res.data.startTime.replace(/\//g,'-'),
                            // endTime: res.data.endTime.replace(/\//g,'-'),
                            taskSchedule: res.data.quickenMinutes,
                        })
                        return;
                    }
                    Toast.tipBottom(res.message)
                }).catch((err) => console.log('err', err))
        }
        if (Platform.OS === "ios") {
            Toast.tip('请稍等...');
            setTimeout(() => {
                callback();
            }, 10000)
        } else {
            Advert.rewardVideo((res) => {
                if (res) {
                    callback();
                } else {
                    Toast.tip(res);
                }
            })
        }
    }

    quickenTask = () => {
        const callback = () => {
            TaskApi.quickenTask()
                .then((res) => {
                    if (res.code == 10009) {
                        Toast.tip(res.message)
                        const endtime = this.getEndTime(new Date());
                        this.props.updateUserInfo({ taskEndTime: endtime });
                        this.setState({
                            endTime: endtime,
                            taskSchedule: 10000,
                        })
                        return;
                    }
                    if (res.code === 200) {
                        this.props.updateUserInfo({ taskStartTime: res.data.startTime, taskSchedule: res.data.quickenMinutes, taskEndTime: res.data.endTime });
                        this.setState({
                            startTime: res.data.startTime,
                            endTime: res.data.endTime,
                            taskSchedule: res.data.quickenMinutes,
                        })
                        return;
                    }
                    Toast.tip(res.message)
                })
        }
        if (Platform.OS === "android") {
            Advert.rewardVideo((res) => {
                if (res) {
                    callback();
                } else {
                    Toast.tip(res)
                }
            })
        } else {
            Toast.tip('ios暂时不支持')
        }
    }

    doDayTask = () => {
        let _imei = '999';
        const getDeviceId = DeviceInfo.getUniqueId();
        if (getDeviceId && getDeviceId != null) {
            _imei = getDeviceId;
        } if (getDeviceId == null) {
            _imei = '888'
        }
        Send('api/Game/WatchVedio', { postId: "3415", imei: _imei }).then(res => {
            if (res.code == 200) {
                Toast.tipBottom('完成任务')
                this.onHeaderRefresh()
            } else {
                Toast.tipBottom(res.message)
            }
        }).catch((err) => console.log(err));
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

    getEndTime = (timestamp) => {
        var date = new Date(timestamp);
        // var Y = date.getFullYear() + '-';
        // var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var Y = date.getFullYear() + '/';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
        var D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
        var h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
        var m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
        var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
        return Y + M + D + h + m + s;
    }
    /**
     * 做任务按钮
     */
    taskBtn = () => {
        const { startTime, endTime, taskSchedule } = this.state;
        // console.warn('endTime: ', endTime);
        // console.warn('startTime: ', startTime);
        // let start = new Date(startTime.replace('-', '/')).getTime();
        // let end = new Date(endTime.replace('-', '/')).getTime();
        let strStart = startTime.replace(/\-/g, "/");
        console.log('strStart: ', strStart);
        let strEnd = endTime.replace(/\-/g, "/");
        console.log('strEnd: ', strEnd);
        let time1 = strStart.replace(/\//g, ':').replace(' ', ':');
        let time2 = time1.split(':');
        var start = Date.parse(new Date(time2[0], (time2[1] - 1), time2[2], time2[3], time2[4], time2[5]));
        let time3 = strEnd.replace(/\//g, ':').replace(' ', ':');
        let time4 = time3.split(':');
        var end = Date.parse(new Date(time4[0], (time4[1] - 1), time4[2], time4[3], time4[4], time4[5]));
        console.log('start1: ', start);
        console.log('end1: ', end);
        console.log('end: ', end);
        let now = (new Date()).getTime();
        // (now - start)：自然走的时间（毫秒）；(taskSchedule * 60000)： 加速的时间（毫秒）除 总时间
        let jishi = start + (end - start) - taskSchedule * 60000;
        let jindu = (now - start + taskSchedule * 60000) / (end - start) * 100;
        if (startTime == '') {
            return (
                <AnimatedCircularProgress
                    size={110}
                    width={8}
                    fill={0}
                    tintColor="#1E90EA"
                    backgroundColor="#F4F4F4">
                    {() => <Text>开始任务</Text>}
                </AnimatedCircularProgress>
            )
        } else if ((new Date).getTime() > jishi) {
            return (
                <AnimatedCircularProgress
                    size={110}
                    width={8}
                    fill={100}
                    tintColor="#1E90EA"
                    backgroundColor="#F4F4F4">
                    {() => <Text>{this.props.isDoTask == 0 ? '领取糖果' : '今日已完成'}</Text>}
                </AnimatedCircularProgress>
            )
        } else {
            return (
                <AnimatedCircularProgress
                    size={110}
                    width={8}
                    fill={Number(jindu).toFixed(0)}
                    tintColor="#1E90EA"
                    backgroundColor="#F4F4F4">
                    {() => <View style={{}}>
                        <CountDownReact
                            date={jishi}
                            hours=':'
                            mins=':'
                            hoursStyle={Styles.time}
                            minsStyle={Styles.time}
                            secsStyle={Styles.time}
                            firstColonStyle={Styles.colon}
                            secondColonStyle={Styles.colon}
                        />
                    </View>}
                </AnimatedCircularProgress>
            )
        }

    }

    listHeaderComponent = () => {
        return (
            <View>
                <View style={{ alignItems: 'center', marginVertical: 10 }}>
                    <Image style={{ height: 35 }} resizeMode={'contain'} source={require('../../../images/dayTask/mainbiaoti.png')} />
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity style={{ margin: 10, flex: 4 }} >
                        <Image style={{ width: (Metrics.screenWidth - 40) * 4 / 7, height: (Metrics.screenWidth - 40) * 4 / 7 / 1.59, borderRadius: 10 }} source={require('../../../images/dayTask/renwu.jpg')} />
                    </TouchableOpacity>
                    <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center', paddingLeft: 30, paddingRight: 40 }}>
                        <TouchableOpacity activeOpacity={0.8} onPress={this.startTask} >
                            {this.taskBtn()}
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ position: 'absolute', width: 50, height: 50, right: 10, bottom: 5, justifyContent: 'flex-end' }}
                            onPress={this.quickenTask}
                        >
                            <Image style={{ width: 60, height: 60, marginBottom: -15 }} source={require('../../../images/dayTask/jiasu.gif')} />
                            <Text style={{ fontSize: 10, color: '#EC9F09' }}>  点我加速</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ alignItems: 'center', marginVertical: 10 }}>
                    <Image style={{ height: 35 }} resizeMode={'contain'} source={require('../../../images/dayTask/zhixian.png')} />
                </View>
            </View>
        )
    }


    renderItem = ({ item, index }) => {
        if (item.taskType == 99) {
            return;
        }
        let source = require('../../../images/doDayTaskIcon.png');
        switch (item.taskType) {
            case 1:
                source = require('../../../images/dayTask/fenxiang.png');
                break;
            case 4:
                source = require('../../../images/dayTask/tuijian.png');
                break;
            case 5:
                source = require('../../../images/dayTask/daren.png');
                break;
            case 7:
                source = require('../../../images/dayTask/shipin.png');
                break;
            case 3:
                source = require('../../../images/dayTask/shougoutanpan.png');
                break;
            default:
                break;
        }
        return (
            <TouchableOpacity style={Styles.miningItem} onPress={() => { this.onPressDayTask(item) }}>
                <View style={Styles.miningItemHeader}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <Image style={{ width: 40, height: 40 }} resizeMode={'contain'} source={source} />
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <Text style={Styles.miningItemActivity}>{item.taskTitle}</Text>
                            <Text style={{ fontSize: 13, color: Colors.C6, marginLeft: 5 }}>{`完成任务奖励:${item.reward}果皮`}</Text>
                            <Text numberOfLines={3} style={Styles.miningItemName}>{`${item.taskDesc}`}</Text>
                        </View>
                    </View>
                    <View style={{ marginLeft: 10, height: 20, borderWidth: 1, borderColor: Colors.C6, borderRadius: 10, paddingHorizontal: 10, alignItems: 'center' }}>
                        <Text>{item.carry}/{item.aims}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    keyExtractor = (item, index) => {
        return index.toString()
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.White }}>
                <Header title="任务大厅" />
                <RefreshListView
                    data={this.state.transactionList}
                    keyExtractor={(item, index) => index.toString()}
                    ListHeaderComponent={this.listHeaderComponent}
                    renderItem={this.renderItem}
                    refreshState={this.state.refreshState}
                    onHeaderRefresh={this.onHeaderRefresh}
                />
            </View>
        );
    }
}

const mapStateToProps = state => ({
    uuid: state.user.uuid,
    userId: state.user.id,
    isDoTask: state.user.isDoTask,
    logged: state.user.logged,
    taskSchedule: state.user.taskSchedule,
    taskEndTime: state.user.taskEndTime,

    taskStartTime: state.user.taskStartTime,

});

const mapDispatchToProps = dispatch => ({
    updateUserInfo: (userInfo) => dispatch({ type: UPDATE_USER, payload: { userInfo } })
});
export default connect(mapStateToProps, mapDispatchToProps)(DayDoTask);

const Styles = StyleSheet.create({
    transactionContainer: { left: 15, marginBottom: 10 },
    transaction: { height: 200, margin: 1, flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 6, backgroundColor: '#FFFFFF' },
    avatar: { height: 50, width: 50, borderRadius: 25 },
    name: { fontWeight: 'bold', fontSize: 16 },
    body: { flex: 2, marginLeft: 14 },
    saleInfo: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    price: { fontSize: 14, color: Colors.C6 },
    number: { fontSize: 14, color: Colors.C6 },
    transactionNumber: { fontSize: 14, color: "rgb(170,202,193)" },
    sale: { alignSelf: 'center', justifyContent: 'center', alignItems: 'center', padding: 5, paddingLeft: 10, paddingRight: 10, borderRadius: 5, backgroundColor: Colors.C6 },
    saleText: { fontSize: 15, color: '#FFFFFF' },
    miningItem: { flex: 1, marginHorizontal: 20, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.C7 },
    miningItemHeader: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    miningItemName: { fontSize: 13, marginLeft: 5 },
    miningItemActivity: { fontSize: 16, marginLeft: 5 },
    miningItembody: { marginTop: 10, flexDirection: 'row' },
    miningItemGemin: { fontSize: 14, color: Colors.C16, marginLeft: 5 },
    miningItemGemout: { fontSize: 14, color: Colors.C16, marginLeft: 5 },
    miningItemTime: { marginTop: 6, fontSize: 14, color: '#ffffff', width: 320 },
    miningItemFooter: { alignSelf: 'flex-end', justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderWidth: 1, borderColor: '#ffffff', padding: 18, paddingTop: 10, paddingBottom: 10 },
    miningItemExchange: { fontSize: 18, color: '#ffffff' },
    //时间文字
    time: {
        // paddingHorizontal: 2,
        fontSize: 14,
        color: '#000',
        // marginHorizontal: 2,
        // borderRadius: 2,
    },
    //冒号
    colon: {
        fontSize: 12, color: '#000'
    },
});
