import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { OtherApi } from '../../../../api';
import { onPressSwiper } from '../../../../utils/CommonFunction';
import { Header } from '../../../components/Index';
import { Colors, Metrics } from '../../../theme/Index';

export default class ActiveScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
    }

    componentDidMount() {
        this.getList(2)
    }

    getList = (id) => {
        OtherApi.getActiveList(id)
        .then((data) => {
            this.setState({
                data: data
            })
        }).catch((err) => console.log('err', err))
    }

    render() {
        return (
            <View style={styles.fa}>
                <ScrollView style={{flex: 1}}>
                    { this.state.data.length > 0 && this.state.data.map((item, index) => {
                        return (
                            <TouchableOpacity key={index} style={styles.item} onPress={() => onPressSwiper(item)}>
                                <Image source={{uri: item.imageUrl}} style={styles.itemImg} />
                            </TouchableOpacity>
                        )
                    }) }
                    <View style={{height: 20}}/>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    fa: {
        flex: 1, 
        backgroundColor: Colors.White
    },
    item: {
        paddingHorizontal: 15, 
        marginTop: 10, 
        borderRadius: 5
    },
    itemImg: {
        borderRadius: 5,
        width: Metrics.screenWidth - 30,
        height: (Metrics.screenWidth - 30)/2
    }
})
