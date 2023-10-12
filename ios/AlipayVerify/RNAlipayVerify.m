
#import "RNAlipayVerify.h"
#import <AlipayVerifySDK/APVerifyService.h>
#import <UIKit/UIKit.h>
@implementation RNAlipayVerify

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}
RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(startVerifyService:(NSString *)url certifyId:(NSString *)certifyId callBack:(RCTResponseSenderBlock)callback)
{
//  url = @"https://picker.antcloudauth.aliyuncs.com/gateway.do?alipay_sdk=alipay-sdk-java-3.6.0.ALL&app_id=2019062765775035&biz_content=%7B%22certify_id%22%3A%229ffa27d0df27424668a04ba232b65ec7%22%7D&charset=UTF-8&format=json&method=alipay.user.certify.open.certify&sign=ffk53%2Ba2XU23UU8fWoJXkUIR7MjUOALASCSwb5iciZFCfnx6EBgH67EAKSIeKhCWEeAFd3HxhFrw718VMbhtrWjxXyfSJiODYDwV8e9VGFE9XJD6aYqWAGF%2BPptRfhLD%2B%2FDiO5nNd4HYtCJKtAOkOWJBEXidf9N9VX3JxqY7KKWMrhKvxLdlOM3v%2BKX%2FRJD0MxiV5nq8Rw7LYRrFNnFXOprRf%2B%2BsIlPTkUzyBLYx7Rv6yfzk%2Backw4YP%2BXEBpfYAcBdicPtbRFh90uDuhQDMfj02t5oIIAOkAwV76NKuivPlqSB%2Fyvlk6I42R4NqyKJH2WWGm2zltFjuf5liYHw8cQ%3D%3D&sign_type=RSA2&timestamp=2020-05-08+09%3A54%3A30&version=1.0";
//  certifyId=@"9ffa27d0df27424668a04ba232b65ec7";
  
  UIViewController *rootViewController = [[UIViewController alloc]init];
  UINavigationController * nav = [[UINavigationController alloc]initWithRootViewController:rootViewController];
  nav.navigationBar.hidden = YES;
  nav.modalPresentationStyle = UIModalPresentationOverFullScreen;
  [[UIApplication sharedApplication].keyWindow.rootViewController presentViewController:nav animated:NO completion:^{
    [[APVerifyService sharedService] startVerifyService:@{@"url": url,
                                                          @"certifyId":certifyId,
                                                          @"ext": @"test-extInfo"
    } target:rootViewController block:^(NSMutableDictionary * resultDic){
      [nav dismissViewControllerAnimated:YES completion:^{
        NSLog(@"=========%@", resultDic);
        callback(@[resultDic]);
      }];
    }];
  }];
}
@end

