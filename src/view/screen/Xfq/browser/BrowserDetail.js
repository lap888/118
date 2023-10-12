import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import RefreshListView, { RefreshState } from 'react-native-refresh-list-view';
import { Header } from '../../../components/Index';
import { Colors } from '../../../theme/Index';

export default class BrowserDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data,
        };
    }

    render() {
        const { data } = this.state;
        return (
            <View style={{flex: 1, backgroundColor: Colors.White }}>
                <Header title={'交易详情'} />
                <View style={styles.headerView1}>
                    <View style={{flex: 1}}>
                        <Text style={styles.titleTxt}>交易金额</Text>
                        <Text style={styles.valueTxt1}>{data.tAmount}</Text>
                    </View>
                    <View style={styles.headerViewRight}>
                        <Text style={styles.titleTxt}>手续费</Text>
                        <Text style={styles.valueTxt1}>{data.tFee}</Text>
                    </View>
                </View>
                <View style={styles.headerView1}>
                    <View style={{flex: 1}}>
                        <Text style={styles.titleTxt}>交易完成时间</Text>
                        <Text style={styles.valueTxt2}>{data.tTime}</Text>
                    </View>
                    <View style={styles.headerViewRight}>
                        <Text style={styles.titleTxt}>交易状态</Text>
                        <Text style={styles.valueTxt2}>成功</Text>
                    </View>
                </View>
                <View style={styles.nextView}>
                    <Text style={styles.titleTxt}>交易类型</Text>
                    <Text style={styles.valueTxt2}>转账</Text>
                </View>
                <View style={styles.nextView}>
                    <Text style={styles.titleTxt}>交易哈希</Text>
                    <Text style={styles.valueTxt2}>{data.tHash}</Text>
                </View>
                <View style={styles.nextView}>
                    <Text style={styles.titleTxt}>转出地址</Text>
                    <Text style={styles.valueTxt2}>{data.fromAddress}</Text>
                </View>
                <View style={styles.nextView}>
                    <Text style={styles.titleTxt}>转入地址</Text>
                    <Text style={styles.valueTxt2}>{data.toAddress}</Text>
                </View>
                <View style={styles.nextView}>
                    <Text style={styles.titleTxt}>备注</Text>
                    <Text style={styles.valueTxt2}></Text>
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    headerView1: { paddingHorizontal: 15, flexDirection: 'row', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: Colors.backgroundColor },
    headerViewRight: {flex: 1, borderLeftWidth: 1, borderLeftColor: Colors.backgroundColor, paddingLeft: 15},
    nextView: { paddingHorizontal: 15, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: Colors.backgroundColor },
    titleTxt: {fontSize: 12, color: Colors.grayFont},
    valueTxt1: {fontSize: 16, fontWeight: 'bold', color: Colors.fontColor, marginTop: 5 },
    valueTxt2: {fontSize: 16, color: Colors.fontColor, marginTop: 5},
})