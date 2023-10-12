import React, { Component } from 'react';
import { View, Image, Platform, Text, StyleSheet, InteractionManager, Linking, TouchableOpacity } from 'react-native';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { UPDATE_NOTICE_INFO, UPDATE_USER, UPDATE_NOTICE_STATUS, UPDATE_USER_LOCATION } from '../../../redux/ActionTypes';
import Swiper from 'react-native-swiper';
import { GameList } from '../../components/Index';
import { Colors, Metrics } from '../../theme/Index';
import { HOME_OPTIONS } from '../../../config/Constants';
import Icon from "react-native-vector-icons/Ionicons";
import { Send } from '../../../utils/Http';
import { Toast } from '../../common';
import { upgrade } from 'rn-app-upgrade';
import { Actions } from 'react-native-router-flux';
import Cookie from 'cross-cookie';
import { connect } from 'react-redux';
import { onPressSwiper } from '../../../utils/CommonFunction';
import { TaskApi } from '../../../api';
import { Header, CountDownReact } from '../../components/Index';
import Advert from '../advert/Advert';
import { BannerAd } from 'react-native-mobad';
class ClientGameList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gameList: [],
            currentPage: 1,
            msgData: [],
            totalPage: 1,
            firstLoading: true,
            loadingMore: false,
            recommendation: {},
            taskSchedule: props.taskSchedule,
            startTime: props.taskStartTime,
            endTime: props.taskEndTime,
            bannerList: []
        }

    }
    componentDidMount() {
        if (this.props.type === 0) {
            this.fetchBanner(1);
            this.reloadMessage()
        }
        InteractionManager.runAfterInteractions(() => {
            this.fetchFirstGame(this.props.type);
            this.fetchList(this.state.currentPage);
        });
    }
    /**
     * Options跳转事件
     * @param {*} route 
     */
    onOptionPress(route) {
        if (!this.props.logged) {
            Actions.push("Login");
            return;
        }
        if (route == 'NULL') {
            Toast.tip('暂未开放');
            return;
        }

        if (route == 'xBook') {
            Advert.openNovel()
        }
        else if (route == 'YouKa') {
            this.state.YokaAndChongzhiList.map((v) => {
                if (v.id == 1) {
                    onPressSwiper(v, this.props.mobile, this.props.userId);
                }
            });
        } else if (route == 'Home2Screen' || route == 'Block' || route == 'Game') {
            if (this.props.auditState !== 2) {
                Toast.tip('暂未开放');
                return;
            } else {
                Actions.push(route);
            }
        }
        else if (route == 'QuanMinTask') {
            Advert.jumpAdList(this.props.userId)
        }
        else if (route == 'CityShow') {
            Actions.push(route);
        }
        else if (route == 'PinDuoduoShop') {
            this.state.YokaAndChongzhiList.map((item) => {
                if (item.id == 4) {
                    let params = JSON.parse(item.params);
                    let url = params.url;
                    //处理url
                    let p1 = '{YoyoUserMobilePhone}';
                    let p2 = '{YoyoUserID}';
                    if (url.indexOf(p1) > 0) {
                        url = url.replace(p1, this.props.mobile)
                    }
                    if (url.indexOf(p2) > 0) {
                        url = url.replace(p2, this.props.userId)
                    }
                    Cookie.get('token')
                        .then(value => {
                            let token = value == null || value == '' ? '' : value;
                            Actions.AdReward({ url: url, ty: 5, title: item.title, thumbImage: item.imageUrl, bannerId: item.id, token: token });
                        });
                }
            });
        } else {
            Actions.push(route);
        }
    }
    /**
     * 加载系统消息
     */
    reloadMessage() {
        let that = this;
        let params = {
            pageIndex: 1,
            type: 0,
        };
        Send("api/system/notices", params).then(res => {
            if (res.code == 200) {
                that.setState({
                    msgData: res.data,
                })
            } else {
                that.setState({
                    msgData: [],
                })
            }
        });
    }
    /**
     * 获取游戏Banner列表
     * @param {*} source 
     */
    fetchBanner(source) {
        var that = this;
        Send("api/system/banners?source=" + source, {}, 'GET').then(res => {
            if (res.code == 200) {
                that.setState({ bannerList: res.data });
            } else {
                Toast.tipBottom(res.message)
            }
        })
    }
    /**
     * 首发游戏获取
     */
    fetchFirstGame(type) {
        var that = this;
        Send(`api/Game/FristGame?type=${type}&platform=${Platform.OS}`, {}, 'get').then(res => {
            if (res.code == 200) {
                that.setState({ recommendation: res.data });
            }
        });
    }
    /**
     * 获取游戏列表信息
     * @param {*} page 
     */
    fetchList(page) {
        this.setState({ currentPage: page });
        var that = this;
        Send("api/Game/GameList", { type: this.props.type, pageIndex: page, platform: Platform.OS }).then(res => {
            if (that.state.firstLoading) that.setState({ firstLoading: false });
            if (that.state.loadingMore) that.setState({ loadingMore: false });

            if (res.code == 200) {
                // 初始化
                if (page === 1) {
                    that.setState({ gameList: res.data, totalPage: res.recordCount });
                } else {
                    let gameListTemp = [...that.state.gameList];
                    that.setState({ gameList: gameListTemp.concat(res.data), totalPage: res.recordCount });
                }
            } else {
                Toast.tipBottom(res.message);
            }
        });
    }

    /**
     * 渲染游戏轮播图
     */
    renderSwiper() {
        if (this.props.type !== 0) return <View />;
        return (
            <View style={Styles.cardItemForGraph}>
                <Swiper
                    key={this.state.bannerList.length}
                    loop={true}
                    horizontal={true}
                    autoplay={true}
                    autoplayTimeout={4}
                    paginationStyle={{ bottom: 5 }}
                    showsButtons={false}
                    activeDotStyle={{ width: 15, height: 3, backgroundColor: Colors.White, borderRadius: 1 }}
                    dotStyle={{ width: 15, height: 3, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 1 }}>
                    {this.state.bannerList.map(item =>
                        <TouchableOpacity key={item['id'].toString()} onPress={() => {
                            if (item.type == 7) {
                                if (!this.props.logged) {
                                    Actions.push("Login");
                                    return;
                                }
                            }
                            onPressSwiper(item, this.props.mobile, this.props.userId)
                        }}>
                            <Image
                                source={{ uri: item['imageUrl'] }}
                                style={Styles.img}
                            />
                        </TouchableOpacity>
                    )}
                </Swiper>
            </View>
        )
    }
    /**
     * 显示系统消息
     */
    renderBroadcast() {
        return (
            <TouchableOpacity style={[Styles.bordercast, { marginHorizontal: 10 }]} onPress={() => Actions.Message({ idx: 0 })}>
                <Text style={{ color: Colors.main }}>公告</Text>
                <Icon name="ios-volume-medium" color={Colors.main} size={20} />
                <Swiper
                    style={{ marginLeft: 10 }}
                    key={this.state.msgData.length}
                    height={20}
                    loop={true}
                    removeClippedSubviews={false}
                    horizontal={true}
                    autoplay={true}
                    autoplayTimeout={20}
                    showsPagination={false}
                    showsButtons={false}
                >
                    {this.state.msgData.map((item, key) =>
                        <Text key={key} style={{ fontSize: 14, lineHeight: 21, color: Colors.grayFont }}>{item.title}</Text>
                    )}
                </Swiper>
            </TouchableOpacity>
        )
    }
    /**
     * 渲染列表Header
     */
    renderHeader() {
        return (
            <View>
                {this.renderSwiper()}
                {this.props.type === 0 && this.renderBroadcast()}
                {this.props.type === 0 && this.myNewTask()}
                {this.props.type === 0 &&
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <BannerAd
                            unitId="b1"
                            style={{ width: Metrics.screenWidth - 30, height: 332 / 6.4 }}
                            onAdLoad={({ id }) => { }}
                            onAdShow={({ id }) => { }}
                            onAdClose={({ id }) => { }}
                            onAdClick={({ id }) => { }}
                            onError={({ id, code, message }) => {
                                console.log('Banner err', id, code, message)
                            }}
                        />
                    </View>
                }
            </View>
        )
    }
    /**
     * 渲染功能组件区
     */
    renderOptions() {
        return (
            <View style={{ flexDirection: 'row', marginHorizontal: 5, paddingBottom: 10, borderRadius: 5, flexWrap: 'wrap' }}>
                {HOME_OPTIONS.map(item => {
                    let { key, name, route, image } = item;
                    return (
                        <TouchableOpacity key={key} style={Styles.optionTouch} onPress={() => this.onOptionPress(route)}>
                            <Image source={image} style={{ width: 35, height: 35 }} />
                            <Text style={Styles.optionTitle}>{name}</Text>
                        </TouchableOpacity>
                    )
                })}
            </View>
        )
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
    startTask = () => {
        const callback = (pId) => {
            TaskApi.startTask(pId)
                .then((res) => {
                    if (res.code === 200) {
                        if (res.data.taskSchedule === 10000) {
                            Send(`api/InitInfo?userId=${this.props.userId}`, {}, 'GET').then(res => {
                                if (res.code == 200) {
                                    this.props.updateUserInfo(res.data);
                                    Toast.tipBottom('今日任务已完成...')
                                } else {
                                    Toast.tipBottom(res.message)
                                }
                            })
                            return;
                        }
                        this.setState({
                            startTime: res.data.startTime,
                            endTime: res.data.endTime,
                            taskSchedule: res.data.quickenMinutes,
                        })
                        return;
                    }
                    Toast.tipBottom(res.message)
                }).catch((err) => console.log('err', err))
        }
        if (this.state.startTime != '' && this.props.isDoTask != 0) {
            Toast.tipBottom('今日任务已完成...');
            return;
        }
        if (Platform.OS === "ios") {
            Toast.tip('请稍等...');
            return;
        } else {
            Advert.rewardVideo((res) => {
                if (res) {
                    callback(res);
                } else {
                    Toast.tip(res);
                }
            })
        }

    }
    getEndTime = (timestamp) => {
        var date = new Date(timestamp);
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
        let strStart = startTime.replace(/\-/g, "/");
        let strEnd = endTime.replace(/\-/g, "/");
        let time1 = strStart.replace(/\//g, ':').replace(' ', ':');
        let time2 = time1.split(':');
        var start = Date.parse(new Date(time2[0], (time2[1] - 1), time2[2], time2[3], time2[4], time2[5]));
        let time3 = strEnd.replace(/\//g, ':').replace(' ', ':');
        let time4 = time3.split(':');
        var end = Date.parse(new Date(time4[0], (time4[1] - 1), time4[2], time4[3], time4[4], time4[5]));

        let now = (new Date()).getTime();
        let jishi = start + (end - start) - taskSchedule * 60000;
        let jindu = (now - start + taskSchedule * 60000) / (end - start) * 100;
        if (startTime == '') {
            return (
                <AnimatedCircularProgress
                    size={110}
                    width={8}
                    fill={0}
                    tintColor={Colors.main}
                    backgroundColor={Colors.backgroundColor}>
                    {() => <Text>开始任务</Text>}
                </AnimatedCircularProgress>
            )
        } else if ((new Date).getTime() > jishi) {
            return (
                <AnimatedCircularProgress
                    size={110}
                    width={8}
                    fill={100}
                    tintColor={Colors.main}
                    backgroundColor={Colors.backgroundColor}>
                    {() => <Text>{this.props.isDoTask == 0 ? '领取收益' : '今日已完成'}</Text>}
                </AnimatedCircularProgress>
            )
        } else {
            return (
                <AnimatedCircularProgress
                    size={110}
                    width={8}
                    fill={Number(Number(jindu).toFixed(0))}
                    tintColor={Colors.main}
                    backgroundColor={Colors.backgroundColor}>
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
    myNewTask = () => {
        return (
            <View>
                <View style={{ flexDirection: 'row', marginTop: 5 }}>
                    <TouchableOpacity style={{ margin: 10, flex: 4 }} onPress={() => {
                        if (!this.props.logged) {
                            Actions.push("Login");
                            return;
                        }
                        Advert.jumpAdList(this.props.userId)
                    }} >
                        <Image style={{ width: (Metrics.screenWidth - 40) * 4 / 7, height: (Metrics.screenWidth - 40) * 4 / 7 / 1.59, borderRadius: 10 }} source={require('../../images/tt2.gif')} />
                    </TouchableOpacity>
                    <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center', paddingLeft: 30, paddingRight: 40 }}>
                        <TouchableOpacity activeOpacity={0.8} onPress={this.startTask} >
                            {this.taskBtn()}
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ position: 'absolute', width: 50, height: 50, right: 10, bottom: 5, justifyContent: 'flex-end' }}
                            onPress={this.quickenTask}
                        >
                            {/*  */}
                            <FontAwesome style={{ width: 25, height: 25, marginLeft: 18 }} name={'flash'} color={Colors.C6} size={28} />
                            <Text style={{ fontSize: 10, color: Colors.main }}>   点我加速</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
    render() {
        let { gameList, firstLoading, loadingMore, currentPage, totalPage } = this.state;
        return (
            <View style={Styles.container}>
                <GameList
                    data={gameList}
                    firstLoading={firstLoading}
                    loadingMore={loadingMore}
                    currentPage={currentPage}
                    totalPage={totalPage}
                    ListHeaderComponent={this.renderHeader()}
                    fetchList={page => this.fetchList(page)}
                />
            </View>
        );
    }
}
const mapStateToProps = state => ({
    logged: state.user.logged,
    userId: state.user.id,
    mobile: state.user.mobile,
    level: state.user.level,
    auditState: state.user.auditState,
    candyH: state.user.candyH || 0,
    candyP: state.user.candyP,
    candyNum: state.user.candyNum,
    gc: state.user.gc,
    rcode: state.user.rcode,
    gcx: state.user.gcx,
    location: state.user.location,
    warnVersion: state.router.warnVersion,
    isReaded: state.notice.isReaded,
    id: state.notice.id,
    uuid: state.user.uuid,
    isDoTask: state.user.isDoTask,
    dayNum: state.user.dayNum,
    title: state.notice.title,
    content: state.notice.content,
    userBalanceNormal: state.user.userBalanceNormal,
    userBalanceLock: state.user.userBalanceLock,
    taskSchedule: state.user.taskSchedule,
    taskEndTime: state.user.taskEndTime,
    taskStartTime: state.user.taskStartTime,
});

const mapDispatchToProps = dispatch => ({
    updateUserInfo: (userInfo) => dispatch({ type: UPDATE_USER, payload: { userInfo } })
});
export default connect(mapStateToProps, mapDispatchToProps)(ClientGameList);
const Styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    img: {
        height: '100%',
        width: '100%',
        borderRadius: 5,
    },
    bordercast: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        overflow: "hidden"
    },
    options: {
        flexDirection: 'row',
        marginHorizontal: 5,
        paddingBottom: 10,
        borderRadius: 5,
        flexWrap: 'wrap'
    },
    optionTouch: {
        justifyContent: 'center',
        alignItems: 'center',
        width: (Metrics.screenWidth - 20) / 4,
        marginTop: 10
    },
    optionTitle: { marginTop: 4, fontSize: 12 },
    cardItemForGraph: {
        height: 150,
        margin: 5,
        flexDirection: "row",
        overflow: "hidden"
    },
});