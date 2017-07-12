# VeehicReactApp
React Native App for Veehic

### Installation Steps

1. Install React Native
  1. Visit (https://facebook.github.io/react-native/docs/getting-started.html "React Native Docs"). Pretty simple explaination (i think anyway).
  2. Verify that the React Native CLI is installed (type react-native -v).
2. Clone the repo (or you could've done this first, doesn't matter).
3. Navigate to the project folder (the folder that contains index.ios.js and index.android.js).
4. Run "npm install" in terminal to install all dependencies.
5. Next install Cocoapods.
  1. Cocoapods is a dependency manager for iOS applications. Install it by going to the (https://guides.cocoapods.org/using/getting-started.html "Cocoa pods website") and following their instructions
6. In terminal, from the project folder, navigate to the "ios" folder. This folder contains the .xcworkspace project.
7. In terminal, type "pod install". This will install all native dependencies for the app.
8. Now we can actually open the app in the simulator. 
  1. Open the .xcworkspace project from the iOS folder. 
  2. In XCode, select the emulator you want and press the play button. 
  
The app should be fully functional. 

Also, the code you'll want to edit is in the "App" folder. 
