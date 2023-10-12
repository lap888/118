import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Header } from '../../../components/Index';
import { Colors } from '../../../theme/Index';
//  暂时没有用到这个页面
export default class EquityMailed extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <View>
                <Header title={'邮寄申请'}/>
                <View style={styles.card}>
                    <Text style={{fontSize: 16, color: Colors.White, marginTop: 5}}>总数量: 10000</Text>
                    <Text style={{fontSize: 16, color: Colors.White, marginTop: 10}}>已邮寄数量：5000</Text>
                    <Text style={{fontSize: 16, color: Colors.White, marginTop: 10}}>可邮寄数量：5000</Text>
                </View>
                <View style={{paddingHorizontal: 20}}>
                    <View style={{borderBottomWidth: 1, borderBottomColor: Colors.C16}}>
                        <TextInput
                            onChange={(value) => this.inputOnChange('transferNum', value)}
                            placeholder={'转让份数'}
							keyboardType={'numeric'}
                            value={'transferNum'}
                        /> 
                    </View>
                    <View style={{borderBottomWidth: 1, borderBottomColor: Colors.C16}}>
                        <TextInput
                            onChange={(value) => this.inputOnChange('phone', value)}
                            placeholder={'手机号'}
							keyboardType={'numeric'}
                            value={'phone'}
                        /> 
                    </View>
                    <View style={{borderBottomWidth: 1, borderBottomColor: Colors.C16}}>
                        <TextInput
                            onChange={(value) => this.inputOnChange('pwd2', value)}
                            placeholder={'支付密码'}
                            secureTextEntry={true}
                            value={'pwd2'}
                        /> 
                    </View>
                </View>
                <TouchableOpacity style={{marginHorizontal: 20, justifyContent: 'center', borderRadius: 5, alignItems: 'center', height: 40, marginTop: 15, backgroundColor: Colors.C6}}>
                    <Text style={{fontSize: 16, color: Colors.White}}>提交申请</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    card: {minHeight: 100, backgroundColor: Colors.C16, marginHorizontal: 15, marginTop: 15, borderRadius: 10, padding: 10},
})
