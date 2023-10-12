/*
 * @Author: top.brids 
 * @Date: 2020-01-08 17:42:48 
 * @Last Modified by: top.brids
 * @Last Modified time: 2020-01-08 18:26:27
 */

import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

export default class CountDownButton extends Component {
    static propTypes = {
        style: ViewPropTypes.style,
        textStyle: Text.propTypes.style,
        onClick: PropTypes.func,
        disableColor: PropTypes.string,
        timerTitle: PropTypes.string,
        enable: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
        timerEnd: PropTypes.func,
        timerActiveTitle: PropTypes.array
    };
    constructor(props) {
        super(props);
        this.state = {
            timerCount: this.props.timerCount || 60,
            timerTitle: this.props.timerTitle || '获取验证码',
            counting: false,
            selfEnable: true,
        };
    }
    componentWillUnmount() {
        clearInterval(this.interval)
    }

    shouldStartCountting = (shouldStart) => {
        if (this.state.counting) { return }
        if (shouldStart) {
            this.countDownAction()
            this.setState({ counting: true, selfEnable: false })
        } else {
            this.setState({ selfEnable: true })
        }
    }
    countDownAction() {
        const codeTime = this.state.timerCount;
        const { timerActiveTitle, timerTitle } = this.props
        const now = Date.now()
        const overTimeStamp = now + codeTime * 1000 + 100/*过期时间戳（毫秒） +100 毫秒容错*/
        this.interval = setInterval(() => {
            /* 切换到后台不受影响*/
            const nowStamp = Date.now()
            if (nowStamp >= overTimeStamp) {
                /* 倒计时结束*/
                this.interval && clearInterval(this.interval);
                this.setState({
                    timerCount: codeTime,
                    timerTitle: timerTitle || '获取验证码',
                    counting: false,
                    selfEnable: true
                })
                if (this.props.timerEnd) {
                    this.props.timerEnd()
                };
            } else {
                const leftTime = parseInt((overTimeStamp - nowStamp) / 1000, 10)
                let activeTitle = `重新获取(${leftTime}s)`
                if (timerActiveTitle) {
                    if (timerActiveTitle.length > 1) {
                        activeTitle = timerActiveTitle[0] + leftTime + timerActiveTitle[1]
                    } else if (timerActiveTitle.length > 0) {
                        activeTitle = timerActiveTitle[0] + leftTime
                    }
                }
                this.setState({
                    timerCount: leftTime,
                    timerTitle: activeTitle,
                })
            };
        }, 1000)
    }
    render() {
        const { style, textStyle, enable, disableColor } = this.props
        const { counting, timerTitle, selfEnable } = this.state
        return (
            <TouchableOpacity activeOpacity={counting ? 1 : 0.8} onPress={() => {
                if (!counting && enable && selfEnable) {
                    this.setState({ selfEnable: false })
                    this.props.onClick(this.shouldStartCountting)
                };
            }}>
                <View style={[{ width: 120, height: 44, justifyContent: 'center', alignItems: 'center', backgroundColor: ((!counting && enable && selfEnable) ? ('orange') : '#efefef'), borderRadius: 25 }, style]}>
                    <Text style={[{ fontSize: 16, fontWeight: 'bold' }, textStyle, { color: ((!counting && enable && selfEnable) ? (textStyle ? textStyle.color : 'blue') : disableColor || 'gray') }]}>{timerTitle}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}
