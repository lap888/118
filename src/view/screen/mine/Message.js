import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Actions } from 'react-native-router-flux';
import { Header, ScrollTopArea } from '../../components/Index';
import { Colors, Metrics } from '../../theme/Index';
import SystemMessage from './SystemMessage';
import MyMessage from './MyMessage';

export default class Message extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectFlag: 0,
        };
    }
    headerView() {
        if (this.props.idx == 0) {
            return (
                <Header title="公告" />
            )
        }
        return (
            <Header title="公告" />
        )
    }
    /**
     * 渲染交易TopBar                        
     */
    renderTransaction() {
        return (
            <ScrollTopArea
                labelList={['系统', '我的']}
                initinalIndex={this.props.idx}
                topBarInactiveTextColor='#FFFFFF'
                topBarActiveTextColor="#FFFFFF"
                topBarActiveBackgroundColor={Colors.C6}
                topBarInactiveBackgroundColor="#666666"
                topBar="#666666"
                onChange={e => this.setState({ index: e })}
            >
                <SystemMessage isFocus={this.state.index === 0} />
                <MyMessage isFocus={this.state.index === 1} />
            </ScrollTopArea>
        )
    }
    /**
         * 渲染HeaderLeft
         */
    renderHeaderLeft() {
        return (
            <TouchableWithoutFeedback onPress={() => Actions.pop()}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 16, paddingRight: 16 }}>
                    <FontAwesome name='angle-left' size={30} color="#FFFFFF" />
                </View>
            </TouchableWithoutFeedback>
        )
    }
    /**
     * 渲染HeaderRight
     */
    renderHeaderRight() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', paddingLeft: 16, paddingRight: 16 }}></View>
        )
    }
    /**
     * 渲染HeaderTitle
     */
    renderHeaderTitle() {
        return (
            <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', borderWidth: 0.5, borderColor: Colors.White, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => this.setState({ selectFlag: 0 })} style={{ flex: 1, backgroundColor: this.state.selectFlag == 0 ? Colors.White : Colors.main, justifyContent: 'center', alignItems: 'center', borderBottomLeftRadius: 5, borderTopLeftRadius: 5 }}>
                        <Text style={{ padding: 5, color: this.state.selectFlag == 0 ? Colors.main : Colors.White }}>系统</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.setState({ selectFlag: 1 })} style={{ flex: 1, backgroundColor: this.state.selectFlag == 1 ? Colors.White : Colors.main, justifyContent: 'center', alignItems: 'center', borderBottomRightRadius: 5, borderTopRightRadius: 5 }}>
                        <Text style={{ padding: 5, color: this.state.selectFlag == 1 ? Colors.main : Colors.White }}>我的</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    render() {
        return (
            <View style={Styles.container}>
                <View style={{ paddingTop: Metrics.STATUSBAR_HEIGHT, height: Metrics.HEADER_HEIGHT, width: Metrics.screenWidth, backgroundColor: Colors.main, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    {this.renderHeaderLeft()}
                    {this.renderHeaderTitle()}
                    {this.renderHeaderRight()}
                </View>
                {this.state.selectFlag == 0 ? <SystemMessage isFocus={this.state.index === 0} /> : <MyMessage isFocus={this.state.index === 1} />}
            </View>
        );
    }
}
const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    }
});
