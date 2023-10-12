import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    View, Text, StyleSheet, Image, TouchableOpacity,
    TouchableWithoutFeedback, Alert} from 'react-native';

// import { Form, Button, Right, Input, Title, Body, Item, ListItem, List, Icon, Content, Radio, Container, Left, Toast } from 'native-base';
import RefreshListView, { RefreshState } from 'react-native-refresh-list-view';
import { Header } from '../../components/Index';
import { Colors, Metrics } from '../../theme/Index';

import { Send } from '../../../utils/Http';
import { Actions } from 'react-native-router-flux';
import { Toast } from '../../common';
class MyYoTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            order: 2,
            dataList: []
        };
    }

    componentDidMount() {
        this.onHeaderRefresh();
    }


    /**
   * 排序条件变更
   * @param {*} key 
   */
    onChangeSequence(key) {
        let { order } = this.state;
        let newOrder = order;
        if (order !== key) {
            newOrder = key;
        }
        this.setState({ order: newOrder }, () => {
            this.onHeaderRefresh();
        });
    }
    /**
       * 渲染统计栏目
       */
    renderHeaderComponent() {

        const YoTaskTitle = [
            { key: 2, title: '进行中' },
            { key: 4, title: '已通过' },
            { key: 6, title: '未通过' },
        ]
        let { order } = this.state;
        return (
            <View style={{ marginBottom: 5, }}>
                <View style={styles.sequence}>
                    {YoTaskTitle.map(item => {
                        let { key, title } = item;
                        let itemSelected = order === key;
                        return (
                            <TouchableWithoutFeedback key={key} onPress={() => this.onChangeSequence(key)}>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={ itemSelected ? styles.sequenceTitleed : styles.sequenceTitle}>{title}</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        )
                    })}
                </View >
            </View>
        )
    }
    onHeaderRefresh = () => {
        this.setState({ refreshState: RefreshState.HeaderRefreshing, pageIndex: 1 }, () => {
            Send('api/YoBang/MyTaskRecord', { recordState: this.state.order, pageIndex: this.state.pageIndex }).then(res => {
                if (res.code == 200) {
                    this.setState({
                        dataList: res.data,
                        totalPage: res.recordCount,
                        refreshState: res.data.length < 1 ? RefreshState.EmptyData : RefreshState.Idle
                    })
                } else {
                    this.setState({
                        dataList: [],
                        totalPage: 0,
                        refreshState: RefreshState.EmptyData
                    })
                }
            });

        });
    }

    onFooterRefresh = () => {
        let that = this;
        that.setState({
            refreshState: RefreshState.FooterRefreshing,
            pageIndex: this.state.pageIndex + 1
        }, () => {
            Send('api/YoBang/MyTaskRecord', { recordState: this.state.order, pageIndex: this.state.pageIndex }).then(res => {
                if (res.code == 200) {
                    this.setState({
                        dataList: that.state.dataList.concat(res.data),
                        totalPage: res.recordCount,
                        refreshState: this.state.dataList.length >= this.state.totalPage ? RefreshState.EmptyData : RefreshState.Idle,
                    })
                } else {
                    this.setState({
                        dataList: [],
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
    cancleTask(item) {
        Alert.alert(
            "审核通过提醒",
            `发放赏金`,
            [
                {
                    text: "确定", onPress: () => {
                        Send('api/YoBang/TaskCancel', { recordId: item.recordId, taskId: item.taskId }).then(res => {
                            if (res.code == 200) {
                                this.onHeaderRefresh();
                            } else {
                                Toast.tipBottom(res.message);
                            }
                        });
                    }
                },
                { text: "取消", onPress: () => { } },
            ],
            { onDismiss: () => { } }
        );
    }
    jumpToTaskDetail(item) {
        Send('api/YoBang/TaskList', { keyword: item.taskId }).then(res => {
            if (res.code == 200) {
                Actions.push('ViewTask', { yoBangBaseTask: res.data.list[0] })
            } else {
                Toast.tipBottom(res.message);
            }
        });
    }
    /**
     * 列表
     */
    renderItem() {
        return (
            <RefreshListView
                data={this.state.dataList}
                keyExtractor={this.keyExtractor}
                renderItem={({ item, index }) =>
                    <View style={{ margin: 10, marginBottom: 0, backgroundColor: Colors.White, borderRadius: 5, padding: 15 }}>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ marginLeft: 5, flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ marginLeft: 5, width: 70 }}>
                                    <Image style={{ width: 50, height: 50, borderRadius: 25 }} source={{ uri: item.userPic }} />
                                </View>
                                <TouchableOpacity style={{ width: Metrics.screenWidth * 0.7 }} onPress={() => this.jumpToTaskDetail(item)}>
                                    <Text style={{ fontSize: 16, marginLeft: 5 }}>{`${item.taskTitle}`}</Text>
                                    <Text style={{ fontSize: 13, marginLeft: 5, color: Colors.C6 }}>赏金：{item.unitPrice}</Text>
                                    <Text style={{ fontSize: 13, marginLeft: 5 }}>{`报名时间：${item.entryTime}`}</Text>
                                    <Text style={{ fontSize: 13, marginLeft: 5 }}>{`超时时间：${item.cutoffTime}`}</Text>
                                    <Text style={{ fontSize: 13, marginLeft: 5, color: Colors.C16 }}>{item.recordState == 1 ? '已报名' : item.recordState == 2 ? '已提交' : item.recordState == 3 ? '已申诉' : item.recordState == 4 ? '已完成' : item.recordState == 5 ? '已取消' : item.recordState == 6 ? '已拒绝' : '已超时'}</Text>
                                    {this.state.order == 6 ?
                                        <Text style={{ fontSize: 13, marginLeft: 5 }}>{`拒绝原因：${item.remark}`}</Text> :
                                        <View />}
                                </TouchableOpacity>
                            </View>
                        </View>
                        {item.recordState == 1 ?
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <View style={{ flex: 1 }}></View>
                                <TouchableOpacity onPress={() => this.cancleTask(item)} style={{ backgroundColor: Colors.C16, flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 10, padding: 5, borderRadius: 10, }}>
                                    <Text style={{ color: Colors.White }}>取消报名</Text>
                                </TouchableOpacity>
                                <View style={{ flex: 1 }}></View>
                            </View>
                            : <View />}
                    </View>

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
        );
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.backgroundColor }}>
                <Header title="我的任务" />
                {this.renderHeaderComponent()}
                {this.renderItem()}
            </View>
        );
    }
}
const mapStateToProps = state => ({
    logged: state.user.logged,
    userId: state.user.id
});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(MyYoTask);

const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
    sequenceTitle: { fontSize: 14, color: Colors.C11 },
    sequenceTitleed: { fontSize: 16, color: Colors.main },
    sequence: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        width: Metrics.screenWidth,
        backgroundColor: Colors.White
    },
    searchContainer: { padding: 12, borderWidth: 1, borderColor: Colors.C16, paddingTop: 8, paddingBottom: 8, borderRadius: 8, backgroundColor: Colors.White, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    mobileText: { fontSize: 15, color: Colors.C6, fontWeight: 'bold' },
    mobileInput: { padding: 8, marginLeft: 10, borderRadius: 6, backgroundColor: Colors.C8, marginRight: 10, fontSize: 15, color: Colors.C2, flex: 1, textAlignVertical: 'center', borderWidth: 1, borderColor: Colors.C16 },
    searchIcon: { fontWeight: 'bold', color: Colors.C6, fontSize: 30 },
    inviteCode: { fontSize: 12, color: Colors.C16, },
});
