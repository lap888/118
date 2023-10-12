import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import CurrencyApi from '../../../../api/yoyoTwo/currency/CurrencyApi';
import { Loading, Toast } from '../../../common';
import { Header, SelectTopTab } from '../../../components/Index';
import { Colors, Metrics } from '../../../theme/Index';

const TOPTABLIST = [
    { key: 0, name: '广告宝商店' },
    { key: 1, name: '过期广告宝' }
]
const minningsData = [
    { id: 31, name: '初级[总量-剩余]', count: 1000000 }, { id: 32, name: '中级[总量-剩余]', count: 1000000 }, { id: 33, name: '进阶[总量-剩余]', count: 200000 },
    { id: 34, name: '高级[总量-剩余]', count: 200000 }, { id: 35, name: '精英[总量-剩余]', count: 100 }, { id: 36, name: '超级[总量-剩余]', count: 100 }
]
export default class MiningMachineryShop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tasksList: [],
            hadExMinnings: [],
            selectTap: 0,
            isLoading: true
        };

    }

    componentDidMount() {
        this.getTasksList(0)
    }

    getTasksList = (status) => {
        CurrencyApi.getTasksShop(status)
            .then((data) => {
                this.setState({
                    tasksList: data,
                    isLoading: false
                })
                CurrencyApi.GetCanExMingings().then((res) => {
                    this.setState({
                        hadExMinnings: res
                    })
                })
            }).catch((err) => this.setState({ isLoading: false }))
    }

    exchange = (mid) => {
        this.setState({ isLoading: true }, () => {
            CurrencyApi.exchange(mid)
                .then((data) => {
                    Toast.tip('兑换成功');
                    CurrencyApi.GetCanExMingings().then((res) => {
                        this.setState({
                            hadExMinnings: res
                        })
                    })
                    this.setState({ isLoading: false })
                }).catch((err) => this.setState({ isLoading: false }))
        })
    }

    getSyMinngings = (id) => {
        let data = { count: 0 }
        this.state.hadExMinnings.map(v => {
            if (v.minningId == id) {
                data = v
            }
        })
        return data;
    }

    selectTab = (item) => {
        this.setState({ selectTap: item.key })
        this.getTasksList(item.key)
    }
    renderminningsData = () => {
        return (
            <View style={{ flexDirection: 'row', paddingHorizontal: 5, marginVertical: 5, justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', backgroundColor: Colors.inviterText, borderRadius: 10, marginHorizontal: 15 }}>
                {
                    minningsData.map((item, index) => {
                        return (
                            <TouchableOpacity key={index} style={{ width: (Metrics.screenWidth - 10) / 3, marginVertical: 10, justifyContent: 'center', alignItems: 'center' }} onPress={() => { }}>
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: Colors.White }}>{item.name}</Text>
                                    <Text style={{ color: Colors.White }}>{item.count} - {item.count - this.getSyMinngings(item.id).count}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    })
                }
            </View>
        )
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.backgroundColor }}>
                <Header title={'广告宝'} />
                <SelectTopTab list={TOPTABLIST} onPress={this.selectTab} />
                <View style={{  padding: 10, marginTop:5, justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.main, borderRadius: 10, marginHorizontal: 15 }}>
                    <Text style={{ color: Colors.White }}>恭喜:【{this.getSyMinngings(36).name}】今日成功兑换超级广告宝</Text>
                    <Text style={{ color: Colors.White }}>恭喜:【{this.getSyMinngings(35).name}】今日成功兑换精英广告宝</Text>
                </View>
                <ScrollView style={{ flex: 1 }}>
                    {this.state.selectTap === 0 &&
                        this.renderminningsData()}
                    {this.state.tasksList.length > 0 && this.state.tasksList.map((item, index) => {
                        let img = '';
                        if (item.minningName.indexOf("试炼") != -1) {
                            img = require('../../../images/kj/xinren.png')
                        }
                        if (item.minningName.indexOf("初级") != -1) {
                            img = require('../../../images/kj/chuji.png')
                        }
                        if (item.minningName.indexOf("中级") != -1) {
                            img = require('../../../images/kj/zhongji.png')
                        }
                        if (item.minningName.indexOf("进阶") != -1) {
                            img = require('../../../images/kj/zhongjie.png')
                        }
                        if (item.minningName.indexOf("高级") != -1) {
                            img = require('../../../images/kj/gaoji.png')
                        }
                        if (item.minningName.indexOf("精英") != -1) {
                            img = require('../../../images/kj/gaojie.png')
                        }
                        if (item.minningName.indexOf("超级") != -1) {
                            img = require('../../../images/kj/chaoji.png')
                        }
                        return (
                            <ImageBackground key={index} source={img} resizeMode={'stretch'} style={{ backgroundColor: Colors.main, marginTop: 10, height: 140, borderRadius: 5, marginHorizontal: 15 }}>
                                <View style={styles.topNameView}>
                                    <Text style={styles.topName}>{item.minningName}</Text>
                                    {this.state.selectTap === 0 && <Text style={styles.topNum}>  任务周期：{item.runTime}</Text>}
                                </View>
                                <View style={{ flexDirection: 'row', paddingHorizontal: 10 }}>
                                    <View style={{ flex: 1 }}>
                                        <View style={styles.toptn}>
                                            <Text style={styles.topText}>总产出：{item.candyOut}YB</Text>
                                        </View>
                                        <View style={styles.toptn}>
                                            <Text style={styles.topText}>日产出：{item.pow}YB</Text>
                                        </View>
                                        {this.state.selectTap === 0 && <View style={styles.toptn}>
                                            <Text style={styles.topText}>持有上限：{item.maxHave}</Text>
                                        </View>}

                                        {this.state.selectTap === 0 && <View style={styles.toptn}>
                                            <Text style={styles.topText}>兑换赠送：{item.nlCount}能量、团队活跃度+{item.teamH}</Text>
                                        </View>}

                                        {this.state.selectTap === 0 && item.isExchange &&
                                            <Text style={{ fontSize: 10, color: Colors.White }}>兑换所需要YB: {item.candyIn}</Text>}
                                    </View>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                                        {/* {this.state.selectTap === 0 && item.isExchange &&
                                            <Text style={{ fontSize: 10, color: Colors.White }}>兑换所需要YB: {item.candyIn}</Text>} */}

                                        {this.state.selectTap === 0 && item.isExchange &&
                                            <TouchableOpacity style={[styles.btn]} onPress={() => this.exchange(item.minningId)}>
                                                <Text style={{ fontSize: 16, color: Colors.White }}>兑换</Text>
                                            </TouchableOpacity>}
                                        {this.state.selectTap === 0 && item.minningId === 0 &&
                                            <TouchableOpacity style={[styles.btn]} onPress={() => this.exchange(item.minningId)}>
                                                <Text style={{ fontSize: 16, color: Colors.White }}>限时兑换</Text>
                                            </TouchableOpacity>}
                                        {this.state.selectTap === 1 &&
                                            <View style={styles.btn}>
                                                <Text style={{ fontSize: 13, color: Colors.White }}>已过期</Text>
                                            </View>}
                                    </View>
                                </View>
                            </ImageBackground>
                        )
                    })}
                    <View style={{ height: 20 }} />
                </ScrollView>
                {this.state.isLoading && <Loading />}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    topNameView: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    toptn: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingTop: 5,
        flexWrap: 'wrap'
    },
    topName: {
        color: Colors.White,
        fontSize: 14
    },
    topText: {
        color: Colors.White,
        fontSize: 12
    },
    topNum: {
        color: Colors.White,
        fontSize: 12
    },
    btn: {
        width: 80,
        height: 30,
        borderRadius: 22.5,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        // backgroundColor: Colors.greyText,
        borderWidth: 1,
        borderColor: Colors.White,
    },
    areaChoice: {
        position: 'absolute',
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderWidth: 8,
        borderTopColor: '#999',
        borderLeftColor: '#999',
        borderBottomColor: '#fff',
        borderRightColor: '#999',
        marginLeft: 8,
    },
})
