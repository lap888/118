/*
 * @Author: top.brids 
 * @Date: 2020-01-06 12:01:57 
 * @Last Modified by: top.brids
 * @Last Modified time: 2021-11-25 16:39:30
 */

import React, { Component } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Keyboard
} from 'react-native';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import RefreshListView, { RefreshState } from 'react-native-refresh-list-view';
import { Metrics, Colors } from '../../theme/Index';
import { Send } from '../../../utils/Http';
import { Toast } from '../../common';
class PurchasePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listData: [],
            modalCancleButListVisible: false,
            tradePwd: "",
            itemId: null,
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0,
            optionLoading: false,
        };
    }
    componentDidMount() {
        this.onHeaderRefresh();
    }
    onHeaderRefresh = () => {
        this.setState({ refreshState: RefreshState.HeaderRefreshing, pageIndex: 1 })
        let params = {
            pageIndex: 1,
            status: 1,
            pageSize: this.state.pageSize,
            Sale: 'BUY'
        }
        Send('api/Trade/MyTradeList', params).then(res => {
            if (res.code == 200) {
                this.setState({
                    listData: res.data,
                    totalPage: res.recordCount,
                    refreshState: res.data.length < 1 ? RefreshState.EmptyData : RefreshState.Idle
                })
            } else {
                this.setState({
                    listData: [],
                    totalPage: 0,
                    refreshState: RefreshState.EmptyData
                })
            }
        });
    }

    onFooterRefresh = () => {
        let that = this;
        that.setState({
            refreshState: RefreshState.FooterRefreshing,
            pageIndex: this.state.pageIndex + 1
        }, () => {
            let params = {
                pageIndex: that.state.pageIndex,
                status: 1,
                pageSize: that.state.pageSize,
                Sale: 'BUY'
            }
            Send('api/Trade/MyTradeList', params).then(res => {
                if (res.code == 200) {
                    this.setState({
                        listData: that.state.listData.concat(res.data),
                        totalPage: res.recordCount,
                        refreshState: this.state.listData.length >= this.state.totalPage ? RefreshState.EmptyData : RefreshState.Idle,
                    })
                } else {
                    this.setState({
                        listData: [],
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
     * 取消下架线上买单
     */
    cancleObtainedBuyTransaction() {
        this.setState({ modalCancleButListVisible: false, tradePwd: "" });
    }
    /**
     * 确定下架线上买单
     */
    confirmObtainedBuyTransaction() {
        Keyboard.dismiss();
        if (this.state.tradePwd.trim() === "") return;
        var that = this;
        if (!that.state.optionLoading) that.setState({ optionLoading: true });

        Send(`api/Trade/CancleTrade?orderNum=${this.state.itemId}&tradePwd=${this.state.tradePwd}`, {}, 'get').then(res => {
            if (res.code == 200) {
                this.onHeaderRefresh();
                that.setState({ itemId: null, modalCancleButListVisible: false, tradePwd: "" });
            }
            Toast.tipBottom(res.code == 200 ? "买单下架成功" : res.message)
            // 关闭发布状态
            that.setState({ optionLoading: false });
        });
    }
    /**
     * 渲染下架买单Form表单
     */
    renderModalCancleBuyList() {
        let { modalCancleButListVisible, tradePwd, optionLoading } = this.state;
        return (
            <Modal animationType='slide' visible={modalCancleButListVisible} transparent onRequestClose={() => { }}>
                <View style={{ flex: 1, backgroundColor: 'transparent' }}>
                    <View style={Styles.modalBody}>
                        <View style={{ marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={Styles.publishBuy}>下架买单</Text>
                        </View>
                        <View style={[Styles.modalBodyPrice, { marginTop: 40 }]}>
                            <View style={Styles.modalBodyLeft}>
                                <Text style={Styles.price}>交易密码</Text>
                            </View>
                            <View style={Styles.modalBodyRight}>
                                <View style={Styles.textInputContainer}>
                                    <TextInput style={Styles.publishTextInput} secureTextEntry placeholder="请输入交易密码" placeholderTextColor={Colors.White} underlineColorAndroid="transparent" keyboardType="numeric"
                                        value={tradePwd}
                                        onChangeText={tradePwd => this.setState({ tradePwd })}
                                        returnKeyType="done"
                                        onSubmitEditing={() => this.confirmObtainedBuyTransaction()}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={Styles.modalFooter}>
                            <TouchableOpacity disabled={optionLoading} onPress={() => this.cancleObtainedBuyTransaction()}>
                                <View style={[Styles.publishConfirm, { backgroundColor: Colors.exchangeInput }]}>
                                    <Text style={Styles.publishConfirmText}>取消</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity disabled={optionLoading} onPress={() => this.confirmObtainedBuyTransaction()}>
                                <View style={[Styles.publishConfirm, { backgroundColor: Colors.C6 }]}>
                                    <Text style={Styles.publishConfirmText}>{optionLoading ? '下架中...' : '确定'}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={Styles.modalHeader} />
                </View>
            </Modal>
        )
    }
    /**
     * 取消买单
     * @param {*} item 
     */
    onPressCancle(item) {
        this.setState({
            modalCancleButListVisible: true,
            itemId: item.id,
        });
    }
    renderItem(item) {
        return (
            <View style={Styles.purchaseItemContainer}>
                <View style={Styles.purchaseItemView}>
                    <View style={Styles.purchaseLabel}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={Styles.text}>{`订单号: `}</Text>
                            <Text style={[Styles.text, { fontWeight: 'bold' }]}>{item.tradeNumber}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={Styles.text}>{`类型: `}</Text>
                            <Text style={[Styles.text,]}>{item.orderType}</Text>
                        </View>
                        <View style={{ flexDirection: 'row'}}>
                            <Text style={[Styles.text]}>{`单价: `}</Text>
                            <Text style={Styles.text}>{`￥${item.price}`}</Text>
                            <Text style={[Styles.text, { marginLeft: 50 }]}>{`数量: `}</Text>
                            <Text style={Styles.text}>{item.amount}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={{ flex: 3 }} onPress={() => { this.onPressCancle(item) }}>
                        <LinearGradient colors={[Colors.btnBeforColor, Colors.btnAfterColor]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={Styles.cancleView}>
                            <Text style={Styles.cancleTxt}>取消</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    render() {
        return (
            <View style={Styles.container}>
                <RefreshListView
                    data={this.state.listData}
                    keyExtractor={this.keyExtractor}
                    renderItem={({ item, index }) => this.renderItem(item)}
                    refreshState={this.state.refreshState}
                    onHeaderRefresh={this.onHeaderRefresh}
                    onFooterRefresh={this.onFooterRefresh}
                    // 可选
                    footerRefreshingText='正在玩命加载中...'
                    footerFailureText='我擦嘞，居然失败了 =.=!'
                    footerNoMoreDataText='暂无更多数据...'
                    footerEmptyDataText='暂无更多数据...'
                />
                {this.renderModalCancleBuyList()}
            </View>
        );
    }
}
const mapStateToProps = state => ({
    logged: state.user.logged,
    userId: state.user.id,
    level: state.user.level,
    golds: state.user.golds,
});

const mapDispatchToProps = () => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(PurchasePage);

const Styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.C8, },
    transactionContainer: { left: 10, marginTop: 10 },
    purchaseItemContainer: {
        height: 75,
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: Colors.C8,
        paddingTop: 19,
        paddingBottom: 19,
        // borderRadius: 6,
        margin: 1,
        borderBottomWidth: 1,
        borderColor: Colors.LightGrey,
    },
    purchaseItemView: {
        flex: 1,
        flexDirection: "row",
        alignItems: 'center',
    },
    verticalLine: {
        height: 25,
        width: 6.5,
    },
    purchaseLabel: {
        flex: 7,
        marginLeft: 6,
    },
    cancleView: {
        alignSelf: 'flex-end',
        justifyContent: 'center',
        marginRight: 15,
        backgroundColor: Colors.C6,
        borderRadius: 6,
        height: 40,
        width: 60,
    },
    text: {
        fontSize: 14,
        color: Colors.C0
    },
    cancleTxt: {
        color: "#ffffff",
        fontSize: 14,
        textAlign: "center"
    },

    modalBody: { paddingTop: Metrics.PADDING_BOTTOM, flexDirection: "column", justifyContent: 'flex-end', backgroundColor: Colors.exchangeBg, width: Metrics.screenWidth },
    publishBuy: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
    currentPrice: { color: Colors.White, marginTop: 20, fontSize: 14, },
    modalBodyPrice: { marginTop: 12, flexDirection: 'row', alignItems: 'center' },
    modalBodyLeft: { width: Metrics.screenWidth * 0.3, alignItems: 'flex-end' },
    modalBodyRight: { width: Metrics.screenWidth * 0.7, alignItems: 'flex-start' },
    textInputContainer: { marginLeft: 10, paddingLeft: 8, width: Metrics.screenWidth * 0.7 * 0.8, height: 40, borderRadius: 6, backgroundColor: Colors.exchangeInput },
    publishTextInput: { flex: 1, color: Colors.White },
    modalFooter: { flexDirection: 'row', marginTop: 20 },
    publishConfirm: { height: 60, width: Metrics.screenWidth * 0.5, justifyContent: 'center', alignItems: 'center' },
    publishConfirmText: { fontSize: 16, color: '#FFFFFF', fontWeight: 'bold' },
    price: {
        fontSize: 14,
        color: Colors.White
    },
});