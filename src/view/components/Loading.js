import React, { Component } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import PropTypes from 'prop-types';

export default class Loading extends Component {
    static propTypes = {
        mode: PropTypes.string,
    }

    static defaultProps = {
        mode: 'top'
    }
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    getPositionStyle() {
        switch (this.props.mode) {
            case 'top':
                return { paddingTop: 40 };
            case 'center':
                return { justifyContent: 'center' };
            case 'bottom':
                return { justifyContent: 'flex-end', paddingBottom: 40 };
            default:
                return {};
        }
    }

    render() {
        return (
            <View style={[Styles.container, this.getPositionStyle()]}>
                <Image source={require('../images/loading-spinner.gif')} style={{ width: 40, height: 40 }} />
            </View>
        );
    }
}
const Styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF', alignItems: 'center' },
});