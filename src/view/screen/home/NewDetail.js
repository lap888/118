import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Colors } from '../../theme/Index';
import { Header } from '../../components/Index';
import TDetailContent from '../digg/TDetailContent'
export default class NewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Header title={'新闻详情'} />
                {/* <View style={{ margin: 10, marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.main }}>标题: {this.props.title}</Text>
                </View> */}
                <TDetailContent TDContent={this.props.TDContent} title={this.props.title}></TDetailContent>
                {/* <View style={{ margin: 10, marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.Alipay }}>免责声明：以上文章仅代表作者个人观点，不代表本平台的投资建议和立场。本平台不会承担任何使用或者信赖文章信息引发的任何损失或者损害，望用户仔细甄别，防范风险。</Text>
                </View> */}
            </View>
        );
    }
}
