import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { TASK_LIST } from '../../../../redux/ActionTypes';
import { Colors, Metrics } from '../../../theme/Index';
import { EmptyComponent } from '../../../components/Index';
import { Send } from '../../../../utils/Http';
import { Toast } from '../../../common';
import RefreshListView, { RefreshState } from 'react-native-refresh-list-view';
class MyTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstLoad: true,
            showFlag: false,
            clickKey: -1,
            taskList: []
        };
    }

    componentDidMount() {
        this.onHeaderRefresh();
    }

    /**
     * 获取task列表
     */
    getTaskList() {
        if (!this.props.logged) return;
        var that = this;
        Send("api/system/TaskList?type=" + 0, {}, 'get').then(res => {
            if (that.state.firstLoad) that.setState({ firstLoad: false });
            if (res.code == 200) {
                this.setState({ taskList: res.data })
                that.props.resetTaskList(res.data);
            } else {
                Toast.tipBottom(res.message)
            }
        });
    }

    /**
     * 兑换糖果
     * @param {*} minningId 
     */
    ensureExchange(item) {
        var that = this;
        this.setState({
            showFlag: true,
            clickKey: item.minningId
        })
        Send("api/System/TaskRenew?taskId=" + item.id, {}, 'get').then(result => {
            this.setState({
                showFlag: false,
                clickKey: -1
            })
            Alert.alert(
                `${result.code == 200 ? "续期成功" : "续期失败"}`,
                `${result.code == 200 ? `恭喜您续期一个${item['minningName']}` : result.message}`,
                [
                    { text: "确定", onPress: () => that.getTaskList() },
                ],
                { onDismiss: () => { } }
            )
        })
    }
    /**
     * 兑换矿机提示
     * @param {*} item 
     */
    exchangeMining(item) {
        let { minningName, candyIn } = item;
        Alert.alert(
            "续期提醒",
            `消耗${candyIn}糖果续期一个${minningName}`,
            [
                { text: "确定", onPress: () => this.ensureExchange(item) },
                { text: "取消", onPress: () => { } },
            ],
            { onDismiss: () => { } }
        )
    }
    /**
         * 渲染任务Item
         * @param {*} item 
         * @param {*} index 
         */
    renderTaskItem(item, index) {
        return (
            <LinearGradient colors={[item.colors, Colors.LightG]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={Styles.miningItem} >
                {/* <View style={[Styles.miningItem, { backgroundColor: item.colors }]} > */}
                <View style={Styles.miningItemHeader}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {item.source !== 1 && <Icon name="codepen" color={Colors.White} size={20} type="FontAwesome" style={{ marginRight: 4 }} />}
                        <Text style={Styles.miningItemName}>{`${item.minningName}`}</Text>
                    </View>
                </View>
                <View style={Styles.miningItembody}>
                    <View>                        
                        <Text style={Styles.miningItemGemout}>{`产出 (钻石) ≈${item.candyOut}`}</Text>
                        <Text style={Styles.miningItemGemout}>{`荣耀值 +${item.nlCount}`}</Text>
                        <Text style={Styles.miningItemGemout}>{`活跃度 +${item.teamH}`}</Text>
                        <Text style={Styles.miningItemTime}>{`生效时间：${item.beginTime} `}</Text>
                        <Text style={Styles.miningItemTime}>{`到期时间：${item.endTime}`}</Text>
                    </View>

                </View>
            </LinearGradient >
        )
    }
    /**
     * 空列表组件
     */
    renderEmptyComponent() {
        return (
            <EmptyComponent isLoading={this.state.firstLoad}></EmptyComponent>
        )
    }
    onHeaderRefresh = () => {
        this.setState({ refreshState: RefreshState.HeaderRefreshing })

        Send("api/system/TaskList?type=" + 0, {}, 'get').then(res => {
            if (res.code == 200) {
                this.setState({
                    taskList: res.data,
                    refreshState: res.data.length < 1 ? RefreshState.EmptyData : RefreshState.Idle
                });
            } else {
                this.setState({
                    taskList: [],
                    refreshState: RefreshState.EmptyData
                })
                Toast.tipBottom(res.message)
            }
        });
    }
    keyExtractor = (item, index) => {
        return index.toString()
    }
    render() {
        return (
            <RefreshListView
                data={this.state.taskList}
                keyExtractor={this.keyExtractor}
                renderItem={({ item, index }) => this.renderTaskItem(item, index)}
                refreshState={this.state.refreshState}
                onHeaderRefresh={this.onHeaderRefresh}
                // onFooterRefresh={this.onFooterRefresh}
                // 可选
                footerRefreshingText='正在玩命加载中...'
                footerFailureText='我擦嘞，居然失败了 =.=!'
                footerNoMoreDataText='暂无更多数据...'
                footerEmptyDataText='暂无更多数据...'
            />
        );
    }
}
const mapStateToProps = state => ({
    logged: state.user.logged,
    userId: state.user.id,
    taskList: state.task.taskList
});
const mapDispatchToProps = dispatch => ({
    resetTaskList: taskList => dispatch({ type: TASK_LIST, payload: { taskList } })
});

export default connect(mapStateToProps, mapDispatchToProps)(MyTask);
const Styles = StyleSheet.create({
    miningItem: { margin: 5, marginBottom: 0, backgroundColor: '#53b488', borderRadius: 5, padding: 15 },
    miningItemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    miningItemName: { fontSize: 18, color: '#ffffff' },
    miningItemActivity: { fontSize: 14, color: '#ffffff' },
    miningItembody: { marginTop: 5, flexDirection: 'row', justifyContent: 'space-between' },
    miningItemGemin: { fontSize: 14, color: '#ffffff' },
    miningItemGemout: { marginTop: 6, fontSize: 14, color: '#ffffff' },
    miningItemTime: { marginTop: 6, fontSize: 14, color: '#ffffff', width: Metrics.screenWidth * 0.9 },
    miningItemFooter: { alignSelf: 'flex-end', justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderWidth: 1, borderColor: '#ffffff', padding: 18, paddingTop: 10, paddingBottom: 10 },
    miningItemExchange: { fontSize: 18, color: '#ffffff' },
});