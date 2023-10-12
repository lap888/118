#import "RCTAlipay.h"

static NSString *const kOpenURLNotification = @"RCTOpenURLNotification";

@interface RCTAlipay ()

@property (nonatomic, copy) RCTPromiseResolveBlock payOrderResolve;

@end

@implementation RCTAlipay

- (instancetype)init {
    if (self = [super init]) {
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(handleOpenURL:) name:kOpenURLNotification object:nil];
    }
    return self;
}

- (void)dealloc {
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

- (void)handleOpenURL:(NSNotification *)notification {
    NSString *urlString = notification.userInfo[@"url"];
    NSURL *url = [NSURL URLWithString:urlString];
    if ([url.host isEqualToString:@"safepay"]) {
        __weak __typeof__(self) weakSelf = self;
        [AlipaySDK.defaultService processOrderWithPaymentResult:url standbyCallback:^(NSDictionary *resultDic) {
            NSLog(@"processOrderWithPaymentResult = %@", resultDic);
            if (weakSelf.payOrderResolve) {
                weakSelf.payOrderResolve(resultDic);
                weakSelf.payOrderResolve = nil;
            }
        }];
    }
}

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}
RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(pay:(NSString *)orderInfo
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    self.payOrderResolve = resolve;
    [AlipaySDK.defaultService payOrder:orderInfo fromScheme:self.appScheme callback:^(NSDictionary *resultDic) {
      resolve(resultDic);
    }];
}
 
- (NSString *)appScheme {
    NSArray *urlTypes = NSBundle.mainBundle.infoDictionary[@"CFBundleURLTypes"];
    for (NSDictionary *urlType in urlTypes) {
        NSString *urlName = urlType[@"CFBundleURLName"];
        if ([urlName hasPrefix:@"alipay"]) {
            NSArray *schemes = urlType[@"CFBundleURLSchemes"];
            return schemes.firstObject;
        }
    }
    return nil;
}

@end
