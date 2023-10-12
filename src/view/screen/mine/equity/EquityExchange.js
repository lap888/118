import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView } from 'react-native';
import { Actions } from 'react-native-router-flux';

import { Header } from '../../../components/Index';
import { Colors, Metrics } from '../../../theme/Index';
import ExchangeOrTransfer from './ExchangeOrTransfer';
import TransferModal from './TransferModal';
import { EquityApi, UserApi } from '../../../../api';
import Loading from '../../../common/Loading';
import { Toast } from '../../../common';

export default class EquityExchange extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: '',
            transferModal: false,
            tInfo: {},
            loading: false
        };
    }

    componentDidMount() {
        this.getDetail()
    }

    getDetail = () => {
        EquityApi.getEquityDetail()
        .then((data) => {
            this.setState({data: data, loading: false})
        }).catch((err) => {this.setState({loading: false}); console.log('err', err)})
    }

    exchange = (num, pwd) => {
        if (this.state.loading) {
            return ;
        }
        this.setState({loading: true}, () => {
            const params = {
                PayPwd: pwd,
                Shares: Number(num)
            }
            EquityApi.exchangeEquity(params)
            .then((data) => {
                if (data) {
                    Toast.tipBottom('兑换成功')
                    this.refs.transfer && this.refs.transfer.inputOnChange('equityNum', '')
                    this.refs.transfer && this.refs.transfer.inputOnChange('pwd1', '')
                    this.getDetail()
                }else{
                    this.setState({loading: false})
                }
            }).catch((err) => {this.setState({loading: false}); console.log('err', err)})
        })
        
    }

    getTransferUser = (mobile) => {
        UserApi.getEquityDetail(mobile)
        .then((res) => {
            this.setState({tInfo: res.data, transferModal: true})
        }).catch((err) => console.log('err', err))
    }

    assignment = () => {
        if (this.state.loading) {
            return ;
        }
        this.setState({loading: true, transferModal: false}, () => {
            const { transferNum, phone, pwd2 } = this.refs.transfer.state;
            const params = {
                "PayPwd": pwd2,
                "Mobile": phone,
                "Shares": Number(transferNum)
            }
            EquityApi.transferEquity(params)
            .then((res) => {
                if (res) {
                    this.getDetail()
                    Toast.tipBottom('转让成功')
                    
                    this.refs.transfer && this.refs.transfer.inputOnChange('transferNum', '')
                    this.refs.transfer && this.refs.transfer.inputOnChange('phone', '')
                    this.refs.transfer && this.refs.transfer.inputOnChange('pwd2', '')
                }else{
                    this.setState({loading: false})
                }
            }).catch((err) =>  {this.setState({loading: false}); console.log('err', err)})
        })
    }

    mailed = () => {
        if (this.state.data.totalShares && Number(this.state.data.totalShares) > 0) {
            Alert.alert(
                '证书邮寄',
                `申请纸质证书需工本费及邮费，申请后将不能转让，具体请联系客服`,
                [
                    {text: "确定", onPress: () => {} },
                ],
            )
        }else{
            Toast.tipBottom('您当前没有可以邮寄')
        }
        
    }

    openDianZi = () => {
        if (this.state.data.totalShares && Number(this.state.data.totalShares) > 0) {
            Actions.push('ElectronicEquity',{data: this.state.data});
        }else{
            Toast.tipBottom('您当前没有可以查看')
        }
    }

    render() {
        const { data, transferModal, loading } = this.state;
        if (data != '' && data.totalShares != 0) {
            return (
                <View style={{ flex: 1, backgroundColor: Colors.WhiteSmoke }}>
                    <Header title={'兑换'} rightText="明细" onRightPress={() => Actions.push('EquityDetailList')} />
                    <ScrollView>
                        <View style={styles.card}>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 18, color: Colors.White }}>账户信息</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.name}>姓名:   {data.trueName}</Text>
                                <Text style={styles.textTang}>糖果:   {data.candy}</Text>
                                <Text style={{ color: Colors.C8, fontSize: 12 }}>( 糖果、果皮数量都需大于{data.candyLimit} )</Text>
                                <Text style={styles.textTang}>累计份数:   {data.totalShares}</Text>
                                <Text style={{ color: Colors.C8, fontSize: 12 }}>( {data.unitPrice}糖果{data.unitPrice}果皮兑换 1 份 )</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
                                <TouchableOpacity style={styles.btn} onPress={this.openDianZi}>
                                    <Text style={{ fontSize: 14 }}>电子版证书</Text>
                                </TouchableOpacity>
                                <View style={{ width: 40 }} />
                                <TouchableOpacity style={styles.btn} onPress={this.mailed}>
                                    <Text style={{ fontSize: 14 }}>申请邮寄</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <KeyboardAvoidingView behavior='position' >
                            <ExchangeOrTransfer ref='transfer' data={data} exchange={this.exchange} getTransferUser={this.getTransferUser} />
                        </KeyboardAvoidingView>
                        <View style={{ paddingHorizontal: 15, marginTop: 15 }}>
                            <Text style={{ lineHeight: 20 }}> *{data.rules && data.rules}
                            </Text>
                        </View>
                        <View style={{ height: 45, }} />
                    </ScrollView>
                    {loading ? <Loading /> : null}
                    {transferModal ? <TransferModal info={this.state.tInfo} close={() => this.setState({ transferModal: false })} enter={this.assignment} /> : null}
                </View>
            );
        }else{
            return (
                <View style={{flex: 1}}>
                    <Header title={'兑换'} />
                    <View style={{marginTop: 70, alignItems: 'center'}}>
                        <Text style={{ fontSize: 18 }}>暂未开放</Text>
                    </View>
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    card: {minHeight: 200, backgroundColor: Colors.main, marginHorizontal: 15, marginTop: 15, borderRadius: 10, padding: 10},
    name: {color: Colors.White, fontSize: 16, marginTop: 10},
    textTang: {color: Colors.White, fontSize: 16, marginTop: 20},
    btn: {flex: 1, height: 35, backgroundColor: Colors.White, borderRadius: 5, paddingHorizontal: 10, justifyContent: 'center', alignItems: 'center'},
}) 

