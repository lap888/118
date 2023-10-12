import React, { Component } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Dimensions, ImageBackground } from 'react-native';
const { width, height } = Dimensions.get('window');
import { Header } from '../../components/Index';
import { Colors, Metrics } from '../../theme/Index';
import { Actions } from 'react-native-router-flux';
import Advert from '../advert/Advert';
import { Send } from '../../../utils/Http';
export default class DaJin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            animatin: true
        };
    }

    componentWillUnmount() {
        this.setState({ animatin: false });
    }
    onRightPress() {
        Send(`api/system/CopyWriting?type=dajins_rule`, {}, 'get').then(res => {
            Actions.push('CommonRules', { title: '规则', rules: res.data });
        });
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <Header title={'打金赚GC'} isTabBar={true} onRightPress={() => this.onRightPress({})} rightText="规则" />
                <ImageBackground style={{ width: Metrics.screenWidth, height: Metrics.screenHeight, justifyContent: 'center', alignItems: 'center' }} source={require('../../images/yuanyuzhou.png')}>
                    <View style={{ flex: 4, justifyContent: 'center' }}>
                        <View style={{ flex: 3, justifyContent: 'center', marginTop: 10 }}>
                            <Text style={{ fontSize: 28, color: Colors.White, fontWeight: 'bold' }}>链  游 风  口...</Text>
                            <Text style={{ fontSize: 28, color: Colors.White, fontWeight: 'bold', marginLeft: 30, marginTop: 20 }}>...游  戏  打  金</Text>
                        </View>
                        {/* <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center',marginTop: -50}}>
                            <Text style={{ fontSize: 18, color: Colors.White, fontWeight: 'bold' }}>来</Text>
                            <Text style={{ fontSize: 18, color: Colors.White, fontWeight: 'bold', marginTop: 5 }}>链</Text>
                            <Text style={{ fontSize: 18, color: Colors.White, fontWeight: 'bold', marginTop: 5 }}>游</Text>
                            <Text style={{ fontSize: 18, color: Colors.White, fontWeight: 'bold', marginTop: 5 }}>之</Text>
                            <Text style={{ fontSize: 18, color: Colors.White, fontWeight: 'bold', marginTop: 5 }}>家</Text>
                        </View> */}
                    </View>
                    <View style={{ flex: 1.6 }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: Colors.inviterText, padding: 10, borderRadius: 5, backgroundColor: Colors.main, opacity: 0.7 }}>
                            <Text onPress={() => {
                                Advert.jumpAdList(this.props.userId)
                            }} style={{ fontSize: 30, color: Colors.White, fontWeight: 'bold' }}>开启打金之旅</Text>
                        </View>
                    </View>

                </ImageBackground>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    fa: {
        flex: 1,
        width: width,
        height: height,
        backgroundColor: 'rgba(0, 0, 0, 0)',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    smallbg: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: 5,
    },
})
