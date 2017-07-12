//
//  RCTImageGalleryViewManager.m
//  VeehicApp
//
//  Created by Marco Ledesma on 12/10/15.
//  Copyright © 2015 Facebook. All rights reserved.
//

#import "RCTImageGalleryView.h"
#import "ImageGalleryView.h"

@implementation RCTImageGalleryView

RCT_EXPORT_MODULE()

- (ImageGalleryView *)view
{
  ImageGalleryView *view = [[ImageGalleryView alloc] initWithDispatch:self.bridge.eventDispatcher];
  
  return view;
}


-(NSArray *)customDirectEventTypes
{
  return @[
           @"onTap"
           ];
}

RCT_EXPORT_VIEW_PROPERTY(imageUrls, NSArray)
RCT_EXPORT_VIEW_PROPERTY(shouldShowGalleryWhenTapped, BOOL)

-(dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}
@end
