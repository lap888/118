import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import { ShopApi } from '../../../api';
import { Colors, Metrics } from '../../theme/Index';

export default class ClassfiyScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            leftData: '',
            rightData: [],
        };
    }

    componentDidMount() {
        this.getClass()
    }

    getClass = () => {
        ShopApi.getShopType()
        .then((data) => {
            this.setState({
                data: data,
                leftData: data[0],
                rightData: data[0].typeModels
            })
        }).catch((err) => console.log('err', err))
    }

    render() {
        const { leftData } = this.state;
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: Colors.White}}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.searchBar} onPress={() => Actions.push('SearchGoods')}>
                        <Icon name={'search-sharp'} size={16} color={Colors.grayFont}/>
                        <Text style={{fontSize: 14, color: Colors.grayFont}}>  请输入关键字</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{width: 40, marginRight: 10, justifyContent: 'center', alignItems: 'center'}} onPress={() => Actions.push('OrderList')}>
                        <Icon name={'ios-calendar-sharp'} size={16} color={Colors.main}/>
                        <Text style={{fontSize: 11}}>订单</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection: 'row', flex: 1 }}>
                    <View style={{width: 90, backgroundColor: Colors.White }}>
                        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
                            {this.state.data.map((item, index) => {
                                return (
                                    <TouchableOpacity
                                        key={index}
                                        activeOpacity={0.8}
                                        style={[styles.leftItem, {backgroundColor: leftData.id == item.id ? Colors.White : Colors.backgroundColor}]} 
                                        onPress={() => this.setState({leftData: item, rightData: item.typeModels})}>
                                        <Text>{item.name}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </ScrollView>
                    </View>
                    <View style={{flex: 1, backgroundColor: '#fff' }}>
                        <ScrollView>
                            {leftData != '' && <View style={{margin: 10}}>
                                <Image style={{width: Metrics.screenWidth - 110, height: (Metrics.screenWidth - 110)/2.72 }} source={{uri: leftData.url}} />
                            </View>}
                            <View style={{marginLeft: 10, flexDirection: 'row', flexWrap: 'wrap'}}>
                                {this.state.rightData.map((item, index) => {
                                    return (
                                        <TouchableOpacity 
                                            key={index}
                                            style={styles.rightItem} 
                                            activeOpacity={0.8}
                                            onPress={() => Actions.push('SearchGoods', {title: item.name, type: item.id})}>
                                            <Image style={{width: 50, height: 50}} source={{uri: item.url}}/>
                                            <Text style={{ fontSize: 14, color: Colors.fontColor, marginTop: 5}}>{item.name}</Text>
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}
const styles = StyleSheet.create({
    header: {
        height: 44,
        backgroundColor: Colors.White,
        borderBottomWidth: 1,
        borderBottomColor: '#dfdfdf',
        flexDirection: 'row'
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        borderRadius: 17,
        marginHorizontal: 10,
        marginVertical: 5,
        backgroundColor: Colors.backgroundColor
    },
    leftItem: {
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#dfdfdf',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.backgroundColor
    },
    rightItem: {
        width: (Metrics.screenWidth - 110)/3,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
        
    }
})
