//
//  mobad.h
//  mobad
//
//  Created by chen kai on 2019/12/9.
//  Copyright © 2019 chen kai. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>

@protocol MobadDelegate <NSObject>

@optional
- (void)onAdSuccess:(NSString *)msg;
- (void)onAdFailed:(NSString *)msg;
- (void)onAdClick:(NSString *)msg;
- (void)onAdLoad:(NSString *)msg;
- (void)onVideoPlayStart:(NSString *)msg;
- (void)onVideoPlayComplete:(NSString *)msg;
- (void)onVideoPlayError:(NSString *)msg;
- (void)onVideoPlayClose:(NSString *)msg;
- (void)onLandingPageOpen:(NSString *)msg;
- (void)onLandingPageClose:(NSString *)msg;
- (void)onReward:(NSDictionary *)info;
@end


@interface RewardVideoAd : NSObject

@property(nonatomic, weak) id<MobadDelegate> delegate;

+ (RewardVideoAd *) instance;


-(void)showAdPre:(UIViewController *)uivc appid:(int)appid posid:(int)posid secret:(NSString *)secret;

-(void)showAd:(UIViewController *)uivc appid:(int)appid posid:(int)posid secret:(NSString *)secret;

-(void)loadAd:(int)appid posid:(int)posid secret:(NSString *)secret;
-(void)showAd:(UIViewController *)uivc;


-(BOOL)isReady;

@end
