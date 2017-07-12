//
//  ImageGalleryView.h
//  VeehicApp
//
//  Created by Marco Ledesma on 12/10/15.
//  Copyright © 2015 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "RCTViewManager.h"
#import "RCTView.h"

@class RCTEventDispatcher;

@interface ImageGalleryView : UIScrollView

-(instancetype)initWithDispatch:(RCTEventDispatcher *)dispatcher;

@end
