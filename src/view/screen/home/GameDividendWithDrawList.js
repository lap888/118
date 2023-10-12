/*
 * @Author: top.brids 
 * @Date: 2019-12-31 11:08:39 
 * @Last Modified by: top.brids
 * @Last Modified time: 2019-12-31 11:31:54
 */

import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, InteractionManager } from 'react-native';
import { connect } from 'react-redux';
import { BoxShadow } from 'react-native-shadow';
import { Toast } from 'native-base';
import moment from 'moment';
import { Header, EmptyComponent, ShowMore } from '../../components/Index';
import { Metrics, Colors } from '../../theme/Index';
import { WITHDRAW_TYPE, WITHDRAW_STATUS, Ti_Xian_R } from '../../../config/Constants';

class GameDividendWithDrawList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstLoading: true,
            loadingMore: false,
            withdrawList: [],
        }
        this.currentPage = 1;
        this.totalPage = 1;
    }
    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.fetchList(1);
        });
    }
    /**
     * 获取分红提现列表
     * @param {*} page 
     */
    fetchList(page) {
        this.currentPage = page;
        if (page !== 1 && !this.state.loadingMore) this.setState({ loadingMore: true });

        var that = this;
        setTimeout(() => {
            if (that.state.firstLoading) that.setState({ firstLoading: false });
            if (that.state.loadingMore) that.setState({ loadingMore: false });
            let { withdrawHistory, totalPage } = Ti_Xian_R;
            that.totalPage = totalPage;
            that.setState({ withdrawList: withdrawHistory });
        }, 1000);
        // Send("UserBalance.withdrawHistory", { _uid: this.props.userId, page }, (result) => {
        //     if (that.state.firstLoading) that.setState({ firstLoading: false });
        //     if (that.state.loadingMore) that.setState({ loadingMore: false });

        //     if (result['success']) {
        //         let { withdrawHistory, totalPage } = result['data'];
        //         that.totalPage = totalPage;
        //         // 初始化
        //         if (page === 1) {
        //             that.setState({ withdrawList: withdrawHistory });
        //         } else {
        //             let withdrawListTemp = [...that.state.withdrawList];
        //             that.setState({ withdrawList: withdrawListTemp.concat(withdrawHistory) });
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
    /**
	 * 分页触底操作
	 */
    onEndReached() {
        if (this.currentPage >= this.totalPage) return;
        this.fetchList(this.currentPage + 1);
    }
    /**
     * 渲染分红提现Item
     * @param {*} param0 
     */
    renderItem({ item }) {
        let { amount, createdAt, status, withdrawTo, withdrawType, failReason } = item;
        const shadowOpt = {
            height: status === 2 ? 90 : 76,
            width: Metrics.screenWidth - 20,
            color: Colors.C6,
            border: 2,
            radius: 6,
            opacity: 0.2,
            x: 0,
            y: 0,
            style: Styles.transactionContainer
        }
        return (
            <BoxShadow setting={shadowOpt}>
                <View style={[Styles.diamondCard, { height: status === 2 ? 85 : 71 }]}>
                    <View style={[Styles.labelView]}>
                        <Text style={Styles.labelTxt} numberOfLines={2}>{`提现至 ${WITHDRAW_TYPE[withdrawType]['title']}账户 ${withdrawTo}`}</Text>
                        {status === 2 && failReason && <Text style={Styles.failReason} numberOfLines={2}>{failReason}</Text>}
                        <Text style={Styles.diamondTime} numberOfLines={1}>{moment(createdAt).format('YYYY-MM-DD HH:mm')}</Text>
                    </View>
                    <View style={[Styles.diamondNumView]}>
                        <Text style={Styles.diamondNumTxt}>{`¥${amount.toFixed(2)}`}</Text>
                        <Text style={Styles.diamondTime}>{WITHDRAW_STATUS[status]['title']}</Text>
                    </View>
                </View>
            </BoxShadow>
        )
    }
    render() {
        return (
            <View style={Styles.containr}>
                <Header title="提现记录" />
                <FlatList
                    contentContainerStyle={{ paddingBottom: 10 }}
                    data={this.state.withdrawList}
                    renderItem={this.renderItem.bind(this)}
                    ListEmptyComponent={() => <EmptyComponent isLoading={this.state.firstLoading} />}
                    ListFooterComponent={() => <ShowMore visible={this.state.loadingMore} />}
                    onEndReached={this.onEndReached.bind(this)}
                    onEndReachedThreshold={0.5}
                    keyExtractor={(item, index) => String(index)}
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
        margin: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: Colors.C8,
        borderRadius: 6
    },
    labelView: {
        flex: 1,
        marginLeft: 12
    },
    labelTxt: { fontSize: 15, color: Colors.C0, fontWeight: '400' },
    diamondTime: { marginTop: 8, fontSize: 13, color: Colors.C2, marginRight: 5 },
    diamondNumView: {
        alignItems: "flex-end"
    },
    diamondNumTxt: {
        fontSize: 16,
        color: Colors.C6,
        flexWrap: "wrap",
        fontWeight: 'bold',
        marginRight: 5
    },
    diamondNumTxt2: {
        fontSize: 16,
        color: Colors.C16,
        flexWrap: "wrap",
        fontWeight: 'bold',
        marginRight: 5
    }
});


const mapStateToProps = state => ({
    userId: state.user.id,
});

export default connect(mapStateToProps, {})(GameDividendWithDrawList);