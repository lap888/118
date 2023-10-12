import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Keyboard } from 'react-native';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import RefreshListView, { RefreshState } from 'react-native-refresh-list-view';
import { Actions } from 'react-native-router-flux';
import CurrencyApi from '../../../../api/yoyoTwo/currency/CurrencyApi';
import { Header, SelectTopTab2, AllUserListItem } from '../../../components/Index';
import { Colors } from '../../../theme/Index';
import LinearGradient from 'react-native-linear-gradient';
import { Send } from '../../../../utils/Http';
import Icon from "react-native-vector-icons/Ionicons";
const TOPTABLIST = [
    { key: 0, name: '资产账簿' },
    { key: 1, name: '交易查询' }
]
const TRANSACTION_SEQUENCE = [
    { key: 0, title: '钻石' },
    { key: 1, title: 'GC' }
];
export default class Browser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: '',
            dataList: [],
            teamList: [],
            pageIndex: 1,
            pageSize: 20,
            hash: '',
            selectTap: 0,
            totalPage: 0,
            blockAdress: '',
            searchText: '',
            coinType: 0,
            order: 'desc'
        };
    }

    componentDidMount() {
        this.onHeaderRefresh1()
    }

    getData = (type) => {
        const { dataList, pageIndex, pageSize, hash } = this.state;
        let _hash = hash;
        CurrencyApi.blockBrowser(type, _hash, pageIndex, pageSize)
            .then((data) => {
                this.setState({
                    data: data.headerData,
                    dataList: pageIndex === 1 ? data.records : dataList.concat(data.records),
                    refreshState: data.records < pageSize ? RefreshState.EmptyData : RefreshState.Idle,
                })
            }).catch((err) => this.setState({ dataList: [], refreshState: RefreshState.EmptyData }))
    }
    onHeaderRefresh = () => {
        this.setState({ refreshState: RefreshState.HeaderRefreshing, pageIndex: 1 }, () => {
            this.getData(1)
        });
    }

    onFooterRefresh = () => {
        this.setState({ refreshState: RefreshState.FooterRefreshing, pageIndex: this.state.pageIndex + 1 }, () => {
            this.getData(1)
        });
    }
    selectTab = (item) => {
        this.setState({ selectTap: item.key })
        if (item.key == 0) {
            this.onHeaderRefresh1()
        } else {
            this.setState({ selectTap: item.key, hash: '', blockAdress: '' })
            this.onHeaderRefresh()
        }
    }
    keyExtractor = (item, index) => {
        return index.toString()
    }
    onHeaderRefresh1 = () => {
        this.setState({ refreshState: RefreshState.HeaderRefreshing, pageIndex: 1 })
        let params = {
            pageIndex: 1,
            searchText: this.state.searchText,
            pageSize: this.state.pageSize,
            order: this.state.order,
            coinType: this.state.coinType
        }
        Send('api/AllUserInfos', params).then(res => {
            if (res.code == 200) {
                this.setState({
                    teamList: res.data.teamInfoList,
                    totalPage: res.recordCount,
                    refreshState: res.data.teamInfoList.length < 1 ? RefreshState.EmptyData : RefreshState.Idle
                })
            } else {
                this.setState({
                    teamList: [],
                    totalPage: 0,
                    refreshState: RefreshState.EmptyData
                })
            }
        });
    }

    onFooterRefresh1 = () => {
        let that = this;
        that.setState({
            refreshState: RefreshState.FooterRefreshing,
            searchText: this.state.searchText,
            pageIndex: this.state.pageIndex + 1,
            order: this.state.order,
            coinType: this.state.coinType
        }, () => {
            let params = {
                pageIndex: that.state.pageIndex,
                searchText: this.state.searchText,
                pageSize: that.state.pageSize,
                order: this.state.order,
                coinType: this.state.coinType
            }
            Send('api/AllUserInfos', params).then(res => {
                if (res.code == 200) {
                    this.setState({
                        teamList: that.state.teamList.concat(res.data.teamInfoList),
                        totalPage: res.recordCount,
                        refreshState: this.state.teamList.length >= this.state.totalPage ? RefreshState.EmptyData : RefreshState.Idle,
                    })
                } else {
                    this.setState({
                        teamList: [],
                        avatarUrl: '',
                        refreshState: RefreshState.EmptyData
                    })
                }
            });
        });
    }
    /**
     * 更新检索手机号
     */
    updateSearchText() {
        Keyboard.dismiss();
        this.setState({ refreshState: RefreshState.HeaderRefreshing, pageIndex: 1, hash: this.state.blockAdress }, () => {
            this.getData(2)
        });
    }

    /**
     * 更新检索手机号
     */
    updateSearchText2() {
        Keyboard.dismiss();
        this.setState({ refreshState: RefreshState.HeaderRefreshing, pageIndex: 1, searchText: this.state.searchText }, () => {
            this.onHeaderRefresh1()
        });
    }
    /**
    * 排序条件变更
    * @param {*} key 
    */
    onChangeSequence(key) {
        let { order, coinType } = this.state;
        let newType = coinType;
        let newOrder = order;
        if (coinType === key) {
            if (order === 'desc') {
                newOrder = 'asc';
            } else {
                newOrder = 'desc';
            }
        } else {
            newType = key;
            newOrder = 'desc';
        }
        this.setState({ order: newOrder, coinType: newType }, () => {
            this.onHeaderRefresh1();
        });
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.White }}>
                <Header title={'资产浏览'} />
                <LinearGradient colors={[Colors.main, Colors.White]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ height: 133, paddingHorizontal: 10 }}>
                    <SelectTopTab2 list={TOPTABLIST} onPress={this.selectTab} />
                </LinearGradient>
                {this.state.selectTap == 0 ?
                    <View style={{ flex: 1, marginHorizontal: 10, marginTop: -70, backgroundColor: Colors.White, borderRadius: 5 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10, marginTop: 15 }}>
                            {TRANSACTION_SEQUENCE.map(item => {
                                let { key, title } = item;
                                let itemSelected = this.state.coinType === key;
                                return (
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} key={key}>
                                        <TouchableOpacity key={key} style={{ flexDirection: 'row' }} onPress={() => this.onChangeSequence(key)}>
                                            <Text style={[{ fontSize: 14, color: Colors.C11, fontWeight: 'bold', marginRight: 2 }, { color: itemSelected ? Colors.C0 : Colors.C11 }]}>{title}</Text>
                                            <View style={{ justifyContent: 'center', marginLeft: 3 }}>
                                                {(itemSelected && this.state.order === 'desc') ?
                                                    <FontAwesome name="caret-up" color={Colors.C6} size={10} />
                                                    :
                                                    <FontAwesome name="caret-up" color={Colors.C10} size={10} />
                                                }
                                                {(itemSelected && this.state.order === 'asc') ?
                                                    <FontAwesome name="caret-down" color={Colors.C6} size={10} />
                                                    :
                                                    <FontAwesome name="caret-down" color={Colors.C10} size={10} />
                                                }
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                )
                            })}
                        </View>
                        <View style={Styles.searchContainer}>
                            <TextInput keyboardType="numeric" style={Styles.mobileInput} placeholder="请输入查询地址"
                                value={this.state.searchText}
                                onChangeText={searchText => this.setState({ searchText })}
                                onBlur={() => this.updateSearchText2()}
                            />
                            <TouchableOpacity onPress={() => Keyboard.dismiss()}>
                                <Icon name="md-search" style={Styles.searchIcon} />
                            </TouchableOpacity>
                        </View>
                        <RefreshListView
                            data={this.state.teamList}
                            keyExtractor={this.keyExtractor}
                            renderItem={({ item, index }) =>
                                <AllUserListItem
                                    index={index}
                                    coinType={this.state.coinType}
                                    item={item}
                                />
                            }
                            refreshState={this.state.refreshState}
                            onHeaderRefresh={this.onHeaderRefresh1}
                            onFooterRefresh={this.onFooterRefresh1}
                            // 可选
                            footerRefreshingText='正在玩命加载中...'
                            footerFailureText='我擦嘞，居然失败了 =.=!'
                            footerNoMoreDataText='暂无更多数据...'
                            footerEmptyDataText='暂无更多数据...'
                        />
                    </View>
                    :
                    <View style={{ flex: 1, marginHorizontal: 10, marginTop: -70, backgroundColor: Colors.White, borderRadius: 5 }}>
                        <View style={[Styles.searchContainer, { marginTop: 7 }]}>
                            {/* <Text style={Styles.mobileText}>查询</Text> */}
                            <TextInput keyboardType="numeric" style={Styles.mobileInput} placeholder="请输入查询地址"
                                value={this.state.blockAdress}
                                onChangeText={blockAdress => this.setState({ blockAdress })}
                                onBlur={() => this.updateSearchText()}
                            />
                            <TouchableOpacity onPress={() => Keyboard.dismiss()}>
                                <Icon name="md-search" style={Styles.searchIcon} />
                            </TouchableOpacity>
                        </View>
                        <Text style={{ color: Colors.Alipay, fontSize: 12, marginLeft: 20 }}>1.交易查询列表只展示最新的50条全网交易记录</Text>
                        <Text style={{ color: Colors.notice, fontSize: 12, marginLeft: 20 }}>2.输入区块地址查询,可查该地址所有记录</Text>
                        <RefreshListView
                            data={this.state.dataList}
                            keyExtractor={(item, index) => index + ''}
                            renderItem={({ item, index }) => {
                                return (
                                    <TouchableOpacity style={Styles.item} onPress={() => Actions.push('BrowserDetail', { data: item })}>
                                        <View style={{ paddingVertical: 5 }}>
                                            <Text style={{ flex: 1, marginLeft: 10, color: Colors.main, marginTop: 5 }} numberOfLines={1}>from:{item.fromAddress}</Text>
                                            <View style={{ backgroundColor: Colors.Wxpay, marginLeft: 10, height: 20, marginTop: 6, width: 25, justifyContent: 'center', alignItems: 'center', padding: 1, borderRadius: 5, marginHorizontal: 5 }}><Text style={{ color: Colors.White, fontSize: 8, }}>{item.orderType}</Text></View>
                                            {/* <Text style={{ flex: 1, marginLeft: 10, color: Colors.fontColor, marginTop: 2, color: Colors.Wxpay }} numberOfLines={1}>...</Text> */}
                                            <Text style={{ flex: 1, marginLeft: 10, color: Colors.Alipay, marginTop: 5 }} numberOfLines={1}>to:{item.toAddress}</Text>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ flex: 1, marginLeft: 10, color: Colors.notice, marginTop: 5 }} numberOfLines={1}>数量:{item.tAmount}</Text>
                                                <Text style={{ flex: 1, marginLeft: 10, color: Colors.yellow, marginTop: 5 }} numberOfLines={1}>手续费:{item.tFee}</Text>
                                            </View>

                                            <Text style={{ flex: 1, marginLeft: 10, color: Colors.fontColor, marginTop: 5 }} numberOfLines={1}>{item.tTime}</Text>
                                        </View>
                                    </TouchableOpacity>
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
                }

            </View>
        );
    }
}

const Styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.backgroundColor
    },
    searchContainer: { padding: 12, paddingTop: 2, paddingBottom: 8, borderRadius: 4, backgroundColor: Colors.C8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    mobileText: { fontSize: 15, color: Colors.C6, fontWeight: 'bold' },
    mobileInput: { padding: 8, marginLeft: 10, borderRadius: 6, backgroundColor: Colors.C8, marginRight: 10, fontSize: 15, color: Colors.C16, flex: 1, textAlignVertical: 'center', borderWidth: 1, borderColor: Colors.C16 },
    searchIcon: { fontWeight: 'bold', color: Colors.C6, fontSize: 30 },
})