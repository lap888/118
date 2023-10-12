import React, { Component } from 'react';
import { View, ToastAndroid, TouchableOpacity, Image, StyleSheet, Keyboard } from 'react-native';
import { Container, Content, Text, Input, Form, Item } from 'native-base';
import { connect } from 'react-redux';
import { Header } from '../../components/Index';
import { SET_USERINVITER } from '../../../redux/ActionTypes';
import { Actions } from 'react-native-router-flux';
import { Colors, Metrics } from '../../theme/Index';
import { Send } from '../../../utils/Http';
import { Toast } from '../../common';

const verify = /^[0-9a-zA-Z\u4e00-\u9fa5]*$/;

class EditInviterCode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nickName: ''
        };
    }
    submit() {
        Keyboard.dismiss();
        let name = this.state.nickName;
        params = { name: name, uId: this.props.userId }

        /* 为空验证 */
        if (name.length === 0) {
            return (
                Toast.show({
                    text: "邀请码不能为空",
                    position: "top",
                    textStyle: { textAlign: "center" },
                })
            )
        }

        /* 格式验证(必须是数字、字母或汉字) */
        if (!name.match(verify)) {
            return (
                Toast.show({
                    text: "邀请码格式不正确",
                    position: "top",
                    textStyle: { textAlign: "center" },
                })
            )
        }
        /* 长度验证 */
        if (name.length > 15) {
            return (
                Toast.show({
                    text: "邀请码不能超过15位",
                    position: "top",
                    textStyle: { textAlign: "center" },
                })
            )
        }

        var that = this;
        Send("api/ModifyUserInviterCode?name=" + name, {}, 'get').then(res => {
            if (res.code == 200) {
                Toast.show({
                    text: '修改邀请码成功',
                    position: "top",
                    textStyle: { textAlign: "center" },
                });
                that.props.resetUserInfo(res.data);
                Actions.pop();
            } else {
                Toast.show({
                    text: res.message,
                    position: "top",
                    textStyle: { textAlign: "center" },
                });
            }
        });
    }

    render() {
        return (
            <Container>
                <Header title="修改邀请码" rightText="保存" onRightPress={() => this.submit()} />
                <Content>
                    <View style={{ padding: 5, paddingLeft: 15, backgroundColor: "#ffffff" }}>
                        <Text style={{ color: Colors.C16, fontSize: 12, }}>
                            提示: 修改邀请码需要支付0.5个GC服务费用
						</Text>
                    </View>
                    <Form>
                        <Item>
                            <Input placeholder="请输入1-8位英文或数字邀请码" onChangeText={(value) => this.setState({ nickName: value })} />
                        </Item>
                    </Form>
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
    resetUserInfo: name => dispatch({ type: SET_USERINVITER, payload: { name } }),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditInviterCode);
