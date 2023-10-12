import React,{ Component } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

export default class KeyboardSpacer extends Component {
    constructor(){
        super();
    }

    static propTypes = {
        keyboardSpace: PropTypes.number
    };

    static defaultProps = {
        keyboardSpace: 0
    };

    render() {
        let {keyboardSpace} = this.props;
        return (
            <View style={[styles.container, { height: keyboardSpace }]} />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        left: 0,
        right: 0,
        bottom: 0
    }
});
