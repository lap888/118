import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    View, Text, StyleSheet, Modal, Image, TouchableOpacity,
    TextInput, Keyboard, ScrollView, TouchableWithoutFeedback, Switch, Animated, Linking, Platform
} from 'react-native';
import Clipboard from '@react-native-community/clipboard';

import { launchImageLibrary } from 'react-native-image-picker';
import FontAwesome from "react-native-vector-icons/FontAwesome";
// import { Toast } from 'native-base';
import Toast from '../../common/Toast';
import LinearGradient from 'react-native-linear-gradient';
import { Header, PicturePreview } from '../../components/Index';
import { Colors, Metrics } from '../../theme/Index';
import {
    Add_Task_Step
} from '../../../redux/ActionTypes';
import { Send } from '../../../utils/Http';
import ActionButton from 'react-native-action-button';
import { Actions } from 'react-native-router-flux';
//首页预加载bar
let PROFILE_BAR = [
    { key: "remainderCount", title: "剩余数量", router: "CandyDetail" },
    { key: "finishCount", title: "完成数量", router: "CandyH" },
    { key: "submitHour", title: "做单时间", router: "CandyP" },
    { key: "auditHour", title: "审核时间", router: "GameDividend" },
];
class ViewTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            picturePreviewList: [], 		// 预览图片
            picturePreviewModalVisible: false,	// 预览弹框
            clipboardWarnText: '复制数据',
            yoBang: props.yoBangBaseTask,
            yoBangSteps: [],
            isDoTaskState: 0,
            steps: []
        };
    }

    componentDidMount() {
        Send(`api/YoBang/TaskDetail`, { taskId: this.state.yoBang.taskId }).then(res => {
            this.setState({
                yoBangSteps: res.data.steps,
                isDoTaskState: res.data.isDoTaskState
            });
        });
        if (this.state.isDoTaskState == 0) {
            Toast.tipBottom('请先报名再去做任务');
        } else {
            Toast.tipBottom('已经报名可以去任务');
        }
    }

    onRightPress() {
        Send(`api/system/CopyWriting?type=yobang_rule`, {}, 'get').then(res => {
            Actions.push('CommonRules', { title: '哟帮规则', rules: res.data });
        });
    }
    renderProfile() {
        return (
            <View style={[Styles.profile, { marginTop: 10 }]}>
                {PROFILE_BAR.map(item => {
                    let { key, title } = item;
                    let value = (this.state.yoBang[key] == 'undefined' || this.state.yoBang[key] == null) ? 0 : this.state.yoBang[key];
                    return (
                        <View key={key} style={Styles.profileItem}>
                            <Text style={[Styles.profileText]}>{value}</Text>
                            <Text style={Styles.profileTitle}>{title}</Text>
                        </View>
                    )
                })}
            </View>
        )
    }
    /**
     * 渲染变色版
     */
    renderGradient() {
        let { yoBang } = this.state;
        let { userPic, publisher, rewardType } = yoBang;
        let avatar = userPic;
        let userId = publisher;
        return (
            <View style={{}}>
                <View style={{ flexDirection: 'row', backgroundColor: Colors.White, paddingHorizontal: 15, paddingVertical: 10 }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View>
                            <View style={{flexDirection: 'row', height: 70, overflow: 'hidden'}}>
                                <Image source={{ uri: avatar }} style={[Styles.avatar, { marginBottom: 10, overlayColor: Colors.transparent }]} />
                                <Text style={[Styles.version, {marginLeft: 10, marginTop: 10}]}>{`商家ID:${userId}`}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ height: 20, backgroundColor: Colors.main, borderRadius: 10, paddingHorizontal: 10, justifyContent: 'center' }}>
                                    <Text style={Styles.inviteCode}>{yoBang.project}</Text>
                                </View>
                                <View style={{ height: 20, marginLeft: 10, backgroundColor: Colors.main, borderRadius: 10, paddingHorizontal: 10, justifyContent: 'center' }}>
                                    <Text style={Styles.inviteCode}>{yoBang.cateId == 1 ? '下载APP' : yoBang.cateId == 2 ? '账号注册' : yoBang.cateId == 3 ? '认证绑卡' : '其他'}</Text>
                                </View>
                            </View>
                            <Text style={{ fontSize: 14, marginTop: 10, color: Colors.C12 }} numberOfLines={2}>{yoBang.title}</Text>
                        </View>
                        <View style={{ flex: 1, marginTop: 10 }}>
                            {/* <Text style={Styles.version}>{`商家ID:${userId}`}</Text> */}
                        </View>
                    </View>
                    <View style={Styles.setting}>
                        <Text style={Styles.version}>{`任务ID:${yoBang.taskId}`}</Text>
                        <Text style={Styles.nickname} numberOfLines={2}>{`${yoBang.unitPrice} ${rewardType == 1 ? '元' : rewardType == 2 ? '糖果' : 'USDT'}`}</Text>
                    </View>
                </View>
                {this.renderProfile()}
            </View>
        )
    }
    renderLevelBar() {
        return (
            <View style={Styles.level}>
                <View style={{ marginLeft: 15, marginRight: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={Styles.contributionValueText}>{`任务说明`}</Text>
                    </View>
                </View>
                <View style={{ height: 40, width: 1, backgroundColor: Colors.C7 }} />
                <View style={{ flex: 1, paddingLeft: 12 }}>
                    <Text style={Styles.levelPropaganda}>{`先报名再做任务,按时提交，否则无赏金！`}</Text>
                    <Text style={[Styles.levelPropaganda, { marginTop: 4, fontSize: 12 }]}>{this.state.yoBang.desc}</Text>
                </View>
            </View>
        )
    }
    /**
     * 调起相册
     */
    handleImagePicker(key, item) {
        const options = {
            cameraType: 'back',
            mediaType: 'photo',
            videoQuality: 'high',
            durationLimit: 10,
            maxWidth: 600,
            maxHeight: 600,
            quality: 1,
            includeBase64: true,
            saveToPhotos: false
        };
        let that = this;
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('用户取消了选择图片');
            } else if (response.errorCode) {
                console.log('launchImageLibrary 错误: ', response.errorMessage);
            } else {
                let data = {};
                data.id = item.id;
                data.type = 5;
                data.describe = item.describe;
                data.content = 'data:image/jpeg;base64,' + response.base64;
                data.sort = item.sort;
                that.setState({ [key]: 'data:image/jpeg;base64,' + response.base64, steps: [...this.state.steps, data] });
            }
        });
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
        let { yoBangSteps } = this.state;
        return (
            yoBangSteps.map(item => {
                return (
                    <View style={{ backgroundColor: Colors.White, flexDirection: 'row', margin: 15, marginBottom: 0, padding: 10, borderColor: Colors.main, borderWidth: 0, borderRadius: 5 }} key={`${item['type']}_${item['id']}`}>
                        {
                            item.type == 1 || item.type == 4 ?
                                <View style={{ alignItems: 'center', width: 120}}>
                                    <View>
                                        <Text style={{ fontSize: 16, color: Colors.C12 }}>{`${item['describe']} `}</Text>
                                    </View>
                                    <View style={{ padding: 5, borderWidth: 1, borderColor: Colors.main, borderRadius: 4, alignItems: 'center' }}>
                                        <Text numberOfLines={1} style={{ fontSize: 14, color: Colors.main }}>{`${item['content']}`}</Text>
                                    </View>
                                </View>
                                : item.type == 2 || item.type == 3 || item.type == 5 ?
                                    <View style={{ alignItems: 'center', width: 120 }}>
                                        <View  style={{ flex: 1 }}>
                                            <Text style={{ fontSize: 16, color: Colors.C12 }}>{`${item['describe']} `}</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => this.handelPreviewImage(item['content'])}>
                                            <Image source={{ uri: item['content'] }} style={Styles.screenshotImg} />
                                        </TouchableOpacity>
                                    </View>
                                    : item.type == 6 ?
                                        <View style={{ alignItems: 'center', width: 120 }}>
                                            <View>
                                                <Text style={{ fontSize: 16, color: Colors.C12 }}>{`${item['describe']}`}</Text>
                                            </View>
                                            <View style={{ borderWidth: 1, width: 120, marginLeft: 5, borderColor: Colors.White, borderRadius: 5, alignItems: 'center' }}>
                                                <TextInput numberOfLines={1} style={{ fontSize: 16, color: Colors.White }} />
                                            </View>
                                        </View>
                                        : <View></View>
                        }
                        <View style={{ width: 120, marginLeft: 30, alignItems: 'center' }}>
                            {item.type == 5 ?
                                <View style={Styles.uploadView} onPress={() => this.handleImagePicker(`${item['type']}_${item['id']}`, item)}>
                                    {/* <Text style={{ color: Colors.C12, fontSize: 14 }}>上传截图</Text> */}
                                </View>
                                : item.type == 1 ?
                                    <View style={Styles.uploadView}>
                                        <TouchableOpacity
                                            style={{paddingHorizontal: 10, height: 40, borderRadius: 5, backgroundColor: Colors.main, justifyContent: 'center'}}
                                            onPress={() => {
                                                if (item.content.indexOf('http') > -1 || item.content.indexOf('https') > -1) {
                                                    Linking.openURL(item.content)
                                                } else {
                                                    Toast.tipBottom('链接非法')
                                                }
                                            }}>
                                            <Text style={{ color: Colors.White, fontSize: 14 }}>打开链接</Text>
                                        </TouchableOpacity>
                                    </View> : item.type == 4 ?
                                        <View style={Styles.uploadView}>
                                            <TouchableOpacity
                                                style={{ paddingHorizontal: 10, height: 40, borderRadius: 5, backgroundColor: Colors.main, justifyContent: 'center' }}
                                                onPress={() => {
                                                    Clipboard.setString(item.content);
                                                    this.setState({ clipboardWarnText: "已复制" });
                                                }} >
                                                <Text style={{ color: Colors.White, fontSize: 14 }}>{this.state.clipboardWarnText}</Text>
                                            </TouchableOpacity>
                                        </View>
                                        :
                                        <View />
                            }
                            {item.type == 5 ?
                                <View>
                                    {this.state[`${item['type']}_${item['id']}`] ?
                                        <View>
                                            <Image source={{ uri: this.state[`${item['type']}_${item['id']}`] }} style={Styles.screenshotImg} />
                                            <TouchableOpacity style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.handelPreviewImage(this.state[`${item['type']}_${item['id']}`])}>
                                                <View style={{ transform: [{ rotateZ: '45deg' }] }}>
                                                    <Text allowFontScaling={false} style={{ fontSize: 16, color: Colors.C6, fontWeight: '500' }}>118创富助手专属</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                        :
                                        <TouchableOpacity 
                                            onPress={() => this.handleImagePicker(`${item['type']}_${item['id']}`, item)}
                                            style={[Styles.screenshotImg, { justifyContent: 'center', alignItems: 'center' }]}>
                                            <FontAwesome name="image" color={Colors.main} size={40} />
                                            <Text style={{fontSize: 16, marginTop: 10}}>上传图片</Text>
                                        </TouchableOpacity>
                                    }
                                </View> :
                                <View></View>}
                        </View>
                    </View >
                );
            }
            )
        )
    }
    onPressSubButton(type) {
        if (!this.props.userId) {
            Actions.push("Login");
            return;
        }
        if (type == 0) {
            Send(`api/YoBang/TaskApply`, { taskId: this.state.yoBang.taskId }).then(res => {
                if (res.code == 200) {
                    this.setState({
                        isDoTaskState: 1
                    });
                    Toast.tipBottom('报名成功')
                } else {
                    Toast.tipBottom(res.message)
                }
            });
        } else {
            let num = 0;
            let num2 = 0;
            this.state.yoBangSteps.map((v) => {
                if (v.type == 5 || v.type == 6) {
                    num += 1;
                }
            });
            this.state.steps.map((v) => {
                if (v.type == 5 || v.type == 6) {
                    num2 += 1;
                }
            });
            if (num == num2) {
                Send(`api/YoBang/SubmitTask`, { taskId: this.state.yoBang.taskId, steps: this.state.steps }).then(res => {
                    if (res.code == 200) {
                        Toast.tipBottom('提交成功,请耐心等待审核')
                        Actions.popAndpush('MyYoTask');
                    } else {
                        Toast.tipBottom(res.message)
                    }
                });
            } else {
                Toast.tipBottom('提交信息不完全请仔细核实')
            }
        }
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.backgroundColor }}>
                <Header title="任务详情" rightText="规则" onRightPress={() => this.onRightPress()} />
                <ScrollView contentContainerStyle={{ paddingBottom: 10 }}>
                    {this.renderGradient()}
                    {this.renderLevelBar()}
                    {this.renderScreenShot()}
                </ScrollView>
                {this.state.isDoTaskState == 0 ?
                    <ActionButton buttonColor="rgba(255,165,0,1)" hideShadow={true} buttonText="报名" buttonTextStyle={{ fontSize: 14 }} onPress={() => this.onPressSubButton(0)}>
                    </ActionButton>
                    : <ActionButton buttonColor="rgba(50,205,50,1)" hideShadow={true} buttonText="提交" buttonTextStyle={{ fontSize: 14 }} onPress={() => this.onPressSubButton(1)}>
                    </ActionButton>}
                <PicturePreview
                    data={this.state.picturePreviewList}
                    visible={this.state.picturePreviewModalVisible}
                    onClose={() => this.setState({ picturePreviewModalVisible: false })}
                />
            </View>
        );
    }
}

const mapStateToProps = state => ({
    logged: state.user.logged,
    userId: state.user.id,
    candyNum: state.user.candyNum,
    name: state.user.name,
    logged: state.user.logged,
    mobile: state.user.mobile,
    nickname: state.user.name,
    avatar: state.user.avatarUrl
});

const mapDispatchToProps = dispatch => ({
    AddTaskStep: (data) => dispatch({ type: Add_Task_Step, payload: { taskStep: data } }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewTask);
const Styles = StyleSheet.create({
    gradient: { padding: 15, paddingTop: 0, paddingBottom: 20 },
    avatar: { width: 60, height: 60, borderRadius: 30, borderWidth: 0.5, borderColor: Colors.main },
    nickname: { fontSize: 16, color: Colors.main, marginTop: 5},
    inviteCode: { fontSize: 12, color: Colors.White, },
    setting: { paddingLeft: 30, paddingBottom: 30, paddingTop: 10, alignItems: 'flex-end' },
    version: { marginTop: 2, fontSize: 14, color: Colors.C12 },
    profile: { flexDirection: 'row', alignItems: 'center', borderRadius: 4, borderColor: Colors.main, borderWidth: 1, padding: 5, backgroundColor: Colors.White, marginHorizontal: 15 },
    profileItem: { flex: 1, alignItems: 'center' },
    profileTitle: { marginTop: 2, fontSize: 14, color: Colors.C12 },
    profileText: { fontSize: 14, color: Colors.C12 },
    level: { width: Metrics.screenWidth - 30, marginTop: 10, borderRadius: 15, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.main, padding: 5 },
    levelText: { fontSize: 19, color: Colors.C6, fontWeight: 'bold' },
    contributionValueText: { fontSize: 16, color: Colors.White },
    levelPropaganda: { fontSize: 15, color: Colors.White },
    icon: { width: 30, height: 30 },
    barContainer: { width: Metrics.screenWidth - 30, borderRadius: 15, alignSelf: 'center', backgroundColor: Colors.C12, marginTop: 15 },
    barHeader: { flexDirection: 'row', padding: 15, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: Colors.C7 },
    barTitle: { fontSize: 15, color: Colors.C10, fontWeight: '500' },
    barHeaderRight: { flex: 1 },
    barMore: { textAlign: 'right', fontSize: 14, color: Colors.C10 },
    barBody: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: 10, paddingBottom: 14 },
    barBodyItem: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    barText: { marginTop: 6, fontSize: 14, color: Colors.C10 },
    badge: { position: 'absolute', left: 20, top: -2 },
    uploadView: {
        width: 100,
        padding: 12,
        // backgroundColor: Colors.C6,
        alignItems: "center",
        justifyContent: 'center',
        borderRadius: 8,
        flex: 1
    },
    screenshotImg: {
        marginTop: 14,
        width: 120,
        height: 180,
        resizeMode: "stretch",
        borderRadius: 5,
        borderColor: Colors.main,
        borderWidth: 1
    },
    close: {
        backgroundColor: Colors.C6,
        height: 20,
        width: 20,
        borderRadius: 13,
        position: 'absolute',
        left: -15,
        top: -4
    },
});