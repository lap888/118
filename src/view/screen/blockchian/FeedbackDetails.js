import React, { Component } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, TextInput, DeviceEventEmitter } from 'react-native';
import { connect } from 'react-redux';

import { launchImageLibrary } from 'react-native-image-picker';
import { Header } from '../../components/Index';
import { Colors } from '../../theme/Index';
import CurrencyApi from '../../../api/yoyoTwo/currency/CurrencyApi';
import { Actions } from 'react-native-router-flux';
import { Loading } from '../../common';

class FeedbackDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data,
            img: '',
            txt: '',
            isLoading: false,
        };
    }


    /**
     * 调用摄像头或手机相册
     */
    pickImage = () => {
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
                console.log('launchImageLibrary 错误: ', response.errorMessage);
            } else {
                let picBase = 'data:image/jpeg;base64,' + response.base64;
                this.setState({img: picBase})
            }
        });
    }

    submit = () => {
        const { txt, img, data } = this.state;
        if (txt === '') {
            Toast.tip('请输入反馈内容');
            return ;
        }
        let p = {
            Id: data.id,
            PicUrl: img,
            Description: txt,
            Type: data.type,
        }
        this.setState({isLoading: true},() => {
            CurrencyApi.feedback(p)
            .then((data) => {
                Toast.tip('提交成功');
                DeviceEventEmitter.emit('refranshQAList')
                Actions.pop();
                this.setState({isLoading: false})
            })
            .catch((err) => this.setState({isLoading: false}))
        })
    }

    // Keyboard.dismiss();
    
    render() {
        const { data, img, txt, isLoading } = this.state;
        let res =  JSON.parse(data.description);
        return (
            <View style={{flex: 1, backgroundColor: Colors.backgroundColor}}>
                <Header title={'反馈详情'} />
                <ScrollView style={{flex: 1}} >
                    {res && res.map((item, index) => {
                        return (
                            <View key={index} style={{marginTop: 10, paddingHorizontal: 15 }}>
                                <View style={{height: 20, alignItems: 'center'}}>
                                    <Text style={{fontSize: 10, color: Colors.grayFont}}>{item.cTime}</Text>
                                </View>
                                <View style={{flexDirection: 'row', backgroundColor: Colors.White, borderRadius: 5, padding: 10 }}>
                                    {item.flag === "Q" && <Image style={{height: 30, width: 30, borderRadius: 15 }} source={{uri: this.props.avatar}} />}
                                    {item.flag === "A" && <Image style={{height: 30, width: 30, borderRadius: 15 }} source={require('../../images/logo.png')} />}
                                    <View style={{flex: 1, marginHorizontal: 10, marginTop: 5 }}>
                                        <Text style={{fontSize: 14, lineHeight: 20 }}>{item.content}</Text>
                                        {item.flag === "Q" && item.picUrl &&<Image style={{height: 150, width: 100, marginVertical: 10}} resizeMode={'stretch'} source={{uri: item.picUrl}} />}
                                    </View>
                                </View>
                            </View>
                        )
                    })}
                    {data.status == 0 ? <View style={{flexDirection: 'row', backgroundColor: Colors.White, borderRadius: 5, padding: 5, marginHorizontal: 15, marginTop: 20 }}>
                        <View style={{flex: 1, marginHorizontal: 10, marginTop: 10 }}>
                            <TextInput 
                                style={styles.input}
                                placeholder={'继续描述您遇到的问题'}
                                onChangeText={(value) => this.setState({txt: value})}
                                value={txt}
                                multiline={true}
                            />
                            <View style={{ flexDirection: 'row' }}>
                                {img === '' ? <TouchableOpacity style={[styles.imgView, { justifyContent: 'center', alignItems: 'center' }]} onPress={this.pickImage}>
                                    <Text style={{ color: Colors.grayFont, fontSize: 40 }}> + </Text>
                                </TouchableOpacity> :
                                    <TouchableOpacity style={styles.imgView} onPress={this.pickImage}>
                                        <Image style={{ height: 150, width: 100, marginVertical: 10 }} source={{ uri: img }} />
                                    </TouchableOpacity>
                                }
                                <View style={{ flex: 1, marginBottom: 10, justifyContent: 'flex-end', alignItems: 'flex-end' }} >
                                    <TouchableOpacity style={styles.bigBtn} onPress={this.submit}>
                                        <Text style={{fontSize: 14, color: Colors.White}}>提交</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View> : <View/>}
                    <View style={{height: 50,}} />
                </ScrollView>
                {isLoading && <Loading/>}
            </View>
        );
    }
}


const mapStateToProps = state => ({
    logged: state.user.logged,
    userId: state.user.id,
	avatar: state.user.avatarUrl,
});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(FeedbackDetails);

const styles = StyleSheet.create({
    imgView: {
        height: 150,
        width: 100,
        marginVertical: 10,
        borderRadius: 3,
        backgroundColor: Colors.backgroundColor,
    },
    input: {fontSize: 14, height: 80, paddingHorizontal: 5, borderRadius: 5, backgroundColor: Colors.backgroundColor, textAlignVertical: 'top' 
    },
    bigBtn: {
        backgroundColor: Colors.main,
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        height: 40,
        borderRadius: 5
    },
})