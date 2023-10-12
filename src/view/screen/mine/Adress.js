import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, DeviceEventEmitter } from 'react-native';
import { Actions } from 'react-native-router-flux';
import RefreshListView, { RefreshState } from 'react-native-refresh-list-view';
import { Header } from '../../components/Index';
import { Colors, Metrics } from '../../theme/Index';
// import { Toast } from 'native-base';
import { Send } from '../../../utils/Http';
import LinearGradient from 'react-native-linear-gradient';
import { Toast } from '../../common';

export default class Adress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            adressList: [],
            type: this.props.type
        };
    }

    componentDidMount() {
        this.onHeaderRefresh();
    }

    onRightPress = () => {
        this.onHeaderRefresh();
    }
    
    onPressAdd = () => {
        Actions.push('AddAdress', { ty: 'add', adress: '' });
    }
    onHeaderRefresh = () => {
        this.setState({ refreshState: RefreshState.HeaderRefreshing, pageIndex: 1 })

        Send('api/UserAddress/List', {}, 'get').then(res => {
            if (res.code == 200) {
                this.setState({
                    adressList: res.data,
                    refreshState: res.data.length < 1 ? RefreshState.EmptyData : RefreshState.Idle
                })
            } else {
                this.setState({
                    adressList: [],
                    totalPage: 0,
                    refreshState: RefreshState.EmptyData
                })
            }
        });
    }
    setDefault = (item) => {
        Send(`api/UserAddress/Set?id=${item.id}`, {}, 'get').then(res => {
            Toast.show({
                text: res.message,
                position: "top",
                textStyle: { textAlign: "center" },
            });
            this.onHeaderRefresh();
        });
    }
    setModify = (item) => {
        Actions.push('AddAdress', { ty: 'modify', adress: item });
    }
    setDel = (item) => {
        Send(`api/UserAddress/Del?id=${item.id}`, {}, 'get').then(res => {
            Toast.show({
                text: res.message,
                position: "top",
                textStyle: { textAlign: "center" },
            });
            this.onHeaderRefresh();
        });
    }
    setAddress = (data) => {
        if (this.state.type === 'order') {
            DeviceEventEmitter.emit('setAddress', data)
            Actions.pop();
        }
    }
    renderTransaction() {
        return (
            <RefreshListView
                data={this.state.adressList}
                keyExtractor={this.keyExtractor}
                renderItem={({ item, index }) =>
                    <View style={Styles.miningItem}>
                        <TouchableOpacity onPress={() => this.setAddress(item)}>
                            <View style={Styles.miningItemHeader}>
                                <View style={{ marginLeft: 10, flexDirection: 'row' }}>
                                    <Text style={Styles.miningItemActivity}>{`${item.name}`}</Text>
                                    <Text style={Styles.miningItemActivity}>{`${item.phone}`}</Text>
                                    <Text style={{ color: Colors.C6, marginLeft: 10 }}>{`${item.isDefault == 0 ? '' : '默认'}`}</Text>
                                </View>
                            </View>
                            <View style={Styles.miningItemHeader}>
                                <View style={{ marginLeft: 10, flexDirection: 'row', flexWrap: 'wrap' }}>
                                    <Text style={Styles.miningItemGemout}>{`${item.province}`}</Text>
                                    <Text style={Styles.miningItemGemout}>{`${item.city}`}</Text>
                                    <Text style={Styles.miningItemGemout}>{`${item.area}`}</Text>
                                    <Text style={Styles.miningItemGemout}>{`${item.address}`}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <View style={Styles.miningItemHeader}>
                            <View style={{ marginLeft: 10, marginTop: 10, flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => this.setDefault(item)} style={Styles.itemBtnBottom}>
                                    <Text style={{ fontSize: 12 }}>设为默认</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.setModify(item)} style={Styles.itemBtnBottom}>
                                    <Text style={{ fontSize: 12 }}>修改</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.setDel(item)} style={Styles.itemBtnBottom}>
                                    <Text style={{ fontSize: 12 }}>删除</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
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
        )
    }
    keyExtractor = (item, index) => {
        return index.toString()
    }
    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.backgroundColor }}  >
                <Header title="地址管理" rightText="刷新" onRightPress={() => this.onRightPress()} />
                <View style={{ flex: 1}}>
                    {this.renderTransaction()}
                </View>
                <TouchableOpacity
                    onPress={() => this.onPressAdd()}
                    style={{ height: 40, backgroundColor: Colors.main, justifyContent: 'center', alignItems: 'center', borderRadius: 2 }}>
                    <Text style={{ fontSize: 16, color: Colors.White }}>新增收货地址</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }
}

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
    itemBtnBottom: { borderWidth: 1, borderColor: Colors.C6, borderRadius: 10, paddingHorizontal: 10, height: 20, justifyContent: 'center', alignItems: 'center' },

    miningItem: { margin: 10, marginBottom: 0, backgroundColor: Colors.White, borderRadius: 5, padding: 15 },
    miningItemHeader: { flex: 1, flexDirection: 'row', alignItems: 'center' },
    miningItemName: { fontSize: 14, color: Colors.C16, marginLeft: 5 },
    miningItemActivity: { fontSize: 14, color: Colors.C16, marginLeft: 5 },
    miningItembody: { marginTop: 10, flexDirection: 'row' },
    miningItemGemin: { fontSize: 14, color: Colors.C16, marginLeft: 5 },
    miningItemGemout: { fontSize: 14, marginLeft: 5 },
    miningItemTime: { marginTop: 6, fontSize: 14, color: '#ffffff', width: 320 },
    miningItemFooter: { alignSelf: 'flex-end', justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderWidth: 1, borderColor: '#ffffff', padding: 18, paddingTop: 10, paddingBottom: 10 },
    miningItemExchange: { fontSize: 18, color: '#ffffff' },
});
