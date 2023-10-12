import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, TouchableWithoutFeedback, Platform } from 'react-native';

import { launchImageLibrary } from 'react-native-image-picker';
import { SimpleItemsDialog } from 'react-native-pickers';

import RefreshListView, { RefreshState } from 'react-native-refresh-list-view';
import { Actions } from 'react-native-router-flux';

import { BigButton, Header, PicturePreview } from '../../components/Index';
import { Colors, Metrics } from '../../theme/Index';
import CurrencyApi from '../../../api/yoyoTwo/currency/CurrencyApi';
import { Loading } from '../../common';

const typelist = [
    { key: 1, name: '哟帮反馈' },
    { key: 2, name: '产品问题反馈' },
    { key: 3, name: '其他问题反馈' },
]

class YoTaskApeal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            data: '',
            img: '',
            type: '1',
            isLoading: false
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
                this.setState({ img: picBase })
            }
        });
    }

    submit = () => {
        const { id, img, data, type } = this.state;
        if (type === '') {
            Toast.tip('请选择反馈问题类型');
            return;
        }
        if (data === '') {
            Toast.tip('请输入反馈内容');
            return;
        }
        let resultStr = data.replace(/\ +/g, "");//去掉空格
        resultStr = resultStr.replace(/[ ]/g, "");    //去掉空格
        resultStr = resultStr.replace(/[\r\n]/g, "");//去掉回车换行
        let p = {
            Id: id,
            PicUrl: img,
            Description: resultStr,
            Type: typelist[type].key,
        }
        console.warn(p)
        this.setState({ isLoading: true }, () => {
            CurrencyApi.feedback(p)
                .then((data) => {
                    Toast.tip('提交成功，感谢您的反馈');
                    setTimeout(() => Actions.push('YoTaskApealList'), 1000)
                    this.setState({ isLoading: false })
                })
                .catch((err) => this.setState({ isLoading: false }))
        })

    }

    render() {
        const { data, img, type, isLoading } = this.state;
        return (
            <View style={{ flex: 1, backgroundColor: Colors.backgroundColor }}>
                <Header title="问题反馈" rightText={'记录'} onRightPress={() => Actions.push('YoTaskApealList')} />
                <TouchableOpacity style={{ height: 45, paddingLeft: 10, borderRadius: 3, justifyContent: 'center', backgroundColor: Colors.White, marginTop: 10, marginHorizontal: 15 }} onPress={() => { }}>
                    <Text style={{ color: type === '' ? Colors.grayFont : Colors.fontColor }}>{typelist[type].name}</Text>
                </TouchableOpacity>

                <View style={styles.iptView}>
                    <View style={{ flex: 1 }}>
                        <TextInput
                            style={{ flex: 1, textAlignVertical: 'top' }}
                            placeholder={'请输入您宝贵的意见或者遇到的问题，加上图片会更清晰'}
                            value={data}
                            multiline={true}
                            onChangeText={(value) => this.setState({ data: value })}
                        />
                    </View>
                </View>
                {img === '' ? <TouchableOpacity style={[styles.imgView, { justifyContent: 'center', alignItems: 'center' }]} onPress={this.pickImage}>
                    <Text style={{ color: Colors.grayFont, fontSize: 40 }}> + </Text>
                </TouchableOpacity> :
                    <View style={styles.imgView} onPress={this.pickImage}>
                        <Image style={styles.img} source={{ uri: img }} />
                    </View>
                }
                <BigButton style={styles.bigBtn} name={'提交'} onPress={this.submit} />
                <SimpleItemsDialog
                    items={typelist}
                    itemKey={'name'}
                    cance={false}
                    onPress={(value) => {
                        console.log('value: ', value);
                        this.setState({ type: value })
                    }}
                    ref={ref => this.SimpleItemsDialog = ref} />
                {isLoading && <Loading />}
            </View>
        );
    }
}

const mapStateToProps = state => ({
    logged: state.user.logged,
    userId: state.user.id
});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(YoTaskApeal);

const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
    sequenceTitle: { fontSize: 14, color: Colors.C11 },
    sequenceTitleed: { fontSize: 16, color: Colors.main },
    sequence: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        width: Metrics.screenWidth,
        backgroundColor: Colors.White
    },
    searchContainer: { padding: 12, borderWidth: 1, borderColor: Colors.C16, paddingTop: 8, paddingBottom: 8, borderRadius: 8, backgroundColor: Colors.White, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    mobileText: { fontSize: 15, color: Colors.C6, fontWeight: 'bold' },
    mobileInput: { padding: 8, marginLeft: 10, borderRadius: 6, backgroundColor: Colors.C8, marginRight: 10, fontSize: 15, color: Colors.C2, flex: 1, textAlignVertical: 'center', borderWidth: 1, borderColor: Colors.C16 },
    searchIcon: { fontWeight: 'bold', color: Colors.C6, fontSize: 30 },
    inviteCode: { fontSize: 12, color: Colors.C16, },

    iptView: {
        minHeight: 178,
        flexDirection: 'row',
        margin: 15,
        paddingHorizontal: 10,
        backgroundColor: Colors.White,
        borderRadius: 5
    },
    imgView: {
        width: 80,
        height: 80,
        borderRadius: 3,
        marginRight: 5,
        marginLeft: 20,
        backgroundColor: Colors.White
    },
    img: {
        width: 80,
        height: 80,
        borderRadius: 3,
    },
    bigBtn: {
        marginTop: 50,
        height: 50,
        borderRadius: 25,
        marginHorizontal: 80
    },
});



