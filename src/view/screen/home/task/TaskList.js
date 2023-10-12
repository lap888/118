import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import { TASK_TYPE_LIST, TASK_LIST, UPDATE_USER } from '../../../../redux/ActionTypes';
import { Colors, Metrics } from '../../../theme/Index';
import { EmptyComponent } from '../../../components/Index';
import { Send } from '../../../../utils/Http';
import { Toast } from '../../../common';

class TaskList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstLoad: true,
            showFlag: false,
            clickKey: -1
        };
    }

    componentDidMount() {
        this.getTaskTypeList();
    }

    /**
     * 获取兑换矿机列表
     */
    getTaskTypeList() {
        var that = this;
        Send("api/system/TasksShop2", {}, 'get').then(res => {
            if (that.state.firstLoad) that.setState({ firstLoad: false });
            if (res.code == 200) {
                that.props.resetTaskTypeList(res.data);
            } else {
                Toast.tipBottom(res.message)
            }
        });
    }
    /**
     * 刷新用户数据
     */
    initTask() {
        if (!this.props.userId) return;
        var that = this;
        Send("api/system/TaskList?type=" + 0, {}, 'get').then(res => {
            if (that.state.firstLoad) that.setState({ firstLoad: false });
            if (res.code == 200) {
                that.props.resetTaskList(res.data);
            } else {
                Toast.tipBottom(res.message)
            }
        });
        //刷新用户数据
        Send(`api/InitInfo?userId=${this.props.userId}`, {}, 'GET').then(res => {
            if (res.code == 200) {
                that.props.updateUserInfo(res.data)
            } else {
                Toast.tipBottom(res.message)
            }
        });
    }
    /**
     * 兑换钻石
     * @param {*} minningId 
     */
    ensureExchange(item) {
        var that = this;
        this.setState({
            showFlag: true,
            clickKey: item.minningId
        })
        Send("api/system/Exchange2?minningId=" + item.minningId, {}, 'get').then(result => {
            this.setState({
                showFlag: false,
                clickKey: -1
            })
            Alert.alert(
                `${result.code == 200 ? "兑换成功" : "兑换失败"}`,
                `${result.code == 200 ? `恭喜您购入一个${item['minningName']}\n该任务从次日开始生效` : result.message}`,
                [
                    { text: "确定", onPress: () => that.initTask() },
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
            "兑换提醒",
            `消耗${candyIn}钻石兑换一个${minningName}`,
            [
                { text: "确定", onPress: () => this.ensureExchange(item) },
                { text: "取消", onPress: () => { } },
            ],
            { onDismiss: () => { } }
        )
    }
    /**
     * 渲染Item
     * @param {*} item 
     * @param {*} index 
     */
    renderMiningItem(item, index) {

        return (
            <View>
                {item.storeShow == false ? <View /> :
                    <LinearGradient colors={[item.colors, Colors.LightG]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={Styles.miningItem}>
                        {/* <View style={[Styles.miningItem, { backgroundColor: item.colors }]}> */}
                        <View style={Styles.miningItemHeader}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Icon name="codepen" color={Colors.White} size={20} type="FontAwesome" style={{ marginRight: 4 }} />
                                <Text style={Styles.miningItemName}>{`${item.minningName}`}</Text>
                                <Text style={[Styles.miningItemGemin, { marginLeft: 10 }]}>{`周期 ${item.runTime}`}</Text>
                            </View>
                        </View>
                        <View style={Styles.miningItembody}>
                            <View>
                                <Text style={Styles.miningItemActivity}>{`投入 (钻石) ${item.candyIn}`}</Text>
                                <Text style={Styles.miningItemGemout}>{`产出 (钻石) ${item.candyOut}`}</Text>
                                <Text style={Styles.miningItemGemout}>{`荣耀值 +${item.nlCount}`}</Text>
                                <Text style={Styles.miningItemGemout}>{`活跃度 +${item.teamH}`}</Text>
                                <Text style={Styles.miningItemActivity}>{`兑换上限 ${item.maxHave}`}</Text>
                                {item.candyIn == 0 ? <Text style={Styles.miningItemActivity}>{`收益 100%`}</Text> : <Text style={Styles.miningItemActivity}>{`收益 ${parseInt((item.candyOut - item.candyIn) * 100 / item.candyIn)}%`}</Text>}


                            </View>
                            {item.candyIn !== 0 &&
                                < TouchableOpacity disabled={!this.state.showFlag ? false : true} onPress={() => this.exchangeMining(item)}>
                                    <View style={Styles.miningItemFooter}>
                                        <Text style={Styles.miningItemExchange}>{this.state.clickKey == item.minningId ? '兑换中...' : '兑换'}</Text>
                                    </View>
                                </TouchableOpacity>
                            }
                        </View>
                        {item.remark != "" ?
                            <Text style={{ marginTop: 4, fontSize: 14, color: '#ffffff', width: Metrics.screenWidth * 0.9 }}>{`${item.remark}`}</Text>
                            : <View />
                        }
                    </LinearGradient >
                }
            </View>
        )
    }
    render() {
        return (
            <FlatList
                contentContainerStyle={{ paddingBottom: 10 }}
                data={this.props.taskTypeList}
                renderItem={({ item, index }) => this.renderMiningItem(item, index)}
                ListEmptyComponent={() => <EmptyComponent isLoading={this.state.firstLoad} />}
                keyExtractor={(item, index) => String(index)}
            />
        );
    }
}
const mapStateToProps = state => ({
    logged: state.user.logged,
    userId: state.user.id,
    taskTypeList: state.task.taskTypeList,
});

const mapDispatchToProps = dispatch => ({
    resetTaskTypeList: taskTypeList => dispatch({ type: TASK_TYPE_LIST, payload: { taskTypeList } }),
    resetTask: taskInfo => dispatch({ type: RESET_MINING_TASK, payload: taskInfo }),
    resetTaskList: taskList => dispatch({ type: TASK_LIST, payload: { taskList } }),
    updateUserInfo: (userInfo) => dispatch({ type: UPDATE_USER, payload: { userInfo } })
});

export default connect(mapStateToProps, mapDispatchToProps)(TaskList);

const Styles = StyleSheet.create({
    miningItem: { margin: 10, marginBottom: 0, backgroundColor: '#ffffff', borderRadius: 5, padding: 15 },
    miningItemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    miningItemName: { fontSize: 18, color: '#ffffff' },
    miningItemActivity: { fontSize: 14, color: '#ffffff' },
    miningItembody: { marginTop: 8, flexDirection: 'row', justifyContent: 'space-between' },
    miningItemGemin: { fontSize: 14, color: '#ffffff' },
    miningItemGemout: { marginTop: 4, fontSize: 14, color: '#ffffff' },
    miningItemTime: { marginTop: 4, fontSize: 14, color: '#ffffff' },
    miningItemFooter: { alignSelf: 'flex-end', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#ffffff', borderRadius: 10, padding: 10, paddingTop: 6, paddingBottom: 6 },
    miningItemExchange: { fontSize: 16, color: '#ffffff' },
});
