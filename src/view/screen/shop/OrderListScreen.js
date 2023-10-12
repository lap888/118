import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, DeviceEventEmitter } from 'react-native';
import RefreshListView, { RefreshState } from 'react-native-refresh-list-view';
import { Actions } from 'react-native-router-flux';
import { OrderApi } from '../../../api';
import { Header } from '../../components/Index';
import { Colors, Metrics } from '../../theme/Index';

export default class OrderListScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectTab: 2,
			pageIndex: 1,
            pageSize: 10,
            dataList: []
        };
    }
    componentDidMount() {
        this.getOrderList()
        this.addListener = DeviceEventEmitter.addListener('refranshOrder', () => {
            this.onHeaderRefresh()
        })
    }

    componentWillUnmount() {
        this.addListener.remove()
    }

    getOrderList = () => {
        const { selectTab, pageIndex, pageSize } = this.state;
        OrderApi.getOrderList({Status: selectTab, PageIndex: pageIndex, PageSize: pageSize,})
        .then((data) => {
            this.setState({
                dataList: pageIndex <= 1 ? data : this.state.dataList.concat(data),
                refreshState: data.length < this.state.pageSize ? RefreshState.EmptyData : RefreshState.Idle
            })
        }).catch((err) => {
			this.setState({
				goodsList: [],
				refreshState: RefreshState.EmptyData
			})
        })
    }

	onHeaderRefresh = () => {
		this.setState({ refreshState: RefreshState.HeaderRefreshing, pageIndex: 1 }, () => {
            this.getOrderList();
		});
	}

	onFooterRefresh = () => {
		this.setState({
			refreshState: RefreshState.FooterRefreshing,
			pageIndex: this.state.pageIndex + 1
		}, () => {
            this.getOrderList();
		});
    }
    
    selectTab = (key) => {
        this.setState({selectTab: key, pageIndex: 1 }, () => {
            this.getOrderList()
        })
    }

    renderHeaderComponent() {
		const orderTab = [
			{ key: 2, title: '待发货' },
			{ key: 3, title: '待收货' },
			{ key: 4, title: '已完成' },
			{ key: 1, title: '已取消' },
		]
		let { selectTab } = this.state;
		return (
            <View style={styles.sequence}>
                {orderTab.map((item, index) => {
                    return (
                        <TouchableOpacity key={index} style={styles.tabItem} onPress={() => this.selectTab(item.key)}>
                            <Text style={[styles.sequenceTitle, { color: selectTab == item.key ? Colors.main : Colors.C11 }]}>{item.title}</Text>
                        </TouchableOpacity>
                    )
                })}
            </View >
		)
	}

    render() {
        return (
            <View style={{flex: 1, backgroundColor: Colors.backgroundColor}}>
                <Header title={'我的订单'} />
                {this.renderHeaderComponent()}
                <View style={{flex: 1}}>
					<RefreshListView
						data={this.state.dataList}
						keyExtractor={(item, index) =>  index + item.orderNum + '1'}
						renderItem={({ item, index }) => {
                            // 0 未支付 1 取消 2 支付成功 3 已发货 4 确认收货 5 申请退款 6 订单完成
                            let status = '';
                            switch (item.status) {
                                case 0: status = '未支付'; break;
                                case 1: status = '已取消'; break;
                                case 2: status = '待发货'; break;
                                case 3: status = '已发货'; break;
                                case 4: status = '已收货'; break;
                                case 5: status = '退款'; break;
                                case 6: status = '已完成'; break;
                                default: break;
                            }
							return (
                                <View key={index} style={styles.item}>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 5}}>
                                        <Text style={{fontSize: 12}} selectable={true}>订单号: {item.orderNum}</Text>
                                        <Text  style={{fontSize: 12, color: Colors.main}}>{status}</Text>
                                    </View>
                                    <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => Actions.push('OrderDetail', { data: item }) }>
                                        <Image style={{width: 60, height: 60}} source={{uri: item.shopPic}} />
                                        <View style={{ flex: 1, marginLeft: 10}}>
                                            <Text style={{fontSize: 14,flex: 1 }} numberOfLines={2}>{item.name}</Text>
                                            <View style={{flexDirection: 'row', }}>
                                                <Text style={{fontSize: 14, flex: 1}} >x {item.count}</Text>
                                                <Text style={{fontSize: 14, color: Colors.main }} >{item.totalPrice} GC</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )
						}}
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
            </View>
        );
    }
}

const styles = StyleSheet.create({
    sequenceTitle: { fontSize: 14, color: Colors.C11 },
	sequence: {
		flexDirection: 'row',
		alignItems: 'center', 
		height: 40, 
		width: Metrics.screenWidth, 
		backgroundColor: Colors.White,
    },
    tabItem: {
        height: 40,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    item: {
        // flexDirection: 'row',
        marginHorizontal: 10,
        marginTop: 10,
        backgroundColor: Colors.White,
        borderRadius: 5,
        padding: 10
    },
})
