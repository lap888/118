import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../../theme/Index';
import { Header } from '../../../components/Index';

export default class SuperiorInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { reContactTel, reWeChatNo } = this.props;
        
        return (
            <View style={styles.container}>
                <Header title='邀请人信息'/>
                <View>
                    <View style={styles.labelContainer}>
                        <Text style={styles.lableTxt}>手机号</Text>
                        <Text style={[styles.lableTxt, { color: Colors.C10 }]}>{reContactTel == '' ? '邀请人未展示' : reContactTel}</Text>
                    </View>
                    <View style={styles.labelContainer}>
                        <Text style={styles.lableTxt}>微信号</Text>
                        <Text style={[styles.lableTxt, { color: Colors.C10 }]}>{reWeChatNo == '' ? '邀请人未展示' : reWeChatNo}</Text>
                    </View>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    labelContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 52,
        marginLeft: 10,
        paddingRight: 10,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: Colors.C7
    },
    lableTxt: { fontSize: 16, color: Colors.C11 },
})