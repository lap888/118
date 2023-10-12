import React, { Component } from 'react';
import { View, StyleSheet, Text, TextInput } from 'react-native';
// import { Toast } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { UserApi } from '../../../../api';
import { Header } from '../../../components/Index';
import { Colors } from '../../../theme/Index';
import { connect } from 'react-redux';
import { SET_USERMYCONTACTTEL, SET_USERMYWECHATNO } from '../../../../redux/ActionTypes';
import { Toast } from '../../../common';
class SetContact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mobile: props.myContactTel,
            weChat: props.myWeChatNo,
        };
    }

    onRightPress = () => {
        UserApi.setContact({Mobile: this.state.mobile, WeChat: this.state.weChat })
        .then((data) => {
            Toast.tipBottom('保存成功')
            // Toast.show({
            //     text: '保存成功',
            //     position: "top",
            //     textStyle: { textAlign: "center" },
            //     duration: 2000,
            // })
            Actions.pop();
            this.props.resetUserInfo(this.state.mobile, this.state.weChat);
        }).catch((err) => console.log('err', err))
    }

    setWeChat = (value) => {
        this.setState({weChat: value}) 
    }

    setMobile = (value) => {
        this.setState({mobile: value}) 
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: Colors.White}}>
                <Header title='设置手机号' rightText='保存' onRightPress={this.onRightPress} />
                <View style={{marginHorizontal: 15, marginTop: 10}}>
                    <View style={styles.inputView}>
                    <Text>手机号:</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={this.setMobile}
                            placeholder={'请输入手机号'}
                            keyboardType={'numeric'}
                            value={this.state.mobile}
                        /> 
                    </View>
                </View>
                <View style={{marginHorizontal: 15, marginTop: 10}}>
                    <View style={styles.inputView}>
                    <Text>微信号:</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={this.setWeChat}
                            placeholder={'请输入微信号'}
                            value={this.state.weChat}
                        /> 
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    inputView: {flexDirection: 'row', alignItems: 'center', height: 50, borderBottomWidth: 1, borderBottomColor: Colors.C16},
    input: { height: 50 },
})
const mapStateToProps = state => ({
    logged: state.user.logged,
    userId: state.user.id,
});

const mapDispatchToProps = dispatch => ({
    resetUserInfo: (myContactTel, myWeChatNo) => {
        dispatch({ type: SET_USERMYCONTACTTEL, payload: { myContactTel } });
        dispatch({ type: SET_USERMYWECHATNO, payload: { myWeChatNo } });
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(SetContact);
