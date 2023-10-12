import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { BoxShadow } from 'react-native-shadow';
import moment from 'moment';
import { Colors, Metrics } from '../theme/Index';
import { MathFloat } from '../../utils/Index';

export default class CandyPListItem extends PureComponent {
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
        let { content, candyP, createdAt, enabled } = item;
        const shadowOpt = {
            height: 70,
            width: Metrics.screenWidth - 20,
            color: Colors.C6,
            border: 2,
            radius: 6,
            opacity: 0.5,
            x: 0,
            y: 0,
            style: Styles.transactionContainer
        }
        return (
            item ?
                <View style={{borderBottomWidth: 1, borderBottomColor: Colors.backgroundColor}} key={index}>
                    <View style={Styles.diamondCard}>
                        <View style={[Styles.labelView]}>
                            <Text style={Styles.labelTxt}>{content}</Text>
                            <Text style={Styles.diamondTime}>
                                {createdAt}
                            </Text>
                        </View>
                        <View style={[Styles.diamondNumView]}>
                            <Text style={candyP > 0 ? Styles.diamondNumTxt : Styles.diamondNumTxt2}>{`${candyP > 0 ? '+' : ''}${MathFloat.floor(candyP, 2)}`}</Text>
                        </View>
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
        borderRadius: 6
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
        marginRight: 10,

    },
    diamondNumTxt2: {
        fontSize: 14,
        color: Colors.C16,
        flexWrap: "wrap",
        marginRight: 10
    },
});
