/*
 * @Author: top.brids 
 * @Date: 2020-01-04 21:56:24 
 * @Last Modified by: top.brids
 * @Last Modified time: 2020-06-01 15:55:07
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableWithoutFeedback, StyleSheet, Image, TouchableOpacity } from 'react-native';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { BoxShadow } from 'react-native-shadow';
import { Metrics, Colors } from '../../theme/Index';
import LinearGradient from 'react-native-linear-gradient';
import { freeGenWord } from '../../../utils/BaseValidate';

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
        let { item, userId, type } = this.props;
        let { buyerUid, sellerUid, price, amount, dishonesty } = item;
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
                        {buyerUid == 1 ? <FontAwesome name='star-half-full' color={Colors.C6} size={16} /> : null}
                        {buyerUid == 0 ? <FontAwesome name='star-half-full' color={Colors.C6} size={16} /> : null}
                        <View style={Styles.avatar}><Text style={{ color: Colors.White }}>{`${freeGenWord()}`}</Text></View>
                        <Text style={{ marginLeft: 10, fontWeight: 'bold', fontSize: 16 }}>{`匿名`}</Text>
                        <Text style={Styles.transactionNumber}>{`最近30日被投诉 ${dishonesty}`}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 8 }}>
                        <Text style={[Styles.number, {color: Colors.C11}]}>{`数量  `}</Text>
                        <Text style={Styles.number}>{`${amount}糖果`}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 8, alignItems: 'center' }}>
                        <Text style={[Styles.price, {color: Colors.C11}]}>{`单价  `}</Text>
                        <Text style={Styles.price}>{`￥${price}`}</Text>
                        <Text style={Styles.transactionNumber}>支付方式    </Text>
                        <Image style={{ width: 20, height: 20,}} source={require('../../images/profile/biao.png')} />
                    </View>
                </View>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity style={Styles.sale} onPress={() => this.props.toOptionBuyList(item)}>
                        <Text style={Styles.saleText}>{action}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
const Styles = StyleSheet.create({
    transaction: { margin: 10, marginLeft: 25, marginRight: 25, flexDirection: 'row', paddingBottom: 10, alignItems: 'center', backgroundColor: '#FFFFFF', borderColor: Colors.LightGrey, borderBottomWidth: 1 },
    avatar: { height: 30, width: 30, borderRadius: 25, backgroundColor: Colors.C16, alignItems: 'center', justifyContent: 'center' },
    name: { fontWeight: 'bold', fontSize: 14 },
    body: { flex: 2 },
    saleInfo: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    price: { fontSize: 16, color: Colors.C6 },
    number: { fontSize: 16, color: Colors.C6 },
    transactionNumber: { fontSize: 14, color: Colors.LightGrey, marginLeft: 20 },
    sale: { alignSelf: 'center', justifyContent: 'center', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 5, backgroundColor: Colors.C6 },
    saleText: { fontSize: 15, color: '#FFFFFF' }
});

