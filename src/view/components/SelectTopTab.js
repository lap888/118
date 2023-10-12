import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../theme/Index';

export default class SelectTopTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.list.length > 0 && this.props.list[0]
        };
    }

    select = (item) => {
        this.setState({
            data: item,
        })
        this.props.onPress && this.props.onPress(item);
    }

    render() {
        return (
            <View style={styles.fa}>
                {this.props.list.length > 1 && this.props.list.map((item, index) => {
                    return (
                        <TouchableOpacity key={index} style={styles.item} onPress={() => this.select(item)}>
                            <View style={styles.itemTxtView}>
                                <Text style={{ color: this.state.data.key === item.key ? Colors.main : Colors.C12,}}>{item.name}</Text>
                            </View>
                            <View style={{height: 2, width: 80, backgroundColor: this.state.data.key === item.key ? Colors.main : Colors.White}}/>
                        </TouchableOpacity>
                    )
                })}
                {/* <TouchableOpacity style={{flex: 1, alignItems: 'center' }} onPress={() => this.select(1)}>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: this.state.status == 1 ? Colors.mainTab : Colors.C12,}}>赎回订单</Text>
                    </View>
                    <View style={{height: 2, width: 80, backgroundColor: this.state.status == 1 ? Colors.mainTab : Colors.width}}/>
                </TouchableOpacity> */}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    fa: {flexDirection: 'row', height: 40, backgroundColor: Colors.White},
    item: {flex: 1, alignItems: 'center' },
    itemTxtView: {flex: 1, justifyContent: 'center', alignItems: 'center' },
})
