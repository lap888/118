import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { Send } from '../../../utils/Http';
import { Header } from '../../components/Index';
import { Colors, Metrics } from '../../theme/Index';
import NftDetailModal from './NftDetailModal';
import { Toast } from '../../common';

class NftDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data,
            bannerList: [],
            detailList: [],
            remark: '',
            type: '',
            webViewHeight: 500,
            specModle: false,
            morePay: true,
            picturePreviewList: [], 		// 预览图片
            picturePreviewModalVisible: false,	// 预览弹框
        };
    }

    setModle = (setModle, type = '') => {
        if (type != '') {
            this.setState({ specModle: setModle, type: type })
        } else {
            this.setState({ specModle: setModle })
        }

    }
    enterOrder = (value) => {
        // console.warn(value, this.state.type)
        let { hash } = this.state.data;
        if (this.state.type == '出售') {
            let params = { pwd: value.pwd, price: value.price, hash: hash };
            Send('api/Trade/SellNft', params).then(res => {
                if (res.code == 200) {
                    Toast.tipBottom('出售成功')
                    Actions.pop()
                } else {
                    Toast.tipBottom(res.message)
                }
            });
        }
        if (this.state.type == '取消') {
            let params = { pwd: value.pwd, price: value.price, hash: hash };
            Send('api/Trade/NoSellNft', params).then(res => {
                if (res.code == 200) {
                    Toast.tipBottom('取消成功')
                    Actions.pop()
                } else {
                    Toast.tipBottom(res.message)
                }
            });
        }
        if (this.state.type == '质押') {
            let params = { pwd: value.pwd, price: value.price, hash: hash };
            Send('api/Trade/ZyNft', params).then(res => {
                if (res.code == 200) {
                    Toast.tipBottom('质押成功')
                    Actions.pop()
                } else {
                    Toast.tipBottom(res.message)
                }
            });
        }
        if (this.state.type == '购买') {
            let params = { pwd: value.pwd, price: value.price, hash: hash };
            Send('api/Trade/BuyNft', params).then(res => {
                if (res.code == 200) {
                    Toast.tipBottom('购买成功')
                    Actions.pop()
                } else {
                    Toast.tipBottom(res.message)
                }
            });
        }
    }

    onClickQQ() {
        Send(`api/system/CopyWriting?type=call_me`, {}, 'get').then(res => {
            Actions.push('CommonRules', { title: '联系我们', rules: res.data });
        });
    }

    onMessage = (e) => {
        const data = JSON.parse(e.nativeEvent.data);
        if (data.height) {
            this.setState({
                webViewHeight: data.height < 500 ? 500 : data.height
            });
        }
    }
    webViewLoadedEnd = () => {
        this.webview.injectJavaScript(`
                const height = document.body.clientHeight;
                window.ReactNativeWebView.postMessage(JSON.stringify({height: height}));
            `);
    }

    render() {
        let { data } = this.state;
        let record = JSON.parse(data.record)
        return (
            <View style={{ flex: 1, backgroundColor: Colors.backgroundColor }}>
                <Header title={'NFT详情'} />
                <ScrollView style={{ flex: 1 }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Image style={styles.banner} source={{ uri: `https://cdn.jsdelivr.net/gh/ndgchain/nft/${this.props.data.pic}` }} />
                    </View>

                    <View style={styles.card}>
                        <Text style={{ marginTop: 5, fontSize: 14, color: Colors.grayFont, width: Metrics.screenWidth - 100, fontWeight: 'bold' }} numberOfLines={1}>编号: {data.hash}</Text>
                        <Text style={{ fontSize: 13, color: Colors.grayFont, marginTop: 5 }}>属性:<Text style={{ fontSize: 14, color: Colors.main }}> {data.attr}</Text></Text>
                        <Text style={{ fontSize: 13, color: Colors.grayFont, marginTop: 5 }}>当前状态:<Text style={{ fontSize: 14, color: Colors.main }}> {data.status == 0 ? '闲置' : data.status == 1 ? '出售中' : data.status == 2 ? '质押中' : ''}</Text></Text>
                        <Text style={{ fontSize: 13, color: Colors.grayFont, marginTop: 5 }}>竞拍值:<Text style={{ fontSize: 14, color: Colors.main }}> {data.income}</Text> [质押30天可收益15%≈{(data.income * 0.15).toFixed(1)}GC]</Text>
                        <Text style={{ fontSize: 13, color: Colors.grayFont, marginTop: 5 }}>价格:<Text style={{ fontSize: 14, color: Colors.main }}> {data.price}</Text> GC</Text>
                        <Text style={{ fontSize: 13, color: Colors.grayFont, marginTop: 5 }}>创建时间: {data.ctime}</Text>
                        <Text style={{ fontSize: 13, color: Colors.grayFont, marginTop: 5 }}>作者|持有者: {data.name}</Text>
                    </View>

                    {data.status == 2 && this.props.userId == data.cId &&
                        <View style={styles.card}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontSize: 14, color: Colors.grayFont }}>质押开始时间    </Text>
                                <Text style={{ fontSize: 14, color: Colors.fontColor }}>{data.beginTime}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontSize: 14, color: Colors.grayFont }}>质押结束时间    </Text>
                                <Text style={{ fontSize: 14, color: Colors.fontColor }}>{data.endTime}</Text>
                            </View>
                        </View>
                    }
                    <View style={{ flex: 1, alignItems: 'center', marginTop: 10 }}>
                        <View style={[styles.card, { width: Metrics.screenWidth - 20 }]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontSize: 16, color: Colors.grayFont, fontWeight: 'bold' }}>购买记录</Text>
                            </View>
                        </View>
                        {record.map(v => {
                            return (
                                <View key={v.id.toString()} style={[styles.card, { width: Metrics.screenWidth - 20 }]}>
                                    <View style={{ alignItems: 'flex-start', justifyContent: 'center' }}>
                                        <Text style={{ fontSize: 13, color: Colors.grayFont, }}>地址: {v.id}</Text>
                                        <Text style={{ fontSize: 13, color: Colors.grayFont, }}>价格: {v.price}GC</Text>
                                        <Text style={{ fontSize: 13, color: Colors.grayFont, }}>时间: {v.time}</Text>
                                    </View>
                                </View>
                            )
                        })}
                    </View>
                </ScrollView>
                <View style={{ height: 50, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10, backgroundColor: Colors.White }}>
                    {this.props.userId == data.cId && data.status == 0 &&
                        <TouchableOpacity style={{ width: Metrics.screenWidth / 4, height: 40, borderRadius: 5, marginHorizontal: 5 }} onPress={() => this.setModle(true, '出售')}>
                            <LinearGradient colors={[Colors.LightG, Colors.main]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 16, color: Colors.White }}>出售</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    }
                    {
                        this.props.userId != data.cId && data.status == 1 &&
                        <TouchableOpacity style={{ width: Metrics.screenWidth / 4, height: 40, borderRadius: 5, marginHorizontal: 5 }} onPress={() => this.setModle(true, '购买')}>
                            <LinearGradient colors={[Colors.LightG, Colors.main]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 16, color: Colors.White }}>购买</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    }
                    {this.props.userId == data.cId && data.status == 0 &&
                        <TouchableOpacity style={{ width: Metrics.screenWidth / 4, height: 40, borderRadius: 5, marginHorizontal: 5 }} onPress={() => this.setModle(true, '质押')}>
                            <LinearGradient colors={[Colors.LightG, Colors.main]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 16, color: Colors.White }}>质押</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    }
                    {this.props.userId == data.cId && data.status == 1 &&
                        <TouchableOpacity style={{ width: Metrics.screenWidth / 4, height: 40, borderRadius: 5, marginHorizontal: 5 }} onPress={() => this.setModle(true, '取消')}>
                            <LinearGradient colors={[Colors.LightG, Colors.main]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 16, color: Colors.White }}>取消</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    }
                </View>
                {this.state.specModle && <NftDetailModal ref={(modal) => this.tipsModal = modal} enterOrder={(value) => this.enterOrder(value)} close={() => this.setModle(false)} type={this.state.type} data={this.state.data} />}
            </View>
        );
    }
}
const mapStateToProps = state => ({
    logged: state.user.logged,
    userId: state.user.id,
    mobile: state.user.mobile,
    level: state.user.level,
});

const mapDispatchToProps = dispatch => ({

});
export default connect(mapStateToProps, mapDispatchToProps)(NftDetail);
const styles = StyleSheet.create({
    banner: {
        width: Metrics.screenWidth - 20,
        height: (Metrics.screenWidth - 20) / 1.2,
        borderRadius: 5,
        marginTop: 10
    },
    card: {
        backgroundColor: Colors.White,
        borderRadius: 10,
        marginHorizontal: 10,
        marginTop: 10,
        padding: 10
    },
    otherPayTxt: {
        fontSize: 14,
        color: 'rgb(239,9,62)',
        lineHeight: 24,
        backgroundColor: 'rgb(255,219,205)',
        marginRight: 10,
        paddingHorizontal: 10,
        borderRadius: 2,
        marginTop: 5
    },
})
