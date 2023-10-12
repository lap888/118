import React, { Component } from 'react';
import { View, Text, StyleSheet, Modal, Alert, ScrollView, Image, TouchableOpacity, TextInput, Keyboard, DeviceEventEmitter } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { Header, PicturePreview } from '../../components/Index';
import { Colors, Metrics } from '../../theme/Index';
import { Send } from '../../../utils/Http';
import { Toast } from '../../common';

class TaskSubRecordDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataList: [],
            picturePreviewList: [], 		// 预览图片
            picturePreviewModalVisible: false,	// 预览弹框
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0,
            modalObtainedBuyListVisible: false,
            optionLoading: false,
            remark: ''
        };
    }

    /**
     * 预览/申请发布
     */
    confirmPaid(type) {
        if (type == 'preView') {
            console.log('object', JSON.stringify({ recordId: this.props.recordId, taskId: this.props.taskId, recordState: 4 }))
            let that = this;
            Alert.alert(
                "审核通过提醒",
                `发放赏金`,
                [
                    {
                        text: "确定", onPress: () => {
                            //通过审核
                            Send('api/YoBang/TaskAudit', { recordId: that.props.recordId, taskId: that.props.taskId, recordState: 4 }).then(res => {
                                if (res.code == 200) {
                                    Toast.tipBottom('审核通过');
                                    DeviceEventEmitter.emit('refranshTaskList');
                                    Actions.pop();
                                } else {
                                    Toast.tipBottom(res.message);
                                }
                            })
                        }
                    },
                    { text: "取消", onPress: () => { } },
                ],
                { onDismiss: () => { } }
            )
        } else {
            this.onPressObtained()
        }
    }
    /**
     * 拒绝
     */
    onPressObtained() {
        this.setState({ modalObtainedBuyListVisible: true });
    }
    /**
   * 取消下架线上买单
   */
    cancleObtainedBuyTransaction() {
        this.setState({ modalObtainedBuyListVisible: false, remark: "" });
    }
    confirmObtainedBuyTransaction() {
        Keyboard.dismiss();
        let { remark } = this.state;
        if (remark.trim() === "") {
            Toast.tipBottom('请输入原因');
            return;
        }
        var that = this;
        if (!that.state.optionLoading) that.setState({ optionLoading: true });
        Send('api/YoBang/TaskAudit', { recordId: this.props.recordId, taskId: this.props.taskId, recordState: 6, remark: this.state.remark }).then(res => {
            if (res.code == 200) {
                that.setState({ modalObtainedBuyListVisible: false, remark: "" });
                that.setState({ optionLoading: false });
                DeviceEventEmitter.emit('refranshTaskList');
                Actions.pop();
            } else {
                that.setState({ modalObtainedBuyListVisible: false, remark: "" });
                that.setState({ optionLoading: false });
                Toast.tipBottom(res.message);
            }
        })
    }
    /**
   * 渲染下架买单Form表单
   */
    renderModalCancleBuyList() {
        let { modalObtainedBuyListVisible, remark, optionLoading } = this.state;
        return (
            <Modal animationType='slide' visible={modalObtainedBuyListVisible} transparent onRequestClose={() => { }}>
                <View style={{ flex: 1, backgroundColor: 'transparent' }}>
                    <View style={Styles.modalBody}>
                        <View style={{ marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: Colors.main, fontSize: 20, fontWeight: 'bold' }}>拒绝原因</Text>
                        </View>
                        <View style={[Styles.modalBodyPrice, { marginTop: 40 }]}>
                            <View style={Styles.modalBodyLeft}>
                                <Text style={Styles.price}>说明</Text>
                            </View>
                            <View style={Styles.modalBodyRight}>
                                <View style={Styles.textInputContainer}>
                                    <TextInput 
                                        style={Styles.publishTextInput} 
                                        placeholder="请输入文字说明" 
                                        placeholderTextColor={Colors.C10} 
                                        underlineColorAndroid="transparent"
                                        multiline={true}
                                        value={remark}
                                        onChangeText={remark => this.setState({ remark })}
                                        returnKeyType="done"
                                        onSubmitEditing={() => this.confirmObtainedBuyTransaction()}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={Styles.modalFooter}>
                            <TouchableOpacity disabled={optionLoading} onPress={() => this.cancleObtainedBuyTransaction()}>
                                <View style={[Styles.publishConfirm, { backgroundColor: Colors.LightG }]}>
                                    <Text style={Styles.publishConfirmText}>取消</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity disabled={optionLoading} onPress={() => this.confirmObtainedBuyTransaction()}>
                                <View style={[Styles.publishConfirm, { backgroundColor: Colors.C6 }]}>
                                    <Text style={Styles.publishConfirmText}>{optionLoading ? '下架中...' : '确定'}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={Styles.modalHeader} />
                </View>
            </Modal>
        )
    }
    /**
	 * 调起图片预览组件
	 */
    handelPreviewImage(source) {
        this.setState({ picturePreviewList: [{ uri: source }] }, () => {
            if (!this.state.picturePreviewModalVisible) this.setState({ picturePreviewModalVisible: true });
        });
    }
    /**
	 * 渲染截图
	 */
    renderScreenShot() {
        let { taskSteps } = this.props;
        return (
            taskSteps.map(item => {
                return (
                    <View style={{ flexDirection: 'row', margin: 10, marginBottom: 0, padding: 10, borderColor: Colors.main, borderWidth: 1, borderRadius: 5 }} key={`${item['typeUrl']}_${item['id']}`}>
                        <View style={{ alignItems: 'center', width: 120 }}>
                            <View style={{ marginBottom: 10}}>
                                <Text style={{ fontSize: 16, color: Colors.C12 }}>{`${item['describe']} `}</Text>
                            </View>
                            <TouchableOpacity style={Styles.imgView} onPress={() => this.handelPreviewImage(item['content'])}>
                                <Image source={{ uri: item['content'] }} style={Styles.screenshotImg} />
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            }
            )
        )
    }
    /**
         * 渲染Footer
         */
    renderFooter() {
        return (
            <View style={Styles.footerStyle}>
                <TouchableOpacity onPress={() => this.confirmPaid('preView')}>
                    <View style={Styles.footerBtn}>
                        <Text style={Styles.footerTxt}>审核通过</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.confirmPaid('publish')}>
                    <View style={Styles.footerBtn}>
                        <Text style={Styles.footerTxt}>审核失败</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
    /**
   * 渲染变色版
   */
    renderGradient() {
        let { taskTitle, userNick, userPic, auditCutoffTime, submitTime, cutoffTime, taskId, userId } = this.props;
        return (
            <View style={Styles.gradient}>
                <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={{ uri: userPic }} style={[Styles.avatar]} />
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <Text style={Styles.version} numberOfLines={1}>{userNick}</Text>
                            <Text style={Styles.version}>{`用户ID:${userId}`}</Text>
                        </View>
                    </View>
                    <View style={Styles.setting}>
                        <Text style={Styles.version}>{`任务ID:${taskId}`}</Text>
                    </View>
                </View>
                <Text style={Styles.inviteCode} numberOfLines={2} >{`${taskTitle}`}</Text>
                <Text style={Styles.inviteCode} numberOfLines={1}>{`提交时间：${submitTime}`}</Text>
                <Text style={Styles.inviteCode} numberOfLines={1}>{`截止时间：${auditCutoffTime}`}</Text>
            </View>
        )
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.backgroundColor }}>
                <Header title="审核详情" />
                <ScrollView>
                    {this.renderGradient()}
                    {this.renderScreenShot()}
                    {this.renderModalCancleBuyList()}
                </ScrollView>
                <PicturePreview
                    data={this.state.picturePreviewList}
                    visible={this.state.picturePreviewModalVisible}
                    onClose={() => this.setState({ picturePreviewModalVisible: false })}
                />
                {this.renderFooter()}
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

export default connect(mapStateToProps, mapDispatchToProps)(TaskSubRecordDetail);

const Styles = StyleSheet.create({
    publishBuy: { color: Colors.main, fontSize: 20, fontWeight: 'bold' },
    container: { flex: 1, backgroundColor: "#ffffff" },
    gradient: { padding: 15, paddingTop: 0, paddingBottom: 10 },
    avatar: { width: 60, height: 60, borderRadius: 30, borderWidth: 0.5, borderColor: Colors.C8 },
    inviteCode: { fontSize: 12, color: Colors.C12, fontSize: 14, marginTop: 5 },
    setting: { paddingLeft: 30, paddingBottom: 30, paddingTop: 10, alignItems: 'flex-end' },
    version: { marginTop: 2, fontSize: 14, color: Colors.C12 },
    footerStyle: {
        height: 50,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: Colors.C6,
    },
    footerBtn: {
        alignItems: "center",
        backgroundColor: Colors.C8,
        padding: 11,
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 20,
    },
    modalHeader: { flex: 1, opacity: 0.6, backgroundColor: '#FFFFFF' },
    price: { fontSize: 14, color: Colors.C12 },
    publishConfirm: { height: 60, width: Metrics.screenWidth * 0.5, justifyContent: 'center', alignItems: 'center' },
    publishConfirmText: { fontSize: 16, color: '#FFFFFF', fontWeight: 'bold' },
    publishTextInput: { flex: 1, color: Colors.C12, textAlignVertical: 'top' },
    textInputContainer: { marginLeft: 10, paddingLeft: 8, width: Metrics.screenWidth * 0.7 * 0.8, height: 80, borderRadius: 6, backgroundColor: Colors.backgroundColor },
    modalBody: { paddingTop: Metrics.PADDING_BOTTOM, flexDirection: "column", justifyContent: 'flex-end', backgroundColor: Colors.White, width: Metrics.screenWidth },
    publishBuy: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
    modalBodyPrice: { marginTop: 12, flexDirection: 'row', alignItems: 'center' },
    modalBodyLeft: { width: Metrics.screenWidth * 0.3, alignItems: 'flex-end' },
    modalBodyRight: { width: Metrics.screenWidth * 0.7, alignItems: 'flex-start' },
    modalFooter: { flexDirection: 'row', marginTop: 20 },
    uploadView: {
        width: 100,
        padding: 12,
        backgroundColor: Colors.White,
        alignItems: "center",
        borderRadius: 8,
    },
    imgView: {
        width: 122,
        height: 182,
        borderRadius: 10,
        borderColor: Colors.main,
        borderWidth: 1
    },
    screenshotImg: {
        width: 120,
        height: 180,
        resizeMode: "stretch",
        borderRadius: 10,
    },
});
