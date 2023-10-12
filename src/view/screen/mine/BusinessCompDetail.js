import React, { Component } from 'react';
import {
    View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Modal
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { Header } from '../../components/Index';
import { Colors, Metrics } from '../../theme/Index';
import { Trade } from '../../../models';
import { EncryptionUsername } from '../../../utils/Index';

class BusinessCompDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isImgDispalyFullScreen: false,
            trdeData: {}
        };
    }
    componentDidMount() {
        this.reloadData()
    }

    reloadData() {
        // console.log("已完成订单详情", Trade.getCompleteTradeDat()[this.props.cTradeIdx]);
        this.setState({
            trdeData: Trade.getCompleteTradeDat()[this.props.cTradeIdx],
        })
    }
    /**
     * 控制放大缩小截图
     */
    displayFullScreenshot() {
        this.setState({
            isImgDispalyFullScreen: true
        })
    }
    /**
     * 渲染订单Header
     */
    renderHeader() {
        return (
            <LinearGradient colors={[Colors.C6, Colors.LightG]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={Styles.header}>
                <View style={{ marginLeft: -15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Text style={[Styles.title, { color: Colors.White }]}>订单状态</Text>
                    </View>
                    <Text style={{ color: Colors.White, fontSize: 16 }}>已完成</Text>
                </View>
                <View style={{ marginTop: 4 }}>
                    <View style={[Styles.bcdTitleView]}>
                        <Text style={Styles.headerDtitle}>订单编号</Text>
                        <Text style={Styles.headerDtxt}>{this.state.trdeData.tradeNumber || ""}</Text>
                    </View>
                    <View style={[Styles.bcdTitleView]}>
                        <Text style={Styles.headerDtitle}>订单类型</Text>
                        <Text style={Styles.headerDtxt}>{this.state.trdeData.orderType || ""}</Text>
                    </View>
                    <View style={[Styles.bcdTitleView]}>
                        <Text style={Styles.headerDtitle}>交易数量</Text>
                        <Text style={Styles.headerDtxt}>{this.state.trdeData.amount}</Text>
                    </View>
                    <View style={[Styles.bcdTitleView]}>
                        <Text style={Styles.headerDtitle}>单价</Text>
                        <Text style={Styles.headerDtxt}>￥{this.state.trdeData.price}</Text>
                    </View>
                    <View style={[Styles.bcdTitleView]}>
                        <Text style={Styles.headerDtitle}>总金额</Text>
                        <Text style={Styles.headerDtxt}>￥{this.state.trdeData.totalPrice}</Text>
                    </View>
                    <View style={[Styles.bcdTitleView]}>
                        <Text style={Styles.headerDtitle}>交易时间</Text>
                        <Text style={Styles.headerDtxt}>
                            {this.state.trdeData.dealTime ? this.state.trdeData.dealTime : "--"}
                        </Text>
                    </View>
                </View>
            </LinearGradient>
        )
    }
    /**
     * 渲染卖家信息
     */
    renderSeller() {
        return this.renderOwnTage("卖方信息", { name: this.state.trdeData.sellerTrueName, tel: this.state.trdeData.sellerMobile })
    }

    /**
     * 渲染买家信息
     */
    renderBuyer() {
        return this.renderOwnTage("买方信息", { name: this.state.trdeData.buyerTrueName, tel: this.state.trdeData.buyerMobile })
    }
    /**
     * 公用部分买家、卖家
     * @param {*} title 
     * @param {*} info 
     */
    renderOwnTage(title, info) {
        return (
            <View style={Styles.body}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <View style={[Styles.verticalLine, { backgroundColor: Colors.C6 }]} />
                    <Text style={Styles.title}>{title}</Text>
                </View>
                <View style={{ marginLeft: 12.5 }}>
                    <View style={[Styles.bcdTitleView, { marginTop: -14, alignItems: 'flex-end' }]}>
                        <Text style={Styles.bodyDtxt}>头像</Text>
                        {/* <Image style={Styles.imgStyle}
                            source={title === "卖方信息" ? { uri: this.state.trdeData.sellerAvatarUrl } : { uri: this.state.trdeData.buyerAvatarUrl }}
                        /> */}
                        <Image style={Styles.imgStyle}
                            source={require('../../images/logo.png')}
                        />
                    </View>
                    <View style={Styles.bcdTitleView}>
                        <Text style={Styles.bodyDtxt}>姓名</Text>
                        <Text style={[Styles.bodyDtxt]}>{EncryptionUsername(info.name)}</Text>
                    </View>
                    <View style={Styles.bcdTitleView}>
                        <Text style={Styles.bodyDtxt}>电话</Text>
                        <Text style={Styles.bodyDtxt}>{info.tel}</Text>
                    </View>
                    {title === "卖方信息" &&
                        <View style={Styles.bcdTitleView}>
                            <Text style={Styles.bodyDtxt}>支付宝</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                                <Text style={Styles.bodyDtxt}>{this.state.trdeData.sellerAlipay ? this.state.trdeData.sellerAlipay : ""}</Text>
                            </View>
                        </View>
                    }
                </View>
            </View>
        )
    }
    /**
     * 渲染支付截图
     */
    renderScreenshot() {
        return (
            <View style={Styles.body}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <View style={[Styles.verticalLine, { backgroundColor: Colors.C6 }]} />
                    <Text style={Styles.title}>支付截图</Text>
                </View>
                <View style={Styles.screenshotStyle}>
                    <TouchableOpacity onPress={() => { this.displayFullScreenshot() }}>
                        <Image style={Styles.screenshotImg} source={{ uri: this.state.trdeData.pictureUrl }} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    /**
     * 渲染支付截图大图
     */
    renderScreenshotModal() {
        let { isImgDispalyFullScreen } = this.state;
        return (
            <Modal animationType='slide' visible={isImgDispalyFullScreen} transparent onRequestClose={() => { }}>
                <View style={{ flex: 1, backgroundColor: 'transparent' }}>
                    <View style={Styles.modalBody}>
                        <TouchableOpacity onPress={() => {
                            this.setState({
                                isImgDispalyFullScreen: false
                            })
                        }}>
                            <Image
                                style={{
                                    width: Metrics.screenWidth,
                                    height: Metrics.screenHeight,
                                    resizeMode: "contain",
                                }}
                                source={{ uri: this.state.trdeData.pictureUrl }}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
    }
    render() {
        return (
            <View style={Styles.container}>
                <Header title="订单详情" />
                <ScrollView>
                    {this.renderHeader()}
                    <View style={Styles.bcdView}>
                        {this.renderSeller()}
                        {this.renderBuyer()}
                        {this.renderScreenshot()}
                        {this.renderScreenshotModal()}
                    </View>
                </ScrollView>
            </View>
        );
    }
}
const mapStateToProps = state => ({
    logged: state.user.logged,
    level: state.user.level,
    golds: state.user.golds,
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(BusinessCompDetail);

const Styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#ffffff" },
    bcdView: {
        padding: 10,
    },
    header: {
        backgroundColor: Colors.C6,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 20,
        paddingBottom: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20
    },
    body: {
        marginTop: 15,
    },
    title: {
        marginLeft: 6,
        color: Colors.C0,
        fontSize: 18,
        fontWeight: "500",
    },
    verticalLine: {
        height: 20,
        width: 10,
        borderRadius: 1
    },
    bcdTitleView: {
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    headerDtitle: {
        fontSize: 14,
        color: Colors.C8
    },
    headerDtxt: {
        fontSize: 14,
        color: Colors.C8,
    },
    bodyDtxt: {
        fontSize: 14,
        color: Colors.C3,
    },
    imgStyle: {
        marginTop: 10,
        width: 44,
        height: 44,
        borderRadius: 22,
        resizeMode: "stretch"
    },
    screenshotStyle: {
        marginLeft: 12.5,
        flexDirection: "row",
        marginTop: 5,
        flexWrap: "wrap",
    },
    screenshotImg: {
        marginTop: 16,
        width: 120,
        height: 180,
        resizeMode: "stretch",
        borderRadius: 10,
        borderColor: Colors.C2,
        borderWidth: 1
    },
    modalBody: {
        flexDirection: "column",
        justifyContent: 'flex-end',
        backgroundColor: '#25252b',
        width: Metrics.screenWidth,
        height: Metrics.screenHeight
    }
});
