import React, { Component } from 'react';
import { View, Image, Text, StyleSheet, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import RefreshListView, { RefreshState } from 'react-native-refresh-list-view';
import { Send } from '../../../utils/Http';
import { Header } from '../../components/Index';
import LinearGradient from 'react-native-linear-gradient';

import { Colors, Metrics } from '../../theme/Index';

export default class BuyCandyBang extends Component {
    constructor(props) {
        super(props);
        this.state = {
            transactionList: [],
            totalPage: 0,
            order: 'dayBang',
            type: 0
        };
    }
    componentDidMount() {
        this.onHeaderRefresh();
    }
    onRightPress() {
        Send(`api/system/CopyWriting?type=buy_candy_bang_rule`, {}, 'get').then(res => {
            Actions.push('CommonRules', { title: '冲榜规则', rules: res.data });
        });
    }
    onHeaderRefresh = () => {
        this.setState({ refreshState: RefreshState.HeaderRefreshing, pageIndex: 1 })

        Send(`api/System/ShareRanking?type=${this.state.type}`, {}, 'get').then(res => {
            if (res.code == 200) {
                this.setState({
                    transactionList: res.data,
                    refreshState: res.data.length < 1 ? RefreshState.EmptyData : RefreshState.Idle
                })
            } else {
                this.setState({
                    transactionList: [],
                    totalPage: 0,
                    refreshState: RefreshState.EmptyData
                })
            }
        });
    }
    renderTransaction() {
        return (
            <RefreshListView
                data={this.state.transactionList}
                keyExtractor={this.keyExtractor}
                renderItem={({ item, index }) =>
                    <View style={Styles.miningItem}>
                        <View style={Styles.miningItemHeader}>
                            <Image style={{ width: 50, height: 50, borderRadius: 25 }} source={{ uri: item.headImg }} />
                            <View style={{ marginLeft: 10 }}>
                                <Text style={Styles.miningItemActivity}>{`排名:${item.rank}`}</Text>
                                <Text style={Styles.miningItemName}>{`手机号:${item.mobile}`}</Text>
                                <Text style={Styles.miningItemActivity}>{`昵称:${item.nick}`}</Text>
                                <Text style={Styles.miningItemGemin}>{`分享广告有效点击次数:${item.shareCount}次`}</Text>
                            </View>
                        </View>
                    </View>
                }
                refreshState={this.state.refreshState}
                onHeaderRefresh={this.onHeaderRefresh}
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
    /**
   * 排序条件变更
   * @param {*} key 
   */
    onChangeSequence(key) {
        let { order } = this.state;
        let newOrder = order;
        let type = 0;
        if (order !== key) {
            newOrder = key;
        }
        if (key == 'dayBang') {
            type = 0
        } else {
            type = 1;
        }
        this.setState({ order: newOrder, type: type }, () => {
            this.onHeaderRefresh();
        });
    }
    render() {
        const YoTaskTitle = [
            { key: 'dayBang', title: '日排行' },
            { key: 'monthBang', title: '月排行' },
        ]
        let { order } = this.state;
        return (
            <View style={{ flex: 1, backgroundColor: Colors.backgroundColor }}>
                <Header title="分享排行榜" rightText="规则" onRightPress={() => this.onRightPress()} />
                <View style={Styles.sequence}>
                    {YoTaskTitle.map(item => {
                        let { key, title } = item;
                        let itemSelected = order === key;
                        return (
                            <TouchableWithoutFeedback key={key} onPress={() => this.onChangeSequence(key)}>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={itemSelected ? Styles.sequenceTitleed : Styles.sequenceTitle }>{title}</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        )
                    })}
                </View >
                {/* <View style={{ padding: 5, }}>
                    <Image style={{ width: '100%', height: 160, overflow: "hidden", borderRadius: 6 }} source={require('../../images/dayBuyBang.jpg')} />
                </View> */}
                {this.renderTransaction()}
            </View>

        );
    }
}

const Styles = StyleSheet.create({
    transactionContainer: { left: 15, marginBottom: 10 },
    sequenceTitle: { fontSize: 14, color: Colors.C11 },
    sequenceTitleed: { fontSize: 16, color: Colors.main },
    sequence: {
        flexDirection: 'row', 
        alignItems: 'center', 
        height: 50, 
        width: Metrics.screenWidth, 
        backgroundColor: Colors.White
    },
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


    miningItem: { margin: 10, marginBottom: 0, backgroundColor: Colors.White, borderRadius: 5, padding: 15 },
    miningItemHeader: { flexDirection: 'row', alignItems: 'center' },
    miningItemName: { fontSize: 14, color: Colors.C16, marginLeft: 5 },
    miningItemActivity: { fontSize: 14, color: Colors.C16, marginLeft: 5 },
    miningItembody: { marginTop: 10, flexDirection: 'row' },
    miningItemGemin: { fontSize: 14, color: Colors.C16, marginLeft: 5 },
    miningItemGemout: { fontSize: 14, color: Colors.C16, marginLeft: 5 },
    miningItemTime: { marginTop: 6, fontSize: 14, color: '#ffffff', width: 320 },
    miningItemFooter: { alignSelf: 'flex-end', justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderWidth: 1, borderColor: '#ffffff', padding: 18, paddingTop: 10, paddingBottom: 10 },
    miningItemExchange: { fontSize: 18, color: '#ffffff' },
});
