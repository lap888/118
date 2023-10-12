import React, { Component } from 'react';
import { View, Text, SafeAreaView, Image, StyleSheet, ScrollView, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import { Colors, Metrics } from '../theme/Index';
import { MapView } from "react-native-amap3d";
import { Header } from './Index';
import { OtherApi } from '../../api';
import Icon from 'react-native-vector-icons/Ionicons';
import { Actions } from 'react-native-router-flux';

export default class MapViewScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            biao: '',
            addressList: [],
            daddress: '',
            storelatitude: 0,
            storelongitude: 0
        };
    }

    setDetailAddress = (address) => {
        let params = {
            address: address,
            longitude: this.state.storelongitude,
            latitude: this.state.storelatitude,
        }
        DeviceEventEmitter.emit('setAddress', params)
        Actions.pop()
    }

    getaddress = (lang, lat) => {
        OtherApi.getDAddress(lang, lat)
            .then((data) => {
                this.setState({
                    addressList: data.pois,
                    daddress: data.formatted_address,
                    storelatitude: lat,
                    storelongitude: lang
                })
            }).catch((err) => console.log('err', err))
    }

    render() {
        if (this.props.type == 'selUser') {
            const data = this.props.data;
            const lat = this.props.lat;
            const lng = this.props.lng;
            return (
                <SafeAreaView style={{ flex: 1, backgroundColor: Colors.backgroundColor }}>
                    <MapView
                        style={{ flex: 1 }}
                        zoomLevel={4}
                    >
                        {data && data.length > 0 && data.map((item, index) => {
                            return (
                                <MapView.Marker
                                    icon={() => <Image style={{ width: 14, height: 14, borderRadius: 7 }} source={{ uri: item.avatarUrl }} />}
                                    draggable={false}
                                    coordinate={{
                                        latitude: item.latitude,
                                        longitude: item.longitude
                                    }}
                                >
                                    <View style={{ backgroundColor: Colors.C2, padding: 5,borderRadius: 5, }}>
                                        <Image style={{ width: 24, height: 24, borderRadius: 7 }} source={{ uri: item.avatarUrl }} />
                                        <Text style={{ fontSize: 12, color: Colors.White }}>城主：{item.CityName}</Text>
                                        <Text style={{ fontSize: 12, color: Colors.White }}>昵称：{item.name}</Text>
                                        {/* {item.Wechat == '' ? null : <Text style={{fontSize: 10}}>{item.Wechat}</Text>} */}
                                    </View>
                                </MapView.Marker>
                            )
                        })}

                    </MapView>
                </SafeAreaView>
            )
        } else if (this.props.type == 'selAddress') {
            return (
                <SafeAreaView style={{ flex: 1, backgroundColor: Colors.backgroundColor }}>
                    <Header title={'选择详细地址'} />
                    <MapView
                        style={{ height: 350, width: Metrics.screenWidth }}
                        center={{ latitude: 38.036563358542296, longitude: 114.61916138146208 }}
                        tiltEnabled={false}
                        zoomLevel={15}
                        showsLabels={true}
                        showsScale={true}
                        mapType={0}
                        onClick={(mapStatus) => {
                            this.getaddress(mapStatus.longitude, mapStatus.latitude)
                        }}
                        onStatusChangeComplete={(mapStatus) => {
                            this.getaddress(mapStatus.center.longitude, mapStatus.center.latitude)
                        }}
                    />
                    <View style={{ width: 20, position: 'absolute', marginTop: 200, marginLeft: Metrics.screenWidth / 2 - 10 }}>
                        <Icon name={'ios-location-sharp'} size={20} color={'red'} />
                    </View>
                    <ScrollView style={{ flex: 1, paddingTop: 5, backgroundColor: Colors.White }}>
                        <TouchableOpacity style={styles.item} onPress={() => this.setDetailAddress(`${this.state.daddress}`)}>
                            <Text style={{ fontSize: 14, }}>地图位置</Text>
                            <Text style={{ fontSize: 12, color: Colors.grayFont }}>{this.state.daddress}</Text>
                        </TouchableOpacity>
                        {this.state.addressList.map((item, index) => {
                            return (
                                <TouchableOpacity key={index} style={styles.item} onPress={() => this.setDetailAddress(`${item.businessarea}${item.address}${item.name}`)}>
                                    <Text style={{ fontSize: 14, }}>{item.name}</Text>
                                    <Text style={{ fontSize: 12, color: Colors.grayFont }}>{item.distance < 100 ? '100m 内' : `${item.distance}m`} | {item.businessarea}{item.address}</Text>
                                </TouchableOpacity>
                            )
                        })}
                    </ScrollView>
                </SafeAreaView>
            )
        }
    }
}
const styles = StyleSheet.create({
    item: {
        paddingVertical: 10,
        justifyContent: 'center',
        borderTopWidth: 1,
        borderTopColor: Colors.backgroundColor,
        paddingHorizontal: 10
    },
})
