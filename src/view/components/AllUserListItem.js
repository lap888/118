/*
 * @Author: top.brids 
 * @Date: 2019-12-24 22:56:12 
 * @Last Modified by: top.brids
 * @Last Modified time: 2022-03-17 18:01:31
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Clipboard from '@react-native-community/clipboard';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/Index';
import Toast from '../common/Toast';
import { EncryptionAdress } from '../../utils/Index'


export default class AllUserListItem extends Component {
    static propTypes = {
        item: PropTypes.object
    }
    constructor(props) {
        super(props);
        this.state = {
            clipboardWarnText: '复制地址'
        };
    }

    render() {
        let { item, index, coinType } = this.props;
        let { mobile, avatarUrl, name, status, Balance, blockadress, contributions, auditState, teamStart, authCount } = item;
        if (!teamStart || teamStart < 0) teamStart = 0;
        let ctime = '';
        if (item.hasOwnProperty('ctime')) {
            let date = new Date(item['ctime']);
            var Y = date.getFullYear() + '/';
            var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
            var D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
            ctime = Y + M + D;
        }
        return (
            <View style={Styles.bodyItem}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={[Styles.avatar, { overflow: 'visible' }]}>
                        <Image style={Styles.avatar} source={require('../images/logo.png')} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 5 }}>
                        <Text style={{ fontSize: 12, color: Colors.Wxpay }}>{EncryptionAdress(blockadress)}</Text>

                        <View style={{ flexDirection: 'row', alignItems: 'center',marginTop:6 }}>
                            <Text style={[Styles.phoneNumber, { fontSize: 12 }]}>昵称: {name}</Text>
                        </View>
                        <Text style={[Styles.phoneNumber, { fontSize: 12 }]}>{`${coinType == 0 ? '钻石' : 'GC'}: ${Balance == null ? 0 : Balance} `}</Text>
                        <Text style={[Styles.phoneNumber, { fontSize: 12, color: Colors.notice }]}>状态: {status == 0 || status == 1 ? '正常' : '冻结'}</Text>
                        <Text style={{ flex: 1, fontSize: 12, color: '#3c4d66', marginTop: 5 }}>注册时间:  {ctime}</Text>
                    </View>
                    <TouchableOpacity onPress={() => {
                        Clipboard.setString(blockadress);
                        Toast.tipBottom(`复制成功...`)
                        // this.setState({clipboardWarnText:'已复制'})

                    }} style={{ justifyContent: 'center', alignItems: 'center', padding: 10, height: 20, borderRadius: 10, borderWidth: 1, borderColor: Colors.main, backgroundColor: Colors.C2 }}>
                        <Text style={{ fontSize: 12, color: Colors.White }}>{this.state.clipboardWarnText}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
const Styles = StyleSheet.create({
    bodyItem: { alignItems: 'center', marginLeft: 15, paddingVertical: 15, paddingRight: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#eceff4' },
    avatar: { width: 35, height: 35, borderRadius: 17.5 },
    phoneNumber: { fontSize: 12, color: '#3c4d66' },
    teamStart: { fontSize: 12, color: Colors.C6 },
    teamNumber1: { fontSize: 14, color: Colors.main },
    teamNumber2: { fontSize: 12, color: '#666', marginTop: 5 },
    teamActivity: { fontSize: 14, color: '#3c4d66' },
    isCertified: { textAlign: 'right', fontSize: 14, color: '#3c4d66' },
    sequence: { flexDirection: 'row', alignItems: 'center', margin: 10, marginTop: 15 },
    sequenceItem: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    sequenceTitle: { fontSize: 14, color: Colors.C11, textDecorationLine: 'underline' },
    dropup: { width: 9, height: 9 },
});
