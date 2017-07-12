//
//  RCTFilePickerModule.m
//  VeehicApp
//
//  Created by Marco Ledesma on 2/10/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "FilePickerModule.h"
@import FPPicker;

@implementation FilePickerModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(uploadFile: (NSString *)base64encodedStr callback:(RCTResponseSenderBlock)callback) {
	
	FPSimpleAPI *api = [FPSimpleAPI simpleAPIWithSource:[FPSource sourceWithIdentifier:FPSourceCameraRoll]];
	NSData *imageData = [[NSData alloc] initWithBase64EncodedString:base64encodedStr options:NSDataBase64DecodingIgnoreUnknownCharacters];
	
	[api saveMediaRepresentedByData:imageData named:@"image.jpg" withMimeType:@"text/plain" atPath:@"/image/test" completion:^(FPMediaInfo * _Nullable mediaInfo, NSError * _Nullable error) {
		if (!error) {
			NSString *url = mediaInfo.remoteURL.absoluteString;
			callback(@[url]);
		}
		else {
			callback(@[@"", @"Error"]);
		}
	} progress:^(float progress) {
		
	}];
	
}

@end
