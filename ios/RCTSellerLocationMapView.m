//
//  SellerLocationMapView.m
//  VeehicApp
//
//  Created by Marco Ledesma on 12/7/15.
//  Copyright © 2015 Facebook. All rights reserved.
//

#import "RCTSellerLocationMapView.h"
#import <MapKit/MapKit.h>
#import "RCTConvert+CoreLocation.h"


@interface RCTSellerLocationMapView() <MKMapViewDelegate>

@end

@implementation RCTSellerLocationMapView

RCT_EXPORT_MODULE()

- (MKMapView *)view
{
  MKMapView *mapView = [[MKMapView alloc] init];
  mapView.delegate = self;
  return mapView;
}

RCT_EXPORT_VIEW_PROPERTY(pitchEnabled, BOOL)
RCT_CUSTOM_VIEW_PROPERTY(region, MKCoordinateRegion, RCTSellerLocationMapView)
{
  MKMapView *mapView = (MKMapView *)view;
  MKCoordinateRegion region = [RCTConvert MKCoordinateRegion:json];

  MKCircle *circle = [MKCircle circleWithCenterCoordinate:region.center radius:2000];
  [mapView addOverlay:circle];
  
  [mapView setRegion:json ? region : ((MKMapView *)defaultView).region animated:NO];
  
  
}

-(MKOverlayRenderer *)mapView:(MKMapView *)mapView rendererForOverlay:(id<MKOverlay>)overlay
{
  MKCircleRenderer *circleRender = [[MKCircleRenderer alloc] initWithOverlay:overlay];
  
  circleRender.fillColor = [UIColor colorWithRed:16/255.0f green:111/255.0f blue:171/255.0f alpha:0.3f];
  circleRender.strokeColor = [UIColor colorWithRed:16/255.0f green:111/255.0f blue:171/255.0f alpha:1];
  circleRender.lineWidth = 1;
  return circleRender;
}

@end
