import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { Coin } from '../../../api';
import { Loading } from '../../common';
import { CountDownReact } from '../../components/Index';
import { Colors, Metrics } from '../../theme/Index';
import Advert from '../advert/Advert';

export default function MiningMachinery(props) {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         data: props.data,
    //         refransh: 0,
    //         isLoading: false
    //     };
    // }

    
    const [data, setData] = useState(props.data);
    const [refransh, setRefransh] = useState(0);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        // updateJindu()

    },[data, refransh, isLoading])

    useEffect(() => {
        let id = setInterval(() => {
            let r = refransh + 1;
            setRefransh(r)
            console.warn(r);
        }, 10000);
        return () => clearInterval(id);
    });
    
    
    // componentDidMount() {
    //     this.updateJindu()
    // }

    // componentWillUnmount() {
    //     clearInterval(this.timerInterval)
    // }

    updateJindu = () => {
        const timerInterval = setInterval(() => {
            // this.setState({refransh: this.state.refransh++})
            let r = refransh + 1;
            setRefransh(r)
        }, 10000)
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
        setRefransh(true);
        // this.setState({isLoading: true }, () => {
        Advert.rewardVideo()
        setTimeout(()=>{
            Coin.doTask(mid)
            .then((res) => {
                // 修改本地任务时间，修改本地状态
                // this.state.data.workingTime = res.startTime;
                // this.state.data.workingEndTime = res.endTime;
                // this.state.data.minningStatus = this.state.data.minningStatus == 1 ? 2 : 1;
                // this.setState({
                //     data: this.state.data,
                //     isLoading: false,
                // })
                data.workingTime = res.startTime;
                data.workingEndTime = res.endTime;
                data.minningStatus = data.minningStatus == 1 ? 2 : 1;
                setData(data);
                setIsLoading(false);
            }).catch((err) => setIsLoading(false) )
        }, 5000)
        // })
    }

    btnContent = () => {
        // const { data } = this.state;
        if (data.status === 1) {
            if (data.minningStatus === 0) {
                return (
                    <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} onPress={() => doTask(data.id)}>
                        <Text style={{fontSize: 16, color: Colors.White}}>开始挖矿</Text>
                    </TouchableOpacity>
                )
            }else if (data.minningStatus === 1) {
                const { now, end } = getTimes(data.workingTime, data.workingEndTime);
                if (now > end) {
                    return (
                        <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} onPress={() => doTask(data.id)}>
                            <Text style={{fontSize: 16, color: Colors.White}}>收取</Text>
                        </TouchableOpacity>
                    )
                }else{
                    return (
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
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
                    <Text style={{fontSize: 16, color: Colors.White}}>已收取</Text>
                )
            }else{
                return (
                    <Text style={{fontSize: 16, color: Colors.White}}>未知</Text>
                )
            }
        }else if (data.status === 0) {
            return (
                <TouchableOpacity  style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}  onPress={() => this.props.repair(data.id)}>
                    <Text style={{fontSize: 16, color: Colors.White}}>修复矿机</Text>
                </TouchableOpacity>
            )
        }else {
            <Text style={{fontSize: 14, color: Colors.White}}>矿机故障请联系客服</Text>
        }
    }

    // render() {
    // const { data, isLoading } = this.state;
    if (!data.minningName) {
        // 当矿机为空时
        return (
            <View style={{backgroundColor: Colors.White, marginTop: 10, height: 160, borderRadius: 5, marginHorizontal: 20 }}>
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
    let { jindu } = getTimes(data.workingTime, data.workingEndTime);
    jindu = data.minningStatus === 2 ? 1 : jindu; 
    return (
        <View style={{backgroundColor: Colors.White, marginTop: 10, height: 160, borderRadius: 5, marginHorizontal: 20 }}>
            <View style={{flexDirection: 'row', marginTop: 5}}>
                <View style={styles.toptn}>
                    <Text style={styles.topText}>名称</Text>
                    <Text style={styles.topNum}>{data.minningName}</Text>
                </View>
                <View style={styles.toptn}>
                    <Text style={styles.topText}>算力</Text>
                    <Text style={styles.topNum}>{data.pow}</Text>
                </View>
                <View style={styles.toptn}>
                    <Text style={styles.topText}>状态</Text>
                    {data.minningStatus === 0 && <Text style={styles.topNum}>未挖矿</Text>}
                    {data.minningStatus === 1 && <Text style={styles.topNum}>挖矿中</Text>}
                    {data.minningStatus === 2 && <Text style={styles.topNum}>已收取</Text>}
                    {data.minningStatus != 0 && data.minningStatus != 1 && data.minningStatus != 2 && <Text style={styles.topNum}></Text>}
                </View>
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
                <View style={{width: 170, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.main}}>
                    {btnContent()}
                </View>
            </View>
            <View style={{marginLeft: 25, marginTop: 15}}>
                <View style={styles.jidubg}/>
                <View style={[styles.jidu, {width: (Metrics.screenWidth - 90) * jindu}]}/>
            </View>
            {isLoading ? <Loading style={{width: Metrics.screenWidth - 40}}/> : null}
        </View>
    );
    // }
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
    toptn: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        paddingVertical: 10
    },
    topText: {
        color: Colors.greyText, 
        fontSize: 13
    },
    topNum: {
        color: Colors.blakText, 
        fontSize: 15
    },
    jidubg: {
        width: Metrics.screenWidth - 90, 
        height: 15, 
        borderRadius: 20, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#EEEEEE'
    },
    jidu: {
        position: 'absolute', 
        height: 15, 
        borderRadius: 20, 
        backgroundColor: '#85C1F0'
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
})
