import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    View, Text, StyleSheet, Modal, Image, TouchableOpacity,
    TextInput, Keyboard, ScrollView, Platform, SafeAreaView
} from 'react-native';

import { launchImageLibrary } from 'react-native-image-picker';
import Icon from "react-native-vector-icons/Ionicons";
import { Header } from '../../components/Index';
import { Colors, Metrics } from '../../theme/Index';
import {
    Add_Task_Step
} from '../../../redux/ActionTypes';
import { Send } from '../../../utils/Http';
import { Actions } from 'react-native-router-flux';
import { Toast } from '../../common';

class PublicStep extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModify: false,
            modifyId: 0,
            modalInputUrlVisible: false,
            modalInputPicAndTxtVisible: false,
            modalInputQrCodeVisible: false,
            modalCopyDataVisible: false,
            modalFindPicVisible: false,
            modalFindTxtVisible: false,
            step: false,
            taskSteps: [],
            optionLoading: false,       // 交易操作状态
            inputUrl: '',//填写网址
            inputUrlDesc: '',//填写网址说明
            inputPicAndTxtImage: '',//图文说明图片
            inputPicAndTxtDesc: '',//图文说明秒速
            inputOrCodeDesc: '', //扫描二维码描述
            inputOrCodeImage: '',//扫描二维码图片
            copyDataDesc: '', //复制数据步骤说明
            copyDataContent: '',//复制数据需要填写的数据
            findPicDesc: '',//收集数据描述
            findPicImage: '',//收集数据截图
            findTxtDesc: ''
        };
    }
    onPressAddStep(value) {
        this.setState({ step: false });
        if (value == 'inputUrl') {
            this.setState({ modalInputUrlVisible: true });
        } else if (value == 'inputPicAndTxt') {
            this.setState({ modalInputPicAndTxtVisible: true })
        } else if (value == 'inputQrCode') {
            this.setState({ modalInputQrCodeVisible: true })
        } else if (value == 'copyData') {
            this.setState({ modalCopyDataVisible: true })
        } else if (value == 'findPic') {
            this.setState({ modalFindPicVisible: true })
        } else if (value == 'findTxt') {
            this.setState({ modalFindTxtVisible: true })
        } else { }
    }
    onPressModifyStep(data) {
        let value = data.typeUrl;
        if (value == 'inputUrl') {
            this.setState({ modalInputUrlVisible: true, isModify: true, modifyId: data.id, inputUrl: data.content, inputUrlDesc: data.describe });
        } else if (value == 'inputPicAndTxt') {
            this.setState({ modalInputPicAndTxtVisible: true, isModify: true, modifyId: data.id, inputPicAndTxtImage: data.content, inputPicAndTxtDesc: data.describe });
        } else if (value == 'inputQrCode') {
            this.setState({ modalInputQrCodeVisible: true, isModify: true, inputOrCodeDesc: data.describe, inputOrCodeImage: data.content })
        } else if (value == 'copyData') {
            this.setState({ modalCopyDataVisible: true, isModify: true, copyDataDesc: data.describe, copyDataContent: data.content })
        } else if (value == 'findPic') {
            this.setState({ modalFindPicVisible: true, isModify: true, findPicDesc: data.describe, findPicImage: data.content })
        } else if (value == 'findTxt') {
            this.setState({ modalFindTxtVisible: true, isModify: true, findTxtDesc: data.describe })
        } else { }
    }
    /**
     * 预览/申请发布
     */
    confirmPaid(type) {
        if (type == 'preView') {
            Actions.push('PreViewTask');
        } else {
            let flag = false;
            this.props.yoBang.steps.map((v) => {
                if (v.type == 5) {
                    flag = true;
                }
            })
            if (!flag) {
                Toast.tipBottom('必须包含收集截图');
            } else {
                Send('api/YoBang/PostTask', this.props.yoBang).then(res => {
                    if (res.code == 200) {
                        Toast.tipBottom('发布成功');
                        Actions.push('YoTaskSetting')

                    } else {
                        Toast.tipBottom(res.message);
                    }
                })
            }
        }
    }
    /**
     * 渲染Footer
     */
    renderFooter() {
        return (
            <View style={Styles.footerStyle}>
                <TouchableOpacity onPress={() => this.confirmPaid('preView')}>
                    <View style={Styles.footerBtn}>
                        <Text style={Styles.footerTxt}>预览</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.confirmPaid('publish')}>
                    <View style={Styles.footerBtn}>
                        <Text style={Styles.footerTxt}>申请发布</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
    /**
     * 取消输入网址
     */
    cancleModalInputUrl(value) {
        if (value == 'inputUrl') {
            this.setState({ modalInputUrlVisible: false, inputUrlDesc: "", inputUrl: "" });
        } else if (value == 'inputPicAndTxt') {
            this.setState({ modalInputPicAndTxtVisible: false, inputPicAndTxtDesc: "", inputPicAndTxtImage: "" });
        } else if (value == 'inputQrCode') {
            this.setState({ modalInputQrCodeVisible: false, inputOrCodeDesc: "", inputOrCodeImage: "" });
        } else if (value == 'copyData') {
            this.setState({ modalCopyDataVisible: false, copyDataDesc: "", copyDataContent: "" })
        } else if (value == 'findPic') {
            this.setState({ modalFindPicVisible: false, findPicDesc: "", findPicImage: "" })
        } else if (value == 'findTxt') {
            this.setState({ modalFindTxtVisible: false, findTxtDesc: "" })
        } else { }
    }
    /**
     * 确认输入网址
     */
    confirmModalInputUrl() {
        if (this.state.inputUrlDesc == '' || this.state.inputUrl == '') {
            Toast.tipBottom('所有选项不能为空')
            // Toast.show({
            //     text: '所有选项不能为空',
            //     textStyle: { color: '#FFFFFF', textAlign: 'center' },
            //     position: "top",
            //     duration: 2000,
            // });
            return;
        }
        let id = this.state.taskSteps.length;
        let data = {};
        data.id = id;
        data.type = 1;
        data.describe = this.state.inputUrlDesc;
        data.content = this.state.inputUrl;
        data.sort = id;
        data.typeDesc = "输入网址";
        data.typeUrl = "inputUrl";
        if (this.state.isModify) {
            if (this.props.yoBang.steps.length != 0) {
                this.setState({ taskSteps: this.props.yoBang.steps }, () => {
                    this.state.taskSteps.map((v) => {
                        if (v.id == this.state.modifyId) {
                            v.describe = this.state.inputUrlDesc;
                            v.content = this.state.inputUrl;
                        }
                    })
                    this.setState({
                        optionLoading: true
                    }, () => {
                        //更新redux
                        this.props.AddTaskStep(this.state.taskSteps);
                        this.setState({ modalInputUrlVisible: false, isModify: false, optionLoading: false })
                    })
                })
            } else {
                this.state.taskSteps.map((v) => {
                    if (v.id == this.state.modifyId) {
                        v.describe = this.state.inputUrlDesc;
                        v.content = this.state.inputUrl;
                    }
                })
                this.setState({
                    optionLoading: true
                }, () => {
                    //更新redux
                    this.props.AddTaskStep(this.state.taskSteps);
                    this.setState({ modalInputUrlVisible: false, isModify: false, optionLoading: false })
                })
            }
        } else {
            if (this.props.yoBang.steps.length != 0) {
                this.setState({ taskSteps: this.props.yoBang.steps }, () => {
                    this.setState({
                        taskSteps: [...this.state.taskSteps, data],
                        optionLoading: true
                    }, () => {
                        //更新redux
                        this.props.AddTaskStep(this.state.taskSteps);
                        this.setState({ modalInputUrlVisible: false, optionLoading: false })
                    })
                })
            } else {
                this.setState({
                    taskSteps: [...this.state.taskSteps, data],
                    optionLoading: true
                }, () => {
                    //更新redux
                    this.props.AddTaskStep(this.state.taskSteps);
                    this.setState({ modalInputUrlVisible: false, optionLoading: false })
                })
            }
        }
    }
    /**
    * 渲染输入网址
    */
    renderModalInputUrl() {
        let { modalInputUrlVisible, inputUrlDesc, inputUrl, optionLoading } = this.state;
        return (
            <Modal animationType='slide' visible={modalInputUrlVisible} transparent onRequestClose={() => { }}>
                <View style={{ flex: 1, backgroundColor: 'transparent' }}>
                    <View style={Styles.modalBody}>
                        <View style={{ marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={Styles.publishBuy}>输入网址</Text>
                        </View>
                        <View style={[Styles.modalBodyPrice, { marginTop: 40 }]}>
                            <View style={Styles.modalBodyLeft}>
                                <Text style={Styles.price}>步骤说明：</Text>
                            </View>
                            <View style={Styles.modalBodyRight}>
                                <View style={Styles.textInputContainer}>
                                    <TextInput style={Styles.publishTextInput} multiline={true} numberOfLines={3} placeholder="适用于需要点击链接，访问网页的操作，输入内容，提示打开网页相关注意事项" placeholderTextColor={Colors.C10} underlineColorAndroid="transparent"
                                        value={inputUrlDesc}
                                        onChangeText={inputUrlDesc => this.setState({ inputUrlDesc })}
                                        returnKeyType="done"
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={[Styles.modalBodyPrice, { marginTop: 40 }]}>
                            <View style={Styles.modalBodyLeft}>
                                <Text style={Styles.price}>填写网址：</Text>
                            </View>
                            <View style={Styles.modalBodyRight}>
                                <View style={Styles.textInputContainer}>
                                    <TextInput style={Styles.publishTextInput} placeholder="链接" placeholderTextColor={Colors.C10} underlineColorAndroid="transparent"
                                        value={inputUrl}
                                        onChangeText={inputUrl => this.setState({ inputUrl })}
                                        returnKeyType="done"
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={Styles.modalFooter}>
                            <TouchableOpacity disabled={optionLoading} onPress={() => this.cancleModalInputUrl('inputUrl')}>
                                <View style={[Styles.publishConfirm, { backgroundColor: Colors.LightG }]}>
                                    <Text style={Styles.publishConfirmText}>取消</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity disabled={optionLoading} onPress={() => this.confirmModalInputUrl()}>
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
     * 确认图文消息
     */
    confirmModalInputPicAndTxt() {
        if (this.state.inputPicAndTxtDesc == '' || this.state.inputPicAndTxtImage == '') {
            Toast.tipBottom('所有选项不能为空')
            // Toast.show({
            //     text: '所有选项不能为空',
            //     textStyle: { color: '#FFFFFF', textAlign: 'center' },
            //     position: "top",
            //     duration: 2000,
            // });
            return;
        }
        let id = this.state.taskSteps.length;
        let data = {};
        data.id = id;
        data.type = 2;
        data.describe = this.state.inputPicAndTxtDesc;
        data.content = this.state.inputPicAndTxtImage;
        data.sort = id;
        data.typeDesc = "图文说明";
        data.typeUrl = "inputPicAndTxt";
        if (this.state.isModify) {
            if (this.props.yoBang.steps.length != 0) {
                this.setState({ taskSteps: this.props.yoBang.steps }, () => {
                    this.state.taskSteps.map((v) => {
                        if (v.id == this.state.modifyId) {
                            v.describe = this.state.inputPicAndTxtDesc;
                            v.content = this.state.inputPicAndTxtImage;
                        }
                    })
                    this.setState({
                        optionLoading: true
                    }, () => {
                        //更新redux
                        this.props.AddTaskStep(this.state.taskSteps);
                        this.setState({ modalInputPicAndTxtVisible: false, isModify: false, optionLoading: false })
                    })
                })
            } else {
                this.state.taskSteps.map((v) => {
                    if (v.id == this.state.modifyId) {
                        v.describe = this.state.inputPicAndTxtDesc;
                        v.content = this.state.inputPicAndTxtImage;
                    }
                })
                this.setState({
                    optionLoading: true
                }, () => {
                    //更新redux
                    this.props.AddTaskStep(this.state.taskSteps);
                    this.setState({ modalInputPicAndTxtVisible: false, isModify: false, optionLoading: false })
                })
            }
        } else {
            if (this.props.yoBang.steps.length != 0) {
                this.setState({ taskSteps: this.props.yoBang.steps }, () => {
                    this.setState({
                        taskSteps: [...this.state.taskSteps, data],
                        optionLoading: true
                    }, () => {
                        //更新redux
                        this.props.AddTaskStep(this.state.taskSteps);
                        this.setState({ modalInputPicAndTxtVisible: false, optionLoading: false })
                    })
                })
            } else {
                this.setState({
                    taskSteps: [...this.state.taskSteps, data],
                    optionLoading: true
                }, () => {
                    //更新redux
                    this.props.AddTaskStep(this.state.taskSteps);
                    this.setState({ modalInputPicAndTxtVisible: false, optionLoading: false })
                })
            }
        }
    }

    /**
    * 渲染图文说明
    */
    renderModalinputPicAndTxt() {
        let { modalInputPicAndTxtVisible, inputPicAndTxtDesc, optionLoading } = this.state;
        return (
            <Modal animationType='slide' visible={modalInputPicAndTxtVisible} transparent onRequestClose={() => { }}>
                <ScrollView style={{ flex: 1, backgroundColor: 'transparent' }}>
                    <View style={Styles.modalBody}>
                        <View style={{ marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={Styles.publishBuy}>图文说明</Text>
                        </View>
                        <View style={[Styles.modalBodyPrice, { marginTop: 40 }]}>
                            <View style={Styles.modalBodyLeft}>
                                <Text style={Styles.price}>步骤说明：</Text>
                            </View>
                            <View style={Styles.modalBodyRight}>
                                <View style={Styles.textInputContainer}>
                                    <TextInput style={Styles.publishTextInput} multiline={true} numberOfLines={3} placeholder="适用于图片说明引导悬赏人操作，输入内容，详细说明需要注意哪些事项" placeholderTextColor={Colors.C10} underlineColorAndroid="transparent"
                                        value={inputPicAndTxtDesc}
                                        onChangeText={inputPicAndTxtDesc => this.setState({ inputPicAndTxtDesc })}
                                        returnKeyType="done"
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={[Styles.modalBodyPrice, { marginTop: 40 }]}>
                            <View style={Styles.modalBodyLeft}>
                                <Text style={Styles.price}>图片说明：</Text>
                            </View>
                            <View style={Styles.modalBodyRight}>
                                <View style={{ marginLeft: 10, paddingLeft: 8, width: Metrics.screenWidth * 0.7 * 0.8, }}>
                                    <TouchableOpacity onPress={() => this.handleImagePicker('inputPicAndTxt')}>
                                        <View style={Styles.uploadView}>
                                            <Text style={{ color: Colors.White, fontSize: 14 }}>选择图片</Text>
                                        </View>
                                    </TouchableOpacity>
                                    {this.state.inputPicAndTxtImage != '' ?
                                        <View>
                                            <Image source={{ uri: this.state.inputPicAndTxtImage }} style={Styles.screenshotImg} />
                                        </View>
                                        :
                                        <View style={[Styles.screenshotImg, { justifyContent: 'center', alignItems: 'center' }]}>
                                            <Icon name="ios-image-outline" color={Colors.C6} size={60} />
                                        </View>
                                    }
                                </View>
                            </View>
                        </View>
                        <View style={Styles.modalFooter}>
                            <TouchableOpacity disabled={optionLoading} onPress={() => this.cancleModalInputUrl('inputPicAndTxt')}>
                                <View style={[Styles.publishConfirm, { backgroundColor: Colors.LightG }]}>
                                    <Text style={Styles.publishConfirmText}>取消</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity disabled={optionLoading} onPress={() => this.confirmModalInputPicAndTxt()}>
                                <View style={[Styles.publishConfirm, { backgroundColor: Colors.C6 }]}>
                                    <Text style={Styles.publishConfirmText}>{optionLoading ? '下架中...' : '确定'}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={Styles.modalHeader} />
                </ScrollView>
            </Modal>
        )
    }
    confirmModalInputOrCode() {
        if (this.state.inputOrCodeDesc == '' || this.state.inputOrCodeImage == '') {
            Toast.tipBottom('所有选项不能为空');
            return;
        }
        let id = this.state.taskSteps.length;
        let data = {};
        data.id = id;
        data.type = 3;
        data.describe = this.state.inputOrCodeDesc;
        data.content = this.state.inputOrCodeImage;
        data.sort = id;
        data.typeDesc = "传二维码";
        data.typeUrl = "inputQrCode";
        if (this.state.isModify) {
            if (this.props.yoBang.steps.length != 0) {
                this.setState({ taskSteps: this.props.yoBang.steps }, () => {
                    this.state.taskSteps.map((v) => {
                        if (v.id == this.state.modifyId) {
                            v.describe = this.state.inputOrCodeDesc;
                            v.content = this.state.inputOrCodeImage;
                        }
                    })
                    this.setState({
                        optionLoading: true
                    }, () => {
                        //更新redux
                        this.props.AddTaskStep(this.state.taskSteps);
                        this.setState({ modalInputQrCodeVisible: false, isModify: false, optionLoading: false })
                    })
                })
            } else {
                this.state.taskSteps.map((v) => {
                    if (v.id == this.state.modifyId) {
                        v.describe = this.state.inputOrCodeDesc;
                        v.content = this.state.inputOrCodeImage;
                    }
                })
                this.setState({
                    optionLoading: true
                }, () => {
                    //更新redux
                    this.props.AddTaskStep(this.state.taskSteps);
                    this.setState({ modalInputQrCodeVisible: false, isModify: false, optionLoading: false })
                })
            }
        } else {
            if (this.props.yoBang.steps.length != 0) {
                this.setState({ taskSteps: this.props.yoBang.steps }, () => {
                    this.setState({
                        taskSteps: [...this.state.taskSteps, data],
                        optionLoading: true
                    }, () => {
                        //更新redux
                        this.props.AddTaskStep(this.state.taskSteps);
                        this.setState({ modalInputQrCodeVisible: false, optionLoading: false })
                    })
                })
            } else {
                this.setState({
                    taskSteps: [...this.state.taskSteps, data],
                    optionLoading: true
                }, () => {
                    //更新redux
                    this.props.AddTaskStep(this.state.taskSteps);
                    this.setState({ modalInputQrCodeVisible: false, optionLoading: false })
                })
            }
        }
    }
    /**
   * 渲染二维码说明
   */
    renderModalinputQrCode() {
        let { modalInputQrCodeVisible, inputOrCodeDesc, optionLoading } = this.state;
        return (
            <Modal animationType='slide' visible={modalInputQrCodeVisible} transparent onRequestClose={() => { }}>
                <ScrollView style={{ flex: 1, backgroundColor: 'transparent' }}>
                    <View style={Styles.modalBody}>
                        <View style={{ marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={Styles.publishBuy}>传二维码</Text>
                        </View>
                        <View style={[Styles.modalBodyPrice, { marginTop: 40 }]}>
                            <View style={Styles.modalBodyLeft}>
                                <Text style={Styles.price}>步骤说明：</Text>
                            </View>
                            <View style={Styles.modalBodyRight}>
                                <View style={Styles.textInputContainer}>
                                    <TextInput style={Styles.publishTextInput} multiline={true} numberOfLines={3} placeholder="适用于需要扫二维码的操作，输入内容，详细说明需要注意哪些事项" placeholderTextColor={Colors.C10} underlineColorAndroid="transparent"
                                        value={inputOrCodeDesc}
                                        onChangeText={inputOrCodeDesc => this.setState({ inputOrCodeDesc })}
                                        returnKeyType="done"
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={[Styles.modalBodyPrice, { marginTop: 40 }]}>
                            <View style={Styles.modalBodyLeft}>
                                <Text style={Styles.price}>二维码图：</Text>
                            </View>
                            <View style={Styles.modalBodyRight}>
                                <View style={{ marginLeft: 10, paddingLeft: 8, width: Metrics.screenWidth * 0.7 * 0.8, }}>
                                    <TouchableOpacity onPress={() => this.handleImagePicker('inputQrCode')}>
                                        <View style={Styles.uploadView}>
                                            <Text style={{ color: Colors.White, fontSize: 14 }}>选择图片</Text>
                                        </View>
                                    </TouchableOpacity>
                                    {this.state.inputOrCodeImage != '' ?
                                        <View>
                                            <Image source={{ uri: this.state.inputOrCodeImage }} style={Styles.screenshotImg} />
                                        </View>
                                        :
                                        <View style={[Styles.screenshotImg, { justifyContent: 'center', alignItems: 'center' }]}>
                                            <Icon name="ios-image-outline" color={Colors.C6} size={60} />
                                        </View>
                                    }
                                </View>
                            </View>
                        </View>
                        <View style={Styles.modalFooter}>
                            <TouchableOpacity disabled={optionLoading} onPress={() => this.cancleModalInputUrl('inputQrCode')}>
                                <View style={[Styles.publishConfirm, { backgroundColor: Colors.LightG }]}>
                                    <Text style={Styles.publishConfirmText}>取消</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity disabled={optionLoading} onPress={() => this.confirmModalInputOrCode()}>
                                <View style={[Styles.publishConfirm, { backgroundColor: Colors.C6 }]}>
                                    <Text style={Styles.publishConfirmText}>{optionLoading ? '下架中...' : '确定'}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={Styles.modalHeader} />
                </ScrollView>
            </Modal>
        )
    }

    /**
     * 复制数据
     */
    confirmModalCopyData() {
        if (this.state.copyDataContent == '' || this.state.copyDataDesc == '') {
            Toast.tipBottom('所有选项不能为空');
            return;
        }
        let id = this.state.taskSteps.length;
        let data = {};
        data.id = id;
        data.type = 4;
        data.describe = this.state.copyDataDesc;
        data.content = this.state.copyDataContent;
        data.sort = id;
        data.typeDesc = "复制数据";
        data.typeUrl = "copyData";
        if (this.state.isModify) {
            if (this.props.yoBang.steps.length != 0) {
                this.setState({ taskSteps: this.props.yoBang.steps }, () => {
                    this.state.taskSteps.map((v) => {
                        if (v.id == this.state.modifyId) {
                            v.describe = this.state.copyDataDesc;
                            v.content = this.state.copyDataContent;
                        }
                    })
                    this.setState({
                        optionLoading: true
                    }, () => {
                        //更新redux
                        this.props.AddTaskStep(this.state.taskSteps);
                        this.setState({ modalCopyDataVisible: false, isModify: false, optionLoading: false })
                    })
                })
            } else {
                this.state.taskSteps.map((v) => {
                    if (v.id == this.state.modifyId) {
                        v.describe = this.state.copyDataDesc;
                        v.content = this.state.copyDataContent;
                    }
                })
                this.setState({
                    optionLoading: true
                }, () => {
                    //更新redux
                    this.props.AddTaskStep(this.state.taskSteps);
                    this.setState({ modalCopyDataVisible: false, isModify: false, optionLoading: false })
                })
            }
        } else {
            if (this.props.yoBang.steps.length != 0) {
                this.setState({ taskSteps: this.props.yoBang.steps }, () => {
                    this.setState({
                        taskSteps: [...this.state.taskSteps, data],
                        optionLoading: true
                    }, () => {
                        //更新redux
                        this.props.AddTaskStep(this.state.taskSteps);
                        this.setState({ modalCopyDataVisible: false, optionLoading: false })
                    })
                })
            } else {
                this.setState({
                    taskSteps: [...this.state.taskSteps, data],
                    optionLoading: true
                }, () => {
                    //更新redux
                    this.props.AddTaskStep(this.state.taskSteps);
                    this.setState({ modalCopyDataVisible: false, optionLoading: false })
                })
            }
        }
    }
    /**
       * 渲染复制数据
       */
    renderModalCopyData() {
        let { modalCopyDataVisible, copyDataDesc, copyDataContent, optionLoading } = this.state;
        return (
            <Modal animationType='slide' visible={modalCopyDataVisible} transparent onRequestClose={() => { }}>
                <View style={{ flex: 1, backgroundColor: 'transparent' }}>
                    <View style={Styles.modalBody}>
                        <View style={{ marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={Styles.publishBuy}>复制数据</Text>
                        </View>
                        <View style={[Styles.modalBodyPrice, { marginTop: 40 }]}>
                            <View style={Styles.modalBodyLeft}>
                                <Text style={Styles.price}>步骤说明：</Text>
                            </View>
                            <View style={Styles.modalBodyRight}>
                                <View style={Styles.textInputContainer}>
                                    <TextInput style={Styles.publishTextInput} multiline={true} numberOfLines={3} placeholder="适用于需要复制数据，如填写邀请码，输入内容会提示会员复制数据方便填写" placeholderTextColor={Colors.C10} underlineColorAndroid="transparent"
                                        value={copyDataDesc}
                                        onChangeText={copyDataDesc => this.setState({ copyDataDesc })}
                                        returnKeyType="done"
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={[Styles.modalBodyPrice, { marginTop: 40 }]}>
                            <View style={Styles.modalBodyLeft}>
                                <Text style={Styles.price}>填写数据：</Text>
                            </View>
                            <View style={Styles.modalBodyRight}>
                                <View style={Styles.textInputContainer}>
                                    <TextInput style={Styles.publishTextInput} placeholder="如邀请码，钱包之类地址" placeholderTextColor={Colors.C10} underlineColorAndroid="transparent" keyboardType="numeric"
                                        value={copyDataContent}
                                        onChangeText={copyDataContent => this.setState({ copyDataContent })}
                                        returnKeyType="done"
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={Styles.modalFooter}>
                            <TouchableOpacity disabled={optionLoading} onPress={() => this.cancleModalInputUrl('copyData')}>
                                <View style={[Styles.publishConfirm, { backgroundColor: Colors.LightG }]}>
                                    <Text style={Styles.publishConfirmText}>取消</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity disabled={optionLoading} onPress={() => this.confirmModalCopyData()}>
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

    confirmModalFindPic() {
        if (this.state.findPicDesc == '' || this.state.findPicImage == '') {
            Toast.tipBottom('所有选项不能为空')
            // Toast.show({
            //     text: '所有选项不能为空',
            //     textStyle: { color: '#FFFFFF', textAlign: 'center' },
            //     position: "top",
            //     duration: 2000,
            // });
            return;
        }
        let id = this.state.taskSteps.length;
        let data = {};
        data.id = id;
        data.type = 5;
        data.describe = this.state.findPicDesc;
        data.content = this.state.findPicImage;
        data.sort = id;
        data.typeDesc = "收集截图";
        data.typeUrl = "findPic";
        if (this.state.isModify) {
            if (this.props.yoBang.steps.length != 0) {
                this.setState({ taskSteps: this.props.yoBang.steps }, () => {
                    this.state.taskSteps.map((v) => {
                        if (v.id == this.state.modifyId) {
                            v.describe = this.state.findPicDesc;
                            v.content = this.state.findPicImage;
                        }
                    })
                    this.setState({
                        optionLoading: true
                    }, () => {
                        //更新redux
                        this.props.AddTaskStep(this.state.taskSteps);
                        this.setState({ modalFindPicVisible: false, isModify: false, optionLoading: false })
                    })
                })
            } else {
                this.state.taskSteps.map((v) => {
                    if (v.id == this.state.modifyId) {
                        v.describe = this.state.findPicDesc;
                        v.content = this.state.findPicImage;
                    }
                })
                this.setState({
                    optionLoading: true
                }, () => {
                    //更新redux
                    this.props.AddTaskStep(this.state.taskSteps);
                    this.setState({ modalFindPicVisible: false, isModify: false, optionLoading: false })
                })
            }
        } else {
            if (this.props.yoBang.steps.length != 0) {
                this.setState({ taskSteps: this.props.yoBang.steps }, () => {
                    this.setState({
                        taskSteps: [...this.state.taskSteps, data],
                        optionLoading: true
                    }, () => {
                        //更新redux
                        this.props.AddTaskStep(this.state.taskSteps);
                        this.setState({ modalFindPicVisible: false, optionLoading: false })
                    })
                })
            } else {
                this.setState({
                    taskSteps: [...this.state.taskSteps, data],
                    optionLoading: true
                }, () => {
                    //更新redux
                    this.props.AddTaskStep(this.state.taskSteps);
                    this.setState({ modalFindPicVisible: false, optionLoading: false })
                })
            }
        }
    }
    /**
    * 收集截图
    */
    renderModalFindPic() {
        let { modalFindPicVisible, findPicDesc, optionLoading } = this.state;
        return (
            <Modal animationType='slide' visible={modalFindPicVisible} transparent onRequestClose={() => { }}>
                <ScrollView style={{ flex: 1, backgroundColor: 'transparent' }}>
                    <View style={Styles.modalBody}>
                        <View style={{ marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={Styles.publishBuy}>收集截图</Text>
                        </View>
                        <View style={[Styles.modalBodyPrice, { marginTop: 40 }]}>
                            <View style={Styles.modalBodyLeft}>
                                <Text style={Styles.price}>步骤说明：</Text>
                            </View>
                            <View style={Styles.modalBodyRight}>
                                <View style={Styles.textInputContainer}>
                                    <TextInput 
                                        style={Styles.publishTextInput} 
                                        multiline={true} 
                                        numberOfLines={5} 
                                        placeholder="适用于收集截图结果。输入内容，详细说明自己需要哪个界面，符合说明要求等。并且上传截图示例" 
                                        placeholderTextColor={Colors.C10} 
                                        underlineColorAndroid="transparent"
                                        // textAlign=''
                                        value={findPicDesc}
                                        onChangeText={findPicDesc => this.setState({ findPicDesc })}
                                        returnKeyType="done"
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={[Styles.modalBodyPrice, { marginTop: 40 }]}>
                            <View style={Styles.modalBodyLeft}>
                                <Text style={Styles.price}>图片示例：</Text>
                            </View>
                            <View style={Styles.modalBodyRight}>
                                <View style={{ marginLeft: 10, paddingLeft: 8, width: Metrics.screenWidth * 0.7 * 0.8, }}>
                                    <TouchableOpacity onPress={() => this.handleImagePicker('findPic')}>
                                        <View style={Styles.uploadView}>
                                            <Text style={{ color: Colors.White, fontSize: 14 }}>选择图片</Text>
                                        </View>
                                    </TouchableOpacity>
                                    {this.state.findPicImage != '' ?
                                        <View>
                                            <Image source={{ uri: this.state.findPicImage }} style={Styles.screenshotImg} />
                                        </View>
                                        :
                                        <View style={[Styles.screenshotImg, { justifyContent: 'center', alignItems: 'center' }]}>
                                            <Icon name="ios-image-outline" color={Colors.C6} size={60} />
                                        </View>
                                    }
                                </View>
                            </View>
                        </View>
                        <View style={Styles.modalFooter}>
                            <TouchableOpacity disabled={optionLoading} onPress={() => this.cancleModalInputUrl('findPic')}>
                                <View style={[Styles.publishConfirm, { backgroundColor: Colors.LightG }]}>
                                    <Text style={Styles.publishConfirmText}>取消</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity disabled={optionLoading} onPress={() => this.confirmModalFindPic()}>
                                <View style={[Styles.publishConfirm, { backgroundColor: Colors.C6 }]}>
                                    <Text style={Styles.publishConfirmText}>{optionLoading ? '下架中...' : '确定'}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={Styles.modalHeader} />
                </ScrollView>
            </Modal>
        )
    }
    /**
     * 收集信息
     */
    confirmModalFindTxt() {
        if (this.state.findTxtDesc == '') {
            Toast.tipBottom('所有选项不能为空');
            // Toast.show({
            //     text: '所有选项不能为空',
            //     textStyle: { color: '#FFFFFF', textAlign: 'center' },
            //     position: "top",
            //     duration: 2000,
            // });
            return;
        }
        let id = this.state.taskSteps.length;
        let data = {};
        data.id = id;
        data.type = 6;
        data.describe = this.state.findTxtDesc;
        data.content = '';
        data.sort = id;
        data.typeDesc = "收集信息";
        data.typeUrl = "findTxt";
        if (this.state.isModify) {
            if (this.props.yoBang.steps.length != 0) {
                this.setState({ taskSteps: this.props.yoBang.steps }, () => {
                    this.state.taskSteps.map((v) => {
                        if (v.id == this.state.modifyId) {
                            v.describe = this.state.findTxtDesc;
                            v.content = '';
                        }
                    })
                    this.setState({
                        optionLoading: true
                    }, () => {
                        //更新redux
                        this.props.AddTaskStep(this.state.taskSteps);
                        this.setState({ modalFindTxtVisible: false, isModify: false, optionLoading: false })
                    })
                })
            } else {
                this.state.taskSteps.map((v) => {
                    if (v.id == this.state.modifyId) {
                        v.describe = this.state.findTxtDesc;
                        v.content = '';
                    }
                })
                this.setState({
                    optionLoading: true
                }, () => {
                    //更新redux
                    this.props.AddTaskStep(this.state.taskSteps);
                    this.setState({ modalFindTxtVisible: false, isModify: false, optionLoading: false })
                })
            }
        } else {
            if (this.props.yoBang.steps.length != 0) {
                this.setState({ taskSteps: this.props.yoBang.steps }, () => {
                    this.setState({
                        taskSteps: [...this.state.taskSteps, data],
                        optionLoading: true
                    }, () => {
                        //更新redux
                        this.props.AddTaskStep(this.state.taskSteps);
                        this.setState({ modalFindTxtVisible: false, optionLoading: false })
                    })
                })
            } else {
                this.setState({
                    taskSteps: [...this.state.taskSteps, data],
                    optionLoading: true
                }, () => {
                    //更新redux
                    this.props.AddTaskStep(this.state.taskSteps);
                    this.setState({ modalFindTxtVisible: false, optionLoading: false })
                })
            }
        }
    }
    /**
   * 收集信息
   */
    renderModalFindTxt() {
        let { modalFindTxtVisible, findTxtDesc, optionLoading } = this.state;
        return (
            <Modal animationType='slide' visible={modalFindTxtVisible} transparent onRequestClose={() => { }}>
                <View style={{ flex: 1, backgroundColor: 'transparent' }}>
                    <View style={Styles.modalBody}>
                        <View style={{ marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={Styles.publishBuy}>收集信息</Text>
                        </View>
                        <View style={[Styles.modalBodyPrice, { marginTop: 40 }]}>
                            <View style={Styles.modalBodyLeft}>
                                <Text style={Styles.price}>收集信息：</Text>
                            </View>
                            <View style={Styles.modalBodyRight}>
                                <View style={Styles.textInputContainer}>
                                    <TextInput style={Styles.publishTextInput} multiline={true} numberOfLines={3} placeholder="适用于收集手机号，用户名，ID等。输入内容详细说明你需要收集什么内容！" placeholderTextColor={Colors.C10} underlineColorAndroid="transparent"
                                        value={findTxtDesc}
                                        onChangeText={findTxtDesc => this.setState({ findTxtDesc })}
                                        returnKeyType="done"
                                    />
                                </View>
                            </View>
                        </View>

                        <View style={Styles.modalFooter}>
                            <TouchableOpacity disabled={optionLoading} onPress={() => this.cancleModalInputUrl('findTxt')}>
                                <View style={[Styles.publishConfirm, { backgroundColor: Colors.LightG }]}>
                                    <Text style={Styles.publishConfirmText}>取消</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity disabled={optionLoading} onPress={() => this.confirmModalFindTxt()}>
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
    * 调起相册
    */
    handleImagePicker(key) {
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
                if (key == 'inputPicAndTxt') {
                    that.setState({ inputPicAndTxtImage: 'data:image/jpg;base64,' + response.base64 });
                } else if (key == 'inputQrCode') {
                    that.setState({ inputOrCodeImage: 'data:image/jpg;base64,' + response.base64 });
                } else if (key == 'findPic') {
                    that.setState({ findPicImage: 'data:image/jpg;base64,' + response.base64 });
                }
                else { }
            }
        });
    }
    /**
     * 去掉添加步骤
     */
    delTaskStep(index) {
        let arr = this.props.yoBang.steps;
        let arr2 = [];
        this.props.yoBang.steps.map((v) => {
            arr2.push(v.id);
        })
        arr.splice(arr2.indexOf(index), 1);
        this.setState({
            taskSteps: arr
        }, () => {
            //更新redux
            this.props.AddTaskStep(arr);
        })

    }
    render() {
        console.log('inputPicAndTxtImage=:',this.state.inputPicAndTxtImage);
        console.log('inputOrCodeImage',this.state.inputOrCodeImage);
        console.log('findPicImage',this.state.findPicImage);
        return (
            <SafeAreaView style={{ backgroundColor: Colors.White, flex: 1 }}>
                <Header title={`设置步骤「${this.props.headerTitle}」`} />
                {/* <ScrollView style={{flex:1}}> */}
                <View style={{height: 45, }}>
                    <TouchableOpacity style={Styles.stepHeader} onPress={() => this.setState({step: !this.state.step})} >
                        <Text style={{fontSize: 15}}>添加步骤</Text>
                        <Icon name={this.state.step ? 'ios-caret-up' : 'ios-caret-down'} size={14}/>
                    </TouchableOpacity>
                </View>
                <ScrollView style={{flex:1}}>
                    <View>
                        {this.props.yoBang.steps.map((v) => {
                            return (
                                <View style={[Styles.stepHeader,{ height: 40, borderBottomColor: Colors.C7, marginLeft: 10}]} key={v.id}>
                                    <View>
                                        <Text onPress={() => this.onPressModifyStep(v)}>{v.typeDesc}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => this.delTaskStep(v.id)}>
                                        <Icon size={20} style={{ color: Colors.C6 }} name="close-circle-outline" />
                                    </TouchableOpacity>
                                </View>
                            )
                        })}
                    </View>
                </ScrollView>
                {this.state.step && <View style={{ backgroundColor: Colors.White, marginTop: 89, position: 'absolute', height: 200, width: Metrics.screenWidth}}>
                    <TouchableOpacity style={Styles.stepSelect} onPress={() => this.onPressAddStep('inputUrl')}>
                        <Text>输入网址</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={Styles.stepSelect} onPress={() => this.onPressAddStep('inputPicAndTxt')}>
                        <Text>图文说明</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={Styles.stepSelect} onPress={() => this.onPressAddStep('inputQrCode')}>
                        <Text>传二维码</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={Styles.stepSelect} onPress={() => this.onPressAddStep('copyData')}>
                        <Text>复制数据</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={Styles.stepSelect} onPress={() => this.onPressAddStep('findPic')}>
                        <Text>收集截图</Text>
                    </TouchableOpacity>
                </View>}
                {this.renderModalInputUrl()}
                {this.renderModalinputPicAndTxt()}
                {this.renderModalinputQrCode()}
                {this.renderModalCopyData()}
                {this.renderModalFindPic()}
                {this.renderModalFindTxt()}
                {this.renderFooter()}
            </SafeAreaView>
        );
    }
}

const mapStateToProps = state => ({
    logged: state.user.logged,
    userId: state.user.id,
    candyNum: state.user.candyNum,
    yoBang: state.yoBang
});

const mapDispatchToProps = dispatch => ({
    AddTaskStep: (data) => dispatch({ type: Add_Task_Step, payload: { taskStep: data } }),
});

export default connect(mapStateToProps, mapDispatchToProps)(PublicStep);

const Styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#ffffff" },

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
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderRadius: 20,
    },
    modalHeader: { flex: 1, opacity: 0.6, backgroundColor: '#FFFFFF' },
    price: { fontSize: 14, color: Colors.main },
    publishConfirm: { height: 60, width: Metrics.screenWidth * 0.5, justifyContent: 'center', alignItems: 'center' },
    publishConfirmText: { fontSize: 16, color: '#FFFFFF', fontWeight: 'bold' },
    publishTextInput: { flex: 1, color: Colors.C12, padding: 5, textAlignVertical:"top"},
    textInputContainer: { marginLeft: 10, paddingLeft: 8, width: Metrics.screenWidth * 0.7 * 0.8, height: 80, borderRadius: 6, backgroundColor: Colors.backgroundColor},
    modalBody: { 
        paddingTop: Metrics.PADDING_BOTTOM, 
        flexDirection: "column", 
        justifyContent: 'flex-end', 
        backgroundColor: Colors.White, 
        width: Metrics.screenWidth
    },
    publishBuy: { color: Colors.main, fontSize: 20, fontWeight: 'bold' },
    modalBodyPrice: { marginTop: 12, flexDirection: 'row', alignItems: 'center' },
    modalBodyLeft: { width: Metrics.screenWidth * 0.3, alignItems: 'flex-end' },
    modalBodyRight: { width: Metrics.screenWidth * 0.7, alignItems: 'flex-start' },
    modalFooter: { flexDirection: 'row', marginTop: 20 },
    uploadView: {
        width: 100,
        padding: 12,
        backgroundColor: Colors.main,
        alignItems: "center",
        borderRadius: 8,
    },
    screenshotImg: {
        marginTop: 14,
        width: 120,
        height: 180,
        resizeMode: "stretch",
        borderRadius: 10,
        borderColor: Colors.main,
        borderWidth: 1
    },
    stepHeader: { justifyContent: 'space-between', height: 45, flexDirection: 'row', flex: 1, alignItems: 'center', paddingHorizontal: 10, borderBottomColor: Colors.C9, borderBottomWidth: 0.5 },
    stepSelect: {height: 40, flex: 1, justifyContent: 'center', paddingLeft: 10, borderBottomWidth: 0.5, borderBottomColor: Colors.C7 },
});
