import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Header } from '../../components/Index';
import LinearGradient from 'react-native-linear-gradient';
import { Actions } from 'react-native-router-flux';
// import { Toast } from 'native-base';
import { Colors, Metrics } from '../../theme/Index';
import { connect } from 'react-redux';
import { Send } from '../../../utils/Http';
import { Toast } from '../../common';

class Addaddress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            userId: 0,
            name: '',
            phone: '',
            address: '',
            area: '',
            city: '',
            province: '',
            postCode: '',
            isDefault: 0
        };
    }

    componentDidMount() {
        if (this.props.ty == 'modify') {
            this.setState(this.props.adress)
        }
    }

    onPressSave = () => {
        Send('api/UserAddress/Edit', this.state).then(res => {
            if (res.code == 200) {
                Actions.pop();
            }
            Toast.tipBottom(res.message);
        });
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.backgroundColor, }}  >
                <Header title="编辑地址" />
                <ScrollView style={{flex: 1}}>
                    <View style={styles.itemView}>
                        <View style={{ width: Metrics.screenWidth * 0.3, height: 48, paddingLeft: 10, marginTop: 10, alignItems: 'center', justifyContent: 'center', }}>
                            <Text style={styles.leftName}>收货人:</Text>
                        </View>
                        <TextInput style={styles.inputViewStyle}
                            placeholder="请输入收货人"
                            defaultValue={this.state.name}
                            editable={true}
                            onChangeText={(text) => {
                                this.setState({
                                    name: text
                                })
                            }}
                        />
                    </View>
                    <View style={styles.itemView}>
                        <View style={{ width: Metrics.screenWidth * 0.3, height: 48, paddingLeft: 10, marginTop: 10, alignItems: 'center', justifyContent: 'center', }}>
                            <Text style={styles.leftName}>手机号码:</Text>
                        </View>
                        <TextInput style={styles.inputViewStyle}
                            placeholder="请输入手机号码"
                            defaultValue={this.state.phone}
                            editable={true}
                            onChangeText={(text) => {
                                this.setState({
                                    phone: text
                                })
                            }}
                        />
                    </View>
                    <View style={styles.itemView}>
                        <View style={{ width: Metrics.screenWidth * 0.3, height: 48, paddingLeft: 10, marginTop: 10, alignItems: 'center', justifyContent: 'center', }}>
                            <Text style={styles.leftName}>省份:</Text>
                        </View>
                        <TextInput style={styles.inputViewStyle}
                            placeholder="请输入所在省"
                            defaultValue={this.state.province}
                            editable={true}
                            onChangeText={(text) => {
                                this.setState({
                                    province: text
                                })
                            }}
                        />
                    </View>
                    <View style={styles.itemView}>
                        <View style={{ width: Metrics.screenWidth * 0.3, height: 48, paddingLeft: 10, marginTop: 10, alignItems: 'center', justifyContent: 'center', }}>
                            <Text style={styles.leftName}>城市:</Text>
                        </View>
                        <TextInput style={styles.inputViewStyle}
                            placeholder="请输入所在城市"
                            defaultValue={this.state.city}
                            editable={true}
                            onChangeText={(text) => {
                                this.setState({
                                    city: text
                                })
                            }}
                        />
                    </View>
                    <View style={styles.itemView}>
                        <View style={{ width: Metrics.screenWidth * 0.3, height: 48, paddingLeft: 10, marginTop: 10, alignItems: 'center', justifyContent: 'center', }}>
                            <Text style={styles.leftName}>区县:</Text>
                        </View>
                        <TextInput style={styles.inputViewStyle}
                            placeholder="请输入所在区县"
                            defaultValue={this.state.area}
                            editable={true}
                            onChangeText={(text) => {
                                this.setState({
                                    area: text
                                })
                            }}
                        />
                    </View>
                    <View style={styles.itemView}>
                        <View style={{ width: Metrics.screenWidth * 0.3, height: 48, paddingLeft: 10, marginTop: 10, alignItems: 'center', justifyContent: 'center', }}>
                            <Text style={styles.leftName}>详细地址:</Text>
                        </View>
                        <TextInput style={styles.inputViewStyle}
                            placeholder="请输入详细地址"
                            defaultValue={this.state.address}
                            editable={true}
                            onChangeText={(text) => {
                                this.setState({
                                    address: text
                                })
                            }}
                        />
                    </View>
                    <View style={styles.itemView}>
                        <View style={{ width: Metrics.screenWidth * 0.3, height: 48, paddingLeft: 10, marginTop: 10, alignItems: 'center', justifyContent: 'center', }}>
                            <Text style={styles.leftName}>邮政编码:</Text>
                        </View>
                        <TextInput style={styles.inputViewStyle}
                            placeholder="请输入邮政编码"
                            defaultValue={this.state.postCode}
                            editable={true}
                            onChangeText={(text) => {
                                this.setState({
                                    postCode: text
                                })
                            }}
                        />
                    </View>
                </ScrollView>
                <TouchableOpacity onPress={() => this.onPressSave()} style={{ height: 40, backgroundColor: Colors.main, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, color: Colors.White }}>保存</Text>
                </TouchableOpacity>
            </View>
        );
    }
}
const mapStateToProps = state => ({
    userId: state.user.id,
    mobile: state.user.mobile
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Addaddress);

const styles = StyleSheet.create({
    businessPwdPageView: {
        backgroundColor: "#ffffff",
        height: Metrics.screenHeight * 1,
    },
    itemView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    leftName: {
        color: Colors.C12,
        fontSize: 16
    },
    pwdViewStyle: {
        padding: 10,
    },
    promptTxt: {
        fontSize: 12,
        color: Colors.C6,
    },
    inputViewStyle: {
        height: 40,
        paddingLeft: 10,
        marginTop: 10,
        borderRadius: 5,
        backgroundColor: Colors.White,
        width: Metrics.screenWidth * 0.6
    },
    countDownButtonStyle: {
        height: 48,
        padding: 5,
        borderRadius: 5,
        marginTop: 10,
        width: Metrics.screenWidth * 0.3,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.LightG
    },
    submitView: {
        height: Metrics.screenHeight * 0.5,
        justifyContent: 'center',
        alignItems: "center",
    },
    submitBtn: {
        backgroundColor: Colors.C6,
        width: Metrics.screenWidth * 0.6,
        alignItems: "center",
        borderRadius: 8,
    },
});