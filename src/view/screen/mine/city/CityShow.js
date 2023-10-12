import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform, TouchableWithoutFeedback, ScrollView, DeviceEventEmitter } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { Card, CardItem, Body } from 'native-base';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { Header, ReadMore } from '../../../components/Index';
import { Colors, Metrics } from '../../../theme/Index';
import { Send } from '../../../../utils/Http';
import { Toast } from '../../../common';
import MapViewScreen from '../../../components/MapViewScreen';
import { onPressSwiper } from '../../../../utils/CommonFunction';

class CityShow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cityData: '',
            selectFlag: 0,
            allCityMaster: [],
            propagandaList: [],

        };
    }

    componentDidMount() {
        this.getAllCityUser()
        this.getCityData();
        this.fetchAd(9);
        this.listeners = DeviceEventEmitter.addListener('citySetting', () => {
            this.getCityData()
        })
    }
    fetchAd(source) {
        var that = this;
        Send("api/system/banners?source=" + source, {}, 'GET').then(res => {
            if (res.code == 200) {
                that.setState({ propagandaList: res.data });
            } else {
                Toast.tipBottom(res.message);
            }
        })
    }
    getCityData = () => {
        Send(`api/city/Info?code=${this.props.location.cityCode}`, {}, 'get').then(res => {
            this.setState({ cityData: res.data })
        })
    }
    componentWillUnmount() {
        this.listeners.remove()
    }
    onRightPress() {
        if (this.props.userId == this.state.cityData.userId) {
            Actions.push("CitySetting", { mobile: this.state.cityData.mobile, weChat: this.state.cityData.weChat, cityNo: this.state.cityData.cityNo })
            return;
        }
    }
    jumpToCityDivideList(dividendType, accountType) {
        if (this.props.userId != this.state.cityData.userId) {
            Toast.tipBottom('非城主无权查看城主数据')
            return;
        }
        Actions.CityDivideList({ dividendType: dividendType, accountType: accountType, cityNo: this.props.location.cityCode });
    }

    getAllCityUser = () => {
        Send(`api/Coin/CityMaster`, {}, 'get').then(res => {
            if (res.code === 200) {
                this.setState({ allCityMaster: res.data });
            } else {
                Toast.tip(res.message);
            }
        })
    }


    /**
        * 渲染变色版
    */
    renderGradient() {
        let { avatar } = this.props;
        return (
            <View style={Styles.gradient}>
                <View style={{ minHeight: 80, marginBottom: 20, }}>
                    <View style={{ flex: 1, flexDirection: 'row', paddingTop: 10 }}>
                        <Image source={{ uri: this.state.cityData.avatar }} style={Styles.avatar} />
                        <View style={{ flex: 1, }}>
                            <View style={Styles.setting}>
                                <Text style={Styles.nickname} numberOfLines={2}>{this.state.cityData.cityName || "暂无"}合伙人</Text>
                            </View>
                            <View style={{ marginLeft: 10, marginTop: 5, flex: 1 }}>
                                {this.state.cityData.mobile == '' ? null : <Text style={[Styles.inviteCode, { fontSize: 14 }]}>联系方式: {this.state.cityData.mobile}</Text>}
                                {this.state.cityData.weChat == '' ? null : <Text style={[Styles.inviteCode, { fontSize: 14 }]}>微信: {this.state.cityData.weChat}</Text>}
                                <Text style={[Styles.inviteCode, { fontSize: 14 }]}>{`有效期: ${this.state.cityData.effectiveTime || "暂无"}`}</Text>
                            </View>
                        </View>

                    </View>
                </View>
                {this.renderCityInfo()}
            </View >
        )
    }
    handleCityInfo(item) {
        if (this.props.userId != this.state.cityData.userId) {
            Toast.tipBottom('非城主无权查看城主数据')
            return;
        }
        if (item.key != 2) {
            Actions.CityDivideList({ keyType: item.key, cityNo: this.props.location.cityCode, title: item.title });
        }

    }
    renderCityInfo() {
        let SERVICE_BAR = [
            { key: "0", title: "糖果收益", icon: 'eercast', router: 'YoTaskSetting' },
            { key: "1", title: "YB收益", icon: 'superpowers', router: 'MyYoTask' },
            { key: "2", title: "城市人数", icon: 'microchip', router: 'YoTaskApeal' }
        ];
        return (
            <View style={Styles.barContainer}>
                <View style={Styles.barHeader}>
                    <Text style={Styles.barTitle}>城市收益</Text>
                </View>
                <View style={Styles.barBody}>
                    {SERVICE_BAR.map(item =>
                        <TouchableWithoutFeedback key={item['key']} onPress={() => this.handleCityInfo(item)}>
                            <View style={Styles.barBodyItem}>
                                <Text style={Styles.barText}>{this.props.userId == this.state.cityData.userId ? item['title'] == "糖果收益" ? '--' : item['title'] == "YB收益" ? '--' : item['title'] == "城市人数" ? this.state.cityData.people : 0 : "--"}</Text>
                                <Text style={Styles.barText}>{item['title']}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    )}
                </View>
            </View>
        )
    }
    /**
     * 游戏插图
     */
    illustration(imgs) {
        if (imgs != undefined) {
            return (
                imgs.map((item, index) =>
                    <View key={index} style={{ flexDirection: 'column', width: 300, margin: 5, }}>
                        <TouchableOpacity onPress={() => onPressSwiper(item, this.props.mobile, this.props.userId)}>
                            <Image
                                source={{ uri: item['imageUrl'] }}
                                style={{ height: 160, width: 300, borderRadius: 10, resizeMode: 'stretch', marginBottom: 5 }}
                            />
                        </TouchableOpacity>
                        <ReadMore
                            numberOfLines={1}
                        >
                            <Text style={{ fontSize: 14, textAlign: 'left', color: 'gray' }}>
                                {item.title}
                            </Text>
                        </ReadMore>
                    </View>
                )
            )
        }
        return <View />
    }
    renderAdContent() {
        return (
            <Card>
                <CardItem>
                    <Body>
                        <ScrollView>
                            <View style={{ flex: 1 }}>
                                {this.illustration(this.state.propagandaList)}
                            </View>
                        </ScrollView>
                    </Body>
                </CardItem>
                <CardItem footer>
                </CardItem>
            </Card>
        );
    }
    renderMyCity() {
        return (
            <View style={{ marginBottom: 10 }}>
                <ScrollView style={{ paddingHorizontal: 5 }}>
                    {this.renderGradient()}
                    <Text style={{ marginLeft: 10, color: Colors.main, fontSize: 16, marginBottom: 10, }}>城主专属广告位</Text>
                    {this.renderAdContent()}
                </ScrollView>
            </View>
        )
    }
    /**
     * 渲染HeaderLeft
     */
    renderHeaderLeft() {
        return (
            <TouchableWithoutFeedback onPress={() => Actions.pop()}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 16, paddingRight: 16 }}>
                    <FontAwesome name='angle-left' size={30} color="#FFFFFF" />
                </View>
            </TouchableWithoutFeedback>
        )
    }
    /**
     * 渲染HeaderRight
     */
    renderHeaderRight() {
        return (
            <TouchableWithoutFeedback onPress={() => this.onRightPress()}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', paddingLeft: 16, paddingRight: 16 }}>
                    <FontAwesome name='gear' size={28} color="#FFFFFF" />
                </View>
            </TouchableWithoutFeedback>
        )
    }
    /**
     * 渲染HeaderTitle
     */
    renderHeaderTitle() {
        let { title, titleStyle } = this.props;
        return (
            <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', borderWidth: 0.5, borderColor: Colors.White, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => this.setState({ selectFlag: 0 })} style={{ flex: 1, backgroundColor: this.state.selectFlag == 0 ? Colors.White : Colors.main, justifyContent: 'center', alignItems: 'center', borderBottomLeftRadius: 5, borderTopLeftRadius: 5 }}>
                        <Text style={{ padding: 5, color: this.state.selectFlag == 0 ? Colors.main : Colors.White }}>城市大厅</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.setState({ selectFlag: 1 })} style={{ flex: 1, backgroundColor: this.state.selectFlag == 1 ? Colors.White : Colors.main, justifyContent: 'center', alignItems: 'center', borderBottomRightRadius: 5, borderTopRightRadius: 5 }}>
                        <Text style={{ padding: 5, color: this.state.selectFlag == 1 ? Colors.main : Colors.White }}>我的城市</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    render() {
        if (this.state.cityData === '') {
            return <View />
        }
        return (
            <View style={{ flex: 1, backgroundColor: Colors.backgroundColor }}>
                <View style={{ paddingTop: Metrics.STATUSBAR_HEIGHT, height: Metrics.HEADER_HEIGHT, width: Metrics.screenWidth, backgroundColor: Colors.main, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    {this.renderHeaderLeft()}
                    {this.renderHeaderTitle()}
                    {this.renderHeaderRight()}
                </View>
                {this.state.selectFlag == 0 ? <MapViewScreen type="selUser" data={this.state.allCityMaster}></MapViewScreen> : this.renderMyCity()}
            </View>
        );
    }
}

const mapDispatchToProps = dispatch => ({

});


const mapStateToProps = state => ({
    name: state.user.name,
    isPay: state.user.isPay,
    alipayUid: state.user.alipayUid,
    logged: state.user.logged,
    userId: state.user.id,
    level: state.user.level,
    rcode: state.user.rcode,
    golds: state.user.golds,
    mobile: state.user.mobile,
    location: state.user.location,
    nickname: state.user.name,
    avatar: state.user.avatarUrl,
    balance: state.dividend.userBalance,
    candyH: state.user.candyH || 0,
    candyP: state.user.candyP,
    candyNum: state.user.candyNum,
    userBalanceNormal: state.dividend.userBalanceNormal,
    userBalanceLock: state.dividend.userBalanceLock
});


export default connect(mapStateToProps, mapDispatchToProps)(CityShow);

const Styles = StyleSheet.create({
    rightContainer: { flex: 1, justifyContent: 'center', alignItems: 'flex-end', paddingLeft: 16, paddingRight: 16 },
    titleContainer: { flex: 3, justifyContent: 'center', alignItems: 'center' },
    gradient: { padding: 15, paddingTop: 0, paddingBottom: 20, backgroundColor: Colors.b },
    avatar: { width: 60, height: 60, borderRadius: 30, borderWidth: 0.5, borderColor: Colors.C8 },
    nickname: { fontSize: 18, color: Colors.main, fontWeight: '500' },
    inviteCode: { fontSize: 15, color: Colors.C12, },
    setting: { flexDirection: 'row', paddingLeft: 10, alignItems: 'center', justifyContent: 'space-between' },
    version: { marginTop: 2, fontSize: 14, color: Colors.C12 },
    profile: { flexDirection: 'row', alignItems: 'center' },
    profileItem: { flex: 1, alignItems: 'center' },
    profileTitle: { marginTop: 2, fontSize: 16, color: Colors.C8 },
    profileText: { fontSize: 14, color: Colors.C8 },
    level: { height: 70, width: Metrics.screenWidth - 30, borderRadius: 15, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.C8 },
    levelText: { fontSize: 19, color: Colors.C6, fontWeight: 'bold' },
    contributionValueText: { marginTop: 4, fontSize: 14, color: Colors.C0 },
    levelPropaganda: { fontSize: 15, color: Colors.C10 },
    icon: { width: 30, height: 30 },
    barContainer: { width: Metrics.screenWidth - 30, borderRadius: 5, alignSelf: 'center', backgroundColor: Colors.main, marginTop: 15 },
    barHeader: { flexDirection: 'row', padding: 15, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: Colors.C7 },
    barTitle: { fontSize: 15, color: Colors.White, fontWeight: '500' },
    barHeaderRight: { flex: 1 },
    barMore: { textAlign: 'right', fontSize: 14, color: Colors.C10 },
    barBody: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: 10, paddingBottom: 14 },
    barBodyItem: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    barText: { marginTop: 6, fontSize: 14, color: Colors.White },
    badge: { position: 'absolute', left: 20, top: -2 },
    labelContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 52,
        marginLeft: 10,
        paddingRight: 10,
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.main
    },
    lableTxt: { fontSize: 16, color: Colors.C11 },
    signOutView: { justifyContent: 'center', alignItems: "center" },
    signOutBtn: { marginTop: 50, width: Metrics.screenWidth * 0.6, backgroundColor: Colors.C6, alignItems: "center", borderRadius: 8 }
});
