import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
// import { Button, Toast } from 'native-base';
import { Colors } from '../../theme/Index';
import { Send } from '../../../utils/Http';
import { Toast } from '../../common';
import { upgrade } from "rn-app-upgrade";
class GameDetailFooter extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    H5Start = (refUrl, id) => {
        if (this.props.logged) {
            if (this.props.Data.sdwId == 0 || this.props.Data.sdwId == '') {
                Actions.H5({ gUrl: refUrl, id })
            } else {
                Send(`api/Game/GenAuthSdwUrl?sdwId=${this.props.Data.sdwId}`, {}, 'get').then(res => {
                    if (res.code == 200) {
                        console.log('res: ', res);
                        Actions.H5({ gUrl: res.data, id, ty: 'game', sdwId: this.props.Data.sdwId })
                    }
                });
            }
        } else {
            Toast.tipBottom('请您先登录')
            // Toast.show({
            //     text: '请您先登录',
            //     position: "top",
            //     textStyle: { textAlign: "center" },
            // });
            setTimeout(() => Actions.Login(), 1000);
        }
    }
    /* 显示安装或开始 */
    IStart() {
        let { id, gType, gPinyin, gTitle, gameLogoUrl, gH5Url } = this.props.Data;
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
                    <View style={styles.btn}>
                        <Text style={{ color: '#ffffff' }}>安装</Text>
                    </View>
                </TouchableOpacity>
            )
        } else {
            let refUrl = null;
            refUrl = gH5Url;
            return (
                <TouchableOpacity
                    onPress={() => {
                        this.H5Start(refUrl, id);
                    }}
                >
                    <View style={styles.btn}>
                        <Text style={{ color: '#ffffff' }}>开始</Text>
                    </View>
                </TouchableOpacity>
            )
        }
    }
    render() {
        return (
            <View style={styles.totalStyle}>
                <View style={styles.btnview}>
                    {this.IStart()}
                </View>
                {/* <View style={styles.navBtnStyle}>
                    <TouchableOpacity
                        onPress={() => {
                        }}
                    >
                        <Image
                            style={styles.imgSize}
                            source={require("../../images/sub_nav4.png")}
                        />
                        <Text style={styles.txt}>写点评</Text>
                    </TouchableOpacity>
                </View> */}
            </View>
        );
    }
}
const mapStateToProps = state => ({
    logged: state.user.logged,
    userId: state.user.id,
    nickname: state.user.name,
    uuid: state.user.uuid,
    avatar: state.user.avatarUrl
});

export default connect(mapStateToProps, {})(GameDetailFooter);

const styles = StyleSheet.create({
    totalStyle: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: "space-around",
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: 'lightgray'
    },
    navBtnStyle: {
        flexDirection: 'column',
    },
    imgSize: {
        width: 32,
        height: 32,
    },
    btnview: {
        width: 260,
    },
    btn: {
        backgroundColor: Colors.C6,
        justifyContent: 'center',
        alignItems: "center",
        height: 40,
        borderRadius: 15,
    },
    txt: {
        paddingTop: 3,
        fontSize: 11,
        color: '#4cc7ab'
    },
});