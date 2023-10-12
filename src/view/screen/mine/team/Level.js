import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RefreshListView, { RefreshState } from 'react-native-refresh-list-view';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { Coin, UserApi } from '../../../../api';
import { Send } from '../../../../utils/Http';
import { MathFloat } from '../../../../utils/Index';
import { Header } from '../../../components/Index';
import { Colors } from '../../../theme/Index';

class Level extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageIndex: 1,
            pageSize: 20,
            totalPage: 0,
            data: [],
            rule: '',
            refreshState: true
        }
    }
    componentDidMount() {
        this.loadCandyPRule();
        this.onHeaderRefresh();
    }
    
    loadCandyPRule = () => {
        Send(`api/system/CopyWriting?type=userlevel`, {}, 'get').then(res => {
            this.setState({ rule: res.data })
        });
    }
    
    onHeaderRefresh = () => {
        this.setState({ refreshState: RefreshState.HeaderRefreshing, pageIndex: 1 })
        let params = {
            pageIndex: 1,
            pageSize: this.state.pageSize
        }
        UserApi.getGlodsRecord(params)
        .then((res) => {
            this.setState({
                data: res.data,
                totalPage: res.recordCount,
                refreshState: res.data.length < 1 ? RefreshState.EmptyData : RefreshState.Idle
            })
        }).catch((err) => {
            this.setState({
                data: [],
                totalPage: 0,
                refreshState: RefreshState.EmptyData
            })
        })
    }

    onFooterRefresh = () => {
        this.setState({
            refreshState: RefreshState.FooterRefreshing,
            pageIndex: this.state.pageIndex + 1
        }, () => {
            let params = {
                pageIndex: this.state.pageIndex,
                pageSize: this.state.pageSize
            }
            UserApi.getGlodsRecord(params)
            .then((data) => {
                this.setState({
                data: this.state.data.concat(res.data),
                totalPage: res.recordCount,
                refreshState: this.state.candyPList.length >= this.state.totalPage ? RefreshState.EmptyData : RefreshState.Idle,
            })
            }).catch((err) => {
                this.setState({
                    candyHList: [],
                    totalPage: 0,
                    refreshState: RefreshState.EmptyData
                })
            })
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
            title: '规则',
            rules: this.state.rule
        }
        Actions.push('CommonRules', data);
    }

    renderItem = ({ item, index }) => {
        const { content, createdAt, candyP } = item;
        return (
            <View key={index} style={Styles.diamondCard}>
                <View style={[Styles.labelView]}>
                    <Text style={Styles.labelTxt}>{content}</Text>
                    <Text style={Styles.diamondTime}>
                        {createdAt}
                    </Text>
                </View>
                <View style={[Styles.diamondNumView]}>
                    <Text style={candyP > 0 ? Styles.diamondNumTxt : Styles.diamondNumTxt2}>{`${candyP > 0 ? '+' : ''}${MathFloat.floor(candyP, 2)}`}</Text>
                </View>
            </View>
        )
    }

    listHeader = () => {
        return (
            <View style={{height: 60, borderBottomWidth: 5, borderBottomColor: Colors.backgroundColor, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 50 }}>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 12, color: Colors.greyText}}>等级</Text>
                    <Text style={{fontSize: 14, color: Colors.main}}>{this.props.level}</Text>
                </View>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 12, color: Colors.greyText}}>贡献值</Text>
                    <Text style={{fontSize: 14, color: Colors.main}}>{this.props.golds}</Text>
                </View>
            </View>
        )
    }
    /**
     * 渲染活跃值列表
     */
    renderCandyHList() {
        return (
            <View style={{}}>
                <RefreshListView
                    data={this.state.data}
                    keyExtractor={this.keyExtractor}
                    ListHeaderComponent={this.listHeader}
                    renderItem={this.renderItem}
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
        )
    }

    render() {
        return (
            <View style={Styles.container}>
                <Header title="贡献值明细" rightText="规则" onRightPress={() => this.onRightPress()} />
                {this.renderCandyHList()}
            </View>
        );
    }
}

const mapStateToProps = state => ({
    golds: state.user.golds,
    level: state.user.level,
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Level);

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
        fontSize: 18,
        fontWeight: 'bold'
    },
    tTxt: {
        marginLeft: 4,
        fontSize: 16,
        color: Colors.White
    },
    transactionContainer: {
        left: 10,
        marginTop: 10
    },
    verticalLine: {
        height: 35,
        width: 3,
        borderRadius: 3,
        backgroundColor: Colors.C1
    },
    diamondCard: {
        height: 65,
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 1,
        borderColor: Colors.backgroundColor,
        marginHorizontal: 10
    },
    labelView: {
        flex: 1,
        marginLeft: 12,
    },
    labelTxt: {
        fontSize: 14,
        color: Colors.C0,
    },
    diamondTime: {
        marginTop: 8,
        fontSize: 13,
        color: Colors.greyText
    },
    diamondNumView: {
        alignItems: "flex-end"
    },
    diamondNumTxt: {
        fontSize: 14,
        color: Colors.mainTab,
        flexWrap: "wrap",
        marginRight: 10,

    },
    diamondNumTxt2: {
        fontSize: 14,
        color: Colors.C16,
        flexWrap: "wrap",
        marginRight: 10
    },
});
