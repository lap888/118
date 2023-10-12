package com.topguo.alipay;

import android.util.Log;

import com.alibaba.fastjson.JSON;
import com.alipay.sdk.app.PayTask;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Map;

public class AliPayModule extends ReactContextBaseJavaModule {
    private static final String TAG = AliPayModule.class.getSimpleName();
    public AliPayModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }
    private static final int SDK_PAY_FLAG = 1;
    @Override
    public String getName() {
        return "AliPayModule";
    }


    /**
     * 支付宝支付业务示例
     */
    @ReactMethod
    public void payV2(final String orderInfo,final Callback callback) {

        final Runnable payRunnable = new Runnable() {
        String callBackData="";
            @Override
            public void run() {
                PayTask alipay = new PayTask(getCurrentActivity());
                Map<String, String> result = alipay.payV2(orderInfo, true);
                callBackData=JSON.toJSONString(result);
                Log.e("tt",callBackData);
                callback.invoke(callBackData);
            }
        };

        // 必须异步调用
        Thread payThread = new Thread(payRunnable);
        payThread.start();
    }
}
