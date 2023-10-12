package com.dapphaowanhj;

import android.content.pm.ActivityInfo;
import android.os.Bundle;

import com.facebook.react.ReactActivity;

import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "dapphaowanhj";
  }
  @Override
  protected void onCreate(Bundle savedInstanceState) {
//    super.onCreate(savedInstanceState);
    SplashScreen.show(this);  // 添加这一句
    super.onCreate(savedInstanceState);
    try {
      //设置坚屏 一定要放到try catch里面，否则会崩溃
      setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED);
    } catch (Exception e) {
    }

  }

}
