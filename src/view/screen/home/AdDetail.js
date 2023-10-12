import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Animated, TouchableOpacity, Image, } from 'react-native';
import * as WeChat from 'react-native-wechat-lib';
import { Header, Loading } from '../../components/Index';
import { Colors, Metrics } from '../../theme/Index';
import TDetailContent from '../digg/TDetailContent';
import { connect } from 'react-redux'
import { Toast } from '../../common';
const OPTIONS = [
    { key: 0, name: "分享给好友", size: 42, imageUrl: require("../../images/icon64_appwx_logo.png") },
    { key: 1, name: "朋友圈", size: 56, imageUrl: require("../../images/icon_res_download_moments.png") },
];
class AdDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            info: null,
            title: '',
            isLoad: true,
            bottom: new Animated.Value(-156),
            opacity: new Animated.Value(0),
        };
    }
    UNSAFE_componentWillMount() {
        this.reloadTopicData();
    }

    reloadTopicData() {
        let that = this;
        that.setState({
            info: this.props.info,
            title: this.props.title,
            thumbImage: this.props.thumbImage,
            bannerId: this.props.bannerId,
            isLoad: false
        })
    }
    /**
	 * 渲染分享Board
	 */
    renderShareBoard() {
        return (
            <Animated.View style={[styles.shareContainer, { bottom: this.state.bottom, opacity: this.state.opacity }]}>
                <View style={styles.shareBody}>
                    {OPTIONS.map(item => {
                        let { key, name, size, imageUrl } = item;
                        return (
                            <TouchableOpacity key={key} onPress={() => this.wechatShare(key)}>
                                <View style={styles.shareItem}>
                                    <View style={styles.shareImage}>
                                        <Image source={imageUrl} style={{ width: size, height: size, borderRadius: size / 2 }} />
                                    </View>
                                    <Text style={styles.shareText}>{name}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </View>
                <TouchableOpacity style={{ position: 'absolute', bottom: 0, alignSelf: 'center' }} onPress={() => this.closeShareBoard()}>
                    <View style={styles.shareFooter}>
                        <Text style={styles.shareFooterText}>取消</Text>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        )
    }
    /**
	 * HeaderRight点击事件
	 */
    onRightPress() {
        if (this.props.ty === 7) {
            Toast.tip('此文章不支持分享');
            return;
        }
        Animated.parallel([
            Animated.timing(this.state.bottom, {
                toValue: 0,
                duration: 400,
                useNativeDriver: false
            }),
            Animated.timing(this.state.opacity, {
                toValue: 1,
                duration: 400,
                useNativeDriver: false
            }),
        ]).start();
    }
    /**
	 * 关闭分享Board
	 */
    closeShareBoard() {
        Animated.parallel([
            Animated.timing(this.state.bottom, {
                toValue: -156,
                duration: 400,
                useNativeDriver: false
            }),
            Animated.timing(this.state.opacity, {
                toValue: 0,
                duration: 400,
                useNativeDriver: false
            }),
        ]).start();
    }
    /**
      * 微信分享
      * @param {*} key 
      */
    wechatShare(key) {
        let pageUrl = `https://ad.yoyoba.cn/share/${this.state.bannerId}/${this.props.mobile}.html`;
        let message = {
            type: 'news',
            title: this.state.title,
            description: `${this.props.name}邀请您加入118创富助手!每天做任务领糖果,糖果当钱花!2021 118创富助手强势来袭 你准备好了吗?`,
            thumbImageUrl: this.state.thumbImage,
            webpageUrl: pageUrl,
            scene: key
        }
        // let message = {
        //     type: 'news',
        //     title: this.state.title,
        //     description: `${this.props.name}邀请您加入118创富助手!每天做任务领糖果,糖果当钱花!2021 118创富助手强势来袭 你准备好了吗?`,
        //     thumbImage: this.state.thumbImage,
        //     webpageUrl: pageUrl,
        // }
        // if (key === 0) {
        //     WeChat.shareToSession(message, (response) => {
        //         console.log(response);
        //     });
        // } else {
        //     WeChat.shareToTimeline(message, (response) => {
        //         console.log(response);
        //     });
        // }
        WeChat.shareWebpage(message)
    }
    dispalyLoading() {
        if (this.state.info === null) {
            return (
                <View style={{ alignItems: "center", marginTop: 20 }}>
                    <Text>暂无数据</Text>
                </View>
            )
        }
        if (this.state.isLoad) {
            return (
                <Loading />
            )
        } else {
            return (
                <View>
                    <Header title={this.props.title} rightIcon="share-alt" rightIconSize={20} onRightPress={() => this.onRightPress()} />
                    <View style={{ alignItems: "center", height: Metrics.screenHeight * 0.9 }}>
                        <TDetailContent TDContent={this.state.info} userId={this.props.userId} bannerId={this.state.bannerId} type="Ad" />
                    </View>
                </View>
            )
        }
    }
    render() {
        return (
            <View style={styles.container}>
                {this.dispalyLoading()}
                {this.renderShareBoard()}
            </View>
        );
    }
}
const mapStateToProps = state => ({
    userId: state.user.id,
    mobile: state.user.mobile,
    name: state.user.name
});
const mapDispatchToProps = dispatch => ({

})
export default connect(mapStateToProps, mapDispatchToProps)(AdDetail)
// 样式
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    shareContainer: { position: 'absolute', backgroundColor: Colors.C16, height: 156, left: 0, right: 0, borderTopLeftRadius: 10, borderTopRightRadius: 10 },
    shareHeader: { alignSelf: 'center', padding: 20, fontSize: 16, fontWeight: "400" },
    shareBody: { flexDirection: 'row', paddingTop: 20 },
    shareItem: { justifyContent: 'center', alignItems: 'center', paddingLeft: 20 },
    shareImage: { justifyContent: 'center', alignItems: 'center', width: 50, height: 50 },
    shareText: { marginTop: 6, color: Colors.White },
    shareFooter: { alignSelf: 'center', padding: 20 },
    shareFooterText: { fontSize: 16, fontWeight: "400", color: Colors.White },
})