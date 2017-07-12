//
//  RCTConvert+CoreLocation.h
//  VeehicApp
//
//  Created by Marco Ledesma on 12/7/15.
//  Copyright © 2015 Facebook. All rights reserved.
//

#import "RCTConvert.h"
#import <MapKit/MapKit.h>

@interface RCTConvert (CoreLocation)

+ (CLLocationCoordinate2D)CLLocationCoordinate2D:(id)json;
+ (MKCoordinateSpan)MKCoordinateSpan:(id)json;
+ (MKCoordinateRegion)MKCoordinateRegion:(id)json;

@end
