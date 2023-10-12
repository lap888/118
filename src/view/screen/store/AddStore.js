import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, DeviceEventEmitter, StyleSheet } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';

import { SimpleItemsDialog, AreaPicker } from 'react-native-pickers';

import AreaJson from '../../common/area.json';
import { Header } from '../../components/Index';
import { Colors, Metrics } from '../../theme/Index';
import { StoreApi } from '../../../api';
import { Loading } from '../../common';
const typelist= [
    { key: 1, name: '美食' },
    { key: 2, name: '娱乐' },
    { key: 3, name: '生活服务' },
    { key: 4, name: '日用百货' },
    { key: 5, name: '其他' },
]
export default class AddStore extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "Name": "",
            "TelPhone": "",
            "Type": 0,
            "Remark": "",
            "Address": "",
            "DAddress": "",
            "Longitude": 0,
            "Latitude": 0,
            "LogoPic": "",
            "StoreInPic": []
        };
    }
    
    componentDidMount() {
        DeviceEventEmitter.addListener('setAddress', (data) => {
            this.setState({
                DAddress: data.address,
                Longitude: data.longitude,
                Latitude: data.latitude,
            })
        })  
    }

    submit = () => {
        this.setState({isLoading: true },() => {
            StoreApi.addStore(this.state)
            .then((data) => {
                console.warn('data', data);
                this.setState({isLoading: false })
            }).catch((err) => this.setState({isLoading: false }))
        })
    }

    handleImagePicker = (key, index = 0) => {
        const options = {
            cameraType: 'back',
            mediaType: 'photo',
            videoQuality: 'high',
            durationLimit: 10,
            maxWidth: 600,
            maxHeight: 600,
            quality: 1,
            includeBase64: true,
            saveToPhotos: false
        };
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('用户取消了选择图片');
            } else if (response.errorCode) {
                console.log('ImagePicker 错误: ', response.errorMessage);
            } else {
                if (key == 'banner') {
                    this.setState({ LogoPic: 'data:image/jpg;base64,' + response.base64 });
                }
                if (key == 'content') {
                    const piclist = this.state.StoreInPic;
                    piclist.push({
                        "Base64Pic": 'data:image/jpg;base64,' + response.base64,
                        "Width": 0,
                        "Height": 0
                    })
                    this.setState({ StoreInPic: piclist });
                }
                if (key == 'replace') {
                    const piclist = this.state.StoreInPic;
                    piclist[index] = {
                        "Base64Pic": 'data:image/jpg;base64,' + response.base64,
                        "Width": 0,
                        "Height": 0
                    }
                    this.setState({ StoreInPic: piclist });
                }
            }
        });
    }

    render() {
        const { Type, TelPhone, Name, Remark, Address, DAddress } = this.state;
        return (
            <View style={{flex: 1, backgroundColor: Colors.White}}>
                <Header title={'商户入驻'} />
                <ScrollView style={{flex: 1, paddingHorizontal: 10, marginBottom: 10}}>
                    <Text style={{fontSize: 15, fontWeight: 'bold', marginTop: 10}}>信息填写</Text>
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ fontSize: 14, color: Colors.C12 }}>选择分类</Text>
                        <TouchableOpacity 
                            style={{ height: 50, borderBottomColor: Colors.C13, borderBottomWidth: 1, justifyContent: 'center' }}
                            onPress={() => this.SimpleItemsDialog.show()}
                            >
                            <Text style={{ color: Type === 0 ? Colors.grayFont : Colors.fontColor}}>{Type === 0 ? '请选择分类' : typelist[Type].name}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ fontSize: 14, color: Colors.C12 }}>店铺联系方式</Text>
                        <View style={{ height: 50, borderBottomColor: Colors.C13, borderBottomWidth: 1, }}>
                            <TextInput
                                style={{ flex: 1 }}
                                placeholder={'请输入店铺联系方式'}
                                keyboardType='number-pad'
                                value={TelPhone}
                                onChangeText={(value) => this.setState({ TelPhone: value })}
                            />
                        </View>
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ fontSize: 14, color: Colors.C12 }}>店铺名称</Text>
                        <View style={{ height: 50, borderBottomColor: Colors.C13, borderBottomWidth: 1, }}>
                            <TextInput
                                style={{ flex: 1 }}
                                placeholder={'请输入店铺名称'}
                                value={Name}
                                onChangeText={(value) => this.setState({ Name: value })}
                            />
                        </View>
                    </View>
                    <TouchableOpacity style={{ marginTop: 10 }} onPress={() => this.AreaPicker.show()}>
                        <Text style={{ fontSize: 14, color: Colors.C12 }}>店铺地址</Text>
                        <View style={{ height: 50, borderBottomColor: Colors.C13, borderBottomWidth: 1, justifyContent: 'center' }}>
                            <Text style={{ color: Address === '' ? Colors.grayFont : Colors.fontColor}}>{Address === '' ? '请选择店铺地址' : Address }</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginTop: 10 }} onPress={() => Actions.push('MapView', {type: 'selAddress'})}>
                        <Text style={{ fontSize: 14, color: Colors.C12 }}>店铺详细地址</Text>
                        <View style={{ height: 50, borderBottomColor: Colors.C13, borderBottomWidth: 1,justifyContent: 'center' }}>
                            <Text style={{ color: DAddress === '' ? Colors.grayFont : Colors.fontColor}}>{DAddress === '' ? '请选择店铺详细地址' : DAddress }</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ fontSize: 14, color: Colors.C12 }}>备注</Text>
                        <View style={{ height: 50, borderBottomColor: Colors.C13, borderBottomWidth: 1, }}>
                            <TextInput
                                style={{ flex: 1 }}
                                placeholder={'备注'}
                                value={Remark}
                                onChangeText={(value) => this.setState({ Remark: value })}
                            />
                        </View>
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ fontSize: 14, color: Colors.C12 }}>添加店铺门面照片</Text>
                        <View style={{ marginTop: 10, borderBottomColor: Colors.C13, justifyContent: 'center', paddingLeft: 10}}>
                            {this.state.LogoPic === '' ? 
                                <TouchableOpacity style={styles.selectImgBtn} onPress={() => this.handleImagePicker('banner')}>
                                    <Icon name={'ios-add'} size={50} color={Colors.grayFont}/>
                                </TouchableOpacity> : 
                                <TouchableOpacity style={styles.selectImgBtn} onPress={() => this.handleImagePicker('banner')}>
                                    <Image style={styles.selectImgBtn} resizeMode='stretch' source={{uri: this.state.LogoPic}} />
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ fontSize: 14, color: Colors.C12 }}>添加店内照片</Text>
                        <View style={{ marginTop: 10, borderBottomColor: Colors.C13, justifyContent: 'center', paddingLeft: 10}}>
                            {this.state.StoreInPic.map((item, index) => {
                                return (
                                    <TouchableOpacity key={index} style={[styles.selectImgBtn, {marginBottom: 10}]} onPress={() => this.handleImagePicker('replace', index)}>
                                        <Image style={styles.selectImgBtn} resizeMode='stretch' source={{uri: item.Base64Pic}} />
                                    </TouchableOpacity>
                                )
                            })}
                            {this.state.StoreInPic.length >= 4 ? null : 
                                <TouchableOpacity style={styles.selectImgBtn} onPress={() => this.handleImagePicker('content')}>
                                    <Icon name={'ios-add'} size={50} color={Colors.grayFont}/>
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
                    <View style={{height: 100, }}>
                        <TouchableOpacity style={styles.submitBtn} onPress={this.submit}>
                            <Text style={{color: Colors.White}}>提交审核</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <SimpleItemsDialog 
                    items={typelist}
                    itemKey={'name'}
                    cance={false}
                    onPress={(value) => {
                        this.setState({Type: value})
                    }}
                    ref={ref => this.SimpleItemsDialog = ref}/>
                <AreaPicker
                    areaJson={AreaJson}
                    onPickerCancel={() => { }}
                    onPickerConfirm={(value) => {
                        this.setState({Address: `${value[0]} ${value[1]} ${value[2]}`})
                    }}
                    ref={ref => this.AreaPicker = ref} />
                    {this.state.isLoading && <Loading/>}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    selectImgBtn: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.backgroundColor,
        width: Metrics.screenWidth - 40,
        borderRadius: 5
    },
    submitBtn: {
        height: 45,
        marginTop: 30,
        marginHorizontal: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: Colors.main
    },
})
