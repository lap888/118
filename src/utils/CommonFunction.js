import { Linking } from "react-native";
import { Actions } from "react-native-router-flux";
import { upgrade } from "rn-app-upgrade";
import Cookie from 'cross-cookie';
import Advert from '../view//screen/advert/Advert';
import { Toast } from "../view/common";

// 轮播点击事件
/**
 * 
 * @param {*} item 
 * @param {*} mobile 
 * @param {*} userId 
 */
export const onPressSwiper = (item, mobile = '', userId = '') => {
    if (item.type == 1) {
        let params = JSON.parse(item.params);
        Linking.openURL(params.url)
    } else if (item.type == 2) {
        let params = JSON.parse(item.params)
        Toast.tipBottom('正在下载...');
        upgrade(params.url);
    } else if (item.type == 3) {
        let params = JSON.parse(item.params);
        Actions.AdH5({ url: params.url, ty: 3, title: item.title, thumbImage: item.imageUrl, bannerId: item.id });
    } else if (item.type == 4) {
        let params = JSON.parse(item.params);
        let url = params.url;
        //处理url
        let p1 = '{YoyoUserMobilePhone}';
        let p2 = '{YoyoUserID}';
        if (url.indexOf(p1) > 0) {
            url = url.replace(p1, mobile)
        }
        if (url.indexOf(p2) > 0) {
            url = url.replace(p2, userId)
        }
        Actions.AdH5({ url: url, ty: 4, title: item.title, thumbImage: item.imageUrl, bannerId: item.id });
    } else if (item.type == 5) {
        let params = JSON.parse(item.params);
        let url = params.url;
        Cookie.get('token')
            .then(value => {
                let token = value == null || value == '' ? '' : value;
                Actions.AdReward({ url: url, ty: 5, title: item.title, thumbImage: item.imageUrl, bannerId: item.id, token: token });
            });
    } else if (item.type == 6) {
        let params = JSON.parse(item.params);
        Actions.AdH5({ url: params.url, ty: 6, title: item.title, thumbImage: item.imageUrl, bannerId: item.id });
    } else if (item.type == 7) {
        Advert.jumpAdList(userId)
    } else {
        Actions.AdDetail({ info: item.params, title: item.title, thumbImage: item.imageUrl, bannerId: item.id, ty: item.type });
    }
};