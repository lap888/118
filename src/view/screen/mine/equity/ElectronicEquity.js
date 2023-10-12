import React, { Component } from 'react';
import { View, Text, Image, CameraRoll, PermissionsAndroid } from 'react-native';
import { Header } from '../../../components/Index';

import { captureRef } from "react-native-view-shot";
import { Colors } from '../../../theme/Index';
import { Toast } from '../../../common';

export default class ElectronicEquity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data
        };
    }

    saveImage = async () => {
        try {
            const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: "118创富助手想要使用您的相册存储权限",
                    message:
                        "没有您的存储权限将不能保存到相册",
                    buttonNeutral: "以后询问",
                    buttonPositive: "好的"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("允许");
                this.snapshot()
            } else {
                console.log("不允许");
            }
        } catch (err) {
            console.warn(err);
        }
    };

    snapshot = () => {
        captureRef(this.refs.diazi, {
            format: "jpg",
            quality: 0.8,
            // result: "tmpfile",
            // snapshotContentContainer: true
        })
        .then((uri) => {
            return CameraRoll.saveToCameraRoll(uri)
        })
        .then((res) => {
            Toast.tipBottom('保存成功')
        }).catch((err) => console.warn('err', err))
    }

    getData = () => {
        let date = new Date();  //实例一个时间对象；
        let year = date.getFullYear();  //获取系统的年；
        let month = date.getMonth() + 1;    //获取系统月份，由于月份是从0开始计算，所以要加1
        let day = date.getDate();   //获取系统日
        let hour = date.getHours(); //获取系统时间
        let minute = date.getMinutes(); //分
        let second = date.getSeconds(); //秒
        return year + '年' + month + '月' + day + '日 ' + hour + '时' + minute + '分' + second + '秒'
    }

    render() {
        const { data } = this.state;
        return (
            <View style={{flex: 1, alignItems: 'center', backgroundColor: Colors.White}}>
                <Header title={'电子股权证书'} rightText={"保存"} onRightPress={this.saveImage} />
                <View style={{width: 350, height: 500, backgroundColor: Colors.White}} ref='diazi'>
                    {/* <Image style={{ width: 260, height: 365, }} source={require('../../../images/mine/guquanrengou.png')}/> */}
                    {/* <Image style={{ width: 350, height: 500, position: 'absolute' }} source={require('../../../images/mine/dianzi.png')}/> */}
                    <View style={{flexDirection: 'row', marginTop: 134, height: 20,alignItems:'center', width: 350}}>
                        <Text style={{marginLeft: 200, fontSize: 10, color: '#000' }}>{data.trueName ? data.trueName : ''}</Text>
                    </View>
                    <View style={{flexDirection: 'row', height: 20,alignItems:'center', width: 350}}>
                        <Text style={{marginLeft: 190, fontSize: 10, color: '#000' }}>{data.mobile ? data.mobile : ''}</Text>
                    </View>
                    <View style={{flexDirection: 'row', height: 20,alignItems:'center', width: 350}}>
                        <Text style={{marginLeft: 170, fontSize: 10, color: '#000' }}>{data.idCardNum ? data.idCardNum : ''}</Text>
                    </View>
                    <View style={{flexDirection: 'row', height: 20,alignItems:'center', width: 350}}>
                        <Text style={{marginLeft: 200, fontSize: 10, color: '#000' }}>股权兑换</Text>
                    </View>
                    <View style={{flexDirection: 'row', height: 20,alignItems:'center', width: 350}}>
                        <Text style={{marginLeft: 195, fontSize: 10, color: '#000' }}>10,000,000</Text>
                    </View>
                    <View style={{flexDirection: 'row', height: 20,alignItems:'center', width: 350}}>
                        <Text style={{marginLeft: 205, fontSize: 10, color: '#000' }}>{data.totalShares}</Text>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 198, height: 18, alignItems:'center', width: 350}}>
                        <Text style={{marginLeft: 180, fontSize: 8, color: '#000' }}>{this.getData()}</Text>
                    </View>
                </View>
            </View>
        );
    }
}

