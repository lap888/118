/*
 * @Author: top.brids 
 * @Date: 2020-01-10 22:19:36 
 * @Last Modified by: top.brids
 * @Last Modified time: 2020-04-18 02:13:35
 */


import React from 'react';
import { View, Image, Text, FlatList, Modal, TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';
import { Colors, Metrics } from '../theme/Index';

export default class PicturePreview extends React.Component {

    static propTypes = {
        data: PropTypes.array,
        visible: PropTypes.bool,
        onClose: PropTypes.func
    }

    static defaultProps = {
        data: [],
        visible: false,
        onClose: () => { }
    }

    constructor(props) {
        super(props);
        this.state = {
            visible: props.visible && props.data.length > 0
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.visible !== this.props.visible) {
            if (nextProps.data.length !== 0) this.setState({ visible: nextProps.visible });
        }
    }


    closeModal() {
        this.setState({ visible: false }, () => {
            this.props.onClose();
        })
    }

    /**
     * 渲染图片浏览器组件Item
     */
    renderItem(item) {
        return (
            <TouchableWithoutFeedback onPress={() => this.closeModal()}>
                <View style={{ flex: 1, width: Metrics.screenWidth, height: Metrics.screenHeight, backgroundColor: 'black' }}>
                    {item.hasOwnProperty('uri') ?
                        <Image resizeMode="contain" style={{ flex: 1 }} source={{ uri: item['uri'] }} />
                        :
                        <Image resizeMode="contain" style={{ width: Metrics.screenWidth, height: Metrics.screenHeight }} source={item} />
                    }
                    <View style={{ transform: [{ rotateZ: '45deg' }] }}>
                        <Text allowFontScaling={false} style={{ fontSize: 16, color: Colors.C6 }}>118创富助手专属</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }

    render() {
        return (
            <Modal visible={this.state.visible} transparent animationType='slide' onRequestClose={() => { }}>
                <View style={{ flex: 1, backgroundColor: 'transparent' }}>
                    <FlatList
                        data={this.props.data}
                        horizontal
                        getItemLayout={(data, index) => ({ length: Metrics.screenWidth, offset: Metrics.screenWidth * index, index })}
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item, index }) => this.renderItem(item)}
                        keyExtractor={(item, index) => String(index)}
                    />
                </View>
            </Modal>
        )
    }
}