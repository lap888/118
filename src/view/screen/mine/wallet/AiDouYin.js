import React, { Component } from 'react';
import { View, Text, TextInput, Linking, ImageBackground, Image, Pressable, Alert, TouchableOpacity } from 'react-native';
import { Header, BigButton } from '../../../components/Index';
import { Colors, Metrics } from '../../../theme/Index';
import QuxiYouItem from './QuxiYouItem';
import { UserApi } from '../../../../api';
import { Actions } from 'react-native-router-flux';
import { Send } from '../../../../utils/Http';
import { Loading, RegExp, Toast } from '../../../common';
export default class AiDouYin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: '',
            kgFlag: 0,
            list: [],
            kg: true,
            uid: 0,
        };
    }

    componentDidMount() {
        this.getTiketInfo()
    }

    getTiketInfo = () => {
        UserApi.qxyTicketInfo()
            .then((res) => {
                this.setState({
                    data: res,
                    list: res.package,
                })
            }).catch((err) => console.log('err', err))
    }

    setUid = (value) => {
        if (value == '' || value == undefined) {
            Toast.tipBottom('趣西游玩家UID必填');
            return;
        }
        this.setState({ uid: value })
    }
    exchangeTicket = () => {
        let count = this.ticketItem.state.selected;
        let type = this.ticketItem.state.selected.type;
        if (type == '') {
            Toast.tip('请选择需要兑换的VIP类型')
            return;
        }
        if (this.state.uid == '') {
            Toast.tip('请输入趣西游玩家ID')
            return;
        }
        Alert.alert(
            "兑换套餐",
            `您确定要兑${count.shares}天${type == 1 ? '【VIP】' : type == 2 ? '【转盘VIP】' : '【自动合成VIP】'}吗？`,
            [
                {
                    text: "确定", onPress: () => {
                        UserApi.exchangeQxyTicket({ shares: count.shares, type: type, uid: this.state.uid })
                            .then((res) => {
                                Toast.tip('兑换成功')
                                this.getTiketInfo()
                            }).catch((err) => console.log('err', err))
                    }
                },
                { text: "取消", onPress: () => { } },
            ],
            { onDismiss: () => { } }
        )

    }


    onRightPress() {
        Send(`api/system/CopyWriting?type=quxiyou_rule`, {}, 'get').then(res => {
            Actions.push('CommonRules', { title: '规则', rules: res.data });
        });
    }

    openWWGS = () => {
        // com.cocos.quxiyou
        let deepLinkURL = 'quxiyou://quxiyou/';
        Linking.openURL(deepLinkURL).catch(err => console.warn('An error occurred', err));
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.backgroundColor, alignItems: 'center' }}>
                <Header title={'趣西游'} rightText={'说明'} onRightPress={() => this.onRightPress()} />
                <View style={{ marginTop: 10 }}>
                    <Text style={{ fontSize: 16, color: Colors.C12 }}>趣西游玩家UID</Text>
                    <View style={{ flexDirection: 'row', height: 50, borderBottomColor: Colors.main, borderBottomWidth: 1, marginBottom: 20 }}>
                        <TextInput
                            style={{ flex: 1 }}
                            placeholder={`输入趣西游玩家UID`}
                            value={this.state.uid}
                            onChangeText={this.setUid}
                        />
                    </View>
                    {/* <Text style={{ fontSize: 10, color: Colors.C10, marginTop: 5 }}>{`1荣誉值加1YB兑换1消费券`}</Text> */}
                </View>
                <QuxiYouItem ref={ticket => this.ticketItem = ticket} data={this.state.list} />
                <Text style={{ marginLeft: 15, marginTop: 8, color: Colors.grayFont }}>{this.state.data.rules}</Text>
                <BigButton style={{ marginTop: 20, width: Metrics.screenWidth / 2 }} name={'兑换'} onPress={() => this.exchangeTicket()} />
            </View>
        );
    }
}
