import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { StoreApi } from '../../../api';
import { Toast } from '../../common';
import { Header } from '../../components/Index';
import { Colors } from '../../theme/Index';

export default class StorePay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            StoreId: this.props.storeId,
            name: this.props.storeName,
            Amount: 0,
            Password: ''
        };
    }

    payusdt = () => {
        StoreApi.payUsdt(this.state)
        .then((data) => {
            Toast.tip('支付成功');
            Actions.pop()
        }).catch((err) => console.log('err', err))
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: Colors.backgroundColor}}>
                <Header title={'支付'} />
                <View style={{height: 120, flexDirection: 'row', backgroundColor: Colors.main, justifyContent: 'center', paddingTop: 20}} >
                    <Text style={{fontSize: 18, color: Colors.White}}>{this.state.name}</Text>
                </View>
                <View style={{height: 150, marginTop: -50, paddingTop: 10, paddingHorizontal: 20, backgroundColor: Colors.White, marginHorizontal: 20, borderRadius: 5, }} >
                    <Text style={{ fontSize: 12, color: Colors.grayFont }}>支付金额</Text>
                    <View style={{ height: 50, alignItems: "center", flexDirection: 'row', borderBottomColor: Colors.C13, borderBottomWidth: 1, }}>
                        <TextInput
                            style={{ flex: 1 }}
                            placeholder={'金额'}
                            value={this.state.Amount}
                            keyboardType='number-pad'
                            onChangeText={(value) => this.setState({ Amount: value })}
                        />
                        <Text style={{color: Colors.C10}}>￥</Text>
                    </View>
                    <View style={{ height: 50, alignItems: "center", flexDirection: 'row', borderBottomColor: Colors.C13, borderBottomWidth: 1, }}>
                        <TextInput
                            style={{ flex: 1 }}
                            placeholder={'支付密码'}
                            value={this.state.Password}
                            onChangeText={(value) => this.setState({ Password: value })}
                        />
                    </View>
                </View>
                <TouchableOpacity style={styles.payBtn} onPress={this.payusdt}>
                    <Text style={{color: Colors.White}}>确认支付</Text>
                </TouchableOpacity> 
            </View>
        );
    }
}
const styles = StyleSheet.create({
    payBtn: {
        height: 40,
        marginTop: 30,
        marginHorizontal: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: Colors.main
    },
})
