import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import RefreshListView, { RefreshState } from 'react-native-refresh-list-view';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { Header } from '../../components/Index';
import { Colors, Metrics } from '../../theme/Index';
import { Send } from '../../../utils/Http';

class TaskSubRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataList: [],
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0,
        };
    }

    componentDidMount() {
        this.onHeaderRefresh()

        this.listener = DeviceEventEmitter.addListener('refranshTaskList', () => {
            this.onHeaderRefresh()
        })
    }
    componentWillUnmount() {
        this.listener.remove()
    }

    onHeaderRefresh = () => {
        this.setState({ refreshState: RefreshState.HeaderRefreshing, pageIndex: 1 }, () => {
            Send('api/YoBang/TaskRecord', { taskId: this.props.taskId, pageIndex: this.state.pageIndex }).then(res => {
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
            Send('api/YoBang/TaskRecord', { taskId: this.props.taskId, pageIndex: this.state.pageIndex }).then(res => {
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
    /**
     * 列表
     */
    renderItem() {
        return (
            <RefreshListView
                data={this.state.dataList}
                keyExtractor={this.keyExtractor}
                renderItem={({ item, index }) =>
                    <TouchableOpacity style={{ margin: 10, marginBottom: 0, backgroundColor: Colors.White, borderRadius: 5, padding: 15 }} onPress={() => Actions.push('TaskSubRecordDetail', item)}>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ marginLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
                                <Image style={{ width: 50, height: 50, borderRadius: 25 }} source={{ uri: item.userPic }} />
                                <View>
                                    <Text style={{ fontSize: 13, marginLeft: 5 }}>{`任务编号：${item.taskId}`}</Text>
                                    <Text style={{ fontSize: 13, marginLeft: 5 }}>{`提交用户：${item.userNick}`}</Text>
                                    <Text style={{ fontSize: 13, marginLeft: 5 }}>{`任务标题：${item.taskTitle}`}</Text>
                                    <Text style={{ fontSize: 13, marginLeft: 5 }}>{`截止时间：${item.cutoffTime}`}</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
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
            <View style={{ flex: 1, backgroundColor: Colors.backgroundColor, }}>
                <Header title="任务审核" />
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

export default connect(mapStateToProps, mapDispatchToProps)(TaskSubRecord);

const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
    sequenceTitle: { fontSize: 14, color: Colors.C11 },
    sequence: {
        flexDirection: 'row', alignItems: 'center', height: 50, width: Metrics.screenWidth, backgroundColor: Colors.LightG,
        borderBottomLeftRadius: 20, borderBottomRightRadius: 20
    },
    searchContainer: { padding: 12, borderWidth: 1, borderColor: Colors.C16, paddingTop: 8, paddingBottom: 8, borderRadius: 8, backgroundColor: Colors.White, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    mobileText: { fontSize: 15, color: Colors.C6, fontWeight: 'bold' },
    mobileInput: { padding: 8, marginLeft: 10, borderRadius: 6, backgroundColor: Colors.C8, marginRight: 10, fontSize: 15, color: Colors.C2, flex: 1, textAlignVertical: 'center', borderWidth: 1, borderColor: Colors.C16 },
    searchIcon: { fontWeight: 'bold', color: Colors.C6, fontSize: 30 },
    inviteCode: { fontSize: 12, color: Colors.C16, },
});
