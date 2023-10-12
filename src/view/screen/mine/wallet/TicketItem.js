import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Metrics, Colors } from '../../../theme/Index';

export default class TicketItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: '',
        };
    }

    render() {
        const { data } = this.props;
        let { selected } = this.state;
        return (
            <View style={{}}>
                <View style={{marginLeft: 15}}>
                    <Text style={{fontWeight: '700', fontSize: 14, color: Colors.fontColor, }}>兑换套餐</Text>
                </View>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingLeft: 15,}}>
                    {data && data.length > 0 && data.map((item, index) => {
                        return (
                            <TouchableOpacity activeOpacity={0.8} key={index} style={styles.item} onPress={() => this.setState({selected: item})}>
                                <Text style={{fontSize: 15, fontWeight: 'bold', marginTop: 3 }} >{item.candy}<Text style={{fontSize: 13, fontWeight: 'normal'}}> {item.uIn}</Text></Text>
                                <Text style={{fontSize: 11, color: Colors.fontColor, marginTop: 3 }} >兑换</Text>
                                <Text style={{fontSize: 12 }}>{item.shares} {item.uOut}</Text>
                                {/* <Text style={{fontSize: 11, color: Colors.fontColor, marginTop: 3 }} >或  {item.cash}元</Text> */}
                                {selected.shares === item.shares ? <Image style={{position: 'absolute', top: 0, right: 0}} source={require('../../../images/mine/wallet/xuanzhong.png')} /> : null}
                            </TouchableOpacity>
                        )
                    })}
                </View>
        </View>
        );
    }
}

const styles = StyleSheet.create({
    item: {
        justifyContent: 'center', 
        alignItems: 'center', 
        width: (Metrics.screenWidth - 50)/3 ,
        height: 75, 
        marginTop: 10, 
        marginRight: 10, 
        backgroundColor: Colors.White
    },
})
