'use strict';

var React = require('react-native');
var {
    Navigator
    } = React;


class Routes {
    static getRoutePaths() {
        return {
            APP_INFO: 1,
            VEHICLE_SEARCH: 2,
            VEHICLE_VIEW: 3,
            POST_VEHICLE: 4,
            POST_VEHICLE_IMAGES: 5,
            SIGN_UP: 6
        }
    };

    static getAppInfoView() {
        var sceneConfig = Navigator.SceneConfigs.FloatFromBottom;
        sceneConfig.gestures = {};
        return {
            name: "App Info",
            path: Routes.getRoutePaths().APP_INFO,
            NavigatorSceneConfig: sceneConfig
        }
    }

    static getSearchView() {
        return {
            name: "Vehicle Search",
            path: Routes.getRoutePaths().VEHICLE_SEARCH
        }
    }

    static getVehicleView() {
        return {
            name: "View",
            path: Routes.getRoutePaths().VEHICLE_VIEW
        }
    }

    static getPostVehicleView() {
        return {
            name: "List Car",
            path: Routes.getRoutePaths().POST_VEHICLE
        }
    }

    static getPostVehicleUploadImagesView() {
        return {
            name: "Upload",
            path: Routes.getRoutePaths().POST_VEHICLE_IMAGES
        }
    }

    static getSignUpView() {
        return {
            name: "Sign Up",
            path: Routes.getRoutePaths().SIGN_UP
        };
    }

    static getUserSignUpView() {
      return {
        name: "User Sign Up",
        path: Routes.getUserSignUpView().USER_SIGN_UP
      }
   }

    static getInitialRoute() {
        return Routes.getSearchView();
    }

}

module.exports = Routes;
