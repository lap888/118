import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';
import { Metrics, Colors } from '../theme/Index';

function peopleNumber(numberP) {
    let temAry = [];
    if (numberP.length < 9) {
        for (let i = 0; i < numberP.length; i++) {
            temAry.push(numberP[i])
        }
    } else {
        let letter = "超过1万";
        for (let i = 0; i < letter.length; i++) {
            temAry.push(letter[i])
        }
    }

    return (
        temAry.map((item, index) =>
            <View style={Styles.countNum} key={index}>
                <Text style={Styles.countNumTxt} >{item}</Text>
            </View>
        )
    )
}
function displayDiscount(discount) {
    if (discount != null) {
        return (
            <View style={{ flexDirection: "row", marginTop: 5 }}>
                <View style={Styles.arrow} />
                <View style={Styles.account}>
                    <Text style={Styles.accountTxt}>
                        {discount} 折
                    </Text>
                </View>
            </View>
        )
    } else {
        return (
            <View></View>
        )
    }
}
export default class TodayAn extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        let props = this.props;
        return (
            props.children.hasOwnProperty('id') ?
                <LinearGradient colors={[Colors.LightG, Colors.C6]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={Styles.totalConduct}>
                    <View style={Styles.cdtPrompt}>
                        <Text style={Styles.cdtTxt}>今日推荐</Text>
                    </View>
                    <View style={Styles.cdtHostCnt}>
                        <TouchableOpacity onPress={() => Actions.GameDetail({ info: props.children })}>
                            <View style={Styles.cdtCntTitle}>
                                <View style={{ flexDirection: "column" }}>
                                    <Text style={Styles.cdtCntTitletxt} numberOfLines={1}>
                                        {props.children['gTitle'] || ''}
                                    </Text>
                                    <Text style={Styles.desc} numberOfLines={2}>
                                        {props.children['synopsis'] || ''}
                                    </Text>
                                </View>
                                <View style={Styles.imgView}>
                                    <Image
                                        source={{ uri: props.children['gameLogoUrl'] || '' }}
                                        style={Styles.gameImg}
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>
                        <View style={Styles.count}>
                            {peopleNumber((1000000000).toString())}
                            <Text style={Styles.pnTxt}>人正在试玩</Text>
                        </View>
                    </View>
                </LinearGradient>
                :
                <View />
        );
    }
}
const Styles = StyleSheet.create({
    totalConduct: {
        marginTop: 5,
        backgroundColor: Colors.LightG,
        paddingBottom: 20,
        paddingTop: 5,
        opacity: 0.8,
        marginLeft: 5,
        marginRight: 5,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20
    },
    cdtPrompt: {
        height: 25,
        width: 100,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        backgroundColor: Colors.C6,
        justifyContent: "center",
        marginLeft: 5,
        marginBottom: 5,
        zIndex: 2,
    },
    cdtTxt: {
        textAlign: "center",
        color: "#ffffff",
        fontSize: 14,
    },
    cdtHostCnt: {
        alignItems: "center",
        zIndex: 1,
    },
    cdtContent: {
        borderRadius: 10,
        width: Metrics.screenWidth - 20,
        backgroundColor: "#ffffff",
        padding: 20,
        paddingBottom: 10,
        shadowRadius: 10,
        shadowColor: "lightgray",
        shadowOpacity: 1,
        elevation: 4,
        shadowOffset: {
            height: 5,
            width: 1
        },
        zIndex: 1,
    },
    cdtCntTitle: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    cdtCntTitletxt: {
        fontSize: 18,
        width: 120,
        height: 20,
    },
    arrow: {
        borderWidth: 10,
        borderColor: Colors.C16,
        borderTopColor: "transparent",
        borderBottomColor: "transparent",
        borderRightColor: Colors.C16,
    },
    account: {
        backgroundColor: Colors.C16,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
    },
    accountTxt: {
        padding: 3,
        fontSize: 12,
        color: 'white',
    },
    desc: {
        fontSize: 12,
        color: "gray",
        marginTop: 10,
        marginBottom: 10,
        width: 200,
    },
    count: {
        flexDirection: "row",
    },
    pnTxt: {
        fontSize: 12,
        color: Colors.White,
        marginTop: 10,
        marginLeft: 10,
    },
    countNum: {
        backgroundColor: Colors.main,
        marginRight: 3,
        borderRadius: 5,
    },
    countNumTxt: {
        color: "#ffffff",
        padding: 5,
        fontSize: 14,
        fontWeight: 'bold'
    },
    imgView: {

    },
    gameImg: {
        width: 88,
        height: 88,
    },
    cdtSroll: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#EEEEEE",
        padding: 5,
        borderRadius: 20,
        marginHorizontal: 5,
    },
    scrollCdtImg: {
        height: 20,
        width: 20,
    },
    sdts: {
        width: 250,
        fontSize: 12,
        color: "gray",
        marginLeft: 5,
    },
});