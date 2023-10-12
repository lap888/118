import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { StyleSheet, View, Image, Text, TouchableOpacity, ScrollView, Modal, Platform } from 'react-native';
import { connect } from 'react-redux';
import { Textarea } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from "react-native-vector-icons/FontAwesome";

import { launchImageLibrary } from 'react-native-image-picker';
import { Header } from '../../components/Index';
import { Colors, Metrics } from '../../theme/Index';
import { Send } from '../../../utils/Http';
import { Toast } from '../../common';

class AppealPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            txtValue: "",
            avatarSource: "",
            isImgDispalyFullScreen: false,
        }
    }
    /**
     * 上传支付截图
     */
    handleButtonPress = () => {
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
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('用户取消了选择图片');
            } else if (response.errorCode) {
                console.log('launchImageLibrary 错误: ', response.errorMessage);
            } else {
                this.setState({ avatarSource: 'data:image/jpeg;base64,' + response.base64 });
            }
        });
    }
    /* 控制放大缩小截图 */
    displayFullScreenshot() {
        this.setState({
            isImgDispalyFullScreen: true
        })
    }
    isDisplayBigImg() {
        if (this.state.avatarSource) {
            return (
                <TouchableOpacity onPress={() => { this.displayFullScreenshot() }}>
                    <Image
                        style={styles.screenshotImg}
                        source={{ uri: this.state.avatarSource }}
                    />
                </TouchableOpacity>
            )
        } else {
            return (
                <FontAwesome name="image" color={Colors.C6} size={60} />
            )
        }
    }
    /* 显示清除截图图标 */
    clearScreenshot() {
        if (this.state.avatarSource) {
            return (
                <TouchableOpacity onPress={() => {
                    this.setState({
                        avatarSource: ""
                    })
                }}>
                    <View style={styles.close}>
                        <Image style={{ height: 20, width: 20 }}
                            source={require("../../images/close.png")}
                        />
                    </View>
                </TouchableOpacity>
            )
        }
    }
    /* 显示大图 */
    dispalyImage() {
        let { isImgDispalyFullScreen } = this.state;
        return (
            <Modal animationType='slide' visible={isImgDispalyFullScreen} animationType={'none'} transparent onRequestClose={() => { }}>
                <View style={{ flex: 1, backgroundColor: 'transparent' }}>
                    <View style={styles.modalBody}>
                        <TouchableOpacity onPress={() => {
                            this.setState({
                                isImgDispalyFullScreen: false
                            })
                        }}>
                            <Image
                                style={{
                                    width: Metrics.screenWidth,
                                    height: Metrics.screenHeight,
                                    resizeMode: "contain",
                                }}
                                source={{ uri: this.state.avatarSource }}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.modalHeader} />
                </View>
            </Modal>
        )
    }
    submitAppeal() {
        // tradId
        if (!this.state.avatarSource) {
            Toast.show({
                text: "请上传支付截图",
                position: "top",
                textStyle: { textAlign: "center" }
            })
            return;
        }
        if (!this.state.txtValue) {
            Toast.show({
                text: "请填写申诉内容",
                position: "top",
                textStyle: { textAlign: "center" }
            })
            return;
        }
        let params = {
            description: this.state.txtValue,
            orderId: this.props.tradId,
            picUrl: this.state.avatarSource
        }
        let that = this;
        Send("api/Trade/CreateAppeal", params).then(res => {
            if (res.code == 200) {
                Toast.show({
                    text: "提交成功",
                    position: "top",
                    textStyle: { textAlign: "center" }
                })
                setTimeout(() => Actions.pop(that.props.reloadCallBack()), 1000)
            } else {
                Toast.show({
                    text: res.message,
                    position: "top",
                    textStyle: { textAlign: "center" }
                })
            }
        });
    }
    render() {
        return (
            <LinearGradient colors={[Colors.C6, Colors.LightG]} start={{ x: 0, y: 0.1 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}>
                <Header title="申诉" />
                <ScrollView style={styles.view}>
                    <View style={styles.txtAreaView}>
                        <Text style={styles.txtStyle}>申诉说明</Text>
                        <Textarea
                            onChangeText={(text) => {
                                this.state.txtValue = text
                            }}
                            rowSpan={8}
                            placeholder="请填写您要申诉的内容"
                            style={styles.txtAreaStyle}
                        />
                    </View>
                    <View style={styles.txtAreaView}>
                        <View style={styles.last}>
                            <Text style={styles.txtStyle}>凭证</Text>
                            <TouchableOpacity onPress={() => { this.handleButtonPress() }}>
                                <View style={styles.uploadView}>
                                    <Text style={{ color: "#ffffff", fontSize: 15 }}>上传截图</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: "row" }}>
                            {this.isDisplayBigImg()}
                            {this.clearScreenshot()}
                        </View>
                    </View>
                </ScrollView>
                <View style={{ alignItems: "center" }}>
                    <TouchableOpacity onPress={() => { this.submitAppeal() }}>
                        <View style={styles.submitBtn}>
                            <Text style={{ color: "#ffffff", fontSize: 15 }}>提交</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View>
                    {this.dispalyImage()}
                </View>
            </LinearGradient>
        );
    }
}
const mapStateToProps = state => ({
    logged: state.user.logged,
    userId: state.user.id,
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(AppealPage);

const styles = StyleSheet.create({
    view: {
        padding: 10
    },
    last: {
        flexDirection: "row",
        marginBottom: 10,
    },
    uploadView: {
        width: Metrics.screenWidth * 0.4,
        padding: 10,
        backgroundColor: Colors.C6,
        alignItems: "center",
        borderRadius: 10,
        marginLeft: 20
    },
    submitBtn: {
        width: Metrics.screenWidth * 0.6,
        padding: 20,
        backgroundColor: Colors.C6,
        alignItems: "center",
        borderRadius: 8,
        marginVertical: 10,
    },
    screenshotImg: {
        width: Metrics.screenWidth * 0.3,
        height: Metrics.screenWidth * 0.4,
        resizeMode: "stretch",
        marginRight: 5,
        marginTop: 5
    },
    txtAreaView: {
        marginVertical: 5,
        padding: 20,
    },
    txtAreaStyle: {
        backgroundColor: "#ffffff",
        borderRadius: 10,
    },
    txtStyle: {
        marginBottom: 10,
        fontSize: 18,
        color: Colors.White
    },
    modalBody: {
        flexDirection: "column",
        justifyContent: 'flex-end',
        backgroundColor: '#25252b',
        width: Metrics.screenWidth
    },
    modalHeader: {
        flex: 1,
        opacity: 0.6,
        backgroundColor: '#FFFFFF'
    },
    close: {
        backgroundColor: Colors.C6,
        height: 20,
        width: 20,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 13,
        marginLeft: -8,
        marginTop: -5
    },
})