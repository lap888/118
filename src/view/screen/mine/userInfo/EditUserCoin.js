import React, { Component } from 'react';
import { View, ToastAndroid, TouchableOpacity, Image, StyleSheet, Keyboard } from 'react-native';
import { Container, Content, Text, Input, Form, Item } from 'native-base';
import { connect } from 'react-redux';
import { Header } from '../../../components/Index';
import { SET_USERINFO, SET_USERNAME } from '../../../../redux/ActionTypes';
import { Actions } from 'react-native-router-flux';
import { Colors, Metrics } from '../../../theme/Index';
import { Send } from '../../../../utils/Http';
import { Toast } from '../../../common';

const verify = /^[0-9a-zA-Z\u4e00-\u9fa5]*$/;

class EditUserCoin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nickName: '',
            optionLoading: false,       // 交易操作状态
        };
    }
    submit() {
        Keyboard.dismiss();
        let name = this.state.nickName;

        /* 为空验证 */
        if (name.length === 0) {
            Toast.tipBottom('资产不能为空')
            return;
        }

        /* 格式验证(必须是数字、字母或汉字) */
        if (!name.match(verify)) {
            Toast.tipBottom('资产格式不正确')
        }
        /* 长度验证 */
        if (name.length > 6) {
            Toast.tipBottom('资产不能超过6位')
        }

        var that = this;
        if (!that.state.optionLoading) that.setState({ optionLoading: true });
        Send("api/Ticket/AddXfq?amount=" + name, {}, 'get').then(res => {
            if (res.code == 200) {
                Toast.tipBottom('录入资产成功')
                Actions.pop();
            } else {
                Toast.tipBottom(res.message)
            }
            // 关闭发布状态
            that.setState({ optionLoading: false });
        });
    }

    render() {
        return (
            <Container>
                <Header title="资产录入" />
                <Content>
                    <Form>
                        <Item>
                            <Input placeholder="请录入您的资产数量" keyboardType='numeric' onChangeText={(value) => this.setState({ nickName: value })} />
                        </Item>
                    </Form>
                    <View style={{ padding: 5, paddingLeft: 15, backgroundColor: "#ffffff" }}>
                        <Text style={{ color: Colors.C16, fontSize: 14, }}>
                            提示: 每人只有一次录入资产机会，录入前请仔细核对，所有人资产将公开于资产浏览器！
                        </Text>
                    </View>
                    <View style={styles.submitView}>
                        <TouchableOpacity disabled={this.state.optionLoading} onPress={() => { this.submit() }}>
                            <View style={styles.submitBtn}>
                                <Text style={{ padding: 15, color: "#ffffff" }}>
                                    {this.state.optionLoading ? '录入中...' : '提交录入'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </Content>
            </Container>
        );
    }
}
const mapStateToProps = state => ({
    logged: state.user.logged,
    userId: state.user.id,
});

const mapDispatchToProps = dispatch => ({
    resetUserInfo: name => dispatch({ type: SET_USERNAME, payload: { name } }),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditUserCoin);
const styles = StyleSheet.create({
    submitView: {
        height: Metrics.screenHeight * 0.5,
        justifyContent: 'center',
        alignItems: "center",
    },
    submitBtn: {
        backgroundColor: Colors.C6,
        width: Metrics.screenWidth * 0.6,
        alignItems: "center",
        borderRadius: 8,
    },
});