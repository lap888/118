
#if __has_include("RCTBridgeModule.h")
#import "RCTBridgeModule.h"
#else
#import <React/RCTBridgeModule.h>
#endif
#import <mobadvideo/RewardVideoAd.h>
@interface RNMobad : NSObject <RCTBridgeModule,MobadDelegate>

@end
  
