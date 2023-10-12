/*
 * @Author: top.brids 
 * @Date: 2019-12-01 21:55:56 
 * @Last Modified by: top.brids
 * @Last Modified time: 2022-04-08 23:46:53
 */

import React, { Component } from 'react';
import {
	View,
	PermissionsAndroid,
	FlatList,
	RefreshControl,
	ActivityIndicator, Text, Platform, StyleSheet, Image, TouchableOpacity, Modal, StatusBar, SafeAreaView
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Icon from "react-native-vector-icons/Ionicons";
import { connect } from 'react-redux';
import { UPDATE_NOTICE_INFO, UPDATE_USER, UPDATE_NOTICE_STATUS, UPDATE_USER_LOCATION } from '../../../redux/ActionTypes';
import { Colors, Metrics } from '../../theme/Index';
import { Toast } from '../../common';
import { ScrollView } from 'react-native-gesture-handler';
//new
import moment from 'moment';
import CameraRoll from "@react-native-community/cameraroll";
import QRCode from 'react-native-qrcode-svg';
import { captureRef } from 'react-native-view-shot';
import { WEB_PATH } from '../../../config/Index';
import { ReadMore } from '../../components/Index';
import { UserApi } from '../../../api';
import DeviceInfo from 'react-native-device-info';
import SelectTopTab from '../../components/SelectTopTab';
import Timeline from 'react-native-timeline-flatlist'
import LinearGradient from 'react-native-linear-gradient';
const TOPTABLIST = [
	{ key: 1, name: '快讯' },
	{ key: 2, name: '新闻' }
]
const defaultImgUrl = "https://reactnative.dev/img/tiny_logo.png";

class BitCoinNews extends Component {
	constructor(props) {
		super(props);
		this.state = {
			webViewHeight: 300,
			isRefreshing: false,
			waiting: false,
			data: [],
			section: 1,
			pers: 12,
			id: 0,
			deviceUid: DeviceInfo.getUniqueId(),
			selectTap: 1,
			modalObtainedBuyListVisible: false,
			rowData: {},
			qrcodeUrl: `${WEB_PATH}?code=${this.props.code == "0" ? this.props.mobile : this.props.code}`,
		};
	}

	componentDidMount = () => {
		this.onRefresh();
	};

	webViewLoadedEnd = () => {
		this.webview.injectJavaScript(`
                const height = document.body.clientHeight;
                window.ReactNativeWebView.postMessage(JSON.stringify({height: height}));
            `);
	}


	//==Add==//

	onRefresh = () => {
		this.setState({ isRefreshing: true, id: 0 }, () => {
			UserApi.recommendNews(`?section=${this.state.section}&pers=${this.state.pers}&id=0`, this.state.deviceUid).then(res => {
				this.setState({
					data: res.data,
					isRefreshing: false,
					id: res.data[res.data.length - 1].id
				});
			})
		});
	}

	onEndReached = () => {
		if (!this.state.waiting) {
			this.setState({ waiting: true });
			UserApi.recommendNews(`?section=${this.state.section}&pers=${this.state.pers}&id=${this.state.id}`, this.state.deviceUid).then(res => {
				this.setState({
					data: this.state.data.concat(res.data),
					waiting: false,
					id: res.data[res.data.length - 1].id
				});
			})
		}
	}

	renderFooter = () => {
		if (this.state.waiting) {
			return <ActivityIndicator />;
		} else {
			return <Text>~</Text>;
		}
	}
	renderDetail = (rowData, sectionID, rowID) => {
		let time = <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
			<Text style={[Styles.descriptionContainer]}>{moment(rowData.created_at).format('YYYY-MM-DD hh:mm:ss')}</Text>
			<TouchableOpacity style={{ flexDirection: 'row', marginRight: 20 }} onPress={() => {
				this.setState({ modalObtainedBuyListVisible: true, rowData: rowData });
			}}><Icon name="arrow-redo-sharp" style={{ fontSize: 16, color: Colors.main }} /><Text style={[Styles.share]}>分享</Text>
			</TouchableOpacity>
		</View>
		let title = <Text style={[Styles.title]}>{rowData.title}</Text>

		var desc = null;
		if (rowData.content != '' && rowData.content != undefined && rowData.content != null) {
			desc = <View style={Styles.descriptionContainer}><ReadMore numberOfLines={3}><Text style={[Styles.textDescription]}>{rowData.content}</Text></ReadMore></View>
		}
		return (
			<View style={{ flex: 1 }}>
				{time}
				{title}
				{desc}
			</View>
		)
	}
	selectTab = (item) => {
		this.setState({ selectTap: item.key, section: item.key }, () => {
			this.onRefresh()
		})
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
		let invitCode = this.props.rcode == "0" || this.props.rcode == undefined ? this.props.mobile : this.props.rcode;
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
					<View style={Styles.modalBody1}>
						<View style={{ flex: 1 }}>
							<ScrollView contentContainerStyle={{ marginHorizontal: 20, marginTop: 20 }}>
								<View ref="shareViewShot" style={{ alignItems: 'center', justifyContent: 'center', width: Metrics.screenWidth - 50, backgroundColor: Colors.activeTintColor, borderRadius: 5 }}>
									<Image style={{ width: 60, height: 60, marginTop: 30, borderRadius: 30 }} source={require('../../images/logo.png')}></Image>
									<Text style={{ fontSize: 20, marginTop: 10, fontWeight: 'bold', color: Colors.White }}>{'N  D  G  C'}</Text>
									{/* <Text style={{ fontSize: 20, marginTop: 10, fontWeight: 'bold', color: Colors.White }}>{'一起畅玩 NFT DeFi GameChain'}</Text> */}
									
									<Text style={{ color: Colors.White, marginTop: 10 }}>{moment(this.state.rowData.created_at).format('YYYY-MM-DD hh:mm')} {this.getWeek(moment(this.state.rowData.created_at).format('d'))}</Text>
									<View style={{ padding: 10, margin: 10, backgroundColor: Colors.White, borderRadius: 5, paddingBottom: 30, marginBottom: 30 }}>
										<Text style={{ color: Colors.main, marginBottom: 10, fontSize: 20, }}>{this.state.rowData.title}</Text>
										<Text style={{ color: Colors.main, marginBottom: 10, fontSize: 16, }}>{moment(this.state.rowData.created_at).format('YYYY-MM-DD hh:mm:ss')}</Text>
										<Text>{this.state.rowData.content}</Text>
										<View style={{ marginVertical: 20, alignItems: 'center' }}>
											{this.renderQRCode()}
											<Text style={{ color: Colors.main, marginTop: 20, fontSize: 13, }}>邀请码:{this.props.rcode}</Text>
											<Text style={{ color: Colors.main, marginTop: 5, fontSize: 14 }}>扫码加入NDGC</Text>
											<Text style={{ color: Colors.main, marginTop: 5, fontSize: 14, color: Colors.main }}>一起畅玩 NFT DeFi GameChain</Text>
										</View>
									</View>
								</View>
							</ScrollView>
						</View>
					</View>
					<View style={Styles.modalHeader1}>
						<View style={Styles.modalFooter1}>
							<Text style={{ color: Colors.main, fontSize: 18, fontWeight: 'bold', marginTop: 10 }}>分享</Text>
							<TouchableOpacity onPress={() => this.confirmObtainedBuyTransaction()}>
								<View style={{ alignItems: 'center' }}>
									<Icon name="arrow-down-circle-sharp" style={Styles.actionButtonIcon} />
									<Text style={{ color: Colors.lineColor }}>保存图片</Text>
								</View>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => this.cancleObtainedBuyTransaction()}>
								<View style={[Styles.publishConfirm1, { backgroundColor: Colors.Gainsboro, marginTop: 10 }]}>
									<Text style={Styles.publishConfirmText1}>取消</Text>
								</View>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		)
	}
	onPressArticleDetail = (id) => {
		UserApi.articleDetail(`?id=${id}`, this.state.deviceUid, id).then(res => {
			if (res.status == 10000) {
				Actions.push('NewDetail', { TDContent: res.data.content, title: res.data.title })
			} else {
				Toast.tipBottom(res.message)
			}
		});
	}
	renderItem = ({ item }) => {
		return (
			<TouchableOpacity onPress={() => {
				this.onPressArticleDetail(item.id)
			}} key={item.id.toString()} style={Styles.newsItem}>
				<View style={{ flex: 1, alignItems: 'flex-start', marginRight: 10 }}>
					<Text style={Styles.title}>{item.title}</Text>
					<Text style={Styles.descriptionContainer}>{moment(item.created_at).format('YYYY-MM-DD hh:mm:ss')}</Text>
				</View>
				<View><Image source={{ uri: item.cover == '' || item.cover == undefined ? defaultImgUrl : item.cover }} style={{ width: 90, height: 60 }}></Image></View>
			</TouchableOpacity>
		)
	}
	//==Add End//
	render() {
		return (
			<SafeAreaView style={Styles.container}>
				{/* <StatusBar translucent={false} backgroundColor={Colors.White} barStyle='dark-content' /> */}
				<LinearGradient colors={[Colors.main, Colors.White]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ height: 100, paddingHorizontal: 10, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
					<View style={{ marginLeft: 10, paddingTop: 20 }}>
						<Text style={{ color: Colors.White, fontSize: 13 }}>小提示:点击分享即可邀请好友~</Text>
					</View>
				</LinearGradient>
				<View style={{ marginTop: -40, marginHorizontal: 10 }}>
					<SelectTopTab list={TOPTABLIST} onPress={this.selectTab} />
				</View>
				{this.state.selectTap == 1 && <Timeline
					style={Styles.list}
					data={this.state.data}
					circleSize={10}
					circleColor={Colors.main}
					lineColor={Colors.main}
					showTime={false}
					timeContainerStyle={{ minWidth: 52, marginTop: 5 }}
					timeStyle={{ textAlign: 'left', color: Colors.main }}
					descriptionStyle={{ color: 'gray' }}
					options={{
						refreshControl: (
							<RefreshControl
								refreshing={this.state.isRefreshing}
								onRefresh={this.onRefresh}
							/>
						),
						renderFooter: this.renderFooter,
						onEndReached: this.onEndReached
					}}
					renderDetail={this.renderDetail}
					innerCircle={'dot'}
				/>}
				{/* 快讯 */}
				{this.state.selectTap == 2 && <View style={{ flex: 1 }}>
					<FlatList
						data={this.state.data}
						renderItem={this.renderItem}
						keyExtractor={item => item.id.toString()}
						refreshing={this.state.isRefreshing}
						onRefresh={this.onRefresh}
						onEndReachedThreshold={0.2}
						onEndReached={this.onEndReached}
					/>
				</View>}
				{this.renderModalCancleBuyList()}
			</SafeAreaView>
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
	updateNoticeInfo: ({ id, title, content }) => dispatch({ type: UPDATE_NOTICE_INFO, payload: { id, title, content } }),
	updateNoticeStatus: () => dispatch({ type: UPDATE_NOTICE_STATUS }),
	updateUserLocatin: (location) => dispatch({ type: UPDATE_USER_LOCATION, payload: { location } }),
	updateUserInfo: (userInfo) => dispatch({ type: UPDATE_USER, payload: { userInfo } })

});
export default connect(mapStateToProps, mapDispatchToProps)(BitCoinNews);
const Styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: Colors.White },
	wiper: { height: 200, overflow: "hidden" },
	bordercast: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 10,
		overflow: "hidden"
	},
	banner: { height: '100%', width: '100%' },
	options: {
		height: 200,
		width: Metrics.screenWidth - 20,
		borderRadius: 5,
		flexWrap: 'wrap',
		backgroundColor: Colors.White
	},
	placeholderText: {
		height: 50,
		fontSize: 16,
		flex: 1,
		fontWeight: 'bold',
	},
	jidubg: {
		height: 30,
	},
	jidu: {
		position: 'absolute',
		height: 30,
		backgroundColor: Colors.activeTintColor,
		opacity: 0.3,
		right: 0
	},
	modalHeader: { flex: 1, opacity: 0.6, backgroundColor: '#FFFFFF' },
	price: { fontSize: 14, color: Colors.White },
	modalBody: { paddingTop: Metrics.PADDING_BOTTOM, flexDirection: "column", justifyContent: 'flex-end', backgroundColor: Colors.exchangeBg, width: Metrics.screenWidth },
	publishBuy: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
	modalBodyPrice: { marginTop: 12, flexDirection: 'row', alignItems: 'center' },
	modalBodyLeft: { width: Metrics.screenWidth * 0.3, alignItems: 'flex-end' },
	modalBodyRight: { width: Metrics.screenWidth * 0.7, alignItems: 'flex-start' },
	textInputContainer: { marginLeft: 10, paddingLeft: 8, width: Metrics.screenWidth * 0.7 * 0.8, height: 40, borderRadius: 6, backgroundColor: Colors.exchangeInput },
	publishTextInput: { flex: 1, color: Colors.White },
	modalFooter: { flexDirection: 'row', marginTop: 20 },
	publishConfirm: { height: 60, width: Metrics.screenWidth * 0.5, justifyContent: 'center', alignItems: 'center' },
	publishConfirmText: { fontSize: 16, color: '#FFFFFF', fontWeight: 'bold' },
	//add

	list: {
		flex: 1,
		marginTop: 10,
	},
	title: {
		fontSize: 16,
		fontWeight: 'bold',
		marginRight: 10
	},
	share: {
		fontSize: 14,
		fontWeight: 'bold',
		color: Colors.main
	},
	descriptionContainer: {
		flexDirection: 'row',
		paddingRight: 50
	},
	textDescription: {
		marginLeft: 10,
		color: 'gray'
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
	},
	newsItem: {
		// backgroundColor: Colors.main,
		borderBottomWidth: 1,
		borderColor: Colors.Gainsboro,
		padding: 10,
		marginVertical: 5,
		marginHorizontal: 10,
		flexDirection: 'row',
		flex: 1,
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	newsTitle: {
		fontSize: 32,
	}
});
