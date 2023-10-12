/*
 * @Author: top.brids 
 * @Date: 2019-12-23 09:42:34 
 * @Last Modified by: top.brids
 * @Last Modified time: 2021-09-02 00:56:13
 */

import React, { Component } from 'react';
import { Platform } from 'react-native';
import WebView from 'react-native-webview';
import { Metrics } from '../../theme/Index';
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
export default class TDetailContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            height: 0,
        };
    }
    /**
       * web端发送过来的交互消息
       */
    onMessage(event) {

        try {
            const action = JSON.parse(event.nativeEvent.data)
            console.log(action)
            if (action.type === 'setHeight' && action.height > 0) {
                this.setState({ height: action.height })
            }
        } catch (error) {
            console.log(error)
        }
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
                        }
                    });
                }
            }, 1000);
    }
    render() {
        let _html = `<!DOCTYPE html>
        <html>
        <meta name="viewport" content="width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
        <body>
        <p style="color:#0cb585;font-size:20px">${this.props.title == undefined ? '' : `标题：${this.props.title}`}</p>
        ${this.props.TDContent}
        <p style="color:blue">免责声明：以上文章仅代表作者个人观点，不代表本平台的投资建议和立场。本平台不会承担任何使用或者信赖文章信息引发的任何损失或者损害，望用户仔细甄别，防范风险。</p>
        <script>
        function ResizeImages(){
          var myimg;
          for(i=0;i <document.images.length;i++){
            myimg = document.images[i];
            myimg.width = ${Metrics.screenWidth - 20};
          }
        }
        window.onload=function(){ 
          ResizeImages()
          window.location.hash = '#' + document.body.clientHeight;
          document.title = document.body.clientHeight;
        }
        </script></body></html>`
        return (
            <WebView
                injectedJavaScript={BaseScript}
                style={{ width: Metrics.screenWidth, height: this.state.height }}
                automaticallyAdjustContentInsets={true}
                useWebKit={true}
                source={Platform.OS === 'android' ? { html: _html || '', baseUrl: "" } : { html: _html || '' }}
                decelerationRate='normal'
                scalesPageToFit={true}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                // onLoad={() => this.onLoad()}
                onMessage={this.onMessage.bind(this)}
            />
        );
    }
}
