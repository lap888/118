/*
 * @Author: top.brids 
 * @Date: 2019-12-23 09:42:34 
 * @Last Modified by: top.brids
 * @Last Modified time: 2020-06-04 23:07:07
 */

import React, { Component } from 'react';
import { Platform, View } from 'react-native';
import WebView from 'react-native-webview';
import { Colors, Metrics } from '../../theme/Index';
import { Loading } from '../../components/Index';
// import { Toast } from 'native-base';
import { Send } from '../../../utils/Http';
import { Toast } from '../../common';
const BaseScript =
    `
    (function () {
        var height = null;
        function changeHeight() {
          if (document.body.scrollHeight != height) {
            height = document.body.scrollHeight;
            if (window.postMessage) {
              window.postMessage(JSON.stringify({
                type: 'setHeight',
                height: height,
              }))
            }
          }
        }
        setTimeout(changeHeight, 100);
    } ())
    `
export default class TDH5 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            height: 0,
        };
    }
    /**
    * 加载之前注入javascript命令
    */
    injectedJavaScript() {
        let script = `
        (function () {
            if (window.postMessage) {
                window.postMessage(JSON.stringify({
                    type: 'orientation',
                    data: window.orientation,
                }))
            }
        })
        `;
        return script;
    }

    /**
     * 加载完成之后注入javascript命令
     */
    injectJavaScript() {
        let script = `
        (function () {
            if (window.postMessage) {
                window.postMessage(JSON.stringify({
                    type: 'orientation',
                    data: window.orientation,
                }))
            }
        })
        `;
        if (this.refs.webview) this.refs.webview.injectJavaScript(script);
    }
    /**
     * WebView 加载成功
     */
    onLoad() {
        var that = this;
        if (this.setGameLoginTimeout) return;
        this.setGameLoginTimeout =
            setTimeout(function () {
                if (that.props.type == "Ad") {
                    Send(`api/LookAdGetCandyP?id=${that.props.bannerId}`, {}, 'get').then(res => {
                        if (res.code == 20001) {
                            Toast.tipBottom(res.message)
                            // Toast.show({
                            //     text: res.message,
                            //     textStyle: { color: '#FFFFFF', textAlign: 'center' },
                            //     position: "top",
                            //     duration: 10000
                            // });
                        }
                    });
                }
            }, 1000);
    }
    render() {
        let { gUrl } = this.props;
        return (
            <View style={{ flex: 1, backgroundColor: Colors.C8 }}>
                <WebView
                    injectedJavaScript={BaseScript}
                    startInLoadingState
                    geolocationEnabled={true}
                    useWebKit={true}
                    style={{ width: Metrics.screenWidth, height: this.state.height }}
                    automaticallyAdjustContentInsets={true}
                    source={Platform.OS === 'android' ? { uri: gUrl, baseUrl: "" } : { uri: gUrl }}
                    decelerationRate='normal'
                    renderLoading={() => <Loading mode="center" />}
                    scalesPageToFit={true}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    onLoad={() => this.onLoad()}
                />
            </View>
        );
    }
}
