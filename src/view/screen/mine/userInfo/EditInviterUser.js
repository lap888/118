import React, { Component } from 'react';
import { View, ToastAndroid, TouchableOpacity, Image, StyleSheet, Keyboard } from 'react-native';
import { Container, Content, Text, Input, Form, Item } from 'native-base';
import { connect } from 'react-redux';
import { Header } from '../../../components/Index';
import {  Set_InviterMobile } from '../../../../redux/ActionTypes';
import { Actions } from 'react-native-router-flux';
import { Colors, Metrics } from '../../../theme/Index';
import { Send } from '../../../../utils/Http';
import { Toast } from '../../../common';

const verify = /^[0-9a-zA-Z\u4e00-\u9fa5]*$/;

class EditInviterUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nickName: ''
        };
    }
    submit() {
        Keyboard.dismiss();
        let name = this.state.nickName;
        /* 为空验证 */
        if (name.length === 0) {
            Toast.tipBottom('不能为空')
            return;
        }
        /* 格式验证(必须是数字、字母或汉字) */
        if (!name.match(verify)) {
            Toast.tipBottom('格式不正确')
        }
        /* 长度验证 */
        if (name.length > 15) {
            Toast.tipBottom('不能超过15位')
        }        
        Send("api/ModifyUserInviter?name=" + name, {}, 'get').then(res => {
            if (res.code == 200) {
                Toast.tipBottom('修改成功')
                this.props.resetUserInviter(res.data);
                Actions.pop();
                
            } else {
                Toast.tipBottom(res.message)
            }
        });
    }

    render() {
        return (
            <Container>
                <Header title="绑定邀请人" rightText="保存" onRightPress={() => this.submit()} />
                <Content>
                    <View style={{ padding: 5, paddingLeft: 15, backgroundColor: "#ffffff" }}>
                        <Text style={{ color: Colors.C16, fontSize: 12, }}>
                            提示: 当邀请人显示为【社区】时，用户可以重新绑定邀请人
                        </Text>
                    </View>
                    <Form>
                        <Item>
                            <Input placeholder="请输入邀请人手机号或者邀请码" onChangeText={(value) => this.setState({ nickName: value })} />
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
    
    resetUserInviter: mobile => dispatch({ type: Set_InviterMobile, payload: { mobile } }),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditInviterUser);
