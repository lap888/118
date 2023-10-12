/*
 * @Author: top.brids 
 * @Date: 2019-12-30 09:22:25 
 * @Last Modified by: top.brids
 * @Last Modified time: 2019-12-30 09:23:11
 */

import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Colors } from '../theme/Index';

export default class ListGap extends PureComponent {

    static propTypes = {
        style: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.object
        ])
    };

    static defaultProps = {
        style: {}
    };

    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <View style={[{ height: 10, backgroundColor: Colors.C14, borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: Colors.C13 }, this.props.style]} />
        )
    }
}
