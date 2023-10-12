/*
 * @Author: top.brids 
 * @Date: 2020-01-03 11:45:51 
 * @Last Modified by: top.brids
 * @Last Modified time: 2021-10-14 19:29:48
 */

import React, { PureComponent } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, NativeModules, Platform } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { Colors } from '../theme/Index';
import { Send } from '../../utils/Http';
import { Toast } from '../common';
import { upgrade } from "rn-app-upgrade";
// import { Button, Toast } from 'native-base';
class GameListItem extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    H5Start = (refUrl, id, sdwId) => {
        if (this.props.logged) {
            if (sdwId == 0 || sdwId == '') {
                Actions.H5({ gUrl: refUrl, id })
            } else {
                Send(`api/Game/GenAuthSdwUrl?sdwId=${sdwId}`, {}, 'get').then(res => {
                    if (res.code == 200) {
                        Actions.H5({ gUrl: res.data, id, ty: 'game', sdwId: sdwId })
                    }
                });
            }
        } else {
            Toast.tipBottom('请您先登录');
            setTimeout(() => Actions.Login(), 1000);
        }
    }
    /**
     * 检查跳转
     * @param {*} item
     */
    checkLink(item) {
        Actions.GameDetail({ info: item });
    }
    /**
     * 渲染折扣信息
     * @param {*} discount 
     */
    renderDiscountView(discount) {
        if (discount) {
            <View style={styles.prompt}>
                <View style={styles.arrow} />
                <View style={styles.promptTxt}>
                    <Text style={styles.discount}>{discount}折 </Text>
                </View>
            </View>
        }
        return <View />
    }
    /**
     * 渲染软件大小和类别
     * @param {*} item 
     */
    renderSizeCategory(item) {
        let { gSize, categoryName } = item;

        let sizeGategoty = [];
        if (gSize) {
            sizeGategoty.push(
                <Text key="gSize" style={styles.promptStyle}>{`${gSize}MB  `}</Text>
            )
        }
        if (categoryName) {
            sizeGategoty.push(
                <Text key="categoryName" style={styles.promptStyle}>{`${categoryName}  `}</Text>
            )
        }
        if (sizeGategoty.length > 0) {
            return (
                <View style={styles.promptSC}>
                    {sizeGategoty}
                </View>

            )
        }
        return <View />;
    }
    /**
     * 显示安装或开始 
     * @param {*} item 
     */
    IStart(item) {
        let { id, gType, gH5Url, sdwId } = item;
        if (gType === 'App') {
            return (
                <TouchableOpacity
                    onPress={() => {
                        if (Platform.OS === 'ios') {
                            // ipa.itms_install(global.RUBY_API_PATH + "games/plist/" + g_pinyin)
                        } else {
                            Toast.tipBottom('正在下载请稍后...');
                            upgrade(gH5Url);
                        }

                    }}
                >
                    <View style={styles.installBtn}>
                        <Text style={styles.istalBtnTxt}>安装</Text>
                    </View>
                </TouchableOpacity>
            )
        } else {
            // 传值(将用户ID、电话、十位时间戳和渠道)
            // let tem = Date.parse(new Date()).toString().substr(0, 10);
            let refUrl = null;
            // if (game_supplier_id == 6) {
            //     refUrl = "https://dyz.basicworld.cn/gamechannel/gamelogin.html?timestamp=" + tem + "&channel_id=" + 3 + "&sign=" + md5.hex_md5("basicword" + this.props.userId + this.props.uuid + tem + 3) + "&game_id=" + g_h5_url + "?channel_id=3"
            // } else {
            //     refUrl = g_h5_url;
            // }
            refUrl = gH5Url;
            return (
                <TouchableOpacity
                    onPress={() => {
                        this.H5Start(refUrl, id, sdwId)
                    }}
                >
                    <View style={styles.installBtn}>
                        <Text style={styles.istalBtnTxt}>开始</Text>
                    </View>
                </TouchableOpacity>
            )
        }
    }
    /**
     * 渲染标签
     * @param {*} refs 
     */
    renderGameTag(refs) {
        let { gtProportionl, gtVIP, useGem, useGemRate } = refs;
        let tags = [];

        if (gtProportionl) {
            tags.push(
                <Text key="gtProportion" style={styles.promptStyleTwo}>{gtProportionl}</Text>
            )
        }

        if (gtVIP) {
            tags.push(
                <Text key="gtVIP" style={styles.promptStyleOne}>{gtVIP}</Text>
            )
        }

        if (useGem && useGemRate) {
            tags.push(
                <Text key="useGem" style={[styles.promptStyleOne, { borderColor: '#4cc7ab', color: "#4cc7ab" }]}>{`抵扣${useGemRate * 100}%`}</Text>
            )
        }

        if (tags.length > 0) {
            return (
                <View style={styles.promptTag}>
                    {tags}
                </View>
            )
        }
        return <View />
    }
    render() {
        let { item, index } = this.props;
        return (
            <TouchableOpacity style={styles.cardItemStyle} onPress={() => { this.checkLink(item) }}>
                <View style={styles.subViewStyle}>
                    <View style={styles.imagestyle}>
                        <Image source={{ uri: item['gameLogoUrl'] }} style={styles.imagestyle} />
                    </View>
                    <View style={styles.itemStyle}>
                        <View style={styles.prompt}>
                            <Text style={styles.leftTextStyle}>{item['gTitle']}</Text>
                            {this.renderDiscountView(item['discount'])}
                        </View>
                        {this.renderSizeCategory(item)}
                        {this.renderGameTag(item)}
                    </View>
                </View>
                {this.IStart(item)}
            </TouchableOpacity>
        );
    }
}
const mapStateToProps = state => ({
    logged: state.user.logged
});

export default connect(mapStateToProps, {})(GameListItem);

const styles = StyleSheet.create({
    listItemStyle: {
        flex: 1
    },
    imagestyle: {
        width: 60,
        height: 60,
        borderRadius: 10,
    },
    installBtn: {
        borderRadius: 6,
        padding: 12,
        paddingLeft: 14,
        paddingRight: 14,
        backgroundColor: Colors.C6
    },
    istalBtnTxt: {
        color: '#FFFFFF',
        fontSize: 12,
    },
    cardItemStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'lightgray',
        marginLeft: 14,
        paddingRight: 14,
        paddingTop: 14,
        paddingBottom: 14
    },
    subViewStyle: {
        flexDirection: 'row',
    },
    itemStyle: {
        flexDirection: 'column',
        marginRight: 10,
    },
    prompt: {
        flexDirection: "row",
        paddingLeft: 10,
    },
    promptSC: {
        flexDirection: "row",
        paddingLeft: 10,
        paddingTop: 10,
        alignItems: 'center'
    },
    promptTag: {
        flexDirection: "row",
        paddingLeft: 5,
        paddingTop: 10,
    },
    arrow: {
        borderWidth: 10,
        borderColor: "red",
        borderLeftColor: "transparent",
        borderRightColor: "red",
        borderBottomColor: "transparent",
        borderTopColor: "transparent",
    },
    promptTxt: {
        borderWidth: 1,
        borderColor: 'red',
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        backgroundColor: "red"
    },
    discount: {
        padding: 3,
        fontSize: 12,
        color: 'white',
    },
    promptStyle: {
        fontSize: 12,
        color: 'gray'
    },
    promptStyleOne: {
        fontSize: 10,
        marginLeft: 5,
        borderWidth: 1,
        borderColor: Colors.main,
        padding: 2,
        borderRadius: 5,
        color: Colors.main,
    },
    promptStyleTwo: {
        fontSize: 10,
        marginLeft: 5,
        borderWidth: 1,
        borderColor: '#25CDFF',
        padding: 2,
        borderRadius: 5,
        color: '#25CDFF',
    },
    messageStyle: {
        width: 20,
        height: 20,
        margin: 2
    },
    leftTextStyle: {
        fontSize: 16,
    },
    rightTextStyle: {
        fontSize: 12,
        color: "blue",
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    footer: {
        padding: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerTxt: {
        color: '#999999',
        fontSize: 14,
        marginTop: 5,
        marginBottom: 5,
    },
    footerMore: {
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    FMImg: {
        width: 40,
        height: 40,
    },
    img: {
        height: '100%',
        width: '100%',
        borderRadius: 5,
    },
    cardItemForGraph: {
        height: 180,
        margin: 5,
        flexDirection: "row",
        overflow: "hidden"
    }
});