/*
 * @Author: top.brids 
 * @Date: 2019-12-01 21:55:56 
 * @Last Modified by: top.brids
 * @Last Modified time: 2022-04-06 21:41:02
 */

import React, { Component } from 'react';
import { View, Text, BackHandler, Linking, ToastAndroid, Platform, Modal, RefreshControl, StyleSheet, ScrollView, Image, TouchableOpacity, StatusBar } from 'react-native';
import Swiper from 'react-native-swiper';
import WebView from 'react-native-webview';
import { Actions } from 'react-native-router-flux';
import Icon from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { connect } from 'react-redux';
import Cookie from 'cross-cookie';
import { UPDATE_NOTICE_INFO, UPDATE_USER, UPDATE_NOTICE_STATUS, UPDATE_USER_LOCATION } from '../../../redux/ActionTypes';
import Clipboard from '@react-native-community/clipboard';
import { Version } from '../../../config/Index';
import { ReadMore } from '../../components/Index';
import { Colors, Metrics } from '../../theme/Index';
import { HOME_OPTIONS, PROFILE_BAR } from '../../../config/Constants';
import { Send } from '../../../utils/Http';
import { Toast } from '../../common';
import { onPressSwiper } from '../../../utils/CommonFunction';
import { ShopApi, TaskApi } from '../../../api';
import { RefreshState } from 'react-native-refresh-list-view';
import Advert from '../advert/Advert';
import { Body, Card, CardItem } from 'native-base';
import { Header, CountDownReact } from '../../components/Index';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import LinearGradient from 'react-native-linear-gradient';
class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isRefreshing: false,
			refreshing: false,
			progress: 0,
			webViewHeight: 300,
			msgData: [],
			oneMsgData: {},
			bannerList: [],
			profileProgressList: [],
			noticeModalVisible: true,
			propagandaList: [],
			YokaAndChongzhiList: [],
			goodsList: [],
			pageIndex: 1,
			pageSize: 20,
			taskSchedule: props.taskSchedule,
			startTime: props.taskStartTime,
			endTime: props.taskEndTime,
			clipboardWarnText: '复制'
		};
	}


	componentWillUnmount() {
		if (Platform.OS == "android") {
			BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
		}
	}

	onBackAndroid = () => {
		if (Actions.currentScene != "Index") {
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

	componentDidMount() {
		if (Platform.OS == "android") {
			BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
		}
		this.fetchBanner(0);
		// this.reloadMessage()
		if (Version >= this.props.warnVersion) {
			this.fetchMessage();
			return;
		}
	}
	/**
	 * 获取系统Banner列表
	 * @param {*} source 
	 */
	fetchBanner(source) {
		var that = this;
		let params = {
			pageIndex: 1,
			type: 0,
		};
		Send("api/system/banners?source=" + source, {}, 'GET').then(res => {
			if (res.code == 200) {
				that.setState({ bannerList: res.data })
			} else {
				Toast.tipBottom(res.message);
			}
		})
	}


	getGoodsList = (index) => {
		const { pageSize } = this.state;
		ShopApi.getHomeShops(index, pageSize)
			.then((data) => {
				this.setState({
					goodsList: index == 1 ? data : this.state.goodsList.concat(data),
					refreshState: data.length < pageSize ? RefreshState.EmptyData : RefreshState.Idle
				})
			}).catch(() => {
				this.setState({
					goodsList: [],
					refreshState: RefreshState.EmptyData
				})
			})
	}
	onHeaderRefresh = () => {
		this.setState({
			refreshState: RefreshState.HeaderRefreshing,
			pageIndex: 1
		}, () => {
			this.getGoodsList(1)
		});
	}
	onFooterRefresh = () => {
		this.setState({
			refreshState: RefreshState.FooterRefreshing,
			pageIndex: this.state.pageIndex + 1
		}, () => {
			this.getGoodsList(this.state.pageIndex)
		});
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
	imageAdvert = () => {
		if (this.props.logged) {
			onPressSwiper(this.state.doTaskUrl, this.props.mobile, this.props.userId)
		} else {
			Actions.push('Login')
		}
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


	renderAd() {
		return (
			<TouchableOpacity style={[Styles.bordercast, { marginHorizontal: 10, marginTop: 20 }]}>
				<Icon name="rocket-sharp" color={Colors.main} size={22} />
				<Text style={{ fontSize: 14, lineHeight: 21, color: Colors.main, marginLeft: 10 }}>热门福利</Text>
			</TouchableOpacity>
		)
	}
	/**
	 * 游戏插图
	 */
	illustration(imgs) {
		if (imgs != undefined) {
			return (
				imgs.map((item, index) =>
					<View key={index} style={{ flexDirection: 'column', width: 100, margin: 5, }}>
						<TouchableOpacity onPress={() => onPressSwiper(item, this.props.mobile, this.props.userId)}>
							<Image
								source={{ uri: item['imageUrl'] }}
								style={{ height: 160, width: 100, borderRadius: 10, resizeMode: 'stretch', marginBottom: 5 }}
							/>
						</TouchableOpacity>
						<ReadMore
							numberOfLines={1}
						>
							<Text style={{ fontSize: 14, textAlign: 'left', color: 'gray' }}>
								{item.title}
							</Text>
						</ReadMore>
					</View>
				)
			)
		}
		return <View />
	}

	renderAdContent() {
		return (
			<Card>
				<CardItem>
					<Body>
						<ScrollView horizontal={true}>
							<View style={{ flex: 1, flexDirection: "row" }}>
								{this.illustration(this.state.propagandaList)}
							</View>
						</ScrollView>
					</Body>
				</CardItem>
				<CardItem footer>
				</CardItem>
			</Card>
		);
	}

	/**
	 * 渲染轮播图
	 */
	renderSwiper() {
		return (
			<View style={Styles.wiper}>
				<Swiper
					key={this.state.bannerList.length}
					horizontal={true}
					loop={true}
					autoplay={true}
					autoplayTimeout={16}
					removeClippedSubviews={false}
					paginationStyle={{ bottom: 20 }}
					showsButtons={false}
					activeDotStyle={{ width: 15, height: 3, backgroundColor: Colors.White, borderRadius: 1 }}
					dotStyle={{ width: 15, height: 3, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 1 }}
				>
					{this.state.bannerList.map((item, index) =>
						<TouchableOpacity key={index} onPress={() => onPressSwiper(item, this.props.mobile, this.props.userId)}>
							<Image style={Styles.banner} source={{ uri: item['imageUrl'] }} />
						</TouchableOpacity>
					)}
				</Swiper>
			</View >
		)
	}
	/**
	 * 渲染功能组件区
	 */
	renderOptions() {
		return (
			<View style={Styles.options}>
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

	onProfileOptionPress = (item) => {
		if (!this.props.logged) {
			Actions.push('Login')
		}
		Actions.push('AdFlowDetails', { data: item })
	}
	renderItem = (item, index) => {
		return (
			<TouchableOpacity key={index} style={Styles.item} onPress={() => this.onProfileOptionPress(item)}>
				<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
					<Text style={{ fontSize: 14, color: Colors.main, fontWeight: 'bold' }}>{item.keyname}</Text>
					<Icon name={'right'} size={15} color={Colors.C11} />
				</View>
				<View style={{ flexDirection: 'row', marginTop: 10, flex: 1 }}>
					<View style={{ flex: 1, justifyContent: 'center' }}>
						<Text style={{ fontSize: 12, color: Colors.C10, }}>可用</Text>
						<Text style={{ fontSize: 12, color: Colors.C12, marginTop: 3 }}>{item.balance}</Text>
					</View>
					<View style={{ flex: 1, justifyContent: 'center', }}>
						<Text style={{ fontSize: 12, color: Colors.C10, }}>冻结</Text>
						<Text style={{ fontSize: 12, color: Colors.C12, marginTop: 3 }}>{'---'}</Text>
					</View>
				</View>
			</TouchableOpacity>
		)
	}
	/**
	   * 渲染用户收益
	   */
	renderProfile() {
		return (
			<View style={Styles.profile}>
				{PROFILE_BAR.map(item => {
					let { key, keyname, title, router } = item;
					let value = (this.props[keyname] == 'undefined' || this.props[keyname] == null) ? 0 : this.props[keyname];
					value = value.toFixed(2);
					item.balance = value;
					return (
						<TouchableOpacity key={key} style={Styles.item} onPress={() => this.onProfileOptionPress(item)}>
							<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
								<Text style={{ fontSize: 13, color: Colors.main }}>{item.title}</Text>
								{/* <Icon name={'right'} size={15} color={Colors.C11} /> */}
								<Icon name="chevron-forward" color={Colors.C11} size={20} />
							</View>
							<View style={{ flexDirection: 'row', marginTop: 10, flex: 1 }}>
								<View style={{ flex: 1, justifyContent: 'center' }}>
									<Text style={{ fontSize: 12, color: Colors.C10, }}>可用</Text>
									<Text style={{ fontSize: 12, color: Colors.C12, marginTop: 3 }}>{item.balance}</Text>
								</View>
								<View style={{ flex: 1 }}></View>
								<View style={{ flex: 1, justifyContent: 'center', }}>
									<Text style={{ fontSize: 12, color: Colors.C10, }}>冻结</Text>
									<Text style={{ fontSize: 12, color: Colors.C12, marginTop: 3 }}>{'---'}</Text>
								</View>
							</View>
						</TouchableOpacity>
					)
				})}
			</View>
		)
	}
	/**
	 * 获取系统公告
	 */
	fetchMessage() {
		let that = this;
		let d = { ceratedAt: "2021-08-13 12:01:47", content: "欢迎各位家人齐聚一堂，让我们一起Happy!", id: 1, title: "系统消息", updatedAt: "2021-08-13 12:01:47" }
		Send("api/system/OneNotice", {}, 'get').then(res => {
			if (res.code == 200) {
				that.setState({
					oneMsgData: res.data == '' || res.data == undefined ? d : res.data,
				})
			}
		});
	}

	onMessage = (e) => {
		const data = JSON.parse(e.nativeEvent.data);
		if (data.height) {
			this.setState({
				webViewHeight: data.height < 500 ? 500 : data.height
			});
		}
	}
	webViewLoadedEnd = () => {
		this.webview.injectJavaScript(`
                const height = document.body.clientHeight;
                window.ReactNativeWebView.postMessage(JSON.stringify({height: height}));
            `);
	}
	/**
	 * 渲染系统公告Modal
	 */
	renderNoticeModal() {
		let _html = `<!DOCTYPE html>
        <html>
        <meta name="viewport" content="width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
        <body>
        ${this.state.oneMsgData.content}
        <script>
        function ResizeImages(){
          var myimg;
          for(i=0;i <document.images.length;i++){
            myimg = document.images[i];
            myimg.width = ${Metrics.screenWidth - 100};
          }
        }
        window.onload=function(){ 
          ResizeImages()
          window.location.hash = '#' + document.body.clientHeight;
          document.title = document.body.clientHeight;
        }
        </script></body></html>`
		return (
			<Modal animationType='slide' transparent visible={this.state.noticeModalVisible} onRequestClose={() => { }}>
				<View style={{ flex: 1, backgroundColor: "black", opacity: 0.3 }} />
				<View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					<View style={{ width: 280, height: 350, borderRadius: 10, backgroundColor: '#FFFFFF' }}>
						<Text style={{ textAlign: 'center', fontSize: 16, color: Colors.main, fontWeight: 'bold', marginTop: 20, }}>{this.state.oneMsgData.title}</Text>
						<Text style={{ fontSize: 12, padding: 10, paddingLeft: 15, color: "gray" }}>
							发布时间: {this.state.oneMsgData.ceratedAt}
						</Text>
						<ScrollView contentContainerStyle={{ padding: 5, paddingLeft: 5, paddingRight: 5 }}>
							<View style={{ height: this.state.webViewHeight, }}>
								<WebView
									ref={(ref) => this.webview = ref}
									style={{ flex: 1, height: this.state.webViewHeight }}
									source={{ html: _html }}
									originWhitelist={["*"]}
									onMessage={this.onMessage}
									onLoadEnd={this.webViewLoadedEnd}
									javaScriptEnabled={true}
								/>
							</View>
						</ScrollView>
						<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
							<TouchableOpacity onPress={() => this.setState({ noticeModalVisible: false })}>
								<View style={{ marginTop: 6, height: 30, width: 100, marginRight: 5, borderRadius: 10, backgroundColor: Colors.main, alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
									<Text style={{ fontSize: 14, color: Colors.C8 }}>关闭</Text>
								</View>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		)
	}
	descShop = () => {
		Send(`api/system/CopyWriting?type=today_common_rule`, {}, 'get').then(res => {
			Actions.push('CommonRules', { title: '今日推荐说明', rules: res.data });
		});
	}

	renderShopHeader() {
		return (
			<View style={{ paddingHorizontal: 10, marginVertical: 10 }}>
				<TouchableOpacity style={Styles.bordercast1} onPress={() => { }}>
					<Image source={require('../../images/home/jinrituijian.png')} />
				</TouchableOpacity>
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
	/**
	  * 开始 领取任务
	  */
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
					<TouchableOpacity style={{ margin: 10, flex: 4 }} onPress={() => Actions.Task()} >
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

	listHeaderComponent = () => {
		let gc = this.props.gc == undefined || this.props.gc == '' ? 0 : this.props.gc;
		return (
			<View style={{ flex: 1 }}>
				{/* {this.renderSwiper()} */}
				{/* {this.myNewTask()} */}
				<View style={{ backgroundColor: Colors.main, height: 150, justifyContent: 'center', alignItems: 'center' }}>
					<View style={{ flex: 1 }}>
						<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
							<Text style={{ color: Colors.White }}>当前GC资产价值</Text>
							<Text style={{ color: Colors.White, fontSize: 10 }}> 1GC≈{(1 / 6.5).toFixed(2)}USD</Text>
						</View>
						<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
							<Text style={{ color: Colors.White, fontSize: 20, fontWeight: 'bold' }}>{(gc * 1 / 6.5).toFixed(2)}</Text>
							<Text style={{ color: Colors.White }}> USD</Text>
						</View>
						{(this.props.uuid == '' || this.props.uuid == undefined) && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
							<Text style={{ color: Colors.White }}>链接/创建钱包</Text>
						</View>}

						<View style={{ flex: 2, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
							<Text style={{ color: Colors.White }}>{this.props.uuid}</Text>
							<TouchableOpacity onPress={() => {
								Clipboard.setString(this.props.uuid);
								Toast.tipBottom(`复制成功`)
							}}>
								<Text style={{ color: Colors.White }}>  {this.state.clipboardWarnText}</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
				{this.renderProfile()}
			</View>
		)
	}

	render() {
		return (
			<View style={Styles.container}>
				<StatusBar backgroundColor={Colors.main} />
				<Header title="资产" isTabBar={true} />
				<ScrollView style={{ flex: 1 }} refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onHeaderRefresh} />}>
					{this.listHeaderComponent()}
				</ScrollView>
				{this.renderNoticeModal()}
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
	updateNoticeInfo: ({ id, title, content, ceratedAt }) => dispatch({ type: UPDATE_NOTICE_INFO, payload: { id, title, content, ceratedAt } }),
	updateNoticeStatus: () => dispatch({ type: UPDATE_NOTICE_STATUS }),
	updateUserLocatin: (location) => dispatch({ type: UPDATE_USER_LOCATION, payload: { location } }),
	updateUserInfo: (userInfo) => dispatch({ type: UPDATE_USER, payload: { userInfo } })

});
export default connect(mapStateToProps, mapDispatchToProps)(Home);
const Styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: Colors.White },
	wiper: { height: 160, overflow: "hidden", margin: 5, borderRadius: 5 },
	banner: { height: 160, width: '100%' },
	bordercast: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 10,
		overflow: "hidden"
	},
	bordercast1: {
		// flex: 1,
		// marginBottom: 10,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: 'center',
	},
	options: {
		flexDirection: 'row',
		// marginTop: 10,
		marginHorizontal: 5,
		paddingBottom: 10,
		borderRadius: 5,
		flexWrap: 'wrap',
		// backgroundColor: Colors.White,
	},
	optionTouch: {
		justifyContent: 'center',
		alignItems: 'center',
		width: (Metrics.screenWidth - 20) / 4,
		marginTop: 10
	},
	optionTitle: { marginTop: 4, fontSize: 12 },
	task: {
		marginHorizontal: 10,
		flexDirection: 'row',
		alignItems: 'center'
	},
	taskGif: {
		width: 210,
		height: 74,
		borderRadius: 5
	},
	yieldText: { fontSize: 12, color: Colors.grayFont, marginTop: 5 },
	profileText: {
		fontSize: 16,
		color: Colors.main,
		includeFontPadding: false,
		textAlignVertical: 'center',
		maxWidth: 100
	},
	profileTitle: {
		marginTop: 2,
		fontSize: 13,
		color: Colors.fontColor,
	},
	itemView: {
		width: (Metrics.screenWidth - 25) / 2,
		borderRadius: 2,
		marginBottom: 5,
		backgroundColor: Colors.White,
	},


	yield: { marginRight: 40, marginTop: 10, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' },
	yieldInfo: { padding: 6, borderRadius: 6 },
	cdtPrompt: {
		height: 25,
		width: 40,
		borderTopRightRadius: 20,
		borderBottomRightRadius: 20,
		backgroundColor: Colors.C6,
		justifyContent: "center",
		marginLeft: 5,
		marginTop: 5,
		zIndex: 2,
	},
	yieldInfoText: { fontSize: 14, color: '#6b5a2e' },
	profile: {
		flex: 1,
		// flexWrap: 'wrap',
		// flexDirection: 'row',
		// alignItems: 'center',
		// paddingBottom: 5,
		marginTop: 20,
		// marginBottom: 80
	},
	profileItem: {
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1
	},
	//时间文字
	time: {
		fontSize: 14,
		color: '#000',
	},
	//冒号
	colon: {
		fontSize: 12, color: '#000'
	},
	item: {
		paddingVertical: 10,
		borderBottomWidth: 1,
		borderBottomColor: Colors.C13,
		paddingHorizontal: 10
	},
});
