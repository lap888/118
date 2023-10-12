import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import RefreshListView from 'react-native-refresh-list-view';
import Icon from 'react-native-vector-icons/AntDesign';
import { Actions } from 'react-native-router-flux';

import CurrencyApi from '../../../../api/yoyoTwo/currency/CurrencyApi';
import { Colors } from '../../../theme/Index';
import { Header } from '../../../components/Index';

export default class Accounting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: '',
            list: [],
            refreshState: false
        };
    }

    componentDidMount() {
        this.getCoinAmount(0);
        DeviceEventEmitter.addListener('refranshZiChan', () => {
            this.getCoinAmount(0);
        })
    }

    getCoinAmount = (type) => {
        CurrencyApi.getCoinAmount(type)
            .then((data) => {
                let candy = { "accountId": data.lists.length + 1, "type": "CandyDetail", "coinType": "糖果", "expenses": "--", "balance": "--", "frozen": "--", "status": 1 };
                let candyP = { "accountId": data.lists.length + 2, "type": "CandyP", "coinType": "果皮", "expenses": "--", "balance": "--", "frozen": "--", "status": 1 };
                data.lists.push(candy)
                data.lists.push(candyP)
                this.setState({
                    data: data,
                    list: data.lists,
                    refreshState: false
                })
            }).catch((err) => this.setState({ refreshState: false }))
    }

    onHeaderRefresh = () => {
        this.getCoinAmount(0)
    }
    onPressItem = (item) => {
        if (item.coinType != "糖果" && item.coinType != "果皮") {
            Actions.push('FlowDetails', { data: item, type: 'Accounting' })
        }
        else {
            Actions.push(item.type)
        }
    }
    renderItem = (item, index) => {
        if (item.status != 1) {
            return null;
        }
        return (
            <TouchableOpacity key={index} style={styles.item} onPress={() => this.onPressItem(item)}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 14, color: Colors.main, fontWeight: 'bold' }}>{item.coinType}</Text>
                    <Icon name={'right'} size={15} color={Colors.C11} />
                </View>
                <View style={{ flexDirection: 'row', marginTop: 10, flex: 1 }}>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text style={{ fontSize: 12, color: Colors.C10, }}>可用</Text>
                        <Text style={{ fontSize: 12, color: Colors.C12, marginTop: 3 }}>{item.balance}</Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', }}>
                        <Text style={{ fontSize: 12, color: Colors.C10, }}>冻结</Text>
                        <Text style={{ fontSize: 12, color: Colors.C12, marginTop: 3 }}>{item.frozen}</Text>
                    </View>
                    {/* <View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
                        <Text style={{fontSize: 12, color: Colors.C10, }}>折合(USDT)</Text>
                        <Text style={{fontSize: 12, color: Colors.C12, marginTop: 3}}>{item.usPric}</Text>
                    </View> */}
                </View>
            </TouchableOpacity>
        )
    }

    keyExtractor = (item, index) => {
        return index.toString()
    }

    render() {
        const { data, list } = this.state;
        return (
            <View style={styles.container}>
                <Header title={'账务'} />
                <View style={styles.list}>
                    <RefreshListView
                        data={list}
                        keyExtractor={this.keyExtractor}
                        renderItem={({ item, index }) => this.renderItem(item, index)}
                        refreshState={this.state.refreshState}
                        onHeaderRefresh={this.onHeaderRefresh}
                        // onFooterRefresh={this.onFooterRefresh}
                        // 可选
                        footerRefreshingText='正在玩命加载中...'
                        footerFailureText='我擦嘞，居然失败了 =.=!'
                    // footerNoMoreDataText='暂无更多数据...'
                    // footerEmptyDataText='暂无更多数据...'
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.White,
    },
    list: {
        flex: 1,
        backgroundColor: Colors.C8,
    },
    item: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.C13,
        paddingHorizontal: 10
    },
})
