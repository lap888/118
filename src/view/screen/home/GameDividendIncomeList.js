/*
 * @Author: top.brids 
 * @Date: 2019-12-31 11:37:41 
 * @Last Modified by: top.brids
 * @Last Modified time: 2021-06-25 14:20:48
 */
import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { BoxShadow } from 'react-native-shadow';
import { Toast } from 'native-base';
import { Header, EmptyComponent, ShowMore } from '../../components/Index';
import { Metrics, Colors } from '../../theme/Index';
import RefreshListView, { RefreshState } from 'react-native-refresh-list-view';
import { Send } from '../../../utils/Http';
class GameDividendIncomeList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstLoading: true,
            loadingMore: false,
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0,
            withdrawList: [],
        }
    }
    componentDidMount() {
        this.onHeaderRefresh();
    }

    // /**
    //  * 渲染分红提现Item
    //  * @param {*} param0 
    //  */
    // renderItem(item) {
    //     const shadowOpt = {
    //         height: 70,
    //         width: Metrics.screenWidth - 20,
    //         color: Colors.C6,
    //         border: 2,
    //         radius: 6,
    //         opacity: 0.2,
    //         x: 0,
    //         y: 0,
    //         style: Styles.transactionContainer
    //     }
    //     let { recordId, preChange, incurred, postChange, modifyDesc, modifyType, modifyTime } = item;
    //     return (
    //         // <BoxShadow setting={shadowOpt}>
    //         <View style={Styles.diamondCard}>
    //             <View style={[Styles.labelView]}>
    //                 <Text style={Styles.labelTxt}>{modifyDesc}</Text>
    //                 <Text style={Styles.diamondTime}>{modifyTime}</Text>
    //             </View>
    //             <View style={[Styles.diamondNumView]}>
    //                 <Text style={postChange > 0 ? Styles.diamondNumTxt : Styles.diamondNumTxt2}>{`${incurred.toFixed(4)}`} </Text>
    //                 <Text style={Styles.diamondTime} numberOfLines={3}>余额：{postChange.toFixed(4)}</Text>
    //             </View>
    //         </View>
    //         // </BoxShadow>
    //     )
    // }

    renderItem = (item ) => {
        return (
            <View key={item.id} style={Styles.item}>
                <View style={{ justifyContent: 'center' }}>
                    <Text style={{ fontSize: 14 }} numberOfLines={2}>{item.modifyDesc}</Text>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 5, flex: 1 }}>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: 12, color: Colors.C10, }}>数量:  </Text>
                            <Text style={{ fontSize: 12, color: Colors.C12 }}>{item.incurred}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: 12, color: Colors.C10, }}>剩余:  </Text>
                            <Text style={{ fontSize: 12, color: Colors.C12 }}>{item.postChange}</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 12, color: Colors.C10, }}>时间</Text>
                        <Text style={{ fontSize: 12, color: Colors.C12, marginTop: 3 }}>{item.modifyTime}</Text>
                    </View>
                </View>
            </View>
        )
    }


    onHeaderRefresh = () => {
        this.setState({ refreshState: RefreshState.HeaderRefreshing, pageIndex: 1 })
        let params = {
            pageIndex: 1,
            pageSize: this.state.pageSize
        }
        Send('api/Account/WallerRecord', params).then(res => {
            if (res.code == 200) {
                this.setState({
                    withdrawList: res.data,
                    totalPage: res.recordCount,
                    refreshState: res.data.length < 1 ? RefreshState.EmptyData : RefreshState.Idle
                })
            } else {
                this.setState({
                    withdrawList: [],
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
                pageSize: that.state.pageSize
            }
            Send('api/Account/WallerRecord', params).then(res => {
                if (res.code == 200) {
                    this.setState({
                        withdrawList: that.state.withdrawList.concat(res.data),
                        totalPage: res.recordCount,
                        refreshState: this.state.withdrawList.length >= this.state.totalPage ? RefreshState.EmptyData : RefreshState.Idle,
                    })
                } else {
                    this.setState({
                        withdrawList: [],
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
    render() {
        return (
            <View style={Styles.containr}>
                <Header title="钱包流水" />
                <RefreshListView
                    data={this.state.withdrawList}
                    keyExtractor={this.keyExtractor}
                    renderItem={({ item }) => this.renderItem(item)}
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
        );
    }
}
const Styles = StyleSheet.create({
    containr: { flex: 1, backgroundColor: Colors.White },
    failReason: { marginTop: 4, fontSize: 15, color: 'red' },
    transactionContainer: { left: 10, marginTop: 10 },
    verticalLine: { height: 35, width: 3, borderRadius: 3, backgroundColor: Colors.C1 },
    diamondCard: {
        height: 65,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: Colors.backgroundColor,
        marginHorizontal: 5,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    labelView: {
        flex: 1,
        marginLeft: 12
    },
    item: {
        paddingVertical: 10, 
        borderBottomWidth: 1, 
        borderBottomColor: Colors.C13, 
        paddingHorizontal: 10
    },
    labelTxt: { fontSize: 13, color: Colors.C0 },
    diamondTime: { marginTop: 8, fontSize: 13, color: Colors.C2, marginRight: 5 },
    diamondNumView: {
        alignItems: "flex-end"
    },
    diamondNumTxt: {
        fontSize: 13,
        color: Colors.C6,
        flexWrap: "wrap",
        marginRight: 5
    },
    diamondNumTxt2: {
        fontSize: 13,
        color: Colors.C16,
        flexWrap: "wrap",
        marginRight: 5
    }
});


const mapStateToProps = state => ({
    userId: state.user.id,
});

export default connect(mapStateToProps, {})(GameDividendIncomeList);