import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Linking, TouchableOpacity, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Geolocation } from "react-native-amap-geolocation";
import { StoreApi } from '../../../api';
import { Header } from '../../components/Index';
import { Colors, Metrics } from '../../theme/Index';
import { Actions } from 'react-native-router-flux';

export default class StoreDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.store,
            doorOutPic: [],
            houseInPic: [],
        };
    }
    componentDidMount() {
        Geolocation.getCurrentPosition(
            position => {
                let latitude = position.location.latitude.toFixed(6);
                let longitude = position.location.longitude.toFixed(6);
                this.setState({
                    latitude: latitude,
                    longitude: longitude
                })
                error => {
                    console.log('error', error);
                }
            })

        StoreApi.getStoresDetail(this.props.store.id)
            .then((data) => {
                this.setState({
                    doorOutPic: data.doorOutPic,
                    houseInPic: data.houseInPic,
                })
            }).catch((err) => console.log('err', err))
    }

    openAMap = (lat, lon) => {
        const url = Platform.OS === 'ios'
            ? `iosamap://path?sourceApplication=applicationName&sid=&slat=${this.state.latitude}&slon=${this.state.longitude}&sname=当前位置&did=&dlat=${this.state.data.latitude}&dlon=${this.state.data.longitude}&dname=目标位置&dev=0&t=0`
            : `amapuri://route/plan/?sid=&slat=${this.state.latitude}&slon=${this.state.longitude}&sname=当前位置&did=&dlat=${this.state.data.latitude}&dlon=${this.state.data.longitude}&dname=目标位置&dev=0&t=0`;
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url)
            } else {
                console.log("请先安装")
            }
        })
    }

    callme = () => {
        Linking.openURL(`tel: ${this.state.data.telPhone}`)
    }

    render() {
        const { data } = this.state;
        return (
            <View style={{ flex: 1, backgroundColor: Colors.backgroundColor }}>
                <Header title={'店铺详情'} />
                <ScrollView style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', backgroundColor: Colors.White, padding: 10, }}>
                        <Image style={{ width: 90, height: 90, borderRadius: 10,marginTop: 10 }} resizeMode='stretch' source={{ uri: data.logoPic }} />
                        <View style={{ flex: 1, marginLeft: 10, alignItems: 'flex-start' }}>
                            <Text style={{ flex: 1, }}>{data.name}</Text>
                            <TouchableOpacity style={styles.tag1} onPress={this.callme}>
                                <Text style={{ fontSize: 12, color: Colors.White }}>联系商家</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.tag2, { marginTop: 8 }]} onPress={this.callme}>
                                <Text style={{ fontSize: 12, color: Colors.White }}>点购选餐</Text>
                            </TouchableOpacity>
                            <View style={styles.tag}>
                                <Text style={{ fontSize: 12, color: Colors.main }}>{data.type}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.address}>
                        <Text style={{ flex: 1 }}>{data.dAddress}</Text>
                        <Pressable onPress={this.openAMap}>
                            <Icon name={'navigate-outline'} size={18} color={Colors.grayFont} />
                        </Pressable>
                    </View>
                    <View>
                        <View style={{ height: 40, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ alignItems: 'center' }}>———— 店内详情 ————</Text>
                        </View>
                        <View style={{}}>
                            <View style={{ height: 40, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold', alignItems: 'center' }}>{data.name}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                {this.state.doorOutPic.map((item, index) =>
                                    <Image key={index} style={{ marginBottom: 10, width: Metrics.screenWidth, height: Metrics.screenWidth * item.height / item.width }} source={{ uri: item.url }} />
                                )}

                            </View>
                            <View style={{ height: 40, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold', alignItems: 'center' }}>店内展示</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                {this.state.houseInPic.map((item, index) =>
                                    <Image key={index} style={{ marginBottom: 10, width: Metrics.screenWidth, height: Metrics.screenWidth * item.height / item.width }} source={{ uri: item.url }} />
                                )}
                            </View>
                            <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
                                <Text style={{ fontSize: 14 }}>{data.remark}</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <TouchableOpacity style={styles.payBtn} onPress={() => Actions.push('StorePay', { storeName: data.name, storeId: data.id })}>
                    <Text style={{ fontSize: 16, color: Colors.White }}>立即支付</Text>
                </TouchableOpacity>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    tag: {
        borderRadius: 3,
        borderWidth: 1,
        borderColor: Colors.main,
        paddingVertical: 3,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
        marginTop: 8
    },
    tag1: {
        borderRadius: 3,
        backgroundColor: Colors.main,
        paddingVertical: 3,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8
    },
    tag2: {
        borderRadius: 3,
        backgroundColor: Colors.primary,
        paddingVertical: 3,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    address: {
        flexDirection: 'row',
        paddingVertical: 15,
        paddingHorizontal: 10,
        backgroundColor: Colors.White,
        borderTopWidth: 1,
        borderTopColor: Colors.C13
    },
    payBtn: {
        height: 50, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.main
    },
})
