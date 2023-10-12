import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Metrics } from '../../theme/Index';
import RefreshListView, { RefreshState } from 'react-native-refresh-list-view';
import CurrencyApi from '../../../api/yoyoTwo/currency/CurrencyApi';
import { Header } from '../../components/Index';
import { Actions } from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';

export default class AdFlowDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            detailList: [],
            pageSize: 20,
            pageIndex: 1,
            rate: 0,
            refreshState: true,
            moreData: true
        };
    }

    componentDidMount() {
        this.getCoinRecord(1)
    }

    getCoinRecord = (pageIndex) => {
        CurrencyApi.getJifenRecord({ Types: this.state.data.key, PageIndex: pageIndex, PageSize: this.state.pageSize })
            .then((data) => {
                this.setState({
                    detailList: this.state.pageIndex == 1 ? data.data : this.state.detailList.concat(data.data),
                    refreshState: false,
                    rate: data.rate,
                    moreData: data.length < this.state.pageSize ? false : true
                })
            }).catch((err) => this.setState({ refreshState: false }))
    }

    onHeaderRefresh = () => {
        this.setState({ refreshState: true, pageIndex: 1 }, () => {
            this.getCoinRecord(1)
        })
    }

    onFooterRefresh = () => {
        let { moreData, refreshState, pageIndex } = this.state
        if (!moreData || refreshState) {
            return;
        }
        this.setState({ pageIndex: pageIndex + 1, refreshState: true }, () => {
            this.getCoinRecord(this.state.pageIndex)
        })
    }


    renderItem = ({ item, index }) => {
        return (
            <View key={index} style={[styles.item, { padding: 10 }]}>
                <View style={{ justifyContent: 'center' }}>
                    <Text style={{ fontSize: 13 }} numberOfLines={2}>{item.modifyDesc}</Text>
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

    render() {
        const { data, detailList } = this.state;
        let postChange = detailList[0] == undefined ? 0 : detailList[0].postChange
        return (
            <View style={{ flex: 1, backgroundColor: Colors.White }}>
                <Header title={data.name} />
                <View style={{ flex: 1 }}>
                    <RefreshListView
                        data={detailList}
                        ListHeaderComponent={() => {
                            return (
                                <View style={{ justifyContent: 'center' }}>
                                    {data.key == 1 &&
                                        <LinearGradient colors={[Colors.main, Colors.White]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ backgroundColor: Colors.main, paddingHorizontal: 15, marginBottom: 10, borderBottomWidth: 5, borderColor: Colors.backgroundColor, paddingBottom: 50, }}>
                                            <View style={{ marginTop: 20, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={{ fontSize: 16, color: Colors.White, flex: 1 }}>当前持有{postChange}个碎片</Text>
                                                <Text style={{ fontSize: 16, color: Colors.White, flex: 1, marginTop: 10, marginBottom: 10 }}>当前 {this.state.rate} 个碎片兑换 1 个荣耀值</Text>
                                                <TouchableOpacity style={{ alignItems: 'center', marginVertical: 10 }} onPress={() => {
                                                    Actions.push('SubstitutionVideo', { canUserCotton: 0, type: 1, title: '荣耀值' })
                                                }}>
                                                    <LinearGradient colors={[Colors.btnBeforColor, Colors.main]} start={{ x: -0.5, y: -0.1 }} end={{ x: 1, y: 1 }} style={{ borderRadius: 5, width: Metrics.screenWidth / 2, alignItems: 'center', justifyContent: 'center' }}>
                                                        <Text style={{ color: Colors.White, fontSize: 16, paddingHorizontal: 15, paddingVertical: 10 }}>{`去兑换`}</Text>
                                                    </LinearGradient>
                                                </TouchableOpacity>

                                                <Text style={{ fontSize: 12, color: Colors.notice, flex: 1, marginTop: 10 }}>**碎片兑换荣耀值比例会不定时更新</Text>

                                            </View>
                                        </LinearGradient>
                                    }
                                    {data.key == 6 &&
                                        <LinearGradient colors={[Colors.main, Colors.White]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ backgroundColor: Colors.main, paddingHorizontal: 15, marginBottom: 10, borderBottomWidth: 5, borderColor: Colors.backgroundColor, paddingBottom: 50, }}>
                                            <View style={{ marginTop: 20, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                <TouchableOpacity style={{ alignItems: 'center', marginVertical: 10 }} onPress={() => {
                                                    Actions.push('SubstitutionVideo', { canUserCotton: 0, type: 2, title: 'GCX' })
                                                }}>
                                                    <LinearGradient colors={[Colors.btnBeforColor, Colors.main]} start={{ x: -0.5, y: -0.1 }} end={{ x: 1, y: 1 }} style={{ borderRadius: 5, width: Metrics.screenWidth / 2, alignItems: 'center', justifyContent: 'center' }}>
                                                        <Text style={{ color: Colors.White, fontSize: 16, paddingHorizontal: 15, paddingVertical: 10 }}>{`去兑换`}</Text>
                                                    </LinearGradient>
                                                </TouchableOpacity>
                                                <Text style={{ fontSize: 12, color: Colors.notice, flex: 1, marginTop: 10 }}>5个GC+1个钻石+1个荣耀值 可兑换1个GCX</Text>

                                            </View>
                                        </LinearGradient>
                                    }
                                    {data.key == 4 &&
                                        <LinearGradient colors={[Colors.main, Colors.White]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ backgroundColor: Colors.main, paddingHorizontal: 15, marginBottom: 10, borderBottomWidth: 5, borderColor: Colors.backgroundColor, paddingBottom: 10, }}>
                                            <View style={{ marginTop: 20, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={{ fontSize: 16, color: Colors.White, flex: 1, marginTop: 10, marginBottom: 10 }}>当前回购需求: {postChange} 💎</Text>
                                                <TouchableOpacity style={{ alignItems: 'center', marginVertical: 10 }} onPress={() => {
                                                    Actions.push('SubstitutionZuanshi', { canUserCotton: 0 })
                                                }}>
                                                    <LinearGradient colors={[Colors.btnBeforColor, Colors.main]} start={{ x: -0.5, y: -0.1 }} end={{ x: 1, y: 1 }} style={{ borderRadius: 5, width: Metrics.screenWidth / 2, alignItems: 'center', justifyContent: 'center' }}>
                                                        <Text style={{ color: Colors.White, fontSize: 16, paddingHorizontal: 15, paddingVertical: 10 }}>{`确认回购`}</Text>
                                                    </LinearGradient>
                                                </TouchableOpacity>

                                                <Text style={{ fontSize: 12, color: Colors.notice, flex: 1, marginTop: 10 }}>社区回购价:5￥【每日完成任意三档好玩荣耀游戏获得奖励可参与社区回购】</Text>
                                                <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.main, flex: 1, paddingTop: 20 }}>回购明细</Text>
                                            </View>
                                        </LinearGradient>
                                    }
                                </View>
                            )
                        }}
                        keyExtractor={(item, index) => index.toString()}
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
            </View>
        );
    }
}
const styles = StyleSheet.create({
    headerView: {
        flexDirection: 'row',
        paddingVertical: 20,
        paddingHorizontal: 10,
        borderBottomColor: Colors.C13,
        borderBottomWidth: 10,
        backgroundColor: Colors.main
    },
    item: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.C13,
        paddingHorizontal: 10
    },
    headerTab: {
        height: 30,
        width: (Metrics.screenWidth - 70) / 3,
        borderWidth: 0.5,
        borderColor: Colors.White,
        justifyContent: 'center',
        alignItems: 'center'
    },
})
