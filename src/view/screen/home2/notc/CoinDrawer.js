import React, { Component } from 'react';
import { View, Text, Modal, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { Colors, Metrics } from '../../../theme/Index';
import Icon from "react-native-vector-icons/Ionicons";
export default class CoinDrawer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            data: [],
            refreshState: true,
            scaleAnimate: new Animated.Value(-1)
        };
    }

    componentDidMount() {
        this.getHomeRankList()
    }

    getHomeRankList = () => {
        let _data = [{ name: '钻石' }, { name: 'GC' }];
        this.setState({
            data: _data,
            refreshState: false
        })
    }

    showModal = () => {
        this.setState({ modalVisible: true })
        Animated.timing(this.state.scaleAnimate, {
            toValue: 1,
            velocity: 15,//初始速度
            duration: 300,//
            useNativeDriver: true
        }).start();
    }
    closeModal = () => {
        this.setState({ modalVisible: false })
    }

    itemOnpress = (item) => {
        this.props.setItem(item);
        this.closeModal();
    }

    render() {
        return (
            <Modal
                animationType='none'
                transparent={true}
                hardwareAccelerated={true}
                visible={this.state.modalVisible}
                presentationStyle={'overFullScreen'}
                onRequestClose={() => { }}>
                <View style={{ flex: 1, flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <Animated.View style={[
                        {
                            transform: [{   //偏移效果
                                translateX: this.state.scaleAnimate.interpolate({
                                    inputRange: [-1, 1],
                                    outputRange: [-100, 0]
                                })
                            }]
                        },
                        { backgroundColor: Colors.White, flex: 1 }]
                    }>
                        <View style={{ marginTop: 10, paddingLeft: 15, height: 35, borderBottomWidth: 1, borderBottomColor: Colors.backgroundColor }}>
                            <Text style={{ fontSize: 16, }}>选择币种</Text>
                        </View>
                        <View>
                            {this.state.data.map((item, index) => {
                                return (
                                    <TouchableOpacity key={index} style={styles.item} onPress={() => this.itemOnpress(item)}>
                                        <Text style={{ fontSize: 11, color: Colors.C10 }}><Text style={{ fontSize: 15, color: Colors.C12 }}>{item.name}</Text></Text>
                                        {/* <Text style={{fontSize: 11, color: Colors.C10}}>{item.nowPrice}</Text> */}
                                        <Icon name="chevron-forward" color={Colors.C10} size={20} />
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    </Animated.View>
                    <TouchableOpacity style={{ flex: 1 }} onPress={this.closeModal} />
                </View>

            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    item: { height: 50, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomColor: Colors.backgroundColor, borderBottomWidth: 1 },
})