import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Linking, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Actions } from 'react-native-router-flux';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/Ionicons';
import WebView from 'react-native-webview';
import { ShopApi } from '../../../api';
import { Send } from '../../../utils/Http';
import { Header, PicturePreview } from '../../components/Index';
import { Colors, Metrics } from '../../theme/Index';
import GoodsDetailModal from './GoodsDetailModal';

export default class GoodsDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data,
            bannerList: [],
            detailList: [],
            remark: '',
            webViewHeight: 500,
            specModle: false,
            morePay: true,
            picturePreviewList: [], 		// 预览图片
            picturePreviewModalVisible: false,	// 预览弹框
        };
    }
    componentDidMount() {
        this.getGoodsDetail(this.state.data.id)
    }

    getGoodsDetail = (id) => {
        ShopApi.getShopDetail(id)
            .then((data) => {
                this.setState({
                    bannerList: data.shopDetailBanner,
                    // remark: data.remark.remark
                })
            }).catch((err) => console.log('err', err))
    }

    setModle = (setModle) => {
        this.setState({ specModle: setModle })
    }

    onClickQQ() {
        let url = "mqqwpa://im/chat?chat_type=wpa&uin=3120917946";//调用QQ
        //let url = "tel: 电话号码";//调用拨号
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            }
        });
        // Send(`api/system/CopyWriting?type=call_me`, {}, 'get').then(res => {
        //     Actions.push('CommonRules', { title: '联系我们', rules: res.data });
        // });
    }
    /**
     * 调起图片预览组件
     */
    handelPreviewImage(source) {
        this.setState({ picturePreviewList: [{ uri: source }] }, () => {
            if (!this.state.picturePreviewModalVisible) this.setState({ picturePreviewModalVisible: true });
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
        let { data, bannerList, remark, morePay } = this.state;
        let _html = `<!DOCTYPE html>
        <html>
        <meta name="viewport" content="width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
        <body>
        <p style="color:${Colors.notice};font-size:12px">偏远地区不发货,疫情严重地区不发货</p>
        <p style="color:#0ae;font-size:13px">支持7天无理由换货</p>
        ${data.remark}
        <script>
        function ResizeImages(){
          var myimg;
          for(i=0;i <document.images.length;i++){
            myimg = document.images[i];
            myimg.width = ${Metrics.screenWidth - 20};
          }
        }
        window.onload=function(){ 
          ResizeImages()
          window.location.hash = '#' + document.body.clientHeight;
          document.title = document.body.clientHeight;
        }
        </script></body></html>`
        return (
            <View style={{ flex: 1, backgroundColor: Colors.backgroundColor }}>
                <Header title={'商品详情'} />
                <ScrollView style={{ flex: 1 }}>
                    <View style={styles.banner} >
                        <Swiper
                            key={bannerList.length}
                            horizontal={true}
                            loop={true}
                            autoplay={true}
                            autoplayTimeout={16}
                            removeClippedSubviews={false}
                            paginationStyle={{ bottom: 10 }}
                            showsButtons={false}
                            activeDotStyle={{ width: 15, height: 3, backgroundColor: Colors.White, borderRadius: 1 }}
                            dotStyle={{ width: 15, height: 3, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 1 }}
                        >
                            {bannerList.map((item, index) =>
                                <View key={index} style={styles.banner} >
                                    <Image style={styles.banner} source={{ uri: item.url }} />
                                </View>
                            )}
                        </Swiper>
                    </View>
                    <View style={styles.card}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5, flexWrap: 'wrap' }}>
                            <Text style={{ fontSize: 20, color: Colors.main }}><Text style={{ fontSize: 13 }}>现价 </Text>{data.ybPrice}GC  </Text>
                            <Text style={{ fontSize: 12, color: Colors.grayFont, textDecorationLine: 'line-through' }}>原价:{(data.price * 1.1).toFixed(2)}￥</Text>
                        </View>
                        {/* <View style={{ marginTop: 10 }}>
                            <Text style={{ fontSize: 12, color: Colors.grayFont, lineHeight: 14, }} onPress={() => this.setState({ morePay: !this.state.morePay })}>
                                其他支付方式 <Icon name={morePay ? 'ios-caret-down' : 'ios-caret-up'} size={12} />
                            </Text>
                            {morePay && <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5, flexWrap: 'wrap' }}>
                                <Text style={[styles.otherPayTxt]}>{(data.usdtPrice * 0.7).toFixed(2)}<Text style={{ fontSize: 14 }}> ￥ + {(data.usdtPrice * 0.3 / data.px).toFixed(2)}YB</Text>  </Text>
                                <Text style={[styles.otherPayTxt]}>{(data.usdtPrice / 5).toFixed(0)}张消费券</Text>
                            </View>}
                        </View> */}
                        <Text style={{ fontSize: 16, marginTop: 5 }}>{data.name}</Text>
                    </View>
                    <View style={styles.card}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: 14, color: Colors.grayFont }}>发货地    </Text>
                            <Text style={{ fontSize: 14, color: Colors.fontColor }}>{data.adress}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                            <Text style={{ fontSize: 14, color: Colors.grayFont }}>快递    </Text>
                            <Text style={{ fontSize: 14, color: Colors.main }}>{data.postPrice}￥</Text>
                            {data.postPrice == 0 && <Text style={{ fontSize: 12, color: Colors.main }}> 包邮</Text>}
                        </View>
                    </View>
                    <View style={{ height: 30, flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, color: Colors.fontColor }}>商品详情</Text>
                    </View>
                    <View style={{ paddingHorizontal: 5, marginTop: 5 }}>
                        <View style={{ height: this.state.webViewHeight, marginTop: 5 }}>
                            <WebView
                                ref={(ref) => this.webview = ref}
                                style={{ flex: 1, height: this.state.webViewHeight }}
                                source={{ html: _html }}
                                originWhitelist={["*"]}
                                onMessage={this.onMessage}
                                onLoadEnd={this.webViewLoadedEnd}
                                javaScriptEnabled={true}
                            />
                        </View>
                    </View>
                </ScrollView>
                <View style={{ height: 50, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, backgroundColor: Colors.White }}>
                    <View style={{ flex: 1, flexDirection: 'row', marginRight: 10 }}>
                        <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={this.onClickQQ}>
                            <Image source={require('../../images/shop/kefu.png')} />
                            <Text style={{ fontSize: 12 }}>客 服</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={{ width: 200, height: 40, borderRadius: 20 }} onPress={() => this.setModle(true)}>
                        <LinearGradient colors={[Colors.LightG, Colors.main]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 16, color: Colors.White }}>立即购买</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
                {this.state.specModle && <GoodsDetailModal ref={(modal) => this.tipsModal = modal} close={() => this.setModle(false)} data={this.state.data} />}
                <PicturePreview
                    data={this.state.picturePreviewList}
                    visible={this.state.picturePreviewModalVisible}
                    onClose={() => this.setState({ picturePreviewModalVisible: false })}
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    banner: {
        width: Metrics.screenWidth,
        height: Metrics.screenWidth / 1.33,
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
