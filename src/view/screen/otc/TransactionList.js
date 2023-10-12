import React, { Component } from 'react';
import { View, FlatList, InteractionManager } from 'react-native';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Toast } from 'native-base';
import RefreshListView, { RefreshState } from 'react-native-refresh-list-view';
import { ShowMore, EmptyComponent } from '../../components/Index';
import TransactionListItem from './TransactionListItem';
import { Send } from '../../../utils/Http';

class TransactionList extends Component {
    static propTypes = {
        onPressSell: PropTypes.func,
        onPressObtained: PropTypes.func,
        searchText: PropTypes.string,
    };

    static defaultProps = {
        onPressSell: () => { },
        onPressObtained: () => { },
        searchText: ""
    }
    constructor(props) {
        super(props);
        this.state = {
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0,
            transactionList: [],
        };
    }
    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.initTransactionList({ page: 1 });
        });
    }
    /**
     * 初始化交易列表
     */
    initTransactionList({ page, refreshing, searchText, sequence }) {
        if (!this.state.firstLoad) {
            if (page === 1 && refreshing) this.setState({ refreshing: true });
        }
        var that = this;
        this.page = page;
        if (that.page !== 1) that.setState({ ShowMoreLoading: true });
        let sequenceTemp = sequence || this.props.sequence;
        let order = 'price';
        let by = 'desc';
        // if (sequenceTemp.length === 2) {
        //     order = sequenceTemp[0];
        //     by = sequenceTemp[1];
        // }
        setTimeout(() => {
            if (page === 1 && refreshing) that.setState({ refreshing: false });
            let { BuyList, totalPage } = {
                totalPage: 1, BuyList: [
                    { id: 0, buyerUid: 10001, price: 1, amount: 12, successCount: 3 },
                    { id: 1, buyerUid: 10002, price: 1.1, amount: 5, successCount: 1 },
                    { id: 2, buyerUid: 10002, price: 1.1, amount: 5, successCount: 1 },
                    { id: 3, buyerUid: 10002, price: 1.1, amount: 5, successCount: 1 },
                    { id: 4, buyerUid: 10002, price: 1.1, amount: 5, successCount: 1 },
                    { id: 5, buyerUid: 10002, price: 1.1, amount: 5, successCount: 1 }
                ]
            };
            that.setState({ transactionList: BuyList }, () => {
                if (that.page !== 1) that.setState({ ShowMoreLoading: false });
            })
        }, 1000);
        // Send("Trade.OrderBuyList", { page: this.page, mobile: searchText || this.props.searchText, order, by }, function (result) {
        //     if (page === 1 && refreshing) that.setState({ refreshing: false });
        //     if (result['success']) {
        //         let { BuyList, totalPage } = result;
        //         that.totalPage = totalPage;
        //         // 初始化
        //         if (that.page === 1) {
        //             if (that.state.firstLoad) that.setState({ firstLoad: false });
        //             that.setState({ transactionList: BuyList }, () => {
        //                 if (that.page !== 1) that.setState({ ShowMoreLoading: false });
        //             })
        //         } else {
        //             let transactionList = [...that.state.transactionList];
        //             that.setState({ transactionList: transactionList.concat(BuyList) }, () => {
        //                 if (that.page !== 1) that.setState({ ShowMoreLoading: false });
        //             })
        //         }
        //     } else {
        //         Toast.show({
        //             text: result['errMsg'],
        //             textStyle: { color: '#FFFFFF', textAlign: 'center' },
        //             position: "bottom",
        //             duration: 2000,
        //             // type: "success",
        //         });
        //     }
        // });
    }

    onHeaderRefresh = () => {
        this.setState({ refreshState: RefreshState.HeaderRefreshing, pageIndex: 1 })
        let sequenceTemp = this.props.sequence;
        let type = 'price';
        let order = 'desc';
        if (sequenceTemp.length === 2) {
            type = sequenceTemp[0];
            order = sequenceTemp[1];
        }
        let params = {
            pageIndex: 1,
            pageSize: this.state.pageSize,
            type: type,
            order: order
        }
        Send('api/Trade/TradeList', params).then(res => {
            if (res.code == 200) {
                this.setState({
                    transactionList: res.data,
                    totalPage: res.recordCount,
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

    onFooterRefresh = () => {
        let that = this;
        that.setState({
            refreshState: RefreshState.FooterRefreshing,
            pageIndex: this.state.pageIndex + 1
        }, () => {
            let sequenceTemp = this.props.sequence;
            let type = 'price';
            let order = 'desc';
            if (sequenceTemp.length === 2) {
                type = sequenceTemp[0];
                order = sequenceTemp[1];
            }
            let params = {
                pageIndex: that.state.pageIndex,
                pageSize: that.state.pageSize,
                type: type,
                order: order
            }
            Send('api/Trade/TradeList', params).then(res => {
                if (res.code == 200) {
                    this.setState({
                        transactionList: that.state.transactionList.concat(res.data),
                        totalPage: res.recordCount,
                        refreshState: this.state.length >= this.state.totalPage ? RefreshState.EmptyData : RefreshState.Idle,
                    })
                } else {
                    this.setState({
                        teamList: [],
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
     * 取消、出售买单
     * @param {*} item 
     */
    toOptionBuyList(item) {
        if (item['buyerUid'] === this.props.userId) {
            // 取消
            this.props.onPressObtained(item);
        } else {
            // 出售
            this.props.onPressSell(item);
        }
    }

    render() {
        return (
            <View>
                <RefreshListView
                    data={this.state.transactionList}
                    keyExtractor={this.keyExtractor}
                    renderItem={({ item, index }) =>
                        <TransactionListItem
                            index={index}
                            item={item}
                            userId={this.props.userId}
                            toOptionBuyList={this.toOptionBuyList.bind(this, item)}
                        />
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
        );
    }
}
const mapStateToProps = state => ({
    logged: state.user.logged,
    userId: state.user.id,
});

const mapDispatchToProps = dispatch => ({
});
export default connect(mapStateToProps, mapDispatchToProps)(TransactionList);
