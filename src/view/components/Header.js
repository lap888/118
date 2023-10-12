import React, { Component } from 'react';
import { View, Text, TouchableWithoutFeedback, Dimensions, StyleSheet, StatusBar, Platform } from 'react-native';
import * as PropTypes from 'prop-types';
import Icon from "react-native-vector-icons/FontAwesome";
import { Actions } from 'react-native-router-flux';
import * as Metrics from '../theme/Metrics';
import * as Colors from '../theme/Colors';
const window = Dimensions.get("window");

export default class Header extends Component {

    static propTypes = {
        title: PropTypes.string,                // Header标题
        titleStyle: PropTypes.oneOfType([       // Header标题样式
            PropTypes.number,
            PropTypes.object
        ]),

        leftIcon: PropTypes.string,             // HeaderLeft图标
        leftIconSize: PropTypes.number,         // HeaderLeft图标大小
        leftText: PropTypes.string,             // HeaderLeft文字
        onLeftPress: PropTypes.func,            // HeaderLeft点击事件
        leftStyle: PropTypes.oneOfType([        // HeaderLeft样式
            PropTypes.number,
            PropTypes.object
        ]),

        rightIcon: PropTypes.string,            // HeaderRight图标
        rightIconSize: PropTypes.number,        // HeaderRight图标大小
        rightText: PropTypes.string,            // HeaderRight文字
        onRightPress: PropTypes.func,           // HeaderRight点击事件
        rightStyle: PropTypes.oneOfType([       // HeaderRight样式
            PropTypes.number,
            PropTypes.object
        ]),

        style: PropTypes.oneOfType([            // HeaderRight样式
            PropTypes.number,
            PropTypes.object
        ]),

        statusBarBackgroundColor: PropTypes.string,     // StatusBar背景色
        backgroundColor: PropTypes.string,

        isTabBar: PropTypes.bool,               // 是否为Tab界面
    };
    static defaultProps = {
        title: "",
        titleStyle: {},

        leftIcon: "angle-left",
        leftIconSize: 30,
        leftText: "",
        leftStyle: {},
        onLeftPress: () => Actions.pop(),

        rightIcon: "",
        rightIconSize: 30,
        rightText: "",
        rightStyle: {},
        onRightPress: () => { },

        style: {},
        statusBarBackgroundColor: Colors.main,
        backgroundColor: Colors.main,

        isTabBar: false
    };
    
    /**
     * HeaderLeft点击事件
     */
    onLeftPress() {
        if (!this.props.isTabBar) {
            this.props.onLeftPress();
        }
    }

    /**
     * 渲染HeaderLeft
     */
    renderHeaderLeft() {
        let { leftIcon, leftText, leftIconSize, leftStyle, onLeftPress, isTabBar } = this.props;
        return (
            <TouchableWithoutFeedback onPress={() => this.onLeftPress()}>
                <View style={Styles.leftContainer}>
                    {!isTabBar ?
                        (leftText ?
                            <Text style={[Styles.leftStyle, leftStyle]}>{leftText}</Text>
                            :
                            <Icon name={leftIcon} size={leftIconSize} color="#FFFFFF" />
                        )
                        : <View />
                    }
                </View>
            </TouchableWithoutFeedback>
        )
    }

    /**
     * 渲染HeaderTitle
     */
    renderHeaderTitle() {
        let { title, titleStyle } = this.props;
        return (
            <View style={Styles.titleContainer}>
                <Text style={[Styles.titleStyle, titleStyle]}>{title}</Text>
            </View>
        )
    }

    /**
     * 渲染HeaderRight
     */
    renderHeaderRight() {
        let { rightIcon, rightIconSize, rightText, rightStyle, onRightPress } = this.props;
        return (
            <TouchableWithoutFeedback onPress={() => onRightPress()}>
                <View style={Styles.rightContainer}>
                    {rightText ?
                        <Text style={[Styles.rightStyle, rightStyle]}>{rightText}</Text>
                        :
                        (rightIcon ?
                            <Icon name={rightIcon} size={rightIconSize} color="#FFFFFF" />
                            :
                            <View />
                        )
                    }
                </View>
            </TouchableWithoutFeedback>
        )
    }

    /**
     * 渲染StatusBar
     */
    renderStatusBar() {
        return (
            <StatusBar translucent={false} backgroundColor={this.props.statusBarBackgroundColor} barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} />
        )
    }

    render() {
        return (
            <View style={[{ paddingTop: Metrics.STATUSBAR_HEIGHT, height: Metrics.HEADER_HEIGHT, width: Metrics.screenWidth, backgroundColor: Colors.main, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }, { backgroundColor: this.props.backgroundColor }]}>
                {this.renderStatusBar()}
                {this.renderHeaderLeft()}
                {this.renderHeaderTitle()}
                {this.renderHeaderRight()}
            </View>
        );
    }
}
const Styles = StyleSheet.create({
    // container: { paddingTop: Metrics.STATUSBAR_HEIGHT, height: Metrics.HEADER_HEIGHT, width: Metrics.screenWidth, backgroundColor: Colors.main, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    titleContainer: { flex: 4, justifyContent: 'center', alignItems: 'center' },
    titleStyle: { fontSize: 18, color: '#FFFFFF', fontWeight: 'normal' },
    leftContainer: { flex: 1, justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 16, paddingRight: 16 },
    leftStyle: { fontSize: 16, color: '#FFFFFF', fontWeight: 'normal' },
    rightContainer: { flex: 1, justifyContent: 'center', alignItems: 'flex-end', paddingLeft: 16, paddingRight: 16 },
    rightStyle: { fontSize: 16, color: '#FFFFFF', fontWeight: 'normal' },
});
