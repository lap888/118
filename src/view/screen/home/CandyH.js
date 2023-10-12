import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Actions } from 'react-native-router-flux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import RefreshListView, { RefreshState } from 'react-native-refresh-list-view';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../theme/Index';
import { Header, CandyHListItem } from '../../components/Index';
import { Send } from '../../../utils/Http';
export default class CandyH extends Component {
    constructor(props) {
        super(props);
        this.state = {
            baseCandyH: 0,
            extCandyH: 0,
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0,
            candyHList: [],
            candyHRule: []
        }
    }
    componentDidMount() {
        this.loadCandyHRule();
        this.onHeaderRefresh();
    }
    loadCandyHRule = () => {
        Send(`api/system/CopyWriting?type=candy_h_rule`, {}, 'get').then(res => {
            this.setState({
                candyHRule: res.data
            })
        });
    }
    onHeaderRefresh = () => {
        this.setState({ refreshState: RefreshState.HeaderRefreshing, pageIndex: 1 })
        let params = {
            pageIndex: 1,
            pageSize: this.state.pageSize
        }
        Send('api/system/CandyRecordH', params).then(res => {
            if (res.code == 200) {
                this.setState({
                    baseCandyH: res.data.baseCandyH,
                    extCandyH: res.data.extCandyH,
                    candyHList: res.data.candyHLists,
                    totalPage: res.recordCount,
                    refreshState: res.data.candyHLists.length < 1 ? RefreshState.EmptyData : RefreshState.Idle
                })
            } else {
                this.setState({
                    baseCandyH: 0,
                    extCandyH: 0,
                    candyHList: [],
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
            Send('api/system/CandyRecordH', params).then(res => {
                if (res.code == 200) {
                    this.setState({
                        candyHList: that.state.candyHList.concat(res.data.candyHLists),
                        totalPage: res.recordCount,
                        refreshState: this.state.candyHList.length >= this.state.totalPage ? RefreshState.EmptyData : RefreshState.Idle,
                    })
                } else {
                    this.setState({
                        baseCandyH: 0,
                        extCandyH: 0,
                        candyHList: [],
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
     * 进入活跃度规则界面
     */
    onRightPress() {
        let data = {
            title: '果核规则',
            rules: this.state.candyHRule
        }
        Actions.push('CommonRules', data);
    }
    /**
     * 渲染活跃度Header
     */
    renderHeader() {
        return (
            <LinearGradient colors={[Colors.main, Colors.LightG]} start={{ x: 0, y: 0.3 }} end={{ x: 0, y: 1 }} style={Styles.totalDiamond}>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={Styles.totalNum}>
                        {`${this.state.baseCandyH.toFixed(2)} + ${this.state.extCandyH.toFixed(2)}`}
                    </Text>
                    <View style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                        <FontAwesome name="fire" color={Colors.White} size={20} />
                        <Text style={Styles.tTxt}>果核</Text>
                    </View>
                </View>
            </LinearGradient>
        )
    }
    /**
     * 渲染活跃值列表
     */
    renderCandyHList() {
        return (
            <RefreshListView
                data={this.state.candyHList}
                keyExtractor={this.keyExtractor}
                renderItem={({ item, index }) => <CandyHListItem index={index} item={item} />}
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
    render() {
        return (
            <View style={Styles.container}>
                <Header title="果核明细" rightText="规则" onRightPress={() => this.onRightPress()} />
                {this.renderHeader()}
                {this.renderCandyHList()}
            </View>
        );
    }
}
const Styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    totalDiamond: {
        backgroundColor: Colors.primary,
        paddingTop: 2,
        paddingBottom: 12,
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
    },
    stick: { height: 40, width: 3, borderRadius: 3 },
    totalNum: {
        color: Colors.C8,
        fontSize: 16
    },
    tTxt: {
        marginLeft: 4,
        fontSize: 14,
        color: Colors.White
    }
});
