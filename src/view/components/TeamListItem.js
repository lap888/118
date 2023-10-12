/*
 * @Author: top.brids 
 * @Date: 2019-12-24 22:56:12 
 * @Last Modified by: top.brids
 * @Last Modified time: 2022-04-06 23:14:11
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Colors } from '../theme/Index';
import { EncryptionMobile } from '../../utils/Index';
import moment from 'moment';

export default class TeamListItem extends Component {
    static propTypes = {
        item: PropTypes.object
    }
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.item === this.props.item) {
            return false
        }
        return true
    }
    render() {
        let { item, index } = this.props;
        let { mobile, name, active, teamCount, teamCandyH, contributions, auditState, teamStart, authCount } = item;
        if (!teamStart || teamStart < 0) teamStart = 0;
        let ctime = '';
        if (item.hasOwnProperty('ctime')) {
            ctime = item['ctime'];//moment(item['ctime']).format('YYYY-MM-DD')
        }
        return (
            <View style={Styles.bodyItem}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={[Styles.avatar, { overflow: 'visible' }]}>
                        <Image style={Styles.avatar} source={require('../images/logo.png')} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 5 }}>
                        <Text style={[Styles.phoneNumber, { fontSize: 13 }]}>{name}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                            {teamCount > 1 ?
                                <Text style={[Styles.phoneNumber, { fontSize: 14 }]}>{`${mobile} `}</Text> :
                                <Text style={[Styles.phoneNumber]}>{`${EncryptionMobile(mobile)} `}</Text>
                            }
                            {teamStart != 0 && <Text style={[Styles.teamStart]}>{`  ${teamStart}星达人`}</Text>}

                            <Text style={{ fontSize: 12, color: '#53A200' }}> 活跃度 {teamCandyH}</Text>
                        </View>
                        <Text style={{ flex: 1, fontSize: 12, color: '#3c4d66', marginTop: 5 }}>注册时间:{ctime}</Text>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center', width: 46, height: 20, borderRadius: 10, borderWidth: 1, borderColor: Colors.main, backgroundColor: Colors.C2 }}>
                        <Text style={{ fontSize: 12, color: Colors.White }}>{auditState ? '已认证' : '未认证'}</Text>
                    </View>
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
