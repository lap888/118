import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import RefreshListView, { RefreshState } from 'react-native-refresh-list-view';
import { Actions } from 'react-native-router-flux';
import CurrencyApi from '../../../../api/yoyoTwo/currency/CurrencyApi';
import { Header } from '../../../components/Index';
import { Colors } from '../../../theme/Index';

export default class Browser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: '',
            dataList: [],
            pageIndex: 1,
            pageSize: 20,
            hash: ''
        };
    }

    componentDidMount() {
        this.onHeaderRefresh();
    }

    getData = () => {
        const { dataList, pageIndex, pageSize, hash } = this.state;
        CurrencyApi.blockBrowser(hash, pageIndex, pageSize)
            .then((data) => {
                this.setState({
                    data: data.headerData,
                    dataList: pageIndex === 1 ? data.records : dataList.concat(data.records),
                    refreshState: data.records < pageSize ? RefreshState.EmptyData : RefreshState.Idle,
                })
            }).catch((err) => this.setState({ dataList: [], refreshState: RefreshState.EmptyData}))
    }
    onHeaderRefresh = () => {
        this.setState({ refreshState: RefreshState.HeaderRefreshing, pageIndex: 1 }, () => {
            this.getData()
        });
    }

    onFooterRefresh = () => {
        this.setState({ refreshState: RefreshState.FooterRefreshing, pageIndex: this.state.pageIndex + 1 }, () => {
            this.getData()
        });
    }

    render() {
        const { data } = this.state;
        return (
            <View style={{flex: 1, backgroundColor: Colors.main,}}>
                <Header title={'浏览器'} />
                <View style={{height: 150, paddingTop: 10, paddingHorizontal: 15}}>
                    <View style={{flex: 1, flexDirection: 'row' }}>
                        <View style={{flex: 1, alignItems: 'center'}}>
                            <Text style={{fontSize: 14, color: Colors.White}}>区块高度</Text>
                            <Text style={{fontSize: 25, color: Colors.White, marginTop: 10, fontStyle: 'italic'}}>{data.blockHeight}</Text>
                        </View>
                        <View style={{flex: 1, alignItems: 'center'}}>
                            <Text style={{fontSize: 14, color: Colors.White}}>今日出块</Text>
                            <Text style={{fontSize: 25, color: Colors.White, marginTop: 10, fontStyle: 'italic'}}>{data.todayBlock}</Text>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', height: 60}}>
                        <View style={{flex: 1, alignItems: 'center'}}>
                            <Text style={{fontSize: 14, color: Colors.White}}>交易总量</Text>
                            <Text style={{fontSize: 16, color: Colors.White, marginTop: 5}}>{data.tTotal}</Text>
                        </View>
                        <View style={{flex: 1, alignItems: 'center'}}>
                            <Text style={{fontSize: 14, color: Colors.White}}>黑洞销毁</Text>
                            <Text style={{fontSize: 16, color: Colors.White, marginTop: 5}}>{data.blackXx}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ flex: 1, marginHorizontal: 10, backgroundColor: Colors.White, borderRadius: 5 }}>
                    <RefreshListView
                        data={this.state.dataList}
                        keyExtractor={(item, index) => index + ''}
                        renderItem={({ item, index }) => {
                            return (
                                <TouchableOpacity style={styles.item} onPress={() => Actions.push('BrowserDetail', { data: item })}>
                                    <View style={{width: 50, justifyContent: 'center', alignItems: 'center'}} >
                                        <Text style={{fontSize: 14, color: Colors.activeTintColor}} >{item.tId}</Text>
                                    </View>
                                    <Text style={{flex: 1, marginLeft: 10, color: Colors.fontColor}} numberOfLines={1}>{item.tHash}</Text>
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
            </View>
        );
    }
}

const styles = StyleSheet.create({
    item: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.backgroundColor 
    },
})