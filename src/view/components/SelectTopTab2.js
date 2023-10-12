import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../theme/Index';

export default class SelectTopTab2 extends Component {
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
                                <Text style={{ color: this.state.data.key === item.key ? Colors.White : Colors.WhiteSmoke }}>{item.name}</Text>
                            </View>
                            <View style={{ height: 2, width: 60, backgroundColor: this.state.data.key === item.key ? Colors.White : 'rgba(52, 52, 52, 0)' }} />
                        </TouchableOpacity>
                    )
                })}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    fa: { flexDirection: 'row', height: 40 },
    item: { flex: 1, alignItems: 'center' },
    itemTxtView: { flex: 1, justifyContent: 'center', alignItems: 'center' },
})
