import Clipboard from '@react-native-community/clipboard';
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { OrderApi } from '../../../api';
import { Toast } from '../../common';
import { Header } from '../../components/Index';
import { Colors } from '../../theme/Index';
import moment from 'moment';

export default class OrderDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data
        };
    }

    copy1 = () => {
        Clipboard.setString(this.state.data.orderNum);
        Toast.tip('已复制订单号')
    }
    copy2 = () => {
        Clipboard.setString(this.state.data.postNum);
        Toast.tip('已复制快递单号')
    }

    sureGet = () => {
        OrderApi.sureGet(this.state.data.id)
            .then((data) => {
                Toast.tip('已收货');
                this.state.data.status = 4;
                this.setState({
                    data: this.state.data
                })
                DeviceEventEmitter.emit('refranshOrder');
            }).catch((err) => console.log('err', err))
    }

    cancleOrder = () => {
        OrderApi.cancleOrder(this.state.data.id)
            .then((data) => {
                Toast.tip('已取消')
                this.state.data.status = 1;
                this.setState({
                    data: this.state.data
                })
                DeviceEventEmitter.emit('refranshOrder');
            }).catch((err) => console.log('err', err))
    }


    render() {
        const { data } = this.state;

        let dw = 'GC';// data.type == 0 ? '￥' : data.type == 1 ? '￥' : data.type == 2 ? '￥' : '';
        let payMoney = data.type == 0 ? (Number(data.candyPrice) * Number(data.num)).toFixed(2) : data.type == 1 ? (Number(data.ybPrice) * Number(data.num)).toFixed(2) : data.type == 2 ? (Number(data.usdtPrice) * Number(data.num)).toFixed(2) : '';
        return (
            <View style={{ flex: 1, backgroundColor: Colors.backgroundColor }}>
                <Header title={'订单详情'} />
                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    <View style={styles.card}>
                        <Text style={{ fontSize: 14, color: Colors.fontColor }}><Icon name={'location'} size={14} /> {`${data.province}  ${data.city}  ${data.area}`}</Text>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 5, marginLeft: 18 }}>{data.address}</Text>
                        <Text style={{ fontSize: 14, color: Colors.fontColor, marginTop: 5, marginLeft: 18 }}>{`${data.sName}  ${data.phone}`}</Text>
                    </View>
                    <View style={styles.card}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                            <Image style={{ height: 60, width: 60 }} source={{ uri: data.shopPic }} />
                            <View style={{ flex: 1, marginLeft: 10 }}>
                                <Text style={{ fontSize: 14, color: Colors.fontColor, flex: 1 }}>{data.name}</Text>
                                <Text style={{ fontSize: 12, marginTop: 5 }}>{data.amount}{dw} x {data.count}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.card}>
                        <View style={[styles.card3Item]}>
                            <Text style={styles.card3LeftTxt}>商品总额</Text>
                            <Text style={styles.card3RightTxt}>{data.amount * data.count} {dw}</Text>
                        </View>
                        <View style={styles.card3Item}>
                            <Text style={styles.card3LeftTxt}>运费:  </Text>
                            <Text style={styles.card3RightTxt}>￥ {data.postPrice}</Text>
                        </View>
                        <View style={styles.card3Item}>
                            <Text style={styles.card3LeftTxt}>实付金额:  </Text>
                            <Text style={styles.card3RightTxt}>{`${data.totalPrice} ${dw}`}</Text>
                        </View>
                    </View>
                    <View style={styles.card}>
                        <View style={[styles.card4Item, { marginTop: 5 }]}>
                            <Text style={styles.card4LeftTxt}>订单号:  </Text>
                            <Text style={styles.card4RightTxt}>{data.orderNum}</Text>
                            <Text style={{ fontSize: 12, color: Colors.main }} onPress={this.copy1}>复制</Text>
                        </View>
                        <View style={styles.card4Item}>
                            <Text style={styles.card4LeftTxt}>邮寄方式:  </Text>
                            <Text style={styles.card4RightTxt}>{data.postService}</Text>
                        </View>
                        <View style={styles.card4Item}>
                            <Text style={styles.card4LeftTxt}>快递单号:  </Text>
                            <Text style={styles.card4RightTxt}>{data.postNum}</Text>
                            <Text style={{ fontSize: 12, color: Colors.main }} onPress={this.copy2}>复制</Text>
                        </View>
                        <View style={styles.card4Item}>
                            <Text style={styles.card4LeftTxt}>下单时间:  </Text>
                            <Text style={styles.card4RightTxt}>{data.createTime}</Text>
                        </View>
                        <View style={styles.card4Item}>
                            <Text style={styles.card4LeftTxt}>发货时间:  </Text>
                            <Text style={styles.card4RightTxt}>{data.postTime}</Text>
                        </View>
                        <View style={styles.card4Item}>
                            <Text style={styles.card4LeftTxt}>收货时间:  </Text>
                            <Text style={styles.card4RightTxt}>{data.sureTime}</Text>
                        </View>
                    </View>
                </ScrollView>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', height: 50, backgroundColor: Colors.White, paddingHorizontal: 15 }}>
                    {data.status == 4 || data.status == 6 ? <TouchableOpacity style={styles.bottomBtn} onPress={() => { }}>
                        <Text style={{ color: Colors.White }}>申请售后</Text>
                    </TouchableOpacity> : null}
                    {data.status == 2 ? <TouchableOpacity style={styles.bottomBtn} onPress={this.cancleOrder}>
                        <Text style={{ color: Colors.White }}>取消订单</Text>
                    </TouchableOpacity> : null}
                    {data.status == 3 ? <TouchableOpacity style={styles.bottomBtn} onPress={this.sureGet}>
                        <Text style={{ color: Colors.White }}>确认收货</Text>
                    </TouchableOpacity> : null}
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
    card3Item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10
    },
    card4Item: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10
    },
    card3LeftTxt: {
        fontSize: 12,
        color: Colors.grayFont,
        flex: 1,
    },
    card3RightTxt: {
        fontSize: 12,
    },
    card4LeftTxt: {
        fontSize: 12,
        color: Colors.grayFont,
    },
    card4RightTxt: {
        fontSize: 12,
        flex: 1,
    },
    bottomBtn: {
        height: 30,
        width: 90,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.main,
        marginLeft: 10
    },

})