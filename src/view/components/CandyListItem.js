/*
 * @Author: top.brids 
 * @Date: 2019-12-27 10:12:36 
 * @Last Modified by: top.brids
 * @Last Modified time: 2021-08-25 23:20:56
 */

import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import moment from 'moment';
import { Colors, Metrics } from '../theme/Index';
import PropTypes from 'prop-types';

export default class CandyListItem extends PureComponent {
    static propTypes = {
        item: PropTypes.object
    }
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        let { item, index } = this.props;
        return (
            item ?
                <View style={Styles.diamondCard}>
                    <View style={[Styles.labelView]}>
                        <Text style={Styles.labelTxt}>
                            {item.description || "糖果收益"}
                        </Text>
                        <Text style={Styles.diamondTime}>
                            {item.createdAt}
                        </Text>
                    </View>
                    <View style={[Styles.diamondNumView]}>
                        {item.num > 0 ? <Text style={Styles.diamondNumTxt}> +{item.num.toFixed(2)} </Text> : <Text style={Styles.diamondNumTxt2}> {item.num < 0 ? item.num.toFixed(2) : "0.00"} </Text>}
                    </View>
                </View>
                : <View />
        );
    }
}

const Styles = StyleSheet.create({
    diamondCard: {
        paddingVertical: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: Colors.C8,
        marginHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.backgroundColor
    },
    labelView: {
        flex: 1,
        // marginLeft: 12,
    },
    labelTxt: { 
        fontSize: 14, 
        color: Colors.C0, 
        fontWeight: '400'
    },
    diamondTime: {
        marginTop: 8,
        fontSize: 13,
        color: Colors.C2
    },
    diamondNumView: {
        alignItems: "flex-end"
    },
    diamondNumTxt: {
        fontSize: 14,
        color: Colors.C6,
        flexWrap: "wrap",
        // marginRight: 10
    },
    diamondNumTxt2: {
        fontSize: 14,
        color: Colors.C16,
        flexWrap: "wrap",
        // marginRight: 10
    },
});