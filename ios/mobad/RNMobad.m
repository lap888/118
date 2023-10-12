
#import "RNMobad.h"
#import <UIKit/UIKit.h>

#if __has_include(<React/RCTBridge.h>)
#import <React/RCTEventDispatcher.h>
#import <React/RCTRootView.h>
#import <React/RCTBridge.h>
#elif __has_include("RCTBridge.h")
#import "RCTEventDispatcher.h"
#import "RCTRootView.h"
#import "RCTBridge.h"
#elif __has_include("React/RCTBridge.h")
#import "React/RCTEventDispatcher.h"
#import "React/RCTRootView.h"
#import "React/RCTBridge.h"
#endif

@interface RNMobad () {
  UINavigationController *_nav;
}

@end

@implementation RNMobad

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}
RCT_EXPORT_MODULE()
@synthesize bridge = _bridge;
- (void)setBridge:(RCTBridge *)bridge {
  _bridge = bridge;
}

RCT_EXPORT_METHOD(showAd)
{
  [RewardVideoAd instance].delegate = self;
  UIViewController *rootViewController = [[UIViewController alloc]init];
  _nav = [[UINavigationController alloc]initWithRootViewController:rootViewController];
  _nav.navigationBar.hidden = YES;
  _nav.modalPresentationStyle = UIModalPresentationOverFullScreen;
  [[UIApplication sharedApplication].keyWindow.rootViewController presentViewController:_nav animated:NO completion:^{
    [[RewardVideoAd instance] showAd:rootViewController appid:2369 posid:3489 secret:@"LfUrGWxJ"];
  }];
}

- (void)onAdSuccess:(NSString *)msg {
  NSLog(@"onAdSuccess:%@",msg);
  [self.bridge.eventDispatcher sendAppEventWithName:@"onAdSuccess"
                                               body:msg];
}
- (void)onAdFailed:(NSString *)msg {
  NSLog(@"onAdFailed:%@",msg);
  [self.bridge.eventDispatcher sendAppEventWithName:@"onAdFailed"
                                               body:msg];
}
- (void)onAdClick:(NSString *)msg {
  NSLog(@"onAdClick:%@",msg);
  [self.bridge.eventDispatcher sendAppEventWithName:@"onAdClick"
                                               body:msg];
}
- (void)onVideoPlayStart:(NSString *)msg {
  NSLog(@"onVideoPlayStart:%@",msg);
  [self.bridge.eventDispatcher sendAppEventWithName:@"onVideoPlayStart"
                                               body:msg];
}
- (void)onVideoPlayComplete:(NSString *)msg {
  NSLog(@"onVideoPlayComplete:%@",msg);
  [self.bridge.eventDispatcher sendAppEventWithName:@"onVideoPlayComplete"
                                               body:msg];
}
- (void)onVideoPlayError:(NSString *)msg {
  NSLog(@"onVideoPlayError:%@",msg);
  [self.bridge.eventDispatcher sendAppEventWithName:@"onVideoPlayError"
                                               body:msg];
}
- (void)onVideoPlayClose:(NSString *)msg {
  NSLog(@"onVideoPlayClose:%@",msg);
  [_nav dismissViewControllerAnimated:YES completion:nil];
  [self.bridge.eventDispatcher sendAppEventWithName:@"onVideoPlayClose"
                                               body:msg];
}
- (void)onLandingPageOpen:(NSString *)msg {
  NSLog(@"onLandingPageOpen:%@",msg);
  [self.bridge.eventDispatcher sendAppEventWithName:@"onLandingPageOpen"
                                               body:msg];
}
- (void)onLandingPageClose:(NSString *)msg {
  NSLog(@"onLandingPageClose:%@",msg);
  [_nav dismissViewControllerAnimated:YES completion:nil];
  [self.bridge.eventDispatcher sendAppEventWithName:@"onLandingPageClose"
                                               body:msg];
}
- (void)onReward:(NSDictionary *)info {
  NSLog(@"onReward:%@",info);
  [self.bridge.eventDispatcher sendAppEventWithName:@"onReward"
                                               body:info];
}

@end

