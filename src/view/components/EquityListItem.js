import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import { BoxShadow } from 'react-native-shadow';
import { Colors, Metrics } from '../theme/Index';

const shadowOpt = {
    height: 65,
    width: Metrics.screenWidth - 20,
    color: Colors.C6,
    border: 2,
    radius: 6,
    opacity: 0.5,
    x: 0,
    y: 0,
    style: { left: 10, marginTop: 10 }
}

export default class EquityListItem extends PureComponent {
    static propTypes = {
        item: PropTypes.object
    }
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        let { type, item, index } = this.props;
        if (!item || !type) {
            return <View/>
        }
        if (type === 1 || type === 3) {
            return (
                <BoxShadow setting={shadowOpt} key={index}>
                    <View style={{flexDirection: 'row', backgroundColor: Colors.White, height: 60, margin: 1, borderRadius: 6}}>
                        <View style={{flex: 1, padding: 5}}>
                            <Text style={{flex: 1}} numberOfLines={2}>{item.modifyDesc}</Text>
                            <Text style={{fontSize: 12}}>时间:  {item.modifyTime}</Text>
                        </View>
                        <View style={{paddingHorizontal: 10, justifyContent: 'center'}}>
                            <Text style={{fontSize: 18, color: Colors.C6}}>{item.incurred > 0 ? `+${item.incurred}` : item.incurred}</Text>
                        </View>
                    </View>
                </BoxShadow>
            );
        }
        if (type === 2) {
            return (
                <BoxShadow setting={shadowOpt} key={index}>
                    <View style={{flexDirection: 'row', backgroundColor: Colors.White, height: 60, margin: 1, borderRadius: 6}}>
                        <View style={{flex: 1, padding: 5}}>
                            <Text style={{flex: 1}} numberOfLines={2}>{item.desc}</Text>
                            <Text style={{fontSize: 12}}>时间:  {item.occurTime}</Text>
                        </View>
                        <View style={{paddingHorizontal: 10, justifyContent: 'center'}}>
                            <Text style={{fontSize: 18, color: Colors.C6}}>{item.occurAmount}</Text>
                        </View>
                    </View>
                </BoxShadow>
            );
        }
    }
}
const Styles = StyleSheet.create({
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
        marginRight: 10
    },
    diamondNumTxt2: {
        fontSize: 14,
        color: Colors.C16,
        flexWrap: "wrap",
        marginRight: 10
    },
});
