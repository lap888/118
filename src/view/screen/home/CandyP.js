import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import RefreshListView, { RefreshState } from 'react-native-refresh-list-view';
import { Metrics, Colors } from '../../theme/Index';
import { Header, CandyPListItem } from '../../components/Index';
import { Send } from '../../../utils/Http';
import { connect } from 'react-redux';

class CandyP extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0,
            candyPList: [],
            candyPRule: []
        }
    }
    componentDidMount() {
        this.loadCandyPRule();
        this.onHeaderRefresh();
    }
    loadCandyPRule = () => {
        Send(`api/system/CopyWriting?type=candy_p_rule`, {}, 'get').then(res => {
            this.setState({
                candyPRule: res.data
            })
        });
    }
    onHeaderRefresh = () => {
        this.setState({ refreshState: RefreshState.HeaderRefreshing, pageIndex: 1 })
        let params = {
            pageIndex: 1,
            pageSize: this.state.pageSize
        }
        Send('api/system/CandyRecordP', params).then(res => {
            if (res.code == 200) {
                this.setState({
                    candyPList: res.data,
                    totalPage: res.recordCount,
                    refreshState: res.data.length < 1 ? RefreshState.EmptyData : RefreshState.Idle
                })
            } else {
                this.setState({
                    candyPList: [],
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
            Send('api/system/CandyRecordP', params).then(res => {
                if (res.code == 200) {
                    this.setState({
                        candyPList: that.state.candyPList.concat(res.data),
                        totalPage: res.recordCount,
                        refreshState: this.state.candyPList.length >= this.state.totalPage ? RefreshState.EmptyData : RefreshState.Idle,
                    })
                } else {
                    this.setState({
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
            title: '果皮规则',
            rules: this.state.candyPRule
        }
        Actions.push('CommonRules', data);
    }

    renderListHeader = () => {
        return (
            <View style={Styles.headerView}>
                <Text style={{fontSize: 16, color:  Colors.White, flex: 1}}>果皮： {this.props.candyP}</Text>
                <TouchableOpacity style={Styles.headerBtn} onPress={() => Actions.push('CandyPExchangeNL')}>
                    <Text style={{fontSize: 16, color:  Colors.White }}>兑换</Text>
                </TouchableOpacity>
            </View>
        )
    }

    /**
     * 渲染活跃值列表
     */
    renderCandyHList() {
        return (
            <RefreshListView
                data={this.state.candyPList}
                keyExtractor={this.keyExtractor}
                renderItem={({ item, index }) => <CandyPListItem index={index} item={item} />}
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
                <Header title="果皮明细" rightText="规则" onRightPress={() => this.onRightPress()} />
                {this.renderListHeader()}
                {this.renderCandyHList()}
            </View>
        );
    }
}
const mapStateToProps = state => ({
	candyP: state.user.candyP,
});
const mapDispatchToProps = dispatch => ({
});
export default connect(mapStateToProps, mapDispatchToProps)(CandyP);


const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    headerView: {
        height: 50,
        backgroundColor: Colors.main,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    headerBtn: {
        height: 30,
        width: 80,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.White
    },
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
        fontSize: 18,
        fontWeight: 'bold'
    },
    tTxt: {
        marginLeft: 4,
        fontSize: 16,
        color: Colors.White
    }
});