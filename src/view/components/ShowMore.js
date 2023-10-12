import React, { Component } from 'react'
import { View, Image } from 'react-native'

class ShowMore extends Component {
    static defaultProps = {
        visible: false,
        size: 40
    }

    render() {
        let { visible, size } = this.props
        return (
            visible
                ? <View style={{ alignItems: 'center' }}>
                    <Image style={{ width: size, height: size }} source={require('../images/loading-spinner.gif')} />
                </View>
                : null
        )
    }
}

export default ShowMore
