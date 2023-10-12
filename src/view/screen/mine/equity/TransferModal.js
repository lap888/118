import React, { Component } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image } from 'react-native';
import { Colors } from '../../../theme/Index';

export default class TransferModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: true,
        };
    }

    render() {
        const { info } = this.props;
        return (
            <Modal
                animationType="slide"
                transparent={true}
                hardwareAccelerated={true}
                visible={this.state.modalVisible}
                presentationStyle={'overFullScreen'}
                onRequestClose={() => {}}
            >
                <View style={styles.tipsView}>
                    <View style={{borderRadius: 10, width: 250,minHeight: 150, backgroundColor: Colors.White}}>
                        <View style={{borderBottomColor: Colors.WhiteSmoke, borderBottomWidth: 1, height: 40, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontSize: 16}}>{'转让人信息'}</Text>
                        </View>
                        <View style={{ padding: 10, }}>
                            <View style={{alignItems: 'center'}}>
                                {/* <Image style={{width: 40, height: 40 }} source={require('../../../images/icon_img.png')} /> */}
                                <Image style={{width: 40, height: 40 }} source={{uri: info.avatarUrl}} />
                                <Text style={{marginTop: 10, fontSize: 16, color: '#000'}}>{info.name}</Text>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', height: 40, borderTopWidth: 1, borderTopColor: Colors.WhiteSmoke }}>
                            <TouchableOpacity  
                                style={{flex: 1, justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderRightColor: Colors.WhiteSmoke}}
                                onPress={() => {this.props.close()}} >
                                <Text>取消</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
                                onPress={() => {this.props.enter(!this.state.modalVisible); }} >
                                <Text>确认</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    tipsView: {
        flex: 1, 
        backgroundColor: 'rgba(0,0,0,0.2)', 
        justifyContent: 'center', 
        alignItems: 'center',
    },
})
