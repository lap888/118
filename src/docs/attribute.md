## 苹果点击 报错兼容问题


https://www.cnblogs.com/wtfu/p/11598566.html
Unknown argument type '__attribute__'
Xcode 11 Error: "Unknown argument type '__attribute__' in method -[RCTAppState getCurrentAppState:error:]. Extend RCTConvert to support this type."
 
 
According the official issue :
https://github.com/facebook/react-native/issues/25138

iOS build fails to run in with Xcode 11.0 beta


This is a 0.59 version bug.

If you have want to fix it by youself, please check this out: https://github.com/facebook/react-native/pull/25146.

react-native/React/Base/RCTModuleMethod.mm

line94:

RCTReadString(input, "__attribute__((__unused__))") ||