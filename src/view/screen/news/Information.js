import React, { Component } from 'react';
import { View, Text, Dimensions } from 'react-native';

import { Colors } from '../../theme/Index';

export default class Information extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: Colors.White}}>
                {/* <NewsPortal
                    appId="ba88b40c2c04cd5752"
                    style={{
                        width: Dimensions.get('window').width,
                        height: Dimensions.get('window').height,
                    }}
                /> */}
            </View>
        );
    }
}

// ba88b40c2c04cd5752 // 自己
// ba0063bfbc1a5ad878