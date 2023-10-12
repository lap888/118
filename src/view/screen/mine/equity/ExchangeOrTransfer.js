import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { Colors } from '../../../theme/Index';
import RegExp from '../../../common/RegExp';
import { Toast } from '../../../common';

export default class ExchangeOrTransfer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 'exchange', // transfer
			equityNum: '',
			pwd1: '',
			transferNum: '',
			phone: '',
			pwd2: '',
        };
    }
	
	inputOnChange = (type, value) => {
		switch (type) {
			case 'equityNum': {
                if (RegExp.integer.test(value) || value === '') {
                    this.setState({equityNum: value});
                }
                break;
            }
			case 'pwd1':
				this.setState({pwd1: value})
				break;
			case 'transferNum': {
                if (RegExp.integer.test(value) || value === '') {
                    this.setState({transferNum: value});
                }
                break;
            }
			case 'phone':
				this.setState({phone: value})
				break;
			case 'pwd2':
				this.setState({pwd2: value})
				break;
			default:
				break;
		}
	}

	btn = () => {
        const {equityNum, pwd1, transferNum,  phone, pwd2} = this.state;
		if (this.state.type == 'exchange') {
            if (equityNum == '') {
                Toast.tipBottom('请输入对换数量')
                return ;
            }
            if (pwd1 == '') {
                Toast.tipBottom('请输入您的支付密码')
                return ;
            }
            this.props.exchange(this.state.equityNum, this.state.pwd1)
		}if (this.state.type == 'transfer') {
            if (transferNum == '') {
                Toast.tipBottom('请输入转让数量')
                return ;
            }
            if (phone == '') {
                Toast.tipBottom('请输入转入的手机号')
                return ;
            }
            if (pwd2 == '') {
                Toast.tipBottom('请输入您的支付密码')
                return ;
            }
			this.props.getTransferUser(this.state.phone)
		}
	}

    render() {
        const { data } = this.props;
        const { type, equityNum, pwd1, transferNum, phone, pwd2 } = this.state;
        return (
            <View style={{backgroundColor: Colors.White, marginTop: 15, marginHorizontal: 15, borderRadius: 10, paddingBottom: 20 }}>
                <View style={{flexDirection: 'row', height: 40, marginBottom: 10}}>
                    <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: type == 'exchange' ? Colors.C6 : Colors.White, borderTopLeftRadius: 10}}
                        onPress={()=> this.setState({type: 'exchange'})}>
                        <Text style={{color: type == 'exchange' ? Colors.White : Colors.C12}}>兑换</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: type == 'transfer' ? Colors.C6 : Colors.White, borderTopRightRadius: 10}}
                        onPress={()=> this.setState({type: 'transfer'})}>
                        <Text style={{color: type == 'transfer' ? Colors.White : Colors.C12}}>转让</Text>
                    </TouchableOpacity>
                </View>
                {type == 'exchange' ? <View style={{paddingHorizontal: 10}}>
                    <View style={styles.inputView}>
                        <TextInput
                            style={styles.input}
                            numberOfLines={1}
                            onChangeText={(value) => this.inputOnChange('equityNum', value)}
                            placeholder={`兑换数量 (${data.unitPrice ? data.unitPrice  : ''}糖果${data.unitPrice ? data.unitPrice : ''}果皮兑换1股)`}
                            keyboardType={'numeric'}
                            dataDetectorTypes={'phoneNumber'}
                            value={equityNum}
                        />
                    </View>
                    <View style={styles.inputView}>
                        <TextInput
                            style={styles.input}
                            onChangeText={(value) => this.inputOnChange('pwd1', value)}
                            placeholder={'交易密码'}
                            secureTextEntry={true}
                            value={pwd1}
                        />
                    </View>
                </View> :
                <View style={{paddingHorizontal: 10}}>
                    <View style={styles.inputView}>
                        <TextInput
                            style={styles.input}
                            onChangeText={(value) => this.inputOnChange('transferNum', value)}
                            placeholder={`当前可转让 ${data.convertible ? data.convertible : ''} 份`}
							keyboardType={'numeric'}
                            value={transferNum}
                        /> 
                    </View>
                    <View style={styles.inputView}>
                        <TextInput
                            style={styles.input}
                            onChangeText={(value) => this.inputOnChange('phone', value)}
                            placeholder={'对方注册手机号'}
							keyboardType={'numeric'}
                            value={phone}
                        /> 
                    </View>
                    <View style={styles.inputView}>
                        <TextInput
                            style={styles.input}
                            onChangeText={(value) => this.inputOnChange('pwd2', value)}
                            placeholder={'交易密码'}
                            secureTextEntry={true}
                            value={pwd2}
                        /> 
                    </View>
                </View>}
                <TouchableOpacity style={styles.btn} onPress={this.btn}>
                    <Text style={{fontSize: 16, color: Colors.White}}>{type == 'exchange' ? '兑换' : '申请转让'}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    btn: {backgroundColor: Colors.C6, height: 40, marginHorizontal: 20, justifyContent: 'center', alignItems: 'center', marginTop: 20, borderRadius: 20},
    inputView: {height: 50, borderBottomWidth: 1, borderBottomColor: Colors.C16},
    input: {
        height: 50
    },
})
