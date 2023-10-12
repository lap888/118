/*
 * @Author: top.brids 
 * @Date: 2019-12-20 18:45:15 
 * @Last Modified by: top.brids
 * @Last Modified time: 2019-12-20 18:49:37
 */

import React, { Component } from 'react';
import { View, Text, StyleSheet, Animated, TouchableWithoutFeedback, InteractionManager, Dimensions } from 'react-native';
import * as PropTypes from 'prop-types';

const Metrics = Dimensions.get('window');
const ITEM_GRAP = 10;				// 图片之间的grap
const ANIMATED_DURATION = 500;		// 动画duration
let UNDERLINE_WIDTH = 60;			// 下划线宽度

class ScrollArea extends Component {
    static propTypes = {
        initinalIndex: PropTypes.number,
        labelList: PropTypes.array,
        topBarInactiveTextColor: PropTypes.string,
        topBarActiveTextColor: PropTypes.string,
        topBarBackgroundColor: PropTypes.string,
        onChange: PropTypes.func,
        ListHeaderComponent: PropTypes.element,
        ListTopBarComponent: PropTypes.element
    };

    static defaultProps = {
        initinalIndex: 0,
        labelList: ['推荐'],
        topBarInactiveTextColor: '#aab9ca',
        topBarActiveTextColor: '#298eff',
        topBarBackgroundColor: '#FFFFFF',
        topBarActiveBackgroundColor: '#54657e',
        topBarInactiveBackgroundColor: '#54657e',
        onChange: () => { },
        ListHeaderComponent: <View />,
        ListTopBarComponent: <View />
    }

    constructor(props) {
        super(props);
        this.state = {
            index: props.initinalIndex,
            position: new Animated.Value(0),
            topBar: new Animated.Value(0),
            underline: new Animated.Value(ITEM_GRAP),
        };
        this.rootTag = null;
        this.topBarContentWidth = 0;
        this.touchMove = { pageX: -1, pageY: -1 };		// 记录内容区手势
        this.clickHistory = [props.initinalIndex];
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.initTopBar(this.state.index);
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.clickHistory.indexOf(nextState.index) === -1) {
            // 点击记录
            this.clickHistory.push(nextState.index);
        }
        return true;
    }

	/**
	 * moveX 	自上次反馈之后的x坐标移动
	 * x0	 	滑动手势识别开始的时候的在屏幕中的坐标
	 * dx		累计滑动距离
	 * vx		滑动距离
	 * Content 手势停止，开启动画
	 * @param {*} gestureState
	 */
    onPanResponderRelease(gestureState) {
        // console.log(gestureState)
        // 降低界面滑动敏感度
        if (Math.abs(gestureState.dx) < 60 || Math.abs(gestureState.dy) > 20) return;
        if (gestureState.dx < 0) {
            // 往左滑动,渲染右侧界面
            if (this.state.index < (this.props.labelList.length - 1)) {

                this.refs[`topBar${this.state.index + 1}`].measureLayout(this.rootTag, (left, top, width, height) => {
                    // console.log('left=' + left + ',top=' + top + ',width' + width + ',height' + height)
                    Animated.parallel([
                        Animated.timing(this.state.position, {
                            toValue: -Metrics.width * (this.state.index + 1),
                            duration: ANIMATED_DURATION,
                            isInteraction: true,
                            useNativeDriver: false
                        }),
                        Animated.timing(this.state.underline, {
                            toValue: left + (width - UNDERLINE_WIDTH) / 2,
                            duration: ANIMATED_DURATION,
                            isInteraction: true,
                            useNativeDriver: false
                        }),
                    ], {useNativeDriver: false}).start(() => {
                        this.setState({ index: ++this.state.index }, () => {
                            if (this.state.index < this.props.labelList.length - 1) this.checkTopBarPosition('forward');
                            this.props.onChange(this.state.index);
                        });
                    });
                });

            }
        } else {
            // 往右滑动,渲染左侧界面
            if (this.state.index <= 0) return;

            this.refs[`topBar${this.state.index - 1}`].measureLayout(this.rootTag, (left, top, width, height) => {
                // console.log('left=' + left + ',top=' + top + ',width' + width + ',height' + height)
                Animated.parallel([
                    Animated.timing(this.state.position, {
                        toValue: -Metrics.width * (this.state.index - 1),
                        duration: ANIMATED_DURATION,
                        isInteraction: true,
                        useNativeDriver: false
                    }),
                    Animated.timing(this.state.underline, {
                        toValue: left + (width - UNDERLINE_WIDTH) / 2,
                        duration: ANIMATED_DURATION,
                        isInteraction: true,
                        useNativeDriver: false
                    }),
                ], {useNativeDriver: false}).start(() => {
                    this.setState({ index: --this.state.index }, () => {
                        if (this.state.index > 0) this.checkTopBarPosition('back');
                        this.props.onChange(this.state.index);
                    });
                });

            });
        }
    }

	/**
	 * 内容区手势捕捉
	 * @param {*} key
	 * @param {*} value
	 */
    onTouchMove(key, nativeEvent) {
        if (key === 'start') {
            this.touchMove = { pageX: nativeEvent.pageX, pageY: nativeEvent.pageY };
        } else if (key === 'end') {
            const { pageX, pageY } = this.touchMove;
            this.onPanResponderRelease({ dx: nativeEvent.pageX - pageX, dy: nativeEvent.pageY - pageY });
        }
    }


	/**
	 * 初始化TopBar
	 * @param {*} index
	 */
    initTopBar(index) {
        // 获取
        if (this.state.index === 0 && index === 0) {
            return;
        }

        this.props.onChange(index);

        if (index > this.state.index) {
            // 往左滑动,渲染右侧界面
            if (this.state.index < (this.props.labelList.length - 1)) {
                this.refs[`topBar${index}`].measureLayout(this.rootTag, (left, top, width, height) => {
                    this.setState({ position: new Animated.Value(-Metrics.width * index), underline: new Animated.Value(left + (width - UNDERLINE_WIDTH) / 2) }, () => {
                        this.setState({ index }, () => {
                            this.checkTopBarPosition('forward');
                        });
                    })
                });
            }
        } else {
            // 往右滑动,渲染左侧界面
            if (this.state.index > 0) {
                this.refs[`topBar${index}`].measureLayout(this.rootTag, (left, top, width, height) => {
                    // console.log('left=' + left + ',top=' + top + ',width' + width + ',height' + height);
                    this.setState({ position: new Animated.Value(-Metrics.width * index), underline: new Animated.Value(left + (width - UNDERLINE_WIDTH) / 2) }, () => {
                        this.setState({ index }, () => {
                            this.checkTopBarPosition('back');
                        });
                    });
                })

            }
        }
    }

	/**
	 * 切换TopBar
	 * @param {*} index
	 */
    switchTopBar(index) {
        // 获取
        if (this.state.index === 0 && index === 0) {
            return;
        }

        this.props.onChange(index);

        if (index > this.state.index) {
            // 往左滑动,渲染右侧界面
            if (this.state.index < (this.props.labelList.length - 1)) {
                this.refs[`topBar${index}`].measureLayout(this.rootTag, (left, top, width, height) => {
                    Animated.parallel([
                        Animated.timing(this.state.position, {
                            toValue: -Metrics.width * index,
                            duration: ANIMATED_DURATION,
                            isInteraction: true,
                            useNativeDriver: false
                        }),
                        Animated.timing(this.state.underline, {
                            toValue: left + (width - UNDERLINE_WIDTH) / 2,
                            duration: ANIMATED_DURATION,
                            isInteraction: true,
                            useNativeDriver: false
                        }),
                    ], {useNativeDriver: false}).start(() => {
                        this.setState({ index }, () => {
                            this.checkTopBarPosition('forward');
                        });
                    });
                });
            }
        } else {
            // 往右滑动,渲染左侧界面
            if (this.state.index > 0) {
                this.refs[`topBar${index}`].measureLayout(this.rootTag, (left, top, width, height) => {
                    // console.log('left=' + left + ',top=' + top + ',width' + width + ',height' + height);
                    Animated.parallel([
                        Animated.timing(this.state.position, {
                            toValue: -Metrics.width * index,
                            duration: ANIMATED_DURATION,
                            isInteraction: true,
                            useNativeDriver: false
                        }),
                        Animated.timing(this.state.underline, {
                            toValue: left + (width - UNDERLINE_WIDTH) / 2,
                            duration: ANIMATED_DURATION,
                            isInteraction: true,
                            useNativeDriver: false
                        }),
                    ],{useNativeDriver: false}).start(() => {
                        this.setState({ index }, () => {
                            this.checkTopBarPosition('back');
                        });
                    });
                })

            }
        }
    }

	/**
	 * 判断下一个TopBar下次滑动是否可视
	 */
    checkTopBarPosition(flag) {
        // 是否探明TopBar边界
        if (!this.topBarContentWidth) {
            this.refs[`topBar${this.props.labelList.length - 1}`].measureLayout(this.rootTag, (left, top, width, height) => {
                // console.log('left=' + left + ',top=' + top + ',width' + width + ',height' + height);
                this.topBarContentWidth = width + left;
                this.checkTopBarPosition(flag);
            });
            return;
        }

        // 如果topBar区域小于界面宽度，放弃边界检查
        if (this.topBarContentWidth <= Metrics.width) return;

        // 左边界情况处理
        // 右边界情况处理

        if (flag === 'forward' && this.state.index < (this.props.labelList.length - 1)) {

            this.refs[`topBar${this.state.index + 1}`].measureLayout(this.rootTag, (left, top, width, height) => {
                this.refs[`topBar${this.state.index + 1}`].measure((x, y, width, height, pageX, pageY) => {
                    if (pageX + width > Metrics.width) {
                        let translateX = left + Metrics.width / 2 - pageX;
                        // 判断下次滑动是否触底
                        if (this.topBarContentWidth && translateX > (this.topBarContentWidth - Metrics.width)) translateX = this.topBarContentWidth - Metrics.width;
                        // this.scrollview.scrollTo({ x: translateX, animated: true })
                    }
                })
            });
        } else if (flag === 'back' && this.state.index > 0) {

            this.refs[`topBar${this.state.index - 1}`].measureLayout(this.rootTag, (left, top, width, height) => {
                this.refs[`topBar${this.state.index - 1}`].measure((x, y, width, height, pageX, pageY) => {
                    if (pageX < 0) {
                        let translateX = left - Metrics.width / 2 - pageX;
                        // 判断下次滑动是否触底
                        if (translateX < 0) translateX = 0;
                        // this.scrollview.scrollTo({ x: translateX, animated: true })
                    }
                });
            });
        }
    }

	/**
     * 渲染TopBar
     */
    renderTopBar() {
        let { topBarActiveBackgroundColor, topBarInactiveBackgroundColor, topBarActiveTextColor, topBarInactiveTextColor } = this.props;
        return (
            <View style={{ backgroundColor: this.props.topBarBackgroundColor, padding: 10, paddingLeft: 15, paddingRight: 15, width: Metrics.width / 2 }}>
                <View style={{ flexDirection: 'row', aliginItems: 'center', borderWidth: StyleSheet.hairlineWidth, borderColor: '#FFFFFF', borderRadius: 8, overflow: 'hidden' }}>
                    {this.props.labelList.map((item, index) => {
                        const check = this.state.index === index;
                        const title = typeof item === 'object' ? item.title : item;
                        const isLeft = index === 0;
                        return (
                            <TouchableWithoutFeedback key={index} onPress={() => this.switchTopBar(index)} key={index}>
                                <View
                                    ref={`topBar${index}`}
                                    collapsable={false}
                                    style={{
                                        flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 12, paddingBottom: 12, borderLeftWidth: isLeft ? 0 : StyleSheet.hairlineWidth, borderColor: '#FFFFFF', backgroundColor: check ? topBarActiveBackgroundColor : topBarInactiveBackgroundColor,
                                    }}
                                >
                                    <Text style={{ color: check ? topBarActiveTextColor : topBarInactiveTextColor }}>{title}</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        );
                    })}
                </View>
            </View>
        );
    }

	/**
	 * 渲染列表内容
	 */
    renderContent() {
        return (
            <Animated.View style={{
                flex: 1,
                flexDirection: 'row',
                width: Metrics.width * this.props.labelList.length,
                transform: [{ translateX: this.state.position }],
            }}
            >
                {React.Children.map(this.props.children, (child, index) => {
                    const props = {
                        ...child.props,
                        onTouchStart: e => this.onTouchMove('start', e.nativeEvent),
                        onTouchEnd: e => this.onTouchMove('end', e.nativeEvent),
                    };
                    return this.clickHistory.indexOf(index) !== -1
                        ? <View {...props} style={{ flex: 1, backgroundColor: '#FFFFFF' }}>{React.cloneElement(child, props)}</View>
                        : <View style={{ flex: 1, backgroundColor: '#FFFFFF' }} />
                })}
            </Animated.View>
        );
    }

    render() {
        return (
            <View style={Styles.container} onLayout={e => this.rootTag = e.nativeEvent.target}>
                {this.props.ListTopBarComponent}
                <View style={{alignItems:'center'}}>
                    {this.renderTopBar()}
                </View>
                {this.props.ListHeaderComponent}
                {this.renderContent()}
            </View>
        );
    }
}

const Styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
});

export default ScrollArea;