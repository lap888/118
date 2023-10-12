import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Clipboard from '@react-native-community/clipboard';
import { connect } from 'react-redux';

import { Header } from '../../../components/Index';
import { Colors } from '../../../theme/Index';
import { Toast } from '../../../common';

class RechargeCandy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            address: props.address,
        };
    }

    copyAddress = () => {
        Toast.tip('复制成功');
        Clipboard.setString(this.props.address);
    }
    
    render() {
        return (
            <View style={{flex: 1, backgroundColor: Colors.backgroundColor}}>
                <Header title={'糖果充值'} />
                <View style={{ backgroundColor: Colors.White, paddingVertical: 20,}}>
                    <View style={{alignSelf: 'center', height: 100, width: 100, justifyContent: 'center', alignItems: 'center', borderColor: Colors.backgroundColor, borderWidth: 0.5}}>
                        <View style={{ borderWidth: 4, borderColor: Colors.White, borderRadius: 5 }}>
                            <QRCode
                                value={this.state.address}
                                logoSize={30}
                                size={90}
                            />
                        </View>
                    </View>
                    <View style={{paddingHorizontal: 10, marginTop: 10}}>
                        <Text style={{fontSize: 14, color: Colors.grayFont}}>充币地址</Text>
                        <Text style={{fontSize: 14}}>{this.state.address}</Text>
                    </View>
                    <TouchableOpacity style={styles.btnpost} onPress={this.copyAddress}>
                        <Text style={{fontSize: 16, color: Colors.White}}>复制地址</Text>
                    </TouchableOpacity>
                </View>
                <View style={{paddingHorizontal: 10, marginTop: 10}}>
                    {/* <Text style={{fontSize: 13}}>注意事项：</Text> */}
                </View>
            </View>
        )
    }
}
const mapStateToProps = state => ({
	address: state.user.uuid,
});
const mapDispatchToProps = dispatch => ({
	// updateUserInfo: (userInfo) => dispatch({ type: UPDATE_USER, payload: { userInfo } })
});
export default connect(mapStateToProps, mapDispatchToProps)(RechargeCandy);

// uuid
const styles = StyleSheet.create({
    btnpost: { 
        height: 40, 
        marginTop: 20, 
        marginHorizontal: 30, 
        backgroundColor: Colors.main, 
        alignItems: 'center', 
        justifyContent: 'center', 
        borderRadius: 20 
    },
})

