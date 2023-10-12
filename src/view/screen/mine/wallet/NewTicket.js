import React, { Component } from 'react';
import { View, Text, ImageBackground, Image, Pressable, Alert, TouchableOpacity } from 'react-native';
import { Header, BigButton } from '../../../components/Index';
import { Colors, Metrics } from '../../../theme/Index';
import TicketItem from './TicketItem';
import { UserApi } from '../../../../api';
import { Toast } from '../../../common';
import { Actions } from 'react-native-router-flux';

export default class NewTicket extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: '',
            kgFlag: 0,
            list: [],
            kg: true,
        };
    }

    componentDidMount() {
        this.getTiketInfo()
    }

    getTiketInfo = () => {
        UserApi.ticketInfo()
            .then((res) => {
                this.setState({
                    data: res,
                    list: res.package,
                })
            }).catch((err) => console.log('err', err))
    }

    exchangeTicket = (type) => {
        let count = this.ticketItem.state.selected;
        if (count == '') {
            Toast.tip('请选择需要兑换的数量')
            return;
        }
        Alert.alert(
            "兑换新人券",
            `您确定要兑${count.shares}张新人券吗？`,
            [
                {
                    text: "确定", onPress: () => {
                        UserApi.exchangeTicket({ shares: count.shares, payType: type })
                            .then((res) => {
                                this.getTiketInfo()
                                Toast.tip('兑换成功')
                                Actions.pop();
                            }).catch((err) => console.log('err', err))
                    }
                },
                { text: "取消", onPress: () => { } },
            ],
            { onDismiss: () => { } }
        )

    }

    setTicketState = () => {
        UserApi.ticketState()
            .then((res) => {
                if (res.code == 200) {
                    Toast.tipBottom('开关打开关闭显示延迟1-30秒请不要频繁点击开关', 3000)
                    setTimeout(() => Actions.pop(), 3000)
                } else {
                    Toast.tip(res.Message)
                }
            }).catch((err) => console.log('err', err))
    }

    renderHeader = () => {
        const { data } = this.state;
        return (
            <View style={{ padding: 15 }}>
                <ImageBackground style={{ paddingHorizontal: 20, width: Metrics.screenWidth - 30, height: (Metrics.screenWidth - 30) / 4.73 }} source={require('../../../images/mine/wallet/xinrenquan.png')}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 12, color: Colors.White, lineHeight: 22 }}><Text style={{ fontSize: 20 }}>{data.balance}</Text>张</Text>
                            <Text style={{ fontSize: 12, color: Colors.White, }}>满1张可用</Text>
                        </View>
                        <View style={{ flex: 3, justifyContent: 'center', paddingLeft: 10 }}>
                            <View style={{ flexDirection: 'row', }}>
                                <Text style={{ fontSize: 15, color: Colors.fontColor, lineHeight: 17 }}>新人券</Text>
                                <Text style={{ fontSize: 12, color: Colors.grayFont, marginLeft: 5 }}>有效期：永久有效</Text>
                            </View>
                            <Pressable onPress={this.setTicketState}>
                                <View style={{ paddingTop: 2, height: 30, flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ flex: 1, fontSize: 12, color: Colors.grayFont }}>新用户身份认证的工具劵</Text>
                                    {data.state == 0
                                        ?
                                        <Image style={{ width: 30 }} resizeMode={'contain'} source={require('../../../images/mine/wallet/kgguan1.png')} />
                                        :
                                        <Image style={{ width: 30 }} resizeMode={'contain'} source={require('../../../images/mine/wallet/kgkai.png')} />}

                                </View>
                            </Pressable>
                        </View>
                    </View>
                </ImageBackground>
            </View>
        )
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.backgroundColor, alignItems: 'center' }}>
                <Header title={'新人券'} rightText={'明细'} onRightPress={() => Actions.push('TicketDetailList')} />
                {this.renderHeader()}
                <TicketItem ref={ticket => this.ticketItem = ticket} data={this.state.list} />
                <Text style={{ marginLeft: 15, marginTop: 8, color: Colors.grayFont }}>{this.state.data.rules}</Text>
                <BigButton style={{ marginTop: 20, width: Metrics.screenWidth / 2 }} name={'兑换'} onPress={() => this.exchangeTicket(2)} />
            </View>
        );
    }
}
