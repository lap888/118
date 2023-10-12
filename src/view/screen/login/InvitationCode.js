import React, { Component } from 'react';
import { StyleSheet, View, Text, Alert, TouchableOpacity, TextInput } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Actions } from 'react-native-router-flux';
import { Header } from '../../components/Index';
import { Colors, Metrics } from '../../theme/Index';
import { Send } from '../../../utils/Http';
import { Toast } from '../../common';

export default class InvitationCode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            invitationCode: ''
        };
    }
    confirmCode() {
        if (this.state.invitationCode === '') {
            Toast.tipBottom('邀请码不能为空')
            // Toast.show({
            //     text: '邀请码不能为空',
            //     position: "top",
            //     textStyle: { textAlign: "center" },
            // })
            return false;
        }
        Send('api/GetNameByMobile?mobile=' + this.state.invitationCode, {}, 'GET').then(res => {
            if (res.code == 200) {
                Alert.alert(
                    "邀请人确认",
                    `该码属于:${res.data}`,
                    [
                        { text: "确定", onPress: () => Actions.push('SignUp', { invitationCode: this.state.invitationCode }) },
                        { text: "取消", onPress: () => { } },
                    ],
                    { onDismiss: () => { } }
                )
            } else {
                Toast.tipBottom(res.message)
                // Toast.show({
                //     text: res.message,
                //     position: "top",
                //     textStyle: { textAlign: "center" },
                // })
            }
        })
    }
    render() {
        return (
            <View style={{flex: 1,backgroundColor:Colors.White}}>
                <Header title="邀请码" />
                <View style={{ borderBottomWidth: 1, borderBottomColor: Colors.C13, paddingHorizontal: 15 }}>
                    <TextInput
                        value={this.state.mobile}
                        style={{}}
                        placeholder="请输入邀请码"
                        placeholderTextColor={Colors.grayFont}
                        onChangeText={(value) => this.setState({ invitationCode: value })} />
                </View>
                <View style={styles.submitView}>
                    <TouchableOpacity onPress={() => { this.confirmCode(); }}>
                        <View style={styles.submitBtn} >
                            <Text style={{ padding: 15, color: "#ffffff" }}>下一步</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    submitView: {
        height: Metrics.screenHeight * 0.3,
        justifyContent: 'center',
        alignItems: "center",
    },
    submitBtn: {
        backgroundColor: Colors.main,
        width: Metrics.screenWidth * 0.6,
        alignItems: "center",
        borderRadius: 8,
    }
});
