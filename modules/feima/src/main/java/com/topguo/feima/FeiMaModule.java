package com.topguo.feima;

import android.content.Intent;
import android.telephony.TelephonyManager;
import android.util.Log;

import com.duoyou.task.openapi.DyAdApi;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.lang.reflect.Method;
import java.util.HashMap;

public class FeiMaModule extends ReactContextBaseJavaModule {

    private static final String TAG = FeiMaModule.class.getSimpleName();


    private ReactContext mReactContext;

    public FeiMaModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.mReactContext = reactContext;
    }

    @Override
    public String getName() {
        return "FeiMaModule";
    }
    @ReactMethod
    public void initDyAd(String mediaId,String AppSecret) {
        /**
         * context:上下文
         * mediaId: 多量分配的媒体标识（请到媒体后台查看）
         * AppSecret：多量分配的媒体秘钥（请到媒体后台查看）
         * channel:渠道号，比如小米、应用宝、华为等没有可以传空
         * isAutoGetOAID：是否自动获取OAID，默认true
         * 代码中的APPID仅为测试，切勿上线使用
         */
        DyAdApi.getDyAdApi().init(getReactApplicationContext(), mediaId, AppSecret,"channel");
        /**
        * 设置标题栏颜色
        * colorRes:res类型的颜色，是resInt类型，就是必须现在colors.xml里面定义了，在传入
        */
        DyAdApi.getDyAdApi().setTitleBarColor(R.color.colorYellow);
        /**
        * 设置标题，例如：多量游戏
        */
        DyAdApi.getDyAdApi().setTitle("GameChain");
    }

    @ReactMethod
    public void jumpAdList(String userId) {
        /**
         * userId : 媒体用户UID，代表一个用户的Id（必须保证唯一性，否则用户领不到奖励）
         * advertType: 0（默认值）显示全部数据  1.手游  2.益智
         */
       DyAdApi.getDyAdApi().jumpAdList(getCurrentActivity(), userId, 0);
    }

}
