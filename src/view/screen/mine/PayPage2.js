import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, NativeModules, Platform } from 'react-native';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Actions } from 'react-native-router-flux';
// import { Toast } from 'native-base';
// import Alipay from '@uiw/react-native-alipay';

import { SetPay, SetPay2 } from '../../../redux/ActionTypes';
import { connect } from 'react-redux';
import { Header } from '../../components/Index';
import { Colors, Metrics } from '../../theme/Index';
import { Send } from '../../../utils/Http';
import { Toast } from '../../common';
import OtherApi from '../../../api/OtherApi';

// const AliPay = NativeModules.AliPayModule;
// const AlipayIos = NativeModules.Alipay;

class PayPage2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    authInfo = async () => {
        await OtherApi.getCreateAuthUrl()
        .then((authInfoStr) => {
            console.log('authInfoStr', authInfoStr);
            // return Alipay.authInfo(authInfoStr)
        })
        .then((result) => {
            if (result.resultStatus == '9000') {
                const objList = result.result.split('&');
                for (let i = 0; i < objList.length; i++) {
                    const obj = objList[i];
                    if (obj.split('=')[0] === 'user_id') {
                        console.log('obj: ', obj);
                    }
                }
            }
            return OtherApi.pushAuthCode(result)
        })
        .then((data) => {
            console.log('data', data);
        }).catch((err) => console.log('err', err))
        // 支付宝端授权验证
        // authInfoStr 是后台拼接好的验证参数
        // const authInfoStr = 'apiname=com.alipay.account.auth&method=alipay.open.auth.sdk.code.get&app_id=2019121960042180&app_name=mc&biz_type=openservice&pid=2088731091412796&product_id=APP_FAST_LOGIN&scope=kuaijie&target_id=10001&auth_type=AUTHACCOUNT&sign_type=RSA2&sign=VYKu6zlwj%2BM6GY1Dhv%2BJJcOH9PvMVG93Yk0mcxhIYLubRDmViPY34X1QZLhD4d8sA6nyLguzukTeuRZE0pErlateSlT%2BP16N6iMlV1yZV38b%2BVe4I8buVpao37EyOLTKJzSopDEmM%2ByeE0tRG8Cj7l6EucluNgUoBEEbSg22Y12rWtnpz%2BaEtGdeWgfT9Ulwz5xyi4mFTiRgtgZrFQ%2BBsEISmgwOMUzAEBw5pjY8DogUp7gL3u4H4bEgOEBvADsgK4Xzq3LNBR21ornlfHOrhKeYS8XHDnwx%2B1VOps%2B9Uar0eV%2BGs3uPZEMLmxjBtuP%2BYyDynCIVyPIKyXJkFDphfw%3D%3D';
        // const resule = await Alipay.authInfo(authInfoStr);
        // // resule => success=true&auth_code=9c11732de44f4f1790b63978b6fbOX53&result_code=200&alipay_open_id=20881001757376426161095132517425&user_id=2088003646494707
        // console.log('authInfo:resule-->>>', resule);
    }


    // aliPay() {
    //     Send('api/UserAli/Auth', {}, 'get').then(res => {
    //         console.log('res: ', res);
    //         if (res.code == 200) {
    //             //生成订单
    //             let orderStr = res.data;
    //             if (Platform.OS == "ios") {
    //                 AlipayIos.pay(orderStr).then((response) => {
    //                     let { resultStatus, memo } = response;
    //                     if (resultStatus == "9000") {
    //                         this.props.setPay2();
    //                         //接口更新数据
    //                         Actions.pop();
    //                     } else {
    //                         Toast.show({
    //                             text: memo,
    //                             position: "top",
    //                             textStyle: { textAlign: "center" },
    //                         });
    //                     }
    //                 });
    //             } else {
    //                 AliPay.payV2(orderStr, (response) => {
    //                     let { resultStatus, memo } = JSON.parse(response);
    //                     if (resultStatus == "9000") {
    //                         this.props.setPay2();
    //                         //接口更新数据
    //                         Actions.pop();
    //                     } else {
    //                         Toast.show({
    //                             text: memo,
    //                             position: "top",
    //                             textStyle: { textAlign: "center" },
    //                         });
    //                     }
    //                 });
    //             }
    //         } else {
    //             Toast.show({
    //                 text: res.message,
    //                 position: "top",
    //                 textStyle: { textAlign: "center" },
    //             });
    //         }
    //     })
    // }

    render() {
        return (
            <View style={{ backgroundColor: Colors.White, flex: 1 }}>
                <Header title="二次认证" />
                <View style={{ alignItems: 'center' }}>
                    <View style={{ marginTop: 60, marginBottom: 40, alignItems: 'center' }}>
                        <FontAwesome name="credit-card" color={Colors.C6} size={80} />
                        <Text style={{ color: Colors.C6, fontWeight: 'bold', marginTop: 20, fontSize: 20 }}>二次认证</Text>
                        <Text style={{ color: Colors.C6, marginTop: 10, fontSize: 18 }}>需要支付0.1元认证费</Text>
                    </View>
                    <TouchableOpacity
                        style={{ borderRadius: 25, borderColor: Colors.Alipay, borderWidth: 1, height: 50, width: Metrics.screenWidth * 0.7, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
                        onPress={() => {
                            // this.aliPay();
                            this.authInfo()
                        }}
                    >
                        <Image style={{ width: 32, height: 32 }} source={require('../../images/profile/biao.png')} />
                        <Text style={{ fontSize: 18, marginLeft: 20 }}>支付宝支付</Text>
                    </TouchableOpacity>
                    <Text style={{ marginLeft: 20, marginTop: 40, marginTop: 15, fontSize: 14, color: Colors.C16 }}>{`二次认证须知：
\t\t第一：自愿原则
\t\t第二：因平台需要付款到您的支付宝进行秒付款。所以支付宝需要进行实名和支付宝账号进行验证，所以需要二次认证
\t\t第三：二次认证后可以出售散糖给平台
\t\t第四：哟帮可以接现金任务`}</Text>
                </View>
            </View>
        );
    }
}
const mapStateToProps = state => ({
    name: state.user.name,
});
const mapDispatchToProps = disPatch => ({
    setPay2: () => disPatch({ type: SetPay2 })
});
export default connect(mapStateToProps, mapDispatchToProps)(PayPage2);
