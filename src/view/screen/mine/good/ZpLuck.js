
import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    ImageBackground,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Colors, Metrics } from '../../../theme/Index';
import { Header } from '../../../components/Index';
import { Lottery, LotteryItem } from 'react-native-super-lottery';
import { Actions } from 'react-native-router-flux';
import { Send } from '../../../../utils/Http';
import { connect } from 'react-redux';
import Advert from '../../advert/Advert';
import { BannerAd } from 'react-native-mobad';


const img_width = 100;
const img_height = 80;


class GoodLuck extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            lotteryData: [],
        };
        this.lotteryRef = React.createRef();
        this.isLottering = false;
    }

    componentDidMount() {
        var that = this;
        Advert.interstitial()
        Send(`api/Coin/GetZpLuck`, {}, 'get')
            .then((res) => {
                that.setState({
                    loading: false,
                    lotteryData: res.data,
                });
            });
    }

    //  开始抽奖
    startLottery = () => {
        if (!this.isLottering) {
            this.lotteryRef.current.start();
            Send(`api/Trade/DoZpLuck`, {}, 'get')
                .then((res) => {
                    if (res.code == 200) {
                        this.stopLottery(parseInt(res.data));
                    } else {
                        Alert.alert(res.message);
                        this.stopLottery(5);
                    }
                }).catch((err) => {
                    Alert.alert(res.message);
                    this.stopLottery(5);
                });
        } else {
            Alert.alert("正在抽奖中，请稍后再试");
        }
    }

    // 结束转盘， index 中奖奖品在奖品列表中的位置
    stopLottery = (index) => {
        const { lotteryData } = this.state;
        this.lotteryRef.current.stop(index, (index) => {
            if (index == 5) {
                Alert.alert(`很遗憾，没有中奖，谢谢参与~`);
            } else {
                Alert.alert(`抽奖完毕，中奖奖品是 ${lotteryData[index].name}`);
            }
        });
    }

    renderItem = (item, index, highLightIndex) => {
        const { url } = item;
        if (index === 4) {
            return <LotteryItem url={url} key={index} type="lotteryBtn" index={index} width={img_width} height={img_height} lotteryPress={this.startLottery} />;
        } else if (index === highLightIndex) {
            return <LotteryItem url={url} key={index} type="highLight" index={index} width={img_width} height={img_height} />;
        } else {
            return <LotteryItem url={url} key={index} type="normal" index={index} width={img_width} height={img_height} />;
        }
    }
    onLeftPress() {
        Send(`api/system/CopyWriting?type=zpcj_rule`, {}, 'get').then(res => {
            Actions.push('CommonRules', { title: '规则', rules: res.data });
        });
    }
    render() {
        const { loading, lotteryData } = this.state;
        return (
            <View style={styles.container}>
                <Header rightText={'规则'} title="幸运大抽奖" onRightPress={() => { this.onLeftPress() }} />
                <ImageBackground style={[styles.container, { width: Metrics.screenWidth }]} source={require('../../../images/mine/luck/luck.png')}>
                    <ImageBackground style={styles.imageBg} source={require('../../../images/mine/luck/lottery_bg_1.png')}>
                        {
                            loading
                                ? <ActivityIndicator />
                                : (
                                    <Lottery
                                        ref={this.lotteryRef}
                                        data={lotteryData}
                                        renderItem={this.renderItem}
                                        defaultLucky={5}
                                    />
                                )
                        }
                    </ImageBackground>
                    <View style={{ flex: 1 }}>
                        {/* <Text style={{ color: Colors.White, marginTop: 80, }}>中实物奖品请联系客服，领取奖品~</Text> */}
                    </View>
                    <BannerAd
                        unitId="b1"
                        style={{ width: Metrics.screenWidth, height: 332 / 6.4 }}
                        onAdLoad={({ id }) => { }}
                        onAdShow={({ id }) => { }}
                        onAdClose={({ id }) => { }}
                        onAdClick={({ id }) => { }}
                        onError={({ id, code, message }) => { }}
                    />
                </ImageBackground>
            </View>
        );
    }
}

const mapStateToProps = state => ({
    logged: state.user.logged,
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(GoodLuck);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    paragraph: {
        margin: 24,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    imageBg: {
        marginTop: 260,
        height: 293,
        justifyContent: 'center',
        alignItems: 'center',
        width: 345,
    },
});