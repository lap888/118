import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { BoxShadow } from 'react-native-shadow';
import moment from 'moment';
import { Colors, Metrics } from '../theme/Index';

export default class CityDevideItem extends PureComponent {
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
                        <Text style={Styles.labelTxt}>{item.desc}</Text>
                        <Text style={Styles.diamondTime}>
                            {`${item.createTime} ${item.title}`}
                        </Text>
                    </View>
                    <View style={[Styles.diamondNumView]}>
                        <Text style={Styles.diamondNumTxt}>+{item.amount.toFixed(2)}</Text>
                    </View>
                </View>
                : <View />
        );
    }
}
const Styles = StyleSheet.create({
    transactionContainer: { left: 10, marginTop: 10 },
    verticalLine: { height: 35, width: 3, borderRadius: 3, backgroundColor: Colors.C1 },
    diamondCard: {
        height: 65,
        margin: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: Colors.C8,
        borderRadius: 6,
        borderBottomWidth: 1,
        borderColor: Colors.LightGrey,
    },
    labelView: {
        flex: 1,
        marginLeft: 12,
    },
    labelTxt: { fontSize: 14, color: Colors.C0, fontWeight: '400' },
    diamondTime: { marginTop: 8, fontSize: 13, color: Colors.C2 },
    diamondNumView: {
        alignItems: "flex-end"
    },
    diamondNumTxt: {
        fontSize: 14,
        color: Colors.C6,
        flexWrap: "wrap",
        marginRight: 10
    },
    diamondNumTxt2: {
        fontSize: 14,
        color: Colors.C16,
        flexWrap: "wrap",
        marginRight: 10
    },
});
