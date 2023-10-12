// import BloomAd from 'react-native-bloom-ad';
import { NativeModules } from 'react-native';
import AdSdk from 'react-native-mobad';

const FeiMa = NativeModules.FeiMaModule;

const Advert = {};

Advert.init = (callback) => {
    try {
        AdSdk.init({
            appId: "bacbfc0cf0be3a1910",
            debug: false, // 是否调试模式，默认 false，请至少运行一次调试模式
        });
        callback && callback(true)
    } catch (error) {
        callback && callback(false)
        console.log(error)
    }

}

Advert.setUserId = (userId) => {
    // 登录时请设置 userId
    AdSdk.setUserId(`${userId}`);

}

Advert.setUserId = () => {
    // 登录时请设置 userId;
    AdSdk.setUserId(null);
}

Advert.showSplash = () => {
    const interval = 1000 * 60 * 3;  // 设置时间间隔，单位是毫秒，切到后台后超过间隔返回时重新加载开屏
    AdSdk.setMinSplashInterval(interval); // 单位 ms
    AdSdk.showSplashAd({
        onAdDismiss({ id }) {
            console.log('开屏结束', id);
        },
        onError({ id, code, message }) {
            console.log('开屏出错', id, code, message);
        },
    });
}


Advert.rewardVideo = (callback) => {
    AdSdk.showRewardVideoAd({
        unitId: 'rv1',
        onAdLoad({ id }) {
            console.log('onAdLoad', id);
        },
        onVideoCached({ id }) { },
        onAdShow({ id }) { },
        onReward({ id }) {
            console.log('onReward', id);
            callback && callback(id)
        },
        onAdClick({ id }) { },
        onVideoComplete({ id }) { },
        onAdClose({ id }) { 
            console.log('onAdClose', id);
        },
        onError({ id, code, message }) {
            console.log('onError', id, code, message);
            callback && callback(false)
        },
    });
}

Advert.interstitial = () => {
    AdSdk.showInterstitialAd({
        unitId: 'i1',
        onAdLoad({ id }) { },
        onAdShow({ id }) { },
        onAdClick({ id }) { },
        onAdClose({ id }) { },
        onError({ id, code, message }) { },
    });
}


Advert.initDyAd = () => {
    FeiMa.initDyAd('59636788', 'd8b07fc46cb699a0d22f4df6881ebea3');
}

Advert.jumpAdList = (userid) => {
    FeiMa.jumpAdList(`${userid}`);
}


Advert.openNovel = () => {

}

export default Advert;