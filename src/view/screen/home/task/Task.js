/*
 * @Author: top.brids 
 * @Date: 2019-12-22 17:01:07 
 * @Last Modified by: top.brids
 * @Last Modified time: 2021-09-30 21:06:06
 */

import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Header, ScrollTopBar } from '../../../components/Index';
import { Colors } from '../../../theme/Index';
import MyTask from './MyTask';
import TaskHistory from './TaskHistory';
import TaskList from './TaskList';
import Home2Screen from '../../home2/Home2Screen'
class Task extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0
        };
    }
    renderHeader() {
        return (
            <Header title="任务商店" />
        )
    }
    renderScrollTab() {
        return (
            <ScrollTopBar
                topBarUnderlineStyle={{ backgroundColor: Colors.C6, width: 40, height: 3, borderRadius: 3 }}				                                                    // 下划线样式
                labelList={['我的任务', '任务商店', '过期任务']}			// 标题栏素材
                topBarInactiveTextColor='#666666'		                                              // label 文字非选中颜色
                topBarActiveTextColor={Colors.C6}	                                                // label 文字选中颜色
                topBarBackgroundColor="#FFFFFF"	                                                // 背景颜色
                onChange={e => this.setState({ index: e })}
            >
                <MyTask isFocus={this.state.index === 0} />
                <TaskList isFocus={this.state.index === 1} />
                <TaskHistory isFocus={this.state.index === 2} />
            </ScrollTopBar>
        )
    }
    render() {
        return (
            <View style={Styles.container}>
                {this.renderHeader()}
                {this.renderScrollTab()}
            </View>
        );
    }
}
export default Task;

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    }
});