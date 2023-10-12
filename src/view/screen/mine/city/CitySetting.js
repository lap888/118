import React, { Component } from 'react';
import { View, TextInput, StyleSheet, DeviceEventEmitter } from 'react-native';
import { Header } from '../../../components/Index';
import { Colors } from '../../../theme/Index';
import CityApi from '../../../../api/mine/CityApi';
import { Actions } from 'react-native-router-flux';
import { Toast } from '../../../common';

export default class CitySetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mobile: props.mobile,
            weChat: props.weChat,
            cityNo: props.cityNo,
        };
    }
    
    onRightPress = () => {
        CityApi.setContact({ CityNo: this.state.cityNo, Mobile: this.state.mobile, WeChat: this.state.weChat})
        .then((data) => {
            Toast.tipBottom('城主信息保存成功')
            Actions.pop();
            DeviceEventEmitter.emit('citySetting')
        }).catch((err) => console.log('err', err))
    }

    setMobile = (value) => {
        this.setState({mobile: value}) 
    }

    setWeChat = (value) => {
        this.setState({weChat: value}) 
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: Colors.White}}>
                <Header title='城主设置' rightText='保存' onRightPress={this.onRightPress} />
                <View style={{marginHorizontal: 15, marginTop: 10}}>
                    <View style={styles.inputView}>
                        <TextInput
                            style={styles.input}
                            onChangeText={this.setMobile}
                            placeholder={'请输入手机号'}
                            keyboardType={'numeric'}
                            value={this.state.mobile}
                        /> 
                    </View>
                    <View style={styles.inputView}>
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
    inputView: {height: 50, borderBottomWidth: 1, borderBottomColor: Colors.C16},
    input: { height: 50 },
})
