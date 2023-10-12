import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/Index';

export default class BigButton extends Component {

    render() {
        const { style, name, textStyle, onPress, disabled = false } = this.props;
        return (
            <TouchableOpacity disabled={disabled} style={[styles.faView, style]} onPress={onPress}>
                <Text style={[{fontSize: 16, color: Colors.White}, textStyle]}>{name}</Text>
            </TouchableOpacity>
        );
    }
}


const styles = StyleSheet.create({
	faView: {
        marginHorizontal: 20,
        height: 40, 
        borderRadius: 5,
        backgroundColor: Colors.main,
        justifyContent: 'center',
        alignItems: 'center',
    }
})

