## ak
327c6582a354e950c9c5afbe61b6f88f5256a70a
code-push app add <Your APP Name> <OS(ios/anroid/windows/macOS)> <platform(Objective-C / Swift/react-native/cordova/xamarin)>
code-push app add yoyoba-android anroid  react-native



[topbrids@bogon ~]$ code-push access-key ls
┌───────┬───────────────┐
│ Name  │ Created       │
├───────┼───────────────┤
│ GY    │ Dec 4, 2018   │
├───────┼───────────────┤
│ bogon │ 3 minutes ago │
└───────┴───────────────┘
[topbrids@bogon ~]$ 
[topbrids@bogon ~]$ 
[topbrids@bogon ~]$ code-push access-key rm GY
Are you sure? (y/N): y
Successfully removed the "GY" access key.
[topbrids@bogon ~]$ code-push access-key ls
┌───────┬───────────────┐
│ Name  │ Created       │
├───────┼───────────────┤
│ bogon │ 4 minutes ago │
└───────┴───────────────┘
[topbrids@bogon ~]$ code-push app add yoyoba android react-native
Successfully added the "yoyoba" app, along with the following default deployments:
┌────────────┬────────────────────────────────────────┐
│ Name       │ Deployment Key                         │
├────────────┼────────────────────────────────────────┤
│ Production │ 73DmyIdfkpjxeMc9M9-et0xi7fRzX8wrXqU_ta │
├────────────┼────────────────────────────────────────┤
│ Staging    │ XoEM7H9accPNvSirOSvrsCT8J8z5T1fqKD6fq  │
└────────────┴────────────────────────────────────────┘

[topbrids@bogon ~]$ code-push app add yoyoba-ios ios react-native
Successfully added the "yoyoba-ios" app, along with the following default deployments:
┌────────────┬────────────────────────────────────────┐
│ Name       │ Deployment Key                         │
├────────────┼────────────────────────────────────────┤
│ Production │ Z1HuYOolqeDY1nIrUfcB8dWpVh1AZ93b1g5xBm │
├────────────┼────────────────────────────────────────┤
│ Staging    │ RkZDY0WeR1yo4fjd_6CTZUjP8jB_yplbkm79P  │
└────────────┴────────────────────────────────────────┘

向CodePush添加应用时需要指明应用的平台，成功注册CodePush应用后，每个应用都会生成两个deployment key。其中，Production是用于生产环境的deployment key，Staging则是用于模拟环境的deployment key。
注册成功后，可以通过
https://appcenter.ms/apps 
来查看注册的CodePush应用的信息，如图11-14所示。


code-push release-react codepush ios

code-push release-react yoyoba android


我们可以通过code-push release-react命令发布更新包。多次发布更新包也是如此。

$ code-push release-react <Appname> <Platform> --t <本更新包面向的旧版本号> --des <本次更新说明>

注意： CodePush默认是更新Staging 环境的，如果发布生产环境的更新包，需要指定--d参数：--d Production，如果发布的是强制更新包，需要加上 --m true强制更新

//例如
$ code-push release-rereact CodePushDemo_IOS ios --t 1.0.0 --des "本次更新了hello world!" --m true


查询提交过哪些更新包:

 查询Production
 $ code-push deployment history CodePushDemo_IOS Production
 
 查询Staging
 $ code-push deployment history projectName Staging

react-native-code-push进阶篇

https://www.jianshu.com/p/6e96c6038d80

code-push release-rereact yoyoba android --t 1.1.0 --des "优化实名认证问题" --m true


code-push release-react yoyoba android  --t 1.1.6 --dev false --d Production --des "修复显示问题" --m true

code-push deployment history yoyoba Production

code-push release-react yoyoba android  --t 1.2.4 --dev false --d Production --des "撸哟帮之前版本" --m true

-——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
https://appcenter.ms/users/topbrids-gmail.com/apps/yoyoba-android/analytics/overview
添加应用
appcenter apps create -d yoyoba-ios -o iOS -p React-Native
appcenter apps create -d yoyoba-android -o Android -p React-Native


部署ios
appcenter codepush deployment add -a topbrids-gmail.com/yoyoba-ios Staging
Deployment Staging has been created for topbrids-gmail.com/yoyoba-ios with key BKPcBVfYsZtibMWrJR7RJsh49Hmmi17wvIS5R

appcenter codepush deployment add -a topbrids-gmail.com/yoyoba-ios Production
Deployment Production has been created for topbrids-gmail.com/yoyoba-ios with key XVSTsfdJP2Vix1geo4E6PWFKUyNjf2CfYu180

部署android
appcenter codepush deployment add -a topbrids-gmail.com/yoyoba-android Staging
Deployment Staging has been created for topbrids-gmail.com/yoyoba-android with key jsezJSgW_YJS86ISAXrnau5RDaXUYcLzJB20t

appcenter codepush deployment add -a topbrids-gmail.com/yoyoba-android Production
Deployment Production has been created for topbrids-gmail.com/yoyoba-android with key wkkwA4iHD6WAUNgjGEHR08x4rlLJ6XGiNZfbA

推送更新：
appcenter codepush release-react -a topbrids-gmail.com/yoyoba-android -d Staging -m true  // -m true 是强制更新可以不加
appcenter codepush release-react -a topbrids-gmail.com/yoyoba-android -d Production -m true  // -m true 是强制更新可以不加

appcenter codepush release-react -a topbrids-gmail.com/yoyoba-ios -d Staging -m true  // -m true 是强制更新可以不加
appcenter codepush release-react -a topbrids-gmail.com/yoyoba-ios -d Production -m true  // -m true 是强制更新可以不加


# new

appcenter apps create -d hwhjdapp-android -o Android -p React-Native


`App Secret:            d460cba1-4738-49f4-bd5b-2090aaacfcf0
Description:           
Display Name:          hwhjdapp-android
Name:                  hwhjdapp-android
OS:                    Android
Platform:              React-Native
Release Type:          
Owner ID:              784c794f-ca0c-4121-a560-d2d52675acb2
Owner Display Name:    littlefish
Owner Email:           topbrids@gmail.com
Owner Name:            topbrids-gmail.com`


appcenter codepush deployment add -a topbrids-gmail.com/hwhjdapp-android Production
Deployment Production has been created for topbrids-gmail.com/hwhjdapp-android with key d460cba1-4738-49f4-bd5b-2090aaacfcf0


TK-WiR2OHlvEyxCg2ZPysk-XX2s1A0pGipfL7


appcenter codepush release-react -a topbrids-gmail.com/hwhjdapp-android -d Production -m true