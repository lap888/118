import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, DeviceEventEmitter, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import { OrderApi, UserApi } from '../../../api';
import { Toast } from '../../common';
import { Header } from '../../components/Index';
import { Colors } from '../../theme/Index';

export default class ConfirmOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data,
            address: '',
        };
    }
    componentDidMount() {
        this.seAddListener = DeviceEventEmitter.addListener('setAddress', (data) => {
            this.setState({ address: data })
        })
        this.getaddress();
    }

    componentWillUnmount() {
        this.seAddListener.remove()
    }

    getaddress = () => {
        UserApi.getAddress()
            .then((data) => {
                if (data.length > 0) {
                    for (let i = 0; i < data.length; i++) {
                        const element = data[i];
                        if (element.isDefault == 1) {
                            this.setState({ address: element })
                        }
                    }
                }
            }).catch((err) => console.log('err', err))
    }

    subOrder = () => {
        const { data, address } = this.state;
        const params = {
            "ShopId": data.id,
            "Type": data.type, // 支付方式 0 alipay 1 weipay 2 yb
            "AdressId": address.id,
            "Remark": "", // 备注
            "count": data.num
        }
        OrderApi.subOrder(params)
            .then((data) => {
                Toast.tip('支付成功请到订单中查看')
                Actions.pop()
            }).catch((err) => console.log('err', err))
    }

    render() {
        let { data, address } = this.state;
        let dw = 'GC'//data.type == 0 ? '￥' : data.type == 1 ? '￥' : data.type == 2 ? '￥' : '';
        let payMoney = (Number(data.ybPrice) * Number(data.num)).toFixed(2); //data.type == 0 ? (Number(data.ybPrice) * Number(data.num)).toFixed(2) : data.type == 1 ? (Number(data.usdtPrice) * Number(data.num)).toFixed(2) : data.type == 2 ? (Number(data.usdtPrice) * Number(data.num) * 0.7).toFixed(2) : '';
        return (
            <View style={{ flex: 1, backgroundColor: Colors.backgroundColor }}>
                <Header title={'确认订单'} />
                <View style={{ flex: 1 }}>
                    <View style={styles.card}>
                        {address == '' ? <TouchableOpacity style={{ height: 40, flexDirection: 'row', alignItems: 'center' }} onPress={() => Actions.push('Adress', { type: 'order' })}>
                            <Icon name={'location'} size={20} />
                            <Text style={{ fontSize: 16, flex: 1 }}>  添加收货地址</Text>
                            <Icon name={'chevron-forward-sharp'} size={20} color={Colors.grayFont} />
                        </TouchableOpacity> :
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => Actions.push('Adress', { type: 'order' })}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 14, color: Colors.fontColor }}><Icon name={'location'} size={14} /> {`${address.province}  ${address.city}  ${address.area}`}</Text>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 5 }}>{address.address}</Text>
                                    <Text style={{ fontSize: 14, color: Colors.fontColor, marginTop: 5 }}>{`${address.name}  ${address.phone}`}</Text>
                                </View>
                                <Icon name={'chevron-forward-sharp'} size={20} color={Colors.grayFont} />
                            </TouchableOpacity>
                        }
                    </View>
                    <View style={styles.card}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                            <Image style={{ height: 60, width: 60 }} source={{ uri: data.shopPic1 }} />
                            <View style={{ flex: 1, marginLeft: 10 }}>
                                <Text style={{ fontSize: 14, color: Colors.fontColor }}>{data.name}</Text>
                                <Text style={{ fontSize: 12, fontWeight: 'bold', marginTop: 5 }}>x{data.num}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginTop: 5 }}>
                                    <Text style={{ fontSize: 12, color: Colors.grayFont, lineHeight: 24 }}>价格:</Text>
                                    <Text style={{ fontSize: 18, color: '#E70243' }}> {payMoney}<Text style={{ fontSize: 12 }}> {dw}</Text></Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 10 }} >
                            <Text style={{ fontSize: 12, color: Colors.fontColor }}>快递费</Text>
                            <Text style={{ fontSize: 12, color: Colors.fontColor }}>{data.postPrice}￥</Text>
                        </View>
                    </View>
                </View>
                <View style={{ height: 50, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, backgroundColor: Colors.White }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 12, color: Colors.grayFont, lineHeight: 24 }}>需支付:  </Text>
                        {<Text style={{ fontSize: 18, color: '#E70243', }}>{payMoney}</Text>}
                        <Text style={{ fontSize: 12, color: '#E70243', lineHeight: 22 }}> {dw}</Text>
                    </View>
                    <TouchableOpacity style={{ width: 150, height: 40, borderRadius: 20 }} onPress={this.subOrder}>
                        <LinearGradient colors={['#FFC887', Colors.main]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 16, color: Colors.White }}>提交订单</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.White,
        borderRadius: 10,
        marginHorizontal: 10,
        marginTop: 10,
        padding: 10
    },
})
