//
//  ImageGalleryView.m
//  VeehicApp
//
//  Created by Marco Ledesma on 12/10/15.
//  Copyright © 2015 Facebook. All rights reserved.
//

#import "ImageGalleryView.h"
#import "UIView+React.h"
#import "UIImageView+WebCache.h"
#import "AppDelegate.h"

#import "MWPhotoBrowser.h"

@interface ImageGalleryView() <UIScrollViewDelegate, MWPhotoBrowserDelegate>

@property (strong, nonatomic) NSArray *imageUrls;
@property (nonatomic) BOOL shouldShowGalleryWhenTapped;



@property (nonatomic) CGFloat widthOfView;
@property (strong, nonatomic) NSMutableArray *imageViews;
@property (strong, nonatomic) RCTEventDispatcher *dispatcher;
@property (nonatomic) BOOL subviewHaveBeenLayedOut;
@property (strong, nonatomic) UIPageControl *pageControler;
@property (weak, nonatomic) UIViewController *rootViewController;

@property (strong, nonatomic) NSMutableArray *mwPhotoList;
@property (nonatomic) BOOL orientationDidchange;


@end

@implementation ImageGalleryView

-(instancetype)init
{
  self = [super init];
  
  if (self) {
    
  }
  
  return self;
}

-(instancetype)initWithDispatch:(RCTEventDispatcher *)dispatcher
{
  self = [super init];
  if (self) {
    self.pagingEnabled = YES;
    self.showsHorizontalScrollIndicator = YES;
    self.delegate = self;
    self.imageViews = [NSMutableArray array];
    self.dispatcher = dispatcher;
    self.subviewHaveBeenLayedOut = NO;
    
    AppDelegate *appDelegate = (AppDelegate *)[UIApplication sharedApplication].delegate;
    self.rootViewController = appDelegate.window.rootViewController;
		
		[[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(rotated) name:UIDeviceOrientationDidChangeNotification object:nil];
  }
  return self;
}

-(void)layoutSubviews
{
  if (self.imageUrls && !self.subviewHaveBeenLayedOut)
  {
    int index = 0;
    float width = self.frame.size.width;
    float height = self.frame.size.height;
    self.widthOfView = width;
    
    
    for (NSString *url in self.imageUrls)
    {
      UIImageView *imageView = [[UIImageView alloc] init];
      imageView.frame = CGRectMake(width * index, 0, width, self.frame.size.height);
			
      imageView.contentMode = UIViewContentModeScaleAspectFill;
      imageView.userInteractionEnabled = YES;
      imageView.clipsToBounds = YES;
      
      UITapGestureRecognizer *tapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(galleryTapped)];
      tapGesture.numberOfTapsRequired = 1;
      [imageView addGestureRecognizer:tapGesture];

      if (index <= 1)
      {
          [imageView sd_setImageWithURL:[NSURL URLWithString:url]];
      }
      
      [self addSubview:imageView];
      [self.imageViews addObject:imageView];

			
			
      index++;
    }
    
    self.contentSize = CGSizeMake(width * index, self.frame.size.height);
    self.subviewHaveBeenLayedOut = YES;
    
    
    self.pageControler = [[UIPageControl alloc] initWithFrame:CGRectMake(0, height - 26, width, 30)];
    self.pageControler.numberOfPages = self.imageUrls.count;
    self.pageControler.currentPage = 0;
    [self.superview addSubview:self.pageControler];
  }
	
	else if (self.orientationDidchange)
	{
		self.orientationDidchange = NO;
		
		int index = 0;
		float width = self.frame.size.width;
		self.widthOfView = width;
		
		for (UIImageView *view in self.imageViews)
		{
			CGRect frame = view.frame;
			
			frame.size.width = width;
			frame.origin.x = width * index;
			
			view.frame = frame;
			index++;
		}
		
		self.contentSize = CGSizeMake(width * index, self.frame.size.height);
		self.pageControler.currentPage = 0;
	}
}


-(void)scrollViewDidEndDecelerating:(UIScrollView *)scrollView
{
  dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
    CGPoint contentOffset = scrollView.contentOffset;
    CGFloat index = contentOffset.x / self.widthOfView;
    index = index + 1;
    
    
    dispatch_async(dispatch_get_main_queue(), ^{
      self.pageControler.currentPage = index - 1;
    });
    
    if (index >= self.imageUrls.count)
    {
        return;
    }
    
    NSString *imageUrl = [self.imageUrls objectAtIndex:index];
    UIImageView *imageView = [self.imageViews objectAtIndex:index];
    
    if (imageView.tag == 10 || imageView.image == nil)
    {
        imageView.tag = 0;
        dispatch_async(dispatch_get_main_queue(), ^{
          [imageView sd_setImageWithURL:[NSURL URLWithString:imageUrl]];
        });
    }
    
    
  });
}

-(void)galleryTapped
{
  if (!self.shouldShowGalleryWhenTapped)
  {
		[self.dispatcher sendInputEventWithName:@"onTap" body:@{@"target": self.reactTag}];
  }
  else
  {
		if (self.mwPhotoList == nil)
		{
			self.mwPhotoList = [NSMutableArray array];
			
			for (NSString *url in self.imageUrls)
			{
				[self.mwPhotoList addObject:[MWPhoto photoWithURL:[NSURL URLWithString:url]]];
			}
		}

		MWPhotoBrowser *browser = [[MWPhotoBrowser alloc] initWithPhotos:self.mwPhotoList];
		browser.delegate = self;
		// Set options
		browser.displayActionButton = YES; // Show action button to allow sharing, copying, etc (defaults to YES)
		browser.displayNavArrows = NO; // Whether to display left and right nav arrows on toolbar (defaults to NO)
		browser.displaySelectionButtons = NO; // Whether selection buttons are shown on each image (defaults to NO)
		browser.zoomPhotosToFill = YES; // Images that almost fill the screen will be initially zoomed to fill (defaults to YES)
		browser.alwaysShowControls = NO; // Allows to control whether the bars and controls are always visible or whether they fade away to show the photo full (defaults to NO)
		browser.enableGrid = YES; // Whether to allow the viewing of all the photo thumbnails on a grid (defaults to YES)
		browser.startOnGrid = NO; // Whether to start on the grid of thumbnails instead of the first photo (defaults to NO)
		browser.autoPlayOnAppear = NO; // Auto-play first video
		
		UINavigationController *nav = [[UINavigationController alloc] initWithRootViewController:browser];
		[self.rootViewController presentViewController:nav animated:YES completion:nil];
  }
  
  [UIView animateWithDuration:0.2f animations:^{
    self.alpha = 0.5;
  } completion:^(BOOL finished) {
    self.alpha = 1;
  }];
  
}

- (NSUInteger)numberOfPhotosInPhotoBrowser:(MWPhotoBrowser *)photoBrowser {
	return self.mwPhotoList.count;
}

- (id <MWPhoto>)photoBrowser:(MWPhotoBrowser *)photoBrowser photoAtIndex:(NSUInteger)index {
	if (index < self.mwPhotoList.count) {
		return [self.mwPhotoList objectAtIndex:index];
	}
	return nil;
}

-(void)rotated {
	self.orientationDidchange = YES;
}


-(void)dealloc
{
	NSLog(@"Deallocated Image Gallery View");
	[[NSNotificationCenter defaultCenter] removeObserver:self];
}



@end
