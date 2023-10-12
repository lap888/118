import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ImageBackground, AppState } from 'react-native';
import CurrencyApi from '../../../../api/yoyoTwo/currency/CurrencyApi';
import { CountDownReact } from '../../../components/Index';
import { Colors, Metrics } from '../../../theme/Index';
import Advert from '../../advert/Advert';

export default class MiningMachinery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            refransh: 0,
            isLoading: false,
            appState: AppState.currentState,
        };
    }

    componentDidMount() {
        this.updateJindu()
        AppState.addEventListener("change", this._handleAppStateChange);
    }
    componentWillUnmount() {
        AppState.removeEventListener("change", this._handleAppStateChange);
    }

    _handleAppStateChange = nextAppState => {
        if ( this.state.appState.match(/inactive|background/)) {
            // clearTimeout(this.timeout);
        }
        this.setState({ appState: nextAppState });
        // this.props.setLoading(false);
    };
    

    updateJindu = () => {
        this.timerInterval = setInterval(() => {
            this.setState({refransh: this.state.refransh++})
        }, 10000)
    }

    componentWillUnmount() {
        clearInterval(this.timerInterval)
    }

    getTimes = (startTime, endTime) => {
        if (startTime.length < 5 || endTime.length < 5) {
            return { now: (new Date()).getTime(), start: 0, end: 0, jishi: 0, jindu: 0 }
        }
        let strStart = startTime.replace(/\-/g, "/");
        let strEnd =  endTime.replace(/\-/g, "/");
        let time1 = strStart.replace(/\//g,':').replace(' ',':');
        let time2 = time1.split(':');
        var start = Date.parse(new Date(time2[0],(time2[1]-1),time2[2],time2[3],time2[4],time2[5]));
        let time3 = strEnd.replace(/\//g,':').replace(' ',':');
        let time4 = time3.split(':');
        var end = Date.parse(new Date(time4[0],(time4[1]-1),time4[2],time4[3],time4[4],time4[5]));
        // console.log('start: ', start);
        // console.log('end: ', end);

        let now = (new Date()).getTime();
        let jishi = end - start;
        let jindu = (now - start) / (end - start);
        // console.log('jindu: ', jindu);
        // console.log('jishi: ', jishi);
        return { now, start, end, jishi, jindu: jindu > 1 ? 1 : jindu }
    }

    doTask = (mid) => {
        if (this.state.isLoading) {
            return ;
        }
        this.props.setLoading(true);
        const callback = () => {
            CurrencyApi.doTask(mid)
            .then((data) => {
                // 修改本地任务时间，修改本地状态
                this.state.data.workingTime = data.startTime;
                this.state.data.workingEndTime = data.endTime;
                this.state.data.minningStatus = this.state.data.minningStatus == 1 ? 2 : 1;
                this.setState({
                    data: this.state.data,
                    isLoading: false,
                })
                this.props.setLoading(false);
            }).catch((err) => {this.setState({ isLoading: false }); this.props.setLoading(false);} )
        }
        this.setState({isLoading: true }, () => {
            if (Platform.OS == "android") {
                Advert.rewardVideo((res) => {
                    if (res) {
                        callback();
                    }else{
                        Toast.tip(res);
                    }
                })
            }else{
                this.timeout = setTimeout(()=>{
                    callback();
                }, 10000)
            }
        })
        
    }

    btnContent = () => {
        let { data } = this.state;
        if (data.status === 1) {
            if (data.minningStatus === 0) {
                return (
                    <TouchableOpacity style={styles.btnView} onPress={() => this.doTask(data.id)}>
                        <Text style={styles.btnTxt}>开始任务</Text>
                    </TouchableOpacity>
                )
            }else if (data.minningStatus === 1) {
                const { now, end } = this.getTimes(data.workingTime, data.workingEndTime);
                if (now > end) {
                    return (
                        <TouchableOpacity  style={styles.btnView} onPress={() => this.doTask(data.id)}>
                            <Text style={styles.btnTxt}>收取</Text>
                        </TouchableOpacity>
                    )
                }else{
                    return (
                        <View style={styles.btnView}>
                            <CountDownReact
                                date={end}
                                hours=':'
                                mins=':'
                                hoursStyle={styles.time}
                                minsStyle={styles.time}
                                secsStyle={styles.time}
                                firstColonStyle={styles.colon}
                                secondColonStyle={styles.colon}
                            />
                        </View>
                    )
                }
            }else if(data.minningStatus === 2){
                return (
                    <View style={styles.btnView}>
                        <Text style={styles.btnTxt}>已收取</Text>
                    </View>
                )
            }else{
                return (
                    <View style={styles.btnView}>
                        <Text style={styles.btnTxt}>未知</Text>
                    </View>
                )
            }
        }else if (data.status === 0) {
            return (
                <TouchableOpacity style={styles.btnView} onPress={() => this.props.repair(data.id)}>
                    <Text style={styles.btnTxt}>修复广告宝</Text>
                </TouchableOpacity>
            )
        }else {
            <View style={styles.btnView}>
                <Text style={{fontSize: 14, color: Colors.White}}>广告宝故障请联系客服</Text>
            </View>
        }
    }

    render() {
        const { data } = this.state;
        if (!data.minningName) {
            // 当广告宝为空时
            return (
                <View style={styles.itemView}>
                    <View style={{flexDirection: 'row', marginTop: 5}}>
                        <View style={styles.toptn}>
                            <Text style={styles.topText}>名称</Text>
                            <Text style={styles.topNum}>——</Text>
                        </View>
                        <View style={styles.toptn}>
                            <Text style={styles.topText}>算力</Text>
                            <Text style={styles.topNum}>——</Text>
                        </View>
                        <View style={styles.toptn}>
                            <Text style={styles.topText}>状态</Text>
                            <Text style={styles.topNum}>——</Text>
                        </View>
                    </View>
                    <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
                        <View style={{width: 170, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.main}}>
                        </View>
                    </View>
                    <View style={{marginLeft: 25, marginTop: 15}}>
                        <View style={styles.jidubg}/>
                    </View>
                </View>
            )
        }
        let { jindu } = this.getTimes(data.workingTime, data.workingEndTime);
        jindu = data.minningStatus === 2 ? 1 : jindu;
        let img = '';
        if (data.minningName.indexOf("试炼") != -1) {
            img = require('../../../images/kj/xinren.png')
        }
        if (data.minningName.indexOf("初级") != -1) {
            img = require('../../../images/kj/chuji.png')
        }
        if (data.minningName.indexOf("中级") != -1) {
            img = require('../../../images/kj/zhongji.png')
        }
        if (data.minningName.indexOf("进阶") != -1) {
            img = require('../../../images/kj/zhongjie.png')
        }
        if (data.minningName.indexOf("高级") != -1) {
            img = require('../../../images/kj/gaoji.png')
        }
        if (data.minningName.indexOf("精英") != -1) {
            img = require('../../../images/kj/gaojie.png')
        }
        if (data.minningName.indexOf("超级") != -1) {
            img = require('../../../images/kj/chaoji.png')
        }
        // switch (data.minningId) {
        //     case 0:
        //         img = require('../../../images/kj/xinren.png')
        //         break;
        //     case 2:
        //         img = require('../../../images/kj/chuji.png')
        //         break;
        //     case 3:
        //         img = require('../../../images/kj/zhongji.png')
        //         break;
        //     case 4:
        //         img = require('../../../images/kj/zhongjie.png')
        //         break;
        //     case 5:
        //         img = require('../../../images/kj/gaoji.png')
        //         break;
        //     case 6:
        //         img = require('../../../images/kj/gaojie.png')
        //         break;
        //     case 7:
        //         img = require('../../../images/kj/chaoji.png')
        //         break;
        //     default: break;
        // }
        return (
            <ImageBackground source={img} resizeMode='stretch' style={styles.itemView}>
                <View style={{paddingHorizontal: 10, justifyContent: 'center'}}>
                    <Text style={{fontSize: 10, color: Colors.White}}>时效: {String(data.beginTime).split(' ')[0]} ~ {String(data.endTime).split(' ')[0]}</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                    <View style={styles.toptn}>
                        <Text style={styles.topText}>名称</Text>
                        <Text style={styles.topNum}>{data.minningName}</Text>
                    </View>
                    <View style={styles.toptn}>
                        <Text style={styles.topText}>日释放</Text>
                        <Text style={styles.topNum}>{data.pow}</Text>
                    </View>
                    <View style={styles.toptn}>
                        <Text style={styles.topText}>状态</Text>
                        {data.minningStatus === 0 && <Text style={styles.topNum}>未开始</Text>}
                        {data.minningStatus === 1 && <Text style={styles.topNum}>进行中</Text>}
                        {data.minningStatus === 2 && <Text style={styles.topNum}>已收取</Text>}
                        {data.minningStatus != 0 && data.minningStatus != 1 && data.minningStatus != 2 && <Text style={styles.topNum}></Text>}
                    </View>
                </View>
                <View style={{justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{width: 150, height: 35, borderRadius: 17.5, borderWidth: 1, borderColor: Colors.White}}>
                        {this.btnContent()}
                    </View>
                </View>
                <View style={{marginLeft: 25, marginTop: 10}}>
                    <View style={styles.jidubg}/>
                    <View style={[styles.jidu, {backgroundColor: data.colors, width: (Metrics.screenWidth - 90) * jindu}]}/>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 10, marginTop: 5}}>
                    <Text style={{fontSize: 10, color: Colors.White}}>任务时间: 6:00 ~ 21:00</Text>
                    {/* <Text style={{fontSize: 10, color: Colors.White}}>收矿时间: 9:00 ~ 24:00</Text> */}
                </View>
            </ImageBackground>
        );
    }
}

// const mapStateToProps = state => ({
//     auditState: state.user.auditState,
// });

// const mapDispatchToProps = dispatch => ({
//     logout: () => dispatch({ type: LOGOUT }),
//     updateUserAvatar: avatar => dispatch({ type: UPDATE_USER_AVATAR, payload: { avatar } })
// });

// export default connect(mapStateToProps, mapDispatchToProps)(PlayScreen);

const styles = StyleSheet.create({
    itemView: {
        backgroundColor: Colors.main, 
        marginTop: 10, 
        paddingVertical: 10, 
        borderRadius: 5, 
        marginHorizontal: 20
    },
    toptn: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        paddingVertical: 5
    },
    topText: {
        color: Colors.White, 
        fontSize: 12
    },
    topNum: {
        color: Colors.White, 
        fontSize: 14,
        marginTop: Platform.OS == 'ios' ? 5 : 0,
    },
    jidubg: {
        width: Metrics.screenWidth - 90, 
        height: 6, 
        borderRadius: 3, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#EEEEEE'
    },
    jidu: {
        position: 'absolute', 
        height: 6, 
        borderRadius: 3, 
        backgroundColor: '#85C1F0'
    },
    btnView: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    btnTxt: {
        fontSize: 16, 
        color: Colors.White
    },
    //时间文字
    time: {
        // paddingHorizontal: 2,
        fontSize: 18,
        color: '#fff',
        marginHorizontal: 2,
        // borderRadius: 2,
    },
    //冒号
    colon: {
        fontSize: 17, color: '#fff'
    },
    tag: {
        position: 'absolute',
        height: 0,
        width: 0,
        right: 10,
        borderWidth: 8,
        borderBottomColor: Colors.White,
    },

})
