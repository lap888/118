import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    View, Text, StyleSheet, TouchableOpacity,
    TextInput, Keyboard, ScrollView, TouchableWithoutFeedback, Switch, Animated
} from 'react-native';
import { Input, Icon, } from 'native-base';
import { SimpleItemsDialog } from 'react-native-pickers';
import { Actions } from 'react-native-router-flux';

import { Header } from '../../components/Index';
import { Colors, Metrics } from '../../theme/Index';
import {
    Add_Task, Modify_Task_auditHour, Modify_Task_submitHour, Modify_Task_project,
    Modify_Task_title, Modify_Task_desc, Modify_Task_isRepeat, Modify_Task_rewardType, Modify_Task_unitPrice,
    Modify_Task_total, Modify_Task_cateId, Modify_Task_remainderCount, Modify_Task_commission
} from '../../../redux/ActionTypes';
import { Toast } from '../../common';

class PublicYoTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            headerTitle: props.title == "" ? "发布任务" : props.title,
            taskId: 0,
            userPic: "",
            project: "",
            title: "",
            cateId: props.type,
            desc: "",
            submitHour: 0,
            auditHour: 0,
            isRepeat: props.yoBang.isRepeat != 1 ? props.yoBang.isRepeat : 1,
            commission:  props.yoBang.commission,
            rewardType: props.yoBang.rewardType,
            unitPrice: props.yoBang.unitPrice != 0 ? props.yoBang.unitPrice : 0,
            total: props.yoBang.total != 0 ? props.yoBang.total : 0,
            bottom: new Animated.Value(-276),
            opacity: new Animated.Value(0),
            limitType: ''
        };
    }
    /**
     * onLimitPress
     */
    onLimitPress(type) {
        this.setState({
            limitType: type
        }, Animated.parallel([
            Animated.timing(this.state.bottom, {
                toValue: 0,
                duration: 400,
                useNativeDriver: false
            }),
            Animated.timing(this.state.opacity, {
                toValue: 0.81,
                duration: 400,
                useNativeDriver: false
            }),
        ], { useNativeDriver: false }).start());
    }
    /**
	 * 关闭分享Board
	 */
    closeLimitBoard() {
        Animated.parallel([
            Animated.timing(this.state.bottom, {
                toValue: -276,
                duration: 400,
                useNativeDriver: false
            }),
            Animated.timing(this.state.opacity, {
                toValue: 0,
                duration: 400,
                useNativeDriver: false
            }),
        ], { useNativeDriver: false }).start();
    }
    onLimitBoardPress(time) {
        if (this.state.limitType == 'limitSubTime') {
            this.props.Modify_Task_submitHour(time);
            this.setState({
                submitHour: time
            }, () => {
                this.closeLimitBoard()
            });
        } else if (this.state.limitType == 'reviewTime') {
            this.props.Modify_Task_auditHour(time);
            this.setState({
                auditHour: time
            }, () => {
                this.closeLimitBoard()
            });
        }
    }
    /**
	 * 渲染分享Board
	 */
    renderLimitBoard() {
        return (
            <Animated.View style={[styles.shareContainer, { bottom: this.state.bottom, useNativeDriver: false}]}>
                <View style={styles.shareBody}>
                    <View style={styles.selectItem}><Text>选择时间(小时)</Text></View>
                    <TouchableWithoutFeedback onPress={() => { this.onLimitBoardPress(1) }}>
                        <View style={styles.selectItem}><Text>1小时</Text></View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => { this.onLimitBoardPress(6) }}>
                        <View style={styles.selectItem}><Text>6小时</Text></View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => { this.onLimitBoardPress(24) }}>
                        <View style={styles.selectItem}><Text>24小时</Text></View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => { this.onLimitBoardPress(48) }}>
                        <View style={styles.selectItem}><Text>48小时</Text></View>
                    </TouchableWithoutFeedback>
                </View>
                <TouchableOpacity style={{ position: 'absolute', bottom: 0, alignSelf: 'center' }} onPress={() => this.closeLimitBoard()}>
                    <View style={styles.shareFooter}>
                        <Text style={styles.shareFooterText}>取消</Text>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        )
    }
    onNextStepPress() {
        if (this.props.yoBang.project == '' || this.props.yoBang.desc == '' || this.props.yoBang.title == '') {
            Toast.tipBottom('所有选项不能为空');
            return;
        }
        if (this.props.yoBang.total < 10) {
            Toast.tipBottom('任务数量不得小于10个');
            return;
        }
        if (this.props.yoBang.unitPrice < 1) {
            let msg = this.props.yoBang.rewardType == 1 ? '悬赏单价不能低于1元' : '悬赏单价不能低于1糖果';
            // let msg = '悬赏单价不能低于1糖果';
            Toast.tipBottom(msg);
            return;
        }
        if (isNaN(this.props.yoBang.unitPrice)) {
            Toast.tipBottom('单价必须是数字');
            return;
        }
        if (isNaN(this.props.yoBang.total)) {
            Toast.tipBottom('数量必须是数字');
            return;
        }
        let totalPrice = this.props.yoBang.unitPrice * this.props.yoBang.total;
        let totalNum = this.props.yoBang.rewardType == 1 ? this.props.userBalanceNormal : this.props.candyNum;
        // let totalNum =  this.props.candyNum;
        // console.warn('totalPrice: ', totalPrice);
        // console.warn('totalNum: ', totalNum);
        if (totalNum < totalPrice) {
            Toast.tipBottom('余额不足');
            return;
        }
        this.props.Modify_Task_cateId(this.state.cateId);
        this.props.Modify_Task_remainderCount(this.props.yoBang.total);
        Actions.push('PublicStep', { headerTitle: this.state.headerTitle });

    }
    render() {
        let {
            unitPrice,
            total,
            isRepeat,
            rewardType,
            commission
        } = this.state;
        let { yoBang } = this.props;
        return (
            <View style={{ flex: 1, backgroundColor: Colors.backgroundColor}}>
                <Header title={this.state.headerTitle} />
                <ScrollView contentContainerStyle={styles.viewStyle}>
                    <View style={styles.labelContainer}>
                        <Text style={styles.lableTxt}>项目名称:</Text>
                        <Input style={styles.lableTxt} defaultValue={yoBang.project} placeholder='必须真实项目名 否则不通过' onChangeText={(value) => {
                            this.props.Modify_Task_project(value);
                            this.setState({ project: value })
                        }} />
                    </View>
                    <View style={styles.labelContainer}>
                        <Text style={styles.lableTxt}>悬赏标题:</Text>
                        <Input style={styles.lableTxt} defaultValue={yoBang.title} placeholder='设置一个悬赏标题' onChangeText={(value) => {
                            this.props.Modify_Task_title(value);
                            this.setState({ title: value })
                        }} />
                    </View>
                    <View style={styles.labelContainer}>
                        <Text style={styles.lableTxt}>任务描述:</Text>
                        <Input style={styles.lableTxt} defaultValue={yoBang.desc} placeholder='描述一下任务的要求与限制' onChangeText={(value) => {
                            this.props.Modify_Task_desc(value);
                            this.setState({ desc: value })
                        }} />
                    </View>
                    <View style={styles.labelContainer}>
                        <Text style={styles.lableTxt}>提交时间:</Text>
                        <TouchableWithoutFeedback onPress={() => this.onLimitPress('limitSubTime')}>
                            <Text style={styles.lableTxt}>{`限制${yoBang.submitHour}小时内提交`}</Text>
                        </TouchableWithoutFeedback>
                        <Icon name="arrow-forward" style={{ color: Colors.LightG, fontSize: 20 }} />
                    </View>
                    <View style={styles.labelContainer}>
                        <Text style={styles.lableTxt}>审核时间:</Text>
                        <TouchableWithoutFeedback onPress={() => this.onLimitPress('reviewTime')}>
                            <Text style={styles.lableTxt}>{`将在${yoBang.auditHour}小时内审核`}</Text>
                        </TouchableWithoutFeedback>
                        <Icon name="arrow-forward" style={{ color: Colors.LightG, fontSize: 20 }} />
                    </View>
                    <View style={styles.labelContainer}>
                        <Text style={styles.lableTxt}>重复任务:</Text>
                        <View style={{ flex: 1, flexDirection: "row", justifyContent: 'center', alignContent: 'center' }}>
                            <Text style={[styles.lableTxt, { marginTop: 5 }]}>{isRepeat == 1 ? '只能一次' : '每天一次'}</Text>
                            <Switch style={{ fontSize: 12, marginLeft: 10 }} value={isRepeat == 1 ? true : false} onValueChange={value => {
                                if (value == 1) {
                                    this.props.Modify_Task_isRepeat(value);
                                    this.setState({ isRepeat: value })
                                } else {
                                    this.props.Modify_Task_isRepeat(2);
                                    this.setState({ isRepeat: 2 })
                                }
                            }} />
                        </View>
                    </View>
                    <View style={styles.labelContainer}>
                        <Text style={styles.lableTxt}>任务类型:</Text>
                        <View style={{ flex: 1, flexDirection: "row", justifyContent: 'center', alignContent: 'center' }}>
                            {/* <Text style={[styles.lableTxt, { marginTop: 5 }]}>{rewardType == 1 ? '现金任务' : '糖果任务'}</Text> */}
                            {rewardType == 1 && <Text style={[styles.lableTxt, { marginTop: 5 }]} onPress={() => this.SimpleItemsDialog.show()}>{'现金任务 >'}</Text>}
                            {rewardType == 2 && <Text style={[styles.lableTxt, { marginTop: 5 }]} onPress={() => this.SimpleItemsDialog.show()}>{'糖果任务 >'}</Text>}
                            {rewardType == 3 && <Text style={[styles.lableTxt, { marginTop: 5 }]} onPress={() => this.SimpleItemsDialog.show()}>{'USDT任务 >'}</Text>}
                            {/* <Switch style={{ fontSize: 12, marginLeft: 10 }} value={rewardType == 1 ? true : false} onValueChange={value => {
                                console.warn(value);
                                if (value) {
                                    this.props.Modify_Task_rewardType(1);
                                    this.setState({ rewardType: 1 })
                                } else {
                                    this.props.Modify_Task_rewardType(2);
                                    this.setState({ rewardType: 2 })
                                }
                            }} /> */}
                        </View>
                    </View>
                    <View style={styles.labelContainer}>
                        <Text style={styles.lableTxt}>手续费抵扣:</Text>
                        <View style={{ flex: 1, flexDirection: "row", justifyContent: 'center', alignContent: 'center' }}>
                            <Text style={[styles.lableTxt, { marginTop: 5 }]}>{commission == 0 ? '不抵扣' : 'YB抵扣'}</Text>
                            <Switch style={{ fontSize: 12, marginLeft: 10 }} value={commission == 1 ? true : false} onValueChange={value => {
                                if (value == 0) {
                                    this.props.Modify_Task_commission(0)
                                    this.setState({ commission: 0 })
                                } else {
                                    this.props.Modify_Task_commission(1)
                                    this.setState({ commission: 1 })
                                }
                            }} />
                        </View>
                    </View>
                    <View style={styles.labelContainer}>
                        <Text style={styles.lableTxt}>悬赏单价:</Text>
                        {/* <Input style={styles.lableTxt} defaultValue={`${this.state.unitPrice}`} placeholder='1(糖果/人)' keyboardType="numeric" onChangeText={(value) => { */}
                        <Input style={styles.lableTxt} defaultValue={`${this.state.unitPrice}`} placeholder='1(糖果|元|USDT)/人' keyboardType="numeric" onChangeText={(value) => {
                            this.props.Modify_Task_unitPrice(value);
                            this.setState({ unitPrice: value })
                        }} />
                    </View>
                    <View style={styles.labelContainer}>
                        <Text style={styles.lableTxt}>悬赏名额:</Text>
                        <Input style={styles.lableTxt} defaultValue={`${this.state.total}`} placeholder='最少10人' keyboardType="numeric" onChangeText={(value) => {
                            this.props.Modify_Task_total(value);
                            this.setState({ total: value })
                        }} />
                    </View>
                    <View style={{ alignItems: 'center', marginTop: 20 }}>
                        <Text style={{ color: Colors.main }}>预估费用:{unitPrice * total}{rewardType == 1 ? '元' : rewardType == 2 ? '糖果' : 'USDT'} 手续费:15%</Text>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: "center" }}>
                        <TouchableOpacity onPress={() => this.onNextStepPress()}>
                            <View style={styles.nextStepBtn} >
                                <Text style={{ padding: 15, color: "#ffffff" }}>下一步(设置步骤)</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                {this.renderLimitBoard()}
                <SimpleItemsDialog 
                    items={[
                        { key: 1, name: '现金任务' },
                        { key: 2, name: '糖果任务' },
                        { key: 3, name: 'USDT任务' },
                    ]}
                    itemKey={'name'}
                    cance={false}
                    onPress={(value) => {
                        console.log('value: ', value);
                        this.setState({rewardType: value + 1})
                    }}
                    ref={ref => this.SimpleItemsDialog = ref}/>
            </View >
        );
    }
}
const mapStateToProps = state => ({
    logged: state.user.logged,
    userId: state.user.id,
    candyNum: state.user.candyNum,
    userBalanceNormal: state.dividend.userBalanceNormal,
    yoBang: state.yoBang
});

const mapDispatchToProps = dispatch => ({
    AddTask: (data) => dispatch({ type: Add_Task, payload: { taskBase: data } }),
    Modify_Task_auditHour: (data) => dispatch({ type: Modify_Task_auditHour, payload: { auditHour: data } }),
    Modify_Task_submitHour: (data) => dispatch({ type: Modify_Task_submitHour, payload: { submitHour: data } }),
    Modify_Task_project: (data) => dispatch({ type: Modify_Task_project, payload: { project: data } }),
    Modify_Task_title: (data) => dispatch({ type: Modify_Task_title, payload: { title: data } }),
    Modify_Task_desc: (data) => dispatch({ type: Modify_Task_desc, payload: { desc: data } }),
    Modify_Task_isRepeat: (data) => dispatch({ type: Modify_Task_isRepeat, payload: { isRepeat: data } }),
    Modify_Task_rewardType: (data) => dispatch({ type: Modify_Task_rewardType, payload: { rewardType: data } }),
    Modify_Task_unitPrice: (data) => dispatch({ type: Modify_Task_unitPrice, payload: { unitPrice: data } }),
    Modify_Task_total: (data) => dispatch({ type: Modify_Task_total, payload: { total: data } }),
    Modify_Task_cateId: (data) => dispatch({ type: Modify_Task_cateId, payload: { cateId: data } }),
    Modify_Task_remainderCount: (data) => dispatch({ type: Modify_Task_remainderCount, payload: { remainderCount: data } }),
    Modify_Task_commission: (data) => dispatch({ type: Modify_Task_commission, payload: { commission: data } })
});

export default connect(mapStateToProps, mapDispatchToProps)(PublicYoTask);
const styles = StyleSheet.create({
    viewStyle: {
        padding: 10,
    },
    labelContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 52,
        marginLeft: 10,
        paddingRight: 10,
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.C12
    },
    lableTxt: { fontSize: 16, color: Colors.C11 },
    shareContainer: { position: 'absolute', backgroundColor: Colors.White, height: 276, left: 0, right: 0, borderTopLeftRadius: 10, borderTopRightRadius: 10 },
    shareHeader: { alignSelf: 'center', padding: 20, fontSize: 16, fontWeight: "400" },
    shareBody: { flexDirection: 'column', paddingTop: 20 },
    shareItem: { justifyContent: 'center', alignItems: 'center', paddingLeft: 20 },
    shareImage: { justifyContent: 'center', alignItems: 'center', width: 50, height: 50 },
    shareText: { marginTop: 6 },
    shareFooter: { alignSelf: 'center', padding: 20 },
    shareFooterText: { fontSize: 16, fontWeight: "400" },
    selectItem: {
        borderBottomColor: Colors.C16, borderBottomWidth: 1, width: Metrics.screenWidth, paddingBottom: 10, paddingTop: 10, justifyContent: 'center', alignItems: 'center'
    },
    nextStepBtn: { marginTop: 50, width: Metrics.screenWidth * 0.6, backgroundColor: Colors.C6, alignItems: "center", borderRadius: 8 }
});

