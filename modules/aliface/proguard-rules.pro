# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface
# class:
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

# Uncomment this to preserve the line number information for
# debugging stack traces.
#-keepattributes SourceFile,LineNumberTable

# If you keep the line number information, uncomment this to
# hide the original source file name.
#-renamesourcefileattribute SourceFile
#zoloz 混淆配置
-keep public class com.alipay.mobile.security.zim.api.**{
    public <fields>;
    public <methods>;
}

-keep class com.alipay.mobile.security.zim.biz.ZIMFacadeBuilder {
  !private <fields>;
   !private <methods>;
}

-keep class com.alipay.android.phone.mobilecommon.logger.AlipayMonitorLogService {
    !private <fields>;
    !private <methods>;
}

-keep class com.alipay.android.phone.mobilecommon.rpc.AlipayRpcService {
    !private <fields>;
    !private <methods>;
}

-keep class com.alipay.android.phone.mobilecommon.apsecurity.AlipayApSecurityService {
    !private <fields>;
    !private <methods>;
}

-keep class com.alipay.zoloz.toyger.bean.ToygerMetaInfo {
    !private <fields>;
    !private <methods>;
}

-keep class com.alipay.zoloz.toyger.algorithm.** { *; }

-keep class com.alipay.zoloz.toyger.blob.** {
    !private <fields>;
    !private <methods>;
}

-keep class com.alipay.zoloz.toyger.face.** {
    !private <fields>;
    !private <methods>;
}

-keep class com.alipay.zoloz.hardware.camera.impl.** {
    !private <fields>;
    !private <methods>;
}


-keep public class com.alipay.mobile.security.zim.plugin.**{
    public <fields>;
    public <methods>;
}

-keep class * extends com.alipay.mobile.security.zim.gw.BaseGwService{
    !private <fields>;
    !private <methods>;
}

-keep class * extends com.alipay.mobile.security.bio.service.BioMetaInfo{
    !private <fields>;
    !private <methods>;
}

-keep class com.alipay.zoloz.toyger.workspace.FaceRemoteConfig{
    *;
}

-keep public class com.alipay.zoloz.toyger.**{
    *;
}
-keep public class com.alipay.mobile.security.zim.gw.**{
    *;
}