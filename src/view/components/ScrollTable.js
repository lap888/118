import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Animated, Easing, Dimensions } from "react-native";
import { Colors } from '../theme/Index';
const screenWidth = Dimensions.get("window").width;
const Metrics = Dimensions.get('window');

export default class ScrollTable extends Component {
    static propTypes = {
        initialIndex: PropTypes.number,
        labels: PropTypes.array,
        onChange: PropTypes.func,
        labelStyle: PropTypes.object,
        tintColor: PropTypes.string,
        style: PropTypes.object,
    }

    static defaultProps = {
        initialIndex: 0,
        labels: [{ key: 0, title: "精选" }, { key: 2, title: "热门" }],
        onChange: () => { },
        style: {},
        labelStyle: { color: "#FFFFFF", fontSize: 14 },
        tintColor: "#12cdb0",
    }
    constructor(props) {
        super(props);
        this.headerWidth = screenWidth * 0.5 * (props.labels.length / 2);
        this.headerHeight = 40;
        this.state = {
            index: props.initialIndex,
            translateX: new Animated.Value(props.initialIndex * this.headerWidth / props.labels.length),
            position: new Animated.Value(0),
        }
        this.clickHistory = [0]
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (this.clickHistory.indexOf(nextState.index) === -1) {
            // 点击记录
            this.clickHistory.push(nextState.index);
        }
        return true;
    }
    onHeaderClick(item, index) {
        if (this.state.index === index) return

        let diff = index - this.state.index;

        if (this.clickAnimated) this.clickAnimated.stop();
        this.clickAnimated =
            Animated.parallel([
                Animated.timing(this.state.translateX, {
                    toValue: this.state.translateX["_value"] + diff * this.headerWidth / this.props.labels.length,
                    duration: 200,
                    // easing: Easing.ease,
                    useNativeDriver: false,
                }),
                Animated.timing(this.state.position, {
                    toValue: -Metrics.width * (this.state.index + diff),
                    duration: 200,
                    isInteraction: true,
                    useNativeDriver: false
                })
            ],{useNativeDriver: false});

        this.clickAnimated.start(() => this.setState({ index }, () => this.props.onChange({ item, index })));
    }
    /**
     * 渲染Header
     */
    renderHeader() {
        const { labels, labelStyle, tintColor, style } = this.props;
        if (style.hasOwnProperty("width")) this.headerWidth = style["width"];
        if (style.hasOwnProperty("height")) this.headerHeight = style["height"];

        return (
            <View style={{ justifyContent: 'center', alignItems: 'center', ...style }}>
                <View style={{ width: this.headerWidth, height: this.headerHeight, borderRadius: this.headerHeight, marginTop: 12, marginBottom: 12, backgroundColor: Colors.C16 }}>
                    <Animated.View ref="chanelAnimated" style={[Styles.chanelAnimated, { width: this.headerWidth / labels.length, height: this.headerHeight, borderRadius: this.headerHeight, transform: [{ translateX: this.state.translateX }], useNativeDriver: false }]} />
                    <View style={[Styles.chanel, { width: this.headerWidth, height: this.headerHeight }]}>
                        {labels.map((item, index) => {
                            const checked = index === this.state.index
                            return (
                                <TouchableWithoutFeedback onPress={() => this.onHeaderClick(item, index)} key={item['key']}>
                                    <View style={Styles.chanelItem}>
                                        <Text style={[Styles.chanelTitle, labelStyle, checked && { color: tintColor }]}>{item['title']}</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            )
                        })}
                    </View>
                </View>
            </View>
        )
    }

    /**
     * 渲染列表内容
     */
    renderContent() {
        return (
            <Animated.View style={{
                flex: 1,
                flexDirection: 'row',
                width: Metrics.width * this.props.labels.length,
                transform: [{ translateX: this.state.position }],
                useNativeDriver: false
            }}
            >
                {React.Children.map(this.props.children, (child, index) => {
                    const props = {
                        ...child.props,
                    };
                    return this.clickHistory.indexOf(index) !== -1
                        ? <View {...props} style={{ flex: 1 }}>{React.cloneElement(child, props)}</View>
                        : <View style={{ flex: 1 }} />
                })}
            </Animated.View>
        );
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.renderHeader()}
                {this.renderContent()}
            </View>
        );
    }
}
const Styles = StyleSheet.create({
    chanel: { position: "absolute", flex: 1, flexDirection: 'row', alignItems: 'center' },
    chanelItem: { flex: 1, justifyContent: "center", alignItems: "center" },
    chanelAnimated: { backgroundColor: "#FFFFFF" }
});
