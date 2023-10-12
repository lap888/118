/*
 * @Author: top.brids 
 * @Date: 2020-01-04 21:56:24 
 * @Last Modified by: top.brids
 * @Last Modified time: 2021-09-28 13:25:47
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from 'react-native-linear-gradient';
import { Metrics, Colors } from '../../../theme/Index';
import { freeGenWord, interception } from '../../../../utils/BaseValidate';
import { Toast } from '../../../common';
export default class TransactionListItem extends PureComponent {
    static propTypes = {
        item: PropTypes.object,
    };
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        let { item, userId, type, fristBuyUser } = this.props;
        let { buyerUid, sellerUid, price, amount, uType, name, orderType } = item;
        let fristBuyUserId = fristBuyUser != undefined ? fristBuyUser.buyerUid : 0;
        let action = ''
        if (type === 'SELL') {
            action = sellerUid !== userId ? "购买" : "取消";
        }
        if (type === 'BUY') {
            action = buyerUid !== userId ? "出售" : "取消";
        }
        return (
            <View style={Styles.transaction}>
                <View style={Styles.body}>
                    <View style={Styles.saleInfo}>
                        <LinearGradient colors={[Colors.btnBeforColor, Colors.btnAfterColor]} start={{ x: 0, y: 0 }} end={{ x: 0.8, y: 0.8 }} style={Styles.avatar}>
                            {<Text style={{ color: Colors.White }}>{`${freeGenWord()}`}</Text>}
                        </LinearGradient>
                        <Text style={{ marginLeft: 10, fontWeight: 'bold', fontSize: 16 }} numberOfLines={1} >{uType == 0 ? `匿名` : `${interception(name, 6)}`}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 8 }}>
                        <Text style={[Styles.number, { color: Colors.C11 }]}>{`数量  `}</Text>
                        <Text style={Styles.number}>{`${amount}${orderType}`}</Text>
                    </View>
                    <Image style={{ width: 20, height: 20, marginTop: 8, }} source={require('../../../images/profile/biao.png')} />
                </View>
                <View style={{ alignItems: 'flex-end', justifyContent: 'center', }}>
                    <Text style={[Styles.price, { color: Colors.C11 }]}>{`单价`}</Text>
                    <Text style={[Styles.price, { fontSize: 12, marginVertical: 10, }]}>{`￥${price}`}</Text>
                    <LinearGradient colors={[Colors.btnBeforColor, Colors.btnAfterColor]} start={{ x: 0, y: 0 }} end={{ x: 0.8, y: 0.5 }} style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}>
                        {/* <TouchableOpacity disabled={buyerUid != fristBuyUserId} style={Styles.sale} onPress={() => this.props.toOptionBuyList(item)}>
                            <Text style={Styles.saleText}>{action}</Text>
                        </TouchableOpacity> */}
                        <TouchableOpacity style={Styles.sale} onPress={() => this.props.toOptionBuyList(item)}>
                            <Text style={Styles.saleText}>{action}</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
            </View>
        );
    }
}
const Styles = StyleSheet.create({
    transaction: { flex: 1, margin: 10, marginLeft: 25, marginRight: 25, flexDirection: 'row', paddingBottom: 10, alignItems: 'center', backgroundColor: '#FFFFFF', borderColor: Colors.LightGrey, borderBottomWidth: 1 },
    avatar: { height: 30, width: 30, borderRadius: 25, backgroundColor: Colors.mainTab, alignItems: 'center', justifyContent: 'center' },
    name: { fontWeight: 'bold', fontSize: 14 },
    body: { flex: 1 },
    saleInfo: { flexDirection: 'row', alignItems: 'center', marginTop: 4, width: Metrics.screenWidth - 40 },
    price: { fontSize: 12, color: Colors.mainTab },
    number: { fontSize: 16, color: Colors.mainTab },
    transactionNumber: { fontSize: 14, color: Colors.LightGrey, marginLeft: 10 },
    sale: { alignSelf: 'center', justifyContent: 'center', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 5 },
    saleText: { fontSize: 15, color: '#FFFFFF' }
});

