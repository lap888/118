import React, { Component } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, TextInput, Input, Pressable } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Actions } from 'react-native-router-flux';
// import BigButton from '../../component/BigButton';
import Icon from 'react-native-vector-icons/AntDesign';
import { Toast } from '../../common';
import RegExp from '../../common/RegExp';
import { Colors } from '../../theme/Index';
// import GoodsApi from '../../api/goods/GoodsApi';

export default class NftDetailModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: true,
            data: this.props.data,
            num: 1,
            pwd: '',
            price: 0
        };
    }

    componentWillUnmount() {
        this.setState({
            modalVisible: false,
            data: '',
            num: 1
        })
    }

    closeModal = () => {
        this.props.close();
    }

    enterOrder = () => {
        const { pwd, price } = this.state;
        this.props.enterOrder({ pwd: pwd, price: price });
        this.props.close();
    }

    render() {
        const { data, modalVisible, num } = this.state;
        return (
            <Modal
                style={{ justifyContent: 'center', alignItems: 'center' }}
                animationType="slide"
                transparent={true}
                hardwareAccelerated={true}
                visible={modalVisible}
                presentationStyle={'overFullScreen'}
                onRequestClose={() => this.setModalVisible(false)}
            >
                <View style={styles.tipsView}>
                    <TouchableOpacity style={{ flex: 1 }} onPress={this.closeModal} />
                    <View style={{ backgroundColor: Colors.White, height: 200, paddingHorizontal: 15, paddingTop: 15 }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.greyText }}>{this.props.type}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                            {this.props.type == "出售" &&
                                <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'flex-start', borderBottomWidth: 1, borderBottomColor: Colors.greyText, borderRightWidth: 1, borderRightColor: Colors.greyText }}>
                                    <TextInput keyboardType='numeric' placeholder="请输入出售价格" onChangeText={(value) => this.setState({ price: value })} />
                                </View>}
                            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'flex-start', borderBottomWidth: 1, borderBottomColor: Colors.greyText }}>
                                <TextInput secureTextEntry={true} placeholder="请输入交易密码" onChangeText={(value) => this.setState({ pwd: value })} />
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}>
                            <TouchableOpacity style={styles.closeBtn} onPress={this.closeModal}>
                                <Text style={{ fontSize: 16, color: Colors.main }}>取消</Text>
                            </TouchableOpacity>
                            <View style={{ width: 10 }} />
                            <TouchableOpacity style={{ flex: 1, height: 40, borderRadius: 20 }} onPress={this.enterOrder}>
                                <LinearGradient colors={[Colors.LightG, Colors.main]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 16, color: Colors.White }}>确定</Text>
                                </LinearGradient>
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
        justifyContent: 'flex-end',
    },
    selectPay: {
        marginTop: 10,
        fontSize: 14,
        color: '#E70243',
        paddingVertical: 3,
        paddingHorizontal: 5,
        borderRadius: 2,
        marginRight: 20,
        backgroundColor: 'rgb(255,219,205)'
    },
    closeBtn: { flex: 1, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.backgroundColor },
})