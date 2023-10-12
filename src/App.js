import React, { Component } from 'react';
import { Platform } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import * as WeChat from 'react-native-wechat-lib';
import { RootSiblingParent } from 'react-native-root-siblings';
import Cookie from 'cross-cookie';
import { init } from "react-native-amap-geolocation";

import CreateStore from './redux/CreateStore';
import Routers from './Routers';
import Advert from './view/screen/advert/Advert';

console.reportErrorsAsExceptions = false;
class App extends Component {

    componentDidMount() {
        // 微信分享注册
        WeChat.registerApp('wx7b42c1ef46624de5','https://d.yoyoba.cn');

        init({
			ios: "0e41e0d97f0577a2e501e82a5b1895da",
			android: "e3860f856a89dbaba8be22ce78c69370"
        });
        
        if (Platform.OS === 'android') {
            const callback = (res) => {
                if (res) {
                    Advert.showSplash()
                }
            }
            Advert.init(callback)
            Advert.initDyAd()
            Cookie.get('userId')
            .then(value => {
                if (value) {
                    Advert.setUserId(`s9${value}`)
                }
            })
        } 
    }
    render() {
        let { store, persistor } = CreateStore();
        return (
            <Provider store={store}>
                <PersistGate persistor={persistor}>
                    <RootSiblingParent>
                        <Routers />
                    </RootSiblingParent>
                </PersistGate>
            </Provider>
        );
    }
}
export default App;