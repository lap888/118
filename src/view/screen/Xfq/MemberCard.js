import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import CurrencyApi from '../../../api/yoyoTwo/currency/CurrencyApi';
import { Toast } from '../../common';
import { BigButton, Header } from '../../components/Index';
import { Colors, Metrics } from '../../theme/Index';

class MemberCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            merber: '',
            memberType: 0,
        };
    }

    componentDidMount() {
        this.getMember()
    }

    getMember =  () => {
        CurrencyApi.findIsMerber()
        .then((data) => {
            this.setState({merber: data})
        }).catch((err) => console.log('err', err))
    }

    exchangeMerber =  (payType) => {
        Alert.alert("兑换提示",
            `兑换不同的会员将会对应扣除您的YB或现金`,
            [
                {
                    text: "确定", onPress: () => {
                        CurrencyApi.exchangeMerber(this.state.memberType, payType)
                            .then((data) => {
                                Toast.tip('兑换成功');
                                this.getMember();
                            }).catch((err) => console.log('err', err))
                    }
                },
                { text: "取消", onPress: () => { } },
            ],
            { onDismiss: () => { } }
        )
    }

    render() {
        const { memberType, merber } = this.state;
        return (
            <View style={{flex: 1, backgroundColor: Colors.backgroundColor}}>
                <Header title={'成为会员'} />
                <ScrollView style={{flex: 1 }}>
                    <View style={{height: 90, marginHorizontal: 15, borderRadius: 5, marginTop: 20, backgroundColor: Colors.White, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10}}>
                        <Image style={{width: 60, borderRadius: 30, height: 60 }} source={{uri: this.props.avatarUrl}}/>
                        <View style={{marginLeft: 10}}>
                            <Text style={{fontSize: 14, color: Colors.fontColor}}>{this.props.name}</Text>
                            <Text style={{fontSize: 12, color: Colors.fontColor, marginTop: 5}}>{merber.endTime !== '' ? `到期时间：${merber.endTime}` : '您还不是会员'}</Text>
                        </View>
                    </View>
                    <View style={{height: 150, justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                        <LinearGradient style={{ height: (Metrics.screenWidth-60)/2, width: Metrics.screenWidth-60, borderRadius: 5, padding: 10 }} colors={['#000000', Colors.LightG]} start={{ x: 0, y: 0 }} end={{ x: 1.5, y: 0 }} >
                            <Text style={{fontSize: 20, color: Colors.White}}>会员卡</Text>
                            <View style={{flex: 1}} />
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={{fontSize: 14, color: Colors.White}}>特权</Text>
                                <Text style={{fontSize: 12, color: Colors.White, marginLeft: 10}}>1.一键收取</Text>
                                <Text style={{fontSize: 12, color: Colors.White, marginLeft: 10}}>2.无需等待“零”秒收取</Text>
                            </View>
                        </LinearGradient>
                    </View>
                    <View style={{paddingHorizontal: 15, backgroundColor: Colors.White, marginTop: 10}}>
                        <Text style={{marginVertical: 10}}>开通会员</Text>
                        <TouchableOpacity style={styles.item} onPress={() => this.setState({memberType: 0})}>
                            <Text style={{fontSize: 14, color: Colors.fontColor, flex: 1}}>月卡</Text>
                            <View style={{alignItems: 'flex-end'}}>
                                <Text style={{fontSize: 12}}>YB<Text style={{color: Colors.main}}>10 + 50</Text>能量值 / 月</Text>
                                <Text style={{fontSize: 12}}>或 ￥<Text style={{color: Colors.main}}>20</Text> / 月</Text>
                            </View>
                            <View style={{marginLeft: 15, height: 30, justifyContent: 'center'}}>
                                {memberType === 0 ? <Icon name={'checkbox'} size={15} color={Colors.main}/> : <Icon name={'md-square-outline'} size={15} color={Colors.grayFont}/>}
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.item} onPress={() => this.setState({memberType: 1})}>
                            <Text style={{fontSize: 14, color: Colors.fontColor, flex: 1}}>年卡</Text>
                            <View style={{alignItems: 'flex-end'}}>
                                <Text style={{fontSize: 12}}>YB<Text style={{color: Colors.main}}>100 + 500</Text>能量值 / 年</Text>
                                <Text style={{fontSize: 12}}>或 ￥<Text style={{color: Colors.main}}>200</Text> / 年</Text>
                            </View>
                            <View style={{marginLeft: 15, height: 30, justifyContent: 'center'}}>
                                {memberType === 1 ? <Icon name={'checkbox'} size={15} color={Colors.main}/> : <Icon name={'md-square-outline'} size={15} color={Colors.grayFont}/>}
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <BigButton style={{marginTop: 30}} name={'现金开通'} onPress={() => this.exchangeMerber(1)}/>
                        {/* <BigButton style={{marginTop: 30}} name={'糖果开通'} onPress={() => this.exchangeMerber(0)}/> */}
                        <BigButton style={{marginTop: 30}} name={'YB开通'} onPress={() => this.exchangeMerber(2)}/>
                    </View>
                    <View style={{height: 30}}/>
                </ScrollView>
            </View>
        );
    }
}

const mapStateToProps = state => ({
    name: state.user.name,
    avatarUrl: state.user.avatarUrl,

});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(MemberCard);
const styles = StyleSheet.create({
    item: { paddingVertical: 5, flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.White, borderTopWidth: 1, borderTopColor: Colors.backgroundColor },
})