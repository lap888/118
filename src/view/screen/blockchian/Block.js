import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Image, TouchableOpacity, TextInput, Keyboard, Linking } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import RefreshListView, { RefreshState } from 'react-native-refresh-list-view';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import ActionButton from 'react-native-action-button';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { upgrade } from 'rn-app-upgrade';
import Cookie from 'cross-cookie';

import { Header } from '../../components/Index';
import { Colors, Metrics } from '../../theme/Index';
import { Send } from '../../../utils/Http';
import Swiper from 'react-native-swiper';
import { Toast } from '../../common';
import { interception } from '../../../utils/BaseValidate';
import { onPressSwiper } from '../../../utils/CommonFunction';
class Block extends Component {
	constructor(props) {
		super(props);
		this.state = {
			order: 5,
			pageIndex: 1,
			pageSize: 10,
			totalPage: 0,
			dataList: [],
			sequence: [],
			proName: '',
			searchText: "",
			bannerList: []
		};
	}

	componentDidMount() {
		this.onHeaderRefresh();
		this.fetchBanner(4);
	}

	/**
	 * 获取系统Banner列表
	 * @param {*} source 
	 */
	fetchBanner(source) {
		var that = this;
		Send("api/system/banners?source=" + source, {}, 'GET').then(res => {
			if (res.code == 200) {
				that.setState({ bannerList: res.data });
			} else {
				Toast.tipBottom(res.message);
			}
		})
	}
	
	/**
	 * 进入交易规则界面
	 */
	onRightPress() {
		Send(`api/system/CopyWriting?type=yobang_rule`, {}, 'get').then(res => {
			Actions.push('CommonRules', { title: '哟帮规则', rules: res.data });
		});
	}
	/**
	 * 排序条件变更
	 * @param {*} key 
	 */
	onChangeSequence(key) {
		let { order } = this.state;
		let newOrder = order;
		if (order !== key) {
			newOrder = key;
		}
		this.setState({ order: newOrder, searchText: key == 4 ? '11111111111' : '', pageIndex: 1 }, () => {
			this.onHeaderRefresh();
		});
	}
	/**
	 * 更新检索手机号
	 */
	updateSearchText() {
		Keyboard.dismiss();
		if (this.state.searchText !== this.state.proName) {
			this.setState({ searchText: this.state.proName });
			this.onHeaderRefresh()
		}
	}

	onHeaderRefresh = () => {
		this.setState({ refreshState: RefreshState.HeaderRefreshing, pageIndex: 1 }, () => {
			Send('api/YoBang/TaskList', { sort: this.state.order, keyword: this.state.searchText, pageIndex: this.state.pageIndex }).then(res => {
				if (res.code == 200) {
					this.setState({
						dataList: res.data.list,
						totalPage: res.data.total,
						refreshState: res.data.list.length < 1 ? RefreshState.EmptyData : RefreshState.Idle
					})
				} else {
					this.setState({
						dataList: [],
						totalPage: 0,
						refreshState: RefreshState.EmptyData
					})
				}
			});
		});
	}

	onFooterRefresh = () => {
		let that = this;
		that.setState({
			refreshState: RefreshState.FooterRefreshing,
			pageIndex: this.state.pageIndex + 1
		}, () => {
			Send('api/YoBang/TaskList', { sort: this.state.order, keyword: this.state.searchText, pageIndex: this.state.pageIndex }).then(res => {
				if (res.code == 200) {
					this.setState({
						dataList: that.state.dataList.concat(res.data.list),
						totalPage: res.data.total,
						refreshState: this.state.dataList.length >= this.state.totalPage ? RefreshState.EmptyData : RefreshState.Idle,
					})
				} else {
					this.setState({
						dataList: [],
						totalPage: 0,
						refreshState: RefreshState.EmptyData
					})
				}
			});
		});
	}
	keyExtractor = (item, index) => {
		return index.toString()
	}
	/**
	 * 渲染统计栏目
	 */
	renderHeaderComponent() {
		const YoTaskTitle = [
			{ key: 5, title: '精选' },
			{ key: 1, title: '最新' },
			{ key: 3, title: '最高' },
		]
		let { order } = this.state;
		return (
			<View style={{ }}>
				<View style={styles.sequence}>
					{YoTaskTitle.map(item => {
						let { key, title } = item;
						let itemSelected = order === key;
						return (
							<TouchableOpacity key={key} style={{ height: 40, flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} onPress={() => this.onChangeSequence(key)}>
								<Text style={[styles.sequenceTitle, { color: itemSelected ? Colors.main : Colors.C11 }]}>{title}</Text>
							</TouchableOpacity>
						)
					})}
					<TouchableOpacity style={{ height: 40, flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} onPress={() => this.onChangeSequence(4)}>
						<Icon name="md-search" color={order == 4 ? Colors.main : Colors.C11} size={20} />
					</TouchableOpacity>
				</View >
				{this.state.order === 4 &&
					<View style={styles.searchContainer}>
						<Text style={styles.mobileText}>项目名称</Text>
						<TextInput style={styles.mobileInput} placeholder="搜索任务"
							value={this.state.proName}
							onChangeText={proName => this.setState({ proName })}
							onBlur={() => this.updateSearchText()}
						/>
						<TouchableOpacity onPress={() => { Keyboard.dismiss(); this.updateSearchText() }}>
							<Icon name="md-search" color={Colors.C12} size={20} />
						</TouchableOpacity>
					</View>
				}
			</View>
		)
	}
	renderPublishBar() {
		return (
			<ActionButton buttonColor="rgba(255,165,0,1)" hideShadow={true} buttonText="+" buttonTextStyle={{ fontSize: 25 }}>
				<ActionButton.Item buttonColor='#9b59b6' title="下载APP" onPress={() => !this.props.logged ? Actions.push("Login") : Actions.push('PublicYoTask', { title: '下载APP', type: 1 })}>
					<Icon name="cloud-download" style={styles.actionButtonIcon} />
				</ActionButton.Item>
				<ActionButton.Item buttonColor='#3498db' title="账号注册" onPress={() => !this.props.logged ? Actions.push("Login") : Actions.push('PublicYoTask', { title: '账号注册', type: 2 })}>
					<FontAwesome name="registered" style={styles.actionButtonIcon} />
				</ActionButton.Item>
				<ActionButton.Item buttonColor='#F48354' title="认证绑卡" onPress={() => !this.props.logged ? Actions.push("Login") : Actions.push('PublicYoTask', { title: '认证绑卡', type: 3 })}>
					<FontAwesome name="credit-card" style={styles.actionButtonIcon} />
				</ActionButton.Item>
				<ActionButton.Item buttonColor='#1abc9c' title="其他" onPress={() => !this.props.logged ? Actions.push("Login") : Actions.push('PublicYoTask', { title: '其他', type: 4 })}>
					<Icon name="cube-sharp" style={styles.actionButtonIcon} />
				</ActionButton.Item>
			</ActionButton>
		);
	}

	/**
	 * 渲染轮播图
	 */
	renderSwiper() {
		if (this.state.bannerList.length < 1) {
			return <View/>;
		}
		return (
			<View style={styles.wiper}>
				<Swiper 
					key={this.state.bannerList.length}
					horizontal={true}
					loop={true}
					autoplay={true}
					autoplayTimeout={16}
					removeClippedSubviews={false}
					paginationStyle={{ bottom: 1 }}
					showsButtons={false}
					activeDotStyle={{ width: 15, height: 3, backgroundColor: Colors.White, borderRadius: 1 }}
					dotStyle={{  width: 15, height: 3, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 1 }}
				>
				{this.state.bannerList.map(item =>
					<TouchableWithoutFeedback key={item['id'].toString()} onPress={() => onPressSwiper(item, this.props.mobile, this.props.userId)}>
					<Image
						source={{ uri: item['imageUrl'] }}
						style={styles.banner}
					/>
					</TouchableWithoutFeedback> 
				)}
				</Swiper>
			</View >
		)
	}

	getColor = (index) => {
		if (index % 10 == 0 || index % 10 == 5) {
			return {
				bgColor: '#fee2b2',
				txtColor: '#a07024'
			}
		}
		if (index % 10 == 1 || index % 10 == 6) {
			return {
				bgColor: '#e4d3fd',
				txtColor: '#461c9c'
			}
		}
		if (index % 10 == 2 || index % 10 == 7) {
			return {
				bgColor: '#c0ddfd',
				txtColor: '#3467c3'
			}
		}
		if (index % 10 == 3 || index % 10 == 8) {
			return {
				bgColor: '#bbf1d1',
				txtColor: '#21a34d'
			}
		}
		if (index % 10 == 4 || index % 10 == 9) {
			return {
				bgColor: '#fbdcd9',
				txtColor: '#f75552'
			}
		}
	}
	
	render() {
		return (
			<View style={{ flex: 1, backgroundColor: Colors.backgroundColor }}>
				<Header title="YOYO" isTabBar={true} rightText="规则" onRightPress={this.onRightPress} />
				{this.renderHeaderComponent()}
				{this.renderSwiper()}
				<View style={{flex: 1}}>
					<RefreshListView
						data={this.state.dataList}
						keyExtractor={this.keyExtractor}
						renderItem={({ item, index }) => {
							const color = this.getColor(index)
							return (
								<TouchableOpacity 
									onPress={() => Actions.push('ViewTask', { yoBangBaseTask: item })} 
									style={{ margin: 10, marginBottom: 0, backgroundColor: color.bgColor, borderRadius: 5, padding: 15 }}>
									<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
										<View style={{ marginLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
											<Image style={{ width: 50, height: 50, borderRadius: 25 }} source={{ uri: item.userPic }} />
											<View style={{ width: Metrics.screenWidth * 0.5 }}>
												<View style={{ flexDirection: 'row', alignItems: 'center' }}>
													{item.rank != 0 && <View style={{ marginLeft: 5, borderRadius: 2, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.Green }}>
														<Text style={{ margin: 3, fontSize: 12, color: color.txtColor, padding: 0, lineHeight: 13 }}>精选</Text>
													</View>}
													<Text style={{ fontSize: 15, marginLeft: 5, color: color.txtColor }}>{interception(item.title, 10)}</Text>
												</View>
												<Text style={{ fontSize: 13, marginLeft: 5, color: color.txtColor }}>{`${item.finishCount}已赚，剩余${item.remainderCount}个`}</Text>
											</View>
										</View>
										<View style={{ marginLeft: 10, width: 70 }}>
											{/* {item.rewardType == 1 ?
												<Text style={{ color: color.txtColor }}>赏{item.unitPrice}元</Text> :
												<Text style={{ color: color.txtColor }}>赏{item.unitPrice}糖果</Text>} */}
												{item.rewardType == 1 && <Text style={{ color: color.txtColor }}>赏{item.unitPrice}元</Text>}
												{item.rewardType == 2 && <Text style={{ color: color.txtColor }}>赏{item.unitPrice}糖果</Text>}
												{item.rewardType == 3 && <Text style={{ color: color.txtColor }}>赏{item.unitPrice}USDT</Text>}
										</View>
									</View>
									<View style={{ marginLeft: 5, marginTop: 5, flexDirection: 'row', width: Metrics.screenWidth * 0.7 }}>
										<View style={{ flexDirection: 'row', marginTop: 5, }}>
											<View style={{ backgroundColor: color.txtColor, borderRadius: 10, paddingHorizontal: 10, alignItems: 'center' }}>
												<Text style={styles.inviteCode}>{item.rewardType == 1 ? '现金' : item.rewardType == 2 ? '糖果' : 'USDT'}</Text>
											</View>
											<View style={{ marginLeft: 5, backgroundColor: color.txtColor, borderRadius: 10, paddingHorizontal: 10, alignItems: 'center' }}>
												<Text style={styles.inviteCode}>{interception(item.project, 5)}</Text>
											</View>
											<View style={{ marginLeft: 5, backgroundColor: color.txtColor, borderRadius: 10, paddingHorizontal: 10, alignItems: 'center' }}>
												<Text style={styles.inviteCode}>{item.cateId == 1 ? '下载APP' : item.cateId == 2 ? '账号注册' : item.cateId == 3 ? '认证绑卡' : '其他'}</Text>
											</View>
										</View>
									</View>
								</TouchableOpacity>
								)
							}
						}
						refreshState={this.state.refreshState}
						onHeaderRefresh={this.onHeaderRefresh}
						onFooterRefresh={this.onFooterRefresh}
						// 可选
						footerRefreshingText='正在玩命加载中...'
						footerFailureText='我擦嘞，居然失败了 =.=!'
						footerNoMoreDataText='暂无更多数据...'
						footerEmptyDataText='暂无更多数据...'
					/>
				</View>
				
				{this.renderPublishBar()}
			</View >
		);
	}
}
const mapStateToProps = state => ({
	logged: state.user.logged,
	userId: state.user.id,
	mobile: state.user.mobile,
});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(Block);
const styles = StyleSheet.create({
	actionButtonIcon: {
		fontSize: 20,
		height: 22,
		color: 'white',
	},
	wiper: { height: 60, overflow: "hidden", margin: 5, borderRadius: 6 },
	banner: { height: '100%', width: '100%' },
	sequenceTitle: { fontSize: 14, color: Colors.C11 },
	sequence: {
		flexDirection: 'row',
		alignItems: 'center', 
		height: 40, 
		width: Metrics.screenWidth, 
		backgroundColor: Colors.White,
	},
	searchContainer: { 
		height: 50, 
		borderTopWidth: 1,
		borderTopColor: Colors.backgroundColor,
		backgroundColor: Colors.White,
		paddingHorizontal: 20,
		paddingVertical: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	mobileText: { fontSize: 14, color: Colors.C6, fontWeight: 'bold' },
	mobileInput: { padding: 0,paddingHorizontal: 10, marginLeft: 10, borderRadius: 6, backgroundColor: Colors.C8, marginRight: 10, fontSize: 15, color: Colors.C2, flex: 1, textAlignVertical: 'center', borderWidth: 1, borderColor: Colors.C16 },
	searchIcon: { fontWeight: 'bold', color: Colors.C6, fontSize: 20 },
	inviteCode: { fontSize: 11, color: Colors.White, marginVertical: 1 },
});