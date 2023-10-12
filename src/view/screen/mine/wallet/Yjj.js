import React, { Component } from 'react';
import { View, Text, TextInput, Alert } from 'react-native';
import { Header, BigButton } from '../../../components/Index';
import { Colors, Metrics } from '../../../theme/Index';
import { UserApi } from '../../../../api';
import { Toast } from '../../../common';
export default class Yjj extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: '',
            kgFlag: 0,
            list: [],
            kg: true,
            uid: 0,
            count: 0,
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
        this.setState({ uid: value })
    }
    setCount = (value) => {
        this.setState({ count: value })
    }
    exchangeTicket = () => {
        let count = this.state.count;
        Alert.alert(
            "友情提示",
            `您确定要执行吗？`,
            [
                {
                    text: "确定", onPress: () => {
                        UserApi.beginYJJ({ mobile: this.state.uid, count: count })
                            .then((res) => {
                                Toast.tip('执行完成')
                            }).catch((err) => console.log('err', err))
                    }
                },
                { text: "取消", onPress: () => { } },
            ],
            { onDismiss: () => { } }
        )

    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.backgroundColor, alignItems: 'center' }}>
                <Header title={'优久久'} />
                <View style={{ marginTop: 10 }}>
                    <Text style={{ fontSize: 14, color: Colors.C12 }}>邀请人手机号</Text>
                    <View style={{ flexDirection: 'row', height: 50,width:Metrics.screenWidth-50, borderBottomColor: Colors.main, borderBottomWidth: 1, marginBottom: 20 }}>
                        <TextInput
                            style={{ flex: 1 }}
                            placeholder={`输入邀请人手机号`}
                            value={this.state.uid}
                            onChangeText={this.setUid}
                        />
                    </View>
                </View>
                <View style={{ marginTop: 10 }}>
                    <Text style={{ fontSize: 14, color: Colors.C12 }}>邀请数量</Text>
                    <View style={{ flexDirection: 'row', height: 50,width:Metrics.screenWidth-50, borderBottomColor: Colors.main, borderBottomWidth: 1, marginBottom: 20 }}>
                        <TextInput
                            style={{ flex: 1 }}
                            placeholder={`输入邀请数量`}
                            value={this.state.count}
                            onChangeText={this.setCount}
                        />
                    </View>
                </View>
                <BigButton style={{ marginTop: 20, width: Metrics.screenWidth / 2 }} name={'开始'} onPress={() => this.exchangeTicket()} />
            </View>
        );
    }
}
