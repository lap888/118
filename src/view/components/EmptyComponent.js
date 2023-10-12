/*
 * @Author: top.brids 
 * @Date: 2019-12-20 17:56:50 
 * @Last Modified by: top.brids
 * @Last Modified time: 2019-12-22 22:07:12
 */

import React, { Component } from 'react';
import { View, Text } from 'react-native';
import * as PropTypes from 'prop-types';
import { Colors } from '../theme/Index';
import Loading from './Loading';

export default class EmptyComponent extends Component {
    static propTypes = {
        title: PropTypes.string,
        titleStyle: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.object
        ]),
        style: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.object
        ]),
        isLoading: PropTypes.bool,
    };

    static defaultProps = {
        title: "暂无数据",
        titleStyle: {},
        style: {},
        isLoading: false,
    };
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        let { title, titleStyle, style, isLoading } = this.props;
        return (
            isLoading ? <Loading /> :
                <View style={[{ alignItems: "center", backgroundColor: '#FFFFFF', marginTop: 20 }, style]}>
                    <Text style={[{ fontSize: 15, color: Colors.C2 }, titleStyle]}>{title}</Text>
                </View>
        )
    }
}
