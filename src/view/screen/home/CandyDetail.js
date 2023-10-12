import React, { Component } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import RefreshListView, { RefreshState } from 'react-native-refresh-list-view';
import LinearGradient from 'react-native-linear-gradient';
import { Metrics, Colors } from '../../theme/Index';
import { Toast } from 'native-base';
import { Header, ShowMore, EmptyComponent, CandyListItem } from '../../components/Index';
import { Send } from '../../../utils/Http';
import { Actions } from 'react-native-router-flux';
class CandyDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            candyNum: 0,
            freezeCandyNum: 0,
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0,
            candyRecordList: [],
        }
    }
    componentDidMount() {
        this.onHeaderRefresh();
    };
    onHeaderRefresh = () => {
        this.setState({ refreshState: RefreshState.HeaderRefreshing, pageIndex: 1 })
        let params = {
            pageIndex: 1,
            pageSize: this.state.pageSize
        }
        Send('api/system/CandyRecord', params).then(res => {
            if (res.code == 200) {
                this.setState({
                    candyNum: res.data.candyNum,
                    freezeCandyNum: res.data.freezeCandyNum,
                    candyRecordList: res.data.candyRecord,
                    totalPage: res.recordCount,
                    refreshState: res.data.candyRecord.length < 1 ? RefreshState.EmptyData : RefreshState.Idle
                })
            } else {
                this.setState({
                    candyNum: 0,
                    freezeCandyNum: 0,
                    candyRecordList: [],
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
            Send('api/system/CandyRecord', params).then(res => {
                if (res.code == 200) {
                    this.setState({
                        candyRecordList: that.state.candyRecordList.concat(res.data.candyRecord),
                        totalPage: res.recordCount,
                        refreshState: this.state.candyRecordList.length >= this.state.totalPage ? RefreshState.EmptyData : RefreshState.Idle,
                    })
                } else {
                    this.setState({
                        candyNum: 0,
                        freezeCandyNum: 0,
                        candyRecordList: [],
                        totalPage: 0,
                        refreshState: RefreshState.EmptyData
                    })
                }
            });
        });
    }

    /**
     * 渲染Header Bar
     */
    renderHeader() {
        return (
            <LinearGradient colors={[Colors.main, Colors.LightG]} start={{ x: 0, y: 0.3 }} end={{ x: 0, y: 1 }} style={Styles.totalDiamond}>
                <View style={Styles.totalDiamond}>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <Text style={Styles.totalNum}>{this.state.candyNum}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                            <FontAwesome name="money" color={Colors.White} size={16} />
                            <Text style={Styles.tTxt}>当前糖果</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1, alignItems: 'center', alignItems: 'center' }}>
                        <Text style={Styles.totalNum}>{this.state.freezeCandyNum}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                            <FontAwesome name="lock" color={Colors.White} size={16} />
                            <Text style={Styles.tTxt}>交易冻结</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1, alignItems: 'center', alignItems: 'center' }}>
                        <TouchableOpacity style={Styles.BtnBi} onPress={() => Actions.push('RechargeCandy')}>
                            <Text style={[Styles.tTxt, { color: Colors.C16 }]}>充币</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[Styles.BtnBi, { marginTop: 10 }]} onPress={() => Actions.push('MoveToExchange', { title: '糖果' })}>
                            <Text style={[Styles.tTxt, { color: Colors.C16 }]}>提币</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>
        )
    }

    keyExtractor = (item, index) => {
        return index.toString()
    }
    /**
     * 渲染糖果流水列表
     */
    renderDismondList() {
        return (
            <View style={{ flex: 1, borderRadius: 5, marginTop: -45, marginHorizontal: 10, backgroundColor: Colors.White, }}>
                <RefreshListView
                    data={this.state.candyRecordList}
                    style={{ paddingTop: 5 }}
                    keyExtractor={this.keyExtractor}
                    renderItem={({ item, index }) => <CandyListItem index={index} item={item} />}
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
                <Header title="糖果明细" />
                {this.renderHeader()}
                {this.renderDismondList()}
            </View>
        );
    }
}

const mapStateToProps = state => ({
    userId: state.user.id,
})

export default connect(mapStateToProps, {})(CandyDetail);

const Styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.backgroundColor },
    totalDiamond: {
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 20,
        paddingBottom: 20,
    },
    totalNum: {
        color: Colors.C8,
        fontSize: 16
    },
    tTxt: {
        fontSize: 14,
        color: Colors.White,
        marginLeft: 4,
    },
    BtnBi: {
        width: 70,
        height: 25,
        flexDirection: 'row',
        borderRadius: 17.5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.White
    },
});