import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Easing, Animated, Alert } from 'react-native';
import { connect } from 'react-redux';
import RefreshListView, { RefreshState } from 'react-native-refresh-list-view';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Actions } from 'react-native-router-flux';
import { Toast } from '../../common';
import { Colors, Metrics } from '../../theme/Index';
import LinearGradient from 'react-native-linear-gradient';
import QRCode from 'react-native-qrcode-svg';
import { Header, SelectTopTab2, BigButton } from '../../components/Index';
import { Send } from '../../../utils/Http';
import NftListItem from './NftListItem';
const TOPTABLIST = [
    { key: 0, name: '市场' },
    { key: 1, name: '我的' }
]
const TRANSACTION_SEQUENCE = [
    { key: 0, title: '价格' },
    { key: 1, title: '时间' },
];
let dataURL64 = '';

class Nft extends Component {
    constructor(props) {
        super(props);
        this.spinValue = new Animated.Value(0)
        this.state = {
            showNft: false,
            nftId: `${Date.now()}_${props.userId}_${parseInt(Math.random() * 100000)}`,
            fristCreatePeople: props.userId,
            attr: ['金', '木', '水', '土', '火'][parseInt(Math.random() * 4)],
            timespan: Date.now(),
            github: 'https://github.com/ndgchain/nft',
            nftPath: 'fire',
            lookPic: '',
            dataList: [],
            pageIndex: 1,
            pageSize: 20,
            type: 0,//价格/时间
            order: 0,//正序 / 倒序
            nftType: 0//0 市场 / 我的

        };
    }

    componentDidMount() {
        //获取nft 分类
        Send(`api/Trade/CurFile`, {}, 'get').then(res => {
            if (res.code == 200) {
                this.setState({ nftPath: res.data });
            }
        });
        this.onHeaderRefresh()
        this.setState({
            lookPic: `https://cdn.jsdelivr.net/gh/ndgchain/nft/${this.state.nftPath}/${this.state.nftId}.png`
        })
        this.spin();
    }
    onHeaderRefresh = () => {
        this.setState({ refreshState: RefreshState.HeaderRefreshing, pageIndex: 1, showNft: false })
        let params = {
            pageIndex: 1,
            pageSize: this.state.pageSize,
            order: this.state.order,
            nftType: this.state.nftType,
            type: this.state.type
        }
        Send('api/Trade/GetNft', params).then(res => {
            if (res.code == 200) {
                this.setState({
                    dataList: res.data,
                    totalPage: res.recordCount,
                    refreshState: res.data.length < 1 ? RefreshState.EmptyData : RefreshState.Idle
                })
            } else {
                this.setState({
                    dataList: [],
                    totalPage: 0,
                    refreshState: RefreshState.EmptyData
                })
            }
        });
    }

    onFooterRefresh = () => {
        let that = this;
        that.setState({
            refreshState: RefreshState.FooterRefreshing,
            pageIndex: this.state.pageIndex + 1
        }, () => {
            let params = {
                pageIndex: that.state.pageIndex,
                searchText: this.state.searchText,
                pageSize: that.state.pageSize,
                order: this.state.order,
                nftType: this.state.nftType,
                type: this.state.type
            }
            Send('api/Trade/GetNft', params).then(res => {
                if (res.code == 200) {
                    this.setState({
                        dataList: that.state.dataList.concat(res.data),
                        totalPage: res.recordCount,
                        refreshState: this.state.dataList.length >= this.state.totalPage ? RefreshState.EmptyData : RefreshState.Idle,
                    })
                } else {
                    this.setState({
                        dataList: [],
                        refreshState: RefreshState.EmptyData
                    })
                }
            });
        });
    }
    selectTab = (item) => {
        this.setState({ nftType: item.key, showNft: false }, () => {
            this.onHeaderRefresh()
        })
    }
    /**
     * 排序条件变更
     * @param {*} key 
     */
    onChangeSequence(key) {
        let { order, type } = this.state;
        let newType = type;
        let newOrder = order;
        if (type === key) {
            if (order === 1) {
                newOrder = 0;
            } else {
                newOrder = 1;
            }
        } else {
            newType = key;
            newOrder = 1;
        }
        this.setState({ order: newOrder, type: newType }, () => {
            this.onHeaderRefresh();
        });
    }
    getDataURL() {
        this.svg.toDataURL((dataURL) => {
            this.putGithubPic(dataURL)
        });
    }
    putGithubPic(dataURL64) {
        fetch(`https://api.github.com/repos/ndgchain/nft/contents/${this.state.nftPath}/${this.state.nftId}.png`, {
            method: "put",
            headers: {
                Authorization: "token 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",
                Accept: "application/vnd.github.v3+json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ content: dataURL64, message: `${this.state.nftId}` }),
        }).then(res => {
            Toast.tipBottom('开启成功')
            this.selectTab({ key: 1, name: '我的' })
        }).catch(err => {
            console.warn('err', err)
        });
    }
    uploadPic = () => {
        this.setState({
            nftId: `${Date.now()}_${this.props.userId}_${parseInt(Math.random() * 100000)}`,
            attr: ['金', '木', '水', '土', '火'][parseInt(Math.random() * 4)],
            timespan: Date.now(),
        }, () => {
            let params = { hash: this.state.nftId, pic: `${this.state.nftPath}/${this.state.nftId}.png`, attr: this.state.attr }
            //发送后台保存
            Send("api/Trade/DoNft", params).then(res => {
                if (res.code == 200) {
                    this.getDataURL()
                } else {
                    Toast.tipBottom(res.message)
                }
            });
        })
    }
    /**
     * 渲染二维码
     */
    renderQRCode() {
        let { nftId, fristCreatePeople, attr, timespan, github, nftPath, lookPic } = this.state;
        let content = JSON.stringify({ nftId, fristCreatePeople, attr, timespan, github, nftPath, lookPic })
        let _color = ['#3366f7', '#5c27eb', '#2f6b69', '#c03961', '#EB1909', '#000000', '#228B22'][parseInt(Math.random() * 6)];
        let _bColor = ['#ffd234', '#FFD096', '#FFFFFF'][parseInt(Math.random() * 2)];
        let logoPath = require('../../images/logo.png');
        switch (this.state.attr) {
            case '金':
                logoPath = require('../../images/nft/jin.png');
                break;
            case '木':
                logoPath = require('../../images/nft/mu.png');
                break;
            case '水':
                logoPath = require('../../images/nft/water.png');
                break;
            case '火':
                logoPath = require('../../images/nft/fire.png');
                break;
            case '土':
                logoPath = require('../../images/nft/tu.png');
                break;
            default:
                break;
        }
        return (
            <View style={{ marginTop: 20, justifyContent: 'center', alignSelf: 'center' }}>
                <QRCode
                    value={content}
                    logoSize={20}
                    size={100}
                    logoMargin={5}
                    logoBorderRadius={10}
                    logo={logoPath}
                    color={_color}
                    backgroundColor={_bColor}
                    getRef={(c) => (this.svg = c)}
                />
            </View>
        )
    }
    //旋转方法
    spin = () => {
        this.spinValue.setValue(0)
        Animated.timing(this.spinValue, {
            toValue: 1, // 最终值 为1，这里表示最大旋转 360度
            duration: 4000,
            useNativeDriver: false,
            easing: Easing.linear
        }).start(() => this.spin())
    }
    onRightPress = () => {
        Send(`api/system/CopyWriting?type=nft_rule`, {}, 'get').then(res => {
            Actions.push('CommonRules', { title: 'NFT介绍', rules: res.data });
        });
    }
    /**
     * 渲染团队列表
     */
    renderBody() {
        let { order, type } = this.state;
        return (
            <View style={{ flex: 1, marginTop: -80, backgroundColor: Colors.White, marginHorizontal: 15, borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10, marginTop: 15 }}>
                    {TRANSACTION_SEQUENCE.map(item => {
                        let { key, title } = item;
                        let itemSelected = type === key;
                        return (
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} key={key}>
                                <TouchableOpacity key={key} style={{ flexDirection: 'row' }} onPress={() => this.onChangeSequence(key)}>
                                    <Text style={[{ fontSize: 14, color: Colors.C11, marginRight: 2 }, { color: itemSelected ? Colors.C0 : Colors.C11 }]}>{title}</Text>
                                    <View style={{ justifyContent: 'center', marginLeft: 3 }}>
                                        {(itemSelected && this.state.order === 1) ?
                                            <FontAwesome name="caret-up" color={Colors.C6} size={10} />
                                            :
                                            <FontAwesome name="caret-up" color={Colors.C10} size={10} />
                                        }
                                        {(itemSelected && this.state.order === 0) ?
                                            <FontAwesome name="caret-down" color={Colors.C6} size={10} />
                                            :
                                            <FontAwesome name="caret-down" color={Colors.C10} size={10} />
                                        }
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )
                    })}
                </View>
                <RefreshListView
                    data={this.state.dataList}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={2}
                    renderItem={({ item, index }) =>
                        <NftListItem
                            index={index}
                            data={item}
                        />
                    }
                    refreshState={this.state.refreshState}
                    onHeaderRefresh={this.onHeaderRefresh}
                    onFooterRefresh={this.onFooterRefresh}
                    // 可选
                    footerRefreshingText='正在玩命加载中...'
                    footerFailureText='我擦嘞，居然失败了 =.=!'
                    footerNoMoreDataText='暂无更多数据...'
                    footerEmptyDataText='暂无更多数据...'
                />
            </View>

        )
    }
    openNft = () => {
        if (!this.props.logged) {
            Actions.push("Login");
            return;
        }
        if (!this.state.showNft) {
            Alert.alert(
                "温馨提示",
                "开启盲盒需要消耗100GC和10钻石,您确认开启吗?",
                [
                    {
                        text: "确认开启", onPress: () => {
                            this.setState({ showNft: true }, () => {
                                this.uploadPic()
                            })
                        }
                    },
                    {
                        text: "考虑一下", onPress: () => {

                        }
                    },
                ],
                { cancelable: false }
            )
        }
    }
    render() {
        //映射 0-1的值 映射 成 0 - 360 度  
        const spin = this.spinValue.interpolate({
            inputRange: [0, 1],//输入值
            outputRange: ['0deg', '360deg'] //输出值
        })
        return (
            <View style={{ flex: 1, backgroundColor: Colors.White }}>
                <Header title="NFT" rightText="说明" rightStyle={{ fontSize: 14 }} onRightPress={() => this.onRightPress()} />
                <LinearGradient colors={[Colors.main, Colors.White]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ height: 265, paddingHorizontal: 10 }}>
                    <SelectTopTab2 list={TOPTABLIST} onPress={this.selectTab} />
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={{ margin: 8, flex: 4 }} onPress={() => { }} >
                            <Animated.Image style={[{ width: 130, height: 130 }, { transform: [{ rotate: spin }] }]} source={require('../../images/nftxz.png')} />
                        </TouchableOpacity>
                        <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center', paddingLeft: 30, paddingRight: 40 }}>
                            <TouchableOpacity onPress={() => this.openNft()} >
                                <View style={{ backgroundColor: this.state.showNft ? Colors.transparent : Colors.main, padding: 15, borderRadius: 5 }}>
                                    {this.state.showNft ? this.renderQRCode() : <Text style={{ color: Colors.White, fontWeight: 'bold', marginHorizontal: 10 }}>
                                        开盲盒
                                    </Text>}
                                </View>
                            </TouchableOpacity>

                        </View>
                    </View>
                </LinearGradient>
                <View style={{ flex: 1 }}>
                    {this.renderBody()}
                </View>
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
export default connect(mapStateToProps, mapDispatchToProps)(Nft);

const styles = StyleSheet.create({
    bigBtn: {
        marginTop: 50,
        height: 50,
        borderRadius: 5,
        marginHorizontal: 80,
        backgroundColor: Colors.White,
        color: Colors.Alipay
    },
});