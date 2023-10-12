import React, { Component } from 'react';
import { View, Text, TouchableWithoutFeedback, Animated, StyleSheet } from 'react-native';
import PropType from 'prop-types';
import { Colors, Metrics } from '../theme/Index';
import ListGap from './ListGap';
export default class ActionSheet extends Component {
    static propTypes = {
        options: PropType.array,
        destructiveButtonIndex: PropType.number,
        tintColor: PropType.string,
        isExpand: PropType.bool,
        onChange: PropType.func
    };

    static defaultProps = {
        options: [
            { key: '0', label: '标题', color: Colors.C11, onPress: () => { } },
            { key: '1', label: '取消', color: Colors.C11, onPress: () => { } },
        ],
        tintColor: 'red',
        isExpand: false,
    };
    constructor(props) {
        super(props);
        this.state = {
            translateY: new Animated.Value(0),
            opacity: new Animated.Value(0),
            isExpand: false
        };
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.isExpand !== this.props.isExpand) {
            this.expandActionSheet(nextProps.isExpand);
        }
    }
    /**
     * 展开、收起ActionSheet
     * @param {*} flag 
     */
    expandActionSheet(flag, callback) {
        Animated.parallel([
            Animated.timing(
                this.state.translateY,
                {
                    toValue: flag ? -(this.props.options.length * 54 + 11 + Metrics.PADDING_BOTTOM) : 0,
                    duration: 400,
                    useNativeDriver: false
                }
            ),
            Animated.timing(
                this.state.opacity,
                {
                    toValue: flag ? 0.6 : 0,
                    duration: 400,
                    useNativeDriver: false
                }
            ),
        ]).start(() => {
            this.props.onChange(flag);
            callback;
        });
    }
    /**
     * label 点击事件
     * @param {*} item 
     */
    onPress(item) {
        this.expandActionSheet(false, item.onPress());
    }
    render() {
        let { options, tintColor } = this.props;
        if (!this.props.hasOwnProperty('destructiveButtonIndex')) destructiveButtonIndex = options.length - 1;
        return (
            this.props.isExpand ?
                <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
                    <TouchableWithoutFeedback onPress={() => this.expandActionSheet(false)}>
                        <Animated.View style={{ height: Metrics.screenHeight, width: Metrics.screenWidth, backgroundColor: 'black', opacity: this.state.opacity, useNativeDriver: false }} />
                    </TouchableWithoutFeedback>
                    <Animated.View style={{ transform: [{ translateY: this.state.translateY }], backgroundColor: Colors.C8, paddingBottom: Metrics.PADDING_BOTTOM, useNativeDriver: false }}>
                        {options.map((item, index) => {
                            let { key, label, color, onPress } = item;
                            let isdestructiveButton = destructiveButtonIndex === index;
                            return (
                                <View key={key}>
                                    {isdestructiveButton && <ListGap />}
                                    <TouchableWithoutFeedback onPress={() => this.onPress(item)}>
                                        <View style={{ height: 54, backgroundColor: Colors.C8, justifyContent: 'center', alignItems: 'center', borderBottomWidth: StyleSheet.hairlineWidth, borderColor: Colors.C7 }}>
                                            <Text style={{ fontSize: 15, color: isdestructiveButton ? tintColor : Colors.C11 }}>{label}</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            )
                        })}
                    </Animated.View>
                </View>
                : <View />
        )
    }
}
