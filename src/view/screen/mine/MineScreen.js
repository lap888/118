import React, { Component } from 'react';
import { View, Text, Modal, StatusBar, BackHandler, StyleSheet, ScrollView, TouchableWithoutFeedback, Image, Platform, TouchableOpacity, ImageBackground, SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";


import Toast from '../../common/Toast';
import * as WeChat from 'react-native-wechat-lib';

import { Colors, Metrics } from '../../theme/Index';
import { LOGOUT, UPDATE_USER, UPDATE_NOTICE_STATUS } from '../../../redux/ActionTypes';
import { Env, Version } from '../../../config/Index';
import { PROFILE_BAR } from '../../../config/Constants';
import { Send } from '../../../utils/Http';
import { OtherApi } from '../../../api';
import LinearGradient from 'react-native-linear-gradient';
import WebView from 'react-native-webview';
import Advert from '../advert/Advert';


// 交易
let TRANSACTION_BAR = [
	{ key: "0", title: "买单", icon: 'buysellads', businessType: 0, router: "BuyOrder" },
	{ key: "1", title: "卖单", icon: 'buysellads', businessType: 1, router: "SellOrder" },
	{ key: "2", title: "交易中", icon: 'exchange', businessType: 2, router: "BuyingOrder" },
	{ key: "3", title: "已完成", icon: 'snapchat', businessType: 3, router: "BuyedOrder" }
];
// 基本信息
let BASICINFO_BAR = [
	{ key: "0", title: "任务商店", router: 'Task', icon: 'sketch' },
	{ key: "2", title: "新手指南", router: 'College', icon: 'affiliatetheme' },
	{ key: "4", title: "邀请好友", router: 'BitCoinNews', icon: 'qrcode' },
	{ key: "3", title: "我的团队", router: 'MyTeam', icon: 'reddit-square' },
	{ key: "10", title: "实名认证", icon: 'pencil-square', router: 'Certification', pic: require('../../images/mine/newm/shimingrenz.png') },
	{ key: "8", title: "新人券", icon: 'stack-overflow', router: 'NewTicket', pic: require('../../images/mine/newm/quan.png') },
	// { key: "6", title: "资产录入", icon: 'diamond', router: 'EditUserCoin' },
	{ key: "7", title: "资产浏览", icon: 'internet-explorer', router: 'Browser' },
	{ key: "9", title: "社区节点", icon: 'teamspeak', router: 'JieDian' },
	{ key: "5", title: "问题反馈", icon: 'bug', router: 'YoTaskApeal' },

];


let HUODONG_BAR = [
	{ key: "0", title: "NFT", icon: 'btc', router: 'Nft' },
	{ key: "2", title: "打金", icon: 'gamepad', router: 'QuanMinTask' },
	{ key: "4", title: "抽奖", icon: 'dashboard', router: 'ZpLuck' },
	{ key: "3", title: "打卡", icon: 'cubes', router: 'XfqScreen', pic: require('../../images/host/news.png') },
	{ key: "1", title: "量化", icon: 'unity', router: 'Information' },
	{ key: "5", title: "商城", icon: 'shopping-cart', router: 'Classfiy' },
];

class Mine extends Component {
	constructor(props) {
		super(props);
		this.state = {
			agreed: false,
			webViewHeight: 300,
			content: '',
			douyinH5: ''
		};
	}
	componentDidMount = () => {
		Send(`api/Ticket/FollowH5url`, {}, 'get').then(res => {
			this.setState({ douyinH5: res.data });
		});
	};

	onProfileOptionPress = (item) => {
		if (!this.props.logged) {
			Actions.push('Login')
		}
		Actions.push('AdFlowDetails', { data: item })
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
					return (
						<TouchableOpacity style={{ flex: 1, }} key={key} onPress={() => this.onProfileOptionPress(item)}>
							<View style={Styles.profileItem}>
								<Text style={[Styles.profileText]}>{value}</Text>
								<Text style={Styles.profileTitle}>{title}</Text>
							</View>
						</TouchableOpacity>
					)
				})}
			</View>
		)
	}
	onClickLevelBar() {
		if (this.props.logged) {
			Actions.push('Level');
		} else {
			Actions.push('Login');
		}
	}
	/**
		 * 交易Bar 点击事件
		 */
	handleTransactionBar(item) {
		if (this.props.logged) {
			if (item.hasOwnProperty('businessType')) {
				Actions.push('BusinessPage', { businessType: item['businessType'] });
			} else {
				Actions.push(item['router']);
			}
		} else {
			Actions.push('Login');
		}
	}
	/**
		 * 联系QQ客服
		 */
	onClickQQ() {
		Send(`api/system/CopyWriting?type=call_me`, {}, 'get').then(res => {
			Actions.push('CommonRules', { title: '联系我们', rules: res.data });
		});
	}
	/**
		 * 服务Bar 点击事件
		 */
	handleServiceBar(item) {
		if (this.props.logged) {
			if (item.hasOwnProperty('router')) {
				if (item['router'] === 'CommonRules') {
					this.onServicePress()
				} else if (item['router'] === 'qq') {
					this.onClickQQ();
				} else {
					Actions.push(item['router']);
				}
			} else {
				if (item['key'] === '0') this.onClickQQ();
			}
		} else {
			Actions.push('Login');
		}
	}
	onServicePress() {
		Send(`api/system/CopyWriting?type=day_q`, {}, 'get').then(res => {
			Actions.push('CommonRules', { title: '常见问题', rules: res.data });
		});
	}
	onQuantPress() {
		Send(`api/system/CopyWriting?type=quant_q`, {}, 'get').then(res => {
			Actions.push('CommonRules', { title: '量化', rules: res.data });
		});
	}


	/**
	 * 进入隐私政策界面
	 */
	privacyPolicy1 = () => {
		Send(`api/system/CopyWriting?type=y_s_rule`, {}, 'get').then(res => {
			this.setState({ content: res.data[0].text })
			// Actions.push('CommonRules', { title: '隐私政策', rules: res.data });
		});
	}
	privacyPolicy = () => {
		Send(`api/system/CopyWriting?type=y_s_1_rule`, {}, 'get').then(res => {
			Actions.push('CommonRules', { title: '隐私政策和用户协议', rules: res.data });
		});
	}

	/**
		 * 渲染我的服务
		 */
	renderService() {
		return (
			<View>
				<TouchableOpacity
					style={{ height: 50, backgroundColor: Colors.White, marginTop: 10, paddingLeft: 20, flexDirection: 'row', alignItems: 'center' }}
					onPress={() => Actions.push('Help')}>
					<Image style={{ height: 18, width: 18 }} source={require('../../images/mine/helpicon.png')} />
					<Text style={{ marginLeft: 5, fontSize: 13, color: '#333' }}>帮助中心</Text>
				</TouchableOpacity>
			</View>
		)
	}
	/**
	 * 服务Bar 点击事件
	 */
	handleServiceYoBang(item) {
		if (this.props.logged) {
			if (item.hasOwnProperty('router')) {
				if (item['router'] === 'CommonRules') {
					this.onServicePress()
				} else if (item['router'] === 'GoodLuck') {
					Toast.tipBottom('暂未开放')
				} else if (item['router'] === 'BindWeChat') {
					console.warn('绑定微信');
					WeChat.sendAuthRequest('snsapi_userinfo', 'wechat_sdk_demo')
						.then((responseCode) => {
							let code = responseCode.code;
							return OtherApi.getWechatToken(code)
						})
						.then((data) => {
							return OtherApi.getWechatUser(data.access_token, data.openid)
						})
						.then((userinfo) => {
							console.log('userinfo', userinfo);
						}).catch((err) => console.log('err', err))
				} else if (item['router'] == 'Classfiy1') {
					Toast.tipBottom('暂未开放...')
				} else if (item['router'] == 'QuanMinTask') {
					Advert.jumpAdList(this.props.userId)
				} else if (item['router'] == 'PlayGame') {
					if (this.props.logged) {
						let url = 'https://haowanhuaijiuapi.kumili.net/api/Game/GenAuthSdwUrl2?id={YoyoUserID}';
						//处理url
						let p1 = '{YoyoUserMobilePhone}';
						let p2 = '{YoyoUserID}';
						if (url.indexOf(p1) > 0) {
							url = url.replace(p1, this.props.mobile)
						}
						if (url.indexOf(p2) > 0) {
							url = url.replace(p2, this.props.userId)
						}
						Actions.AdH5({ url: url, ty: 4, title: '畅玩游戏', thumbImage: '', bannerId: 1 });
					} else {
						Actions.push('Login')
					}
				} else if (item['router'] == 'JiaYouSheng') {
					if (this.props.logged) {
						let url = 'https://open.czb365.com/redirection/todo?platformType=98639778&platformCode={YoyoUserMobilePhone}';
						//处理url
						let p1 = '{YoyoUserMobilePhone}';
						let p2 = '{YoyoUserID}';
						if (url.indexOf(p1) > 0) {
							url = url.replace(p1, this.props.mobile)
						}
						if (url.indexOf(p2) > 0) {
							url = url.replace(p2, this.props.userId)
						}
						Actions.AdH5({ url: url, ty: 4, title: '加油省', thumbImage: '', bannerId: 1 });
					} else {
						Actions.push('Login')
					}
				} else if (item['router'] == 'AiDouYin') {
					if (this.props.logged) {
						let url = `${this.state.douyinH5}&type=H5`;
						Actions.AdH5({ url: url, ty: 4, title: '趣抖音', thumbImage: '', bannerId: 1 });
					} else {
						Actions.push('Login')
					}
				} else if (item['router'] == 'Information') {
					this.onQuantPress()
				} else {
					Actions.push(item['router']);
				}
			} else {
				// if (item['key'] === '0') {
				// 	this.onClickQQ()
				// };
			}
		} else {
			Actions.push('Login');
		}
	}
	/**
	 * 头部背景
	 *  */
	renderHeaderCard = () => {
		return (
			<LinearGradient colors={[Colors.main, Colors.White]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ height: 133, paddingHorizontal: 10 }}>
				<View style={{ height: 80, flexDirection: 'row', justifyContent: 'space-between', paddingTop: 5 }}>
					<Text style={Styles.version}>{`版本号：${Env === 'dev' ? Env : ''}${Version}`}</Text>
					<View style={{ flexDirection: 'row' }}>
						{/* <TouchableOpacity style={{ alignItems: 'center', marginRight: 20 }} onPress={() => Actions.push('Message')}>
							<Image source={require('../../images/my/xiaoxi.png')} />
							<Text style={{ fontSize: 9, color: Colors.White }}>消息</Text>
						</TouchableOpacity> */}
						<TouchableOpacity style={{ alignItems: 'center', marginRight: 20 }} onPress={() => Actions.push(this.props.logged ? 'UserInfo' : 'Login')}>
							<Image source={require('../../images/my/shezhi.png')} />
							<Text style={{ fontSize: 9, color: Colors.White }}>设置</Text>
						</TouchableOpacity>
					</View>
				</View>
			</LinearGradient>
			// <ImageBackground source={require('../../images/my/headerbg.png')} resizeMode={'stretch'} style={{ height: 133, paddingHorizontal: 10 }}>

			// </ImageBackground>
		)
	}
	/**
	 * 用户信息板块
	 *  */
	renderUserCard = () => {
		let { nickname, rcode, level } = this.props;
		return (
			<View style={{ backgroundColor: Colors.transparent, marginHorizontal: 10, marginTop: -80, paddingTop: 12 }}>
				<View style={{ flex: 1, backgroundColor: Colors.White, borderTopLeftRadius: 2, borderTopRightRadius: 2 }}>
					{this.props.logged ?
						<View style={{ flex: 1, flexDirection: 'row', }}>
							<View style={{ flex: 1, marginLeft: 85, marginTop: 10 }}>
								<Text style={Styles.nickname} numberOfLines={2}>{nickname || "该用户很懒，还没有修改昵称"}</Text>
								<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => Actions.push('EditInviterCode')}>
									<Text style={Styles.inviteCode} numberOfLines={2}>{rcode == "0" ? `邀请码:${this.props.mobile}` : `邀请码:${rcode}`}</Text>
									<View style={{ backgroundColor: Colors.main, width: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 5, paddingVertical: 2, marginLeft: 5, marginTop: 10 }}><Text style={{ color: Colors.White, fontSize: 12 }}>修改</Text></View>
								</TouchableOpacity>
								<TouchableOpacity style={Styles.level} onPress={() => this.onClickLevelBar()}>
									<Image style={{ height: 25, width: 20 }} source={require('../../images/level.png')} />
									<Text style={Styles.contributionValueText}>{`会员等级:`}</Text>
									<Text style={Styles.levelText}>{level}</Text>
								</TouchableOpacity>
							</View>
						</View>
						:
						<View style={{ flex: 1 }}>
							<TouchableWithoutFeedback onPress={() => Actions.push('Login')}>
								<View style={{ flex: 1, marginLeft: 25, marginTop: 10 }}>
									<Text style={{ fontSize: 20, fontWeight: '600', }} numberOfLines={2}>{"登录"}</Text>
								</View>
							</TouchableWithoutFeedback>
						</View>
					}
					<TouchableOpacity onPress={() => {
						if (!this.props.logged) {
							Actions.push("Login");
							return;
						}
						Advert.jumpAdList(this.props.userId)
					}} style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
						<Image style={{ width: Metrics.screenWidth - 40, height: 50 }} source={require('../../images/home/quanmingtask2.gif')} />
					</TouchableOpacity>
				</View>
				{this.props.logged ? <TouchableOpacity style={{ position: 'absolute', height: 60, width: 60, marginLeft: 15, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderRadius: 30, overflow: 'hidden' }} onPress={() => Actions.push('UserInfo')}>
					<Image source={require('../../images/logo.png')} style={Styles.avatar} />
				</TouchableOpacity> : null}
			</View>
		)
	}
	/**
	 *  交易板块
	 * */
	renderTransactionCard = () => {
		return (
			<View style={Styles.transactionBody}>
				{TRANSACTION_BAR.map(item =>
					<TouchableOpacity style={{ flex: 1 }} key={item['key']} onPress={() => this.handleTransactionBar(item)}>
						<View style={Styles.barBodyItem}>
							{item['router'] == 'BuyOrder' ?
								<Image source={require('../../images/my/mai.png')} /> :
								item['router'] == 'SellOrder' ?
									<Image source={require('../../images/my/maichu.png')} /> :
									item['router'] == 'BuyingOrder' ?
										<Image source={require('../../images/my/jinxingzhong.png')} /> :
										item['router'] == 'BuyedOrder' ?
											<Image source={require('../../images/my/yiwancheng.png')} /> :
											<FontAwesome name={item['icon']} color={Colors.C6} size={28} />
							}
							<Text style={Styles.barText}>{item['title']}</Text>
						</View>
					</TouchableOpacity>
				)}
			</View>
		)
	}
	/**
	 *  用户等级
	 * */
	renderLevelCard = () => {
		return (
			// <View style={{ height: 70, backgroundColor: Colors.White, marginTop: 10, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10 }}>
			<View style={[Styles.profile, { padding: 10 }]}>
				<ImageBackground resizeMode={'cover'} style={{ height: 60, width: Metrics.screenWidth - 40 }} source={require('../../images/mine/mylevel.png')}>
					<TouchableOpacity style={Styles.level} onPress={() => this.onClickLevelBar()}>
						<View style={{ flex: 1, marginLeft: 15, marginRight: 12, justifyContent: 'center', alignItems: 'center' }}>
							{/* <Text style={Styles.levelText}>{level}</Text> */}
							<Image style={{ height: 20, width: 20 }} source={require('../../images/level.png')} />
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<Text style={Styles.contributionValueText}>{`贡献值`}</Text>
							</View>
						</View>
						<View style={{ height: 30, width: 1, backgroundColor: Colors.White }} />
						<View style={{ flex: 2, paddingLeft: 12, alignItems: 'center' }}>
							<Text style={Styles.levelPropaganda}>{`推广越多 等级越高 手续费越低`}</Text>
							<Text style={[Styles.levelPropaganda, { marginTop: 4, fontSize: 11 }]}>点击查看贡献值规则</Text>
						</View>
					</TouchableOpacity>
				</ImageBackground>
			</View>

		)
	}
	/** 
	 * 基本信息
	*/
	renderBasicInfoCard = () => {
		return (
			<View style={Styles.barContainer}>
				<View style={Styles.barHeader}>
					<Text style={Styles.barTitle}>——基本信息——</Text>
				</View>
				<View style={Styles.barBody}>
					{BASICINFO_BAR.map(item =>
						<TouchableOpacity style={[Styles.barBodyItem, { width: (Metrics.screenWidth - 20) / 3 }]} key={item['key']} onPress={() => {
							Actions.push(this.props.logged ? (item['router'] == "Certification" && !this.props.isPay) ? "PayPage" : item['router'] : 'Login')
						}}>
							<View style={[Styles.barBodyItem, { width: (Metrics.screenWidth - 20) / 2 }]}>
								{item['router'] == 'College' || item['router'] == 'Task' || item['router'] == "JieDian" || item['router'] == 'MyTeam' ?
									<FontAwesome5 name={item['icon']} color={Colors.C6} size={28} brand /> :
									<FontAwesome name={item['icon']} color={Colors.C6} size={28} />
								}
								<Text style={Styles.barText}>{item['title']}</Text>
							</View>
						</TouchableOpacity>
					)}
				</View>
			</View>
		)
	}


	/**
	 * ——活动——
	 */
	renderHuoDong = () => {
		return (
			<View style={Styles.yoContainer}>
				<View style={Styles.barHeader}>
					<Text style={Styles.barTitle}>——应用中心——</Text>
				</View>
				<View style={Styles.barBody}>
					{HUODONG_BAR.map(item =>
						<TouchableWithoutFeedback key={item['key']} onPress={() => this.handleServiceYoBang(item)}>
							<View style={[Styles.barBodyItem, { width: (Metrics.screenWidth - 20) / 3, marginTop: 5 }]}>
								{item['router'] == 'AiDouYin' || item['router'] == 'QuanMinTask' || item['router'] == 'DeFi' || item['router'] == 'Information' ?
									<FontAwesome5 name={item['icon']} color={Colors.C6} size={28} brand /> :
									<FontAwesome name={item['icon']} color={Colors.C6} size={28} />
								}
								{/* <FontAwesome name={item['icon']} color={Colors.C6} size={28} /> */}
								<Text style={Styles.barText}>{item['title']}</Text>
							</View>
						</TouchableWithoutFeedback>
					)}
				</View>
			</View>
		)
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
        ${this.state.content}
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
			<Modal animationType='slide' transparent visible={this.props.isReaded} onRequestClose={() => { }}>
				<View style={{ flex: 1, backgroundColor: "black", opacity: 0.3 }} />
				<View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					<View style={{ width: 280, height: 350, borderRadius: 10, backgroundColor: '#FFFFFF' }}>
						<Text style={{ textAlign: 'center', fontSize: 16, color: Colors.main, fontWeight: 'bold', marginTop: 20, }}>用户协议和隐私政策</Text>

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
							<TouchableOpacity onPress={() => this.props.updateNoticeStatus()}>
								<View style={{ marginTop: 6, height: 30, width: 100, marginRight: 5, borderRadius: 10, backgroundColor: Colors.main, alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
									<Text style={{ fontSize: 14, color: Colors.C8 }}>同意</Text>
								</View>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => { BackHandler.exitApp(); }}>
								<View style={{ marginTop: 6, height: 30, width: 100, marginLeft: 10, borderRadius: 10, backgroundColor: Colors.main, alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
									<Text style={{ fontSize: 14, color: Colors.C8 }}>拒绝</Text>
								</View>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		)
	}
	render() {
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: Colors.backgroundColor }}>
				<StatusBar backgroundColor={Colors.main} showHideTransition={'slide'} barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} />
				<ScrollView contentContainerStyle={{ paddingBottom: 10 }}>
					{this.renderHeaderCard()}
					{this.renderUserCard()}
					{/* {this.renderLevelCard()} */}
					{/* {this.renderTransactionCard()} */}
					{this.renderBasicInfoCard()}
					{this.renderHuoDong()}
					{this.renderService()}

				</ScrollView>
			</SafeAreaView>
		);
	}
}
const mapStateToProps = state => ({
	name: state.user.name,
	isPay: state.user.isPay,
	alipayUid: state.user.alipayUid,
	auditState: state.user.auditState,
	logged: state.user.logged,
	userId: state.user.id,
	level: state.user.level,
	rcode: state.user.rcode,
	golds: state.user.golds,
	mobile: state.user.mobile,
	nickname: state.user.name,
	isReaded: state.notice.isReaded,
	avatar: state.user.avatarUrl,
	balance: state.dividend.userBalance,
	candyH: state.user.candyH || 0,
	candyP: state.user.candyP,
	candyNum: state.user.candyNum,
	gc: state.user.gc,
	gcx: state.user.gcx,
	userBalanceNormal: state.dividend.userBalanceNormal,
	userBalanceLock: state.dividend.userBalanceLock
});
const mapDispatchToProps = dispatch => ({
	logout: () => dispatch({ type: LOGOUT }),
	updateNoticeStatus: () => dispatch({ type: UPDATE_NOTICE_STATUS }),
	updateUserInfo: (userInfo) => dispatch({ type: UPDATE_USER, payload: { userInfo } })
});
export default connect(mapStateToProps, mapDispatchToProps)(Mine);

const Styles = StyleSheet.create({
	gradient: { padding: 15, paddingTop: 10, paddingBottom: 20 },
	avatar: { width: 52, height: 52, borderRadius: 26, overlayColor: '#fff' },
	nickname: { fontSize: 16, color: "#333", fontWeight: '500' },
	inviteCode: { fontSize: 13, color: "#666", marginTop: 10 },
	setting: { alignItems: 'flex-end' },
	version: { marginTop: 2, fontSize: 11, color: Colors.C8 },
	profile: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.White, borderBottomLeftRadius: 2, borderBottomRightRadius: 2 },
	profileItem: { flex: 1, alignItems: 'center', justifyContent: 'center', height: 60 },
	profileTitle: { marginTop: 2, fontSize: 12, color: Colors.grayFont },
	profileText: { fontSize: 14, color: Colors.C6 },
	level: { flexDirection: 'row', marginTop: 10, alignItems: 'center' },
	levelText: { fontSize: 12, color: Colors.main, fontWeight: 'bold' },
	contributionValueText: { fontSize: 13, color: Colors.main },
	levelPropaganda: { fontSize: 12, color: Colors.White },
	icon: { width: 30, height: 30 },
	barContainer: { flex: 1, backgroundColor: Colors.C8, marginTop: 10, paddingBottom: 10 },
	yoContainer: { backgroundColor: Colors.White, marginTop: 10, paddingBottom: 10 },
	barHeader: { flex: 1, justifyContent: 'center', alignItems: 'center', marginVertical: 10 },
	barTitle: { fontSize: 14, color: Colors.fontColor, fontWeight: '600' },
	barHeaderRight: { flex: 1 },
	barMore: { textAlign: 'right', fontSize: 14, color: Colors.C10 },
	barBody: { flexDirection: 'row', flexWrap: 'wrap' },
	transactionBody: { flexDirection: 'row', height: 60, backgroundColor: Colors.White, marginTop: 10, paddingVertical: 10 },
	barBodyItem: { justifyContent: 'center', alignItems: 'center', marginVertical: 2 },
	barText: { marginTop: 6, fontSize: 12, color: Colors.fontColor },
	badge: { position: 'absolute', left: 20, top: -2 },
});