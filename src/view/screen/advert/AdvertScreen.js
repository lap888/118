import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Advert from './Advert';

export default class AdvertScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {       
        const callback = (params) => {
            Actions.pop();
        }
        Advert.rewardVideo(callback)
    }

    render() {
        return (
            <View/>
        );
    }
}
