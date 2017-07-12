'use strict';

var React = require('react-native');

var VehicleSearchView = require("./Views/VehicleSearchView");
var AppInfoView = require("./Views/AppInfoView");
var VehicleDetailsView = require("./Views/VehicleDetailsView");
var DrawerContentView = require("./Views/DrawerContentView");
var PostVehicleView = require("./Views/PostVehicleView");
var PostVehicleUploadImagesView = require("./Views/PostVehicleUploadImagesView");
var SignUpView = require("./Views/SignUpView");
var PostVehicleModel = require("./Database/PostVehicleModel");
//var UserSignUpView = require("./Views/UserSignUpView");

var Theme = require("./Helpers/Theme");
var Routes = require("./Routes");

var { Icon, } = require('react-native-icons');
var Drawer = require('react-native-drawer');

var EventEmitter = require('EventEmitter');


var {
    StyleSheet,
    Text,
    Navigator,
    StatusBarIOS,
    TouchableOpacity,
    View,
    ScrollView,
    PixelRatio
    } = React;

//Status Bar White
if (StatusBarIOS != null) { //on android
    StatusBarIOS.setStyle('light-content');
}


var drawerOffset = Math.round(Theme.WidthOfDisplay() * 0.2);


//Navigator, Drawer, and Navigation Bar styles below
class NavigationBarRouteMapper {
    constructor(root) {
        this.RootController = root;
    }

    LeftButton(route, navigator, index, navState) {
        if (route.giftedForm == true) {
            console.log(route.renderLeftButton(navigator));
            return route.renderLeftButton(navigator);
        }

        var sizeForMenuIcon = 40;

        if (index == 0) {

            return (
                <TouchableOpacity
                    onPress={() => this.RootController.toggleControlPanel()}
                    style={{flex:1}}>
                    <View style={{flex:1, paddingLeft:5}}>
                        <Icon
                            name='ion|navicon'
                            size={sizeForMenuIcon}
                            color={Theme.TintColor()}
                            style={{
                                width: sizeForMenuIcon,
                                height: sizeForMenuIcon,
                            }}
                        />
                    </View>
                </TouchableOpacity>
            );
        }

        var previousRoute = navState.routeStack[index - 1];
        sizeForMenuIcon = 25;
        return (
            <TouchableOpacity
                onPress={() => navigator.pop()}
                style={{
                    flex: 1,
                    paddingLeft:5
                }}>
                <View style={{
                    flex:1,
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent:"center",
                    alignItems:"center"
                    }}>
                    <Icon
                        name='ion|chevron-left'
                        size={sizeForMenuIcon}
                        color='#FFF'
                        style={{
                            width: sizeForMenuIcon,
                            height: sizeForMenuIcon,
                        }}
                    />
                    <Text style={[styles.navBarText, styles.navBarButtonText, {width:100}]} numberOfLines={1}>
                        {previousRoute.name}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }

    RightButton(route, navigator, index, navState) {

        if (route.path == Routes.getRoutePaths().VEHICLE_SEARCH) {
            return (
                <TouchableOpacity style={{flex:1}} onPress={() => this.RootController.filterButtonTapped()}>
                    <View style={{flex:1, justifyContent:"center"}}>
                        <Text
                            style={[styles.navBarText, styles.navBarButtonText, {textAlign:"right", paddingRight:14 }]}>Filter</Text>
                    </View>
                </TouchableOpacity>
            );
        } else if (route.giftedForm == true) {
            return route.renderRightButton(navigator);
        } else if (route.path == Routes.getRoutePaths().POST_VEHICLE_IMAGES) {
            return (
                <TouchableOpacity style={{flex:1}} onPress={() => {
                        var vehicleModel = PostVehicleModel.getInstance();
                        if (vehicleModel.attachments.length <= 0) {
                            alert("Please upload at least one image.");
                            return;
                        }

                        navigator.push(Routes.getSignUpView())
                    }
                }>
                    <View style={{flex:1, justifyContent:"center"}}>
                        <Text
                            style={[styles.navBarText, styles.navBarButtonText, {textAlign:"right", paddingRight:14 }]}>Next</Text>
                    </View>
                </TouchableOpacity>
            );
        }
    }

    Title(route, navigator, index, navState) {
        return (
            <View style={{flex:1, justifyContent:"center"}}>
                <Text style={styles.navBarTitle}>
                    {
                        (() => {
                            if (route.giftedForm == true) {
                                return route.getTitle();
                            }
                            else {
                                return route.name;
                            }
                        }).call()
                    }
                </Text>
            </View>
        );
    }
}


var Root = React.createClass({
    //<editor-fold desc="Render Delegate">
    getInitialState: function () {
        return {
            shouldShowNavigationBar: true,
            acceptPan: false,
            navigationBarBackgroundColor: Theme.PrimaryColor()
        }
    },

    componentWillMount: function () {
        this.eventEmmitter = new EventEmitter();
        this.controlPanelIsOpen = false;
    },

    //</editor-fold>

    //<editor-fold desc="Navigator Delegate">
    renderScene: function (route, navigator) {
        var routePaths = Routes.getRoutePaths();

        var contentView;
        if (route.path == routePaths.VEHICLE_SEARCH) {
            contentView =
                <VehicleSearchView ref="currentView" navigator={navigator} root={this} events={this.eventEmmitter}/>;
        }
        else if (route.path == routePaths.APP_INFO) {
            contentView =
                <AppInfoView ref="currentView" navigator={navigator} root={this} events={this.eventEmmitter}/>;
        }
        else if (route.path == routePaths.VEHICLE_VIEW) {
            contentView =
                <VehicleDetailsView ref="currentView" navigator={navigator} root={this} vehicleData={route.vehicleData}
                                    events={this.eventEmmitter}/>;
        }
        else if (route.path == routePaths.POST_VEHICLE) {
            contentView =
                <PostVehicleView ref="currentView" navigator={navigator} root={this} events={this.eventEmmitter}/>;
        }
        else if (route.path == routePaths.POST_VEHICLE_IMAGES) {
            contentView = <PostVehicleUploadImagesView ref="currentView" navigator={navigator} root={this}
                                                       events={this.eventEmmitter}/>
        }
        else if (route.path == routePaths.SIGN_UP) {
            contentView = <SignUpView ref="currentView" navigator={navigator} root={this} events={this.eventEmitter}/>
        }
        else if (route.giftedForm == true) {
            contentView = route.renderScene();
        }

        return (
            <View style={styles.navigateContainerView}>
                {contentView}
            </View>
        );
    },

    configureScene: function (route) {
        if (route.NavigatorSceneConfig != null) {
            return route.NavigatorSceneConfig;
        }
        else if (route.giftedForm) {
            return route.configureScene();
        }
        else {
            return Navigator.SceneConfigs.PushFromRight;
        }
    },

    giftedFormBackgroundColor: function () {
        return {
            backgroundColor: this.state.navigationBarBackgroundColor
        }
    },

    setNavigationBar: function () {
        if (this.state.shouldShowNavigationBar) {
            return (
                <Navigator.NavigationBar
                    style={[styles.navBar, this.giftedFormBackgroundColor()]}
                    routeMapper={new NavigationBarRouteMapper(this)}
                />
            )
        }
    },

    render: function () {
        var that = this;
        return (
            <Drawer
                ref="drawer"
                content={<DrawerContentView events={that.eventEmmitter} rootView={this} drawerOffset={drawerOffset} />}
                panStartCompensation={true}
                onOpen={this.onDrawerOpen}
                onClose={this.onDrawerClosed}
                openDrawerOffset={drawerOffset}
                acceptPan={this.state.acceptPan}
                tapToClose={true}
                type="overlay"
                panOpenMask={0}
                captureGestures={true}
                tweenHandler={(ratio) => {
                    return {
                      main: { opacity:(2-ratio)/2 },
                    }
                  }}
            >
                <Navigator
                    ref="navigator"
                    initialRoute={Routes.getInitialRoute()}
                    renderScene={this.renderScene}
                    configureScene={this.configureScene}
                    navigationBar={this.setNavigationBar()}
                />

            </Drawer>
        )
    },
    //</editor-fold>

    //<editor-fold desc="Helpers">
    //</editor-fold>

    //<editor-fold desc="Control Panel Delegate">
    toggleControlPanel: function () {
        if (this.controlPanelIsOpen) {
            this.closeControlPanel();
        } else {
            this.openControlPanel();

        }
    },
    closeControlPanel: function () {
        this.refs.drawer.close()
        this.controlPanelIsOpen = false
        this.eventEmmitter.emit('drawerDidClose');

    },
    openControlPanel: function () {
        this.refs.drawer.open()
        this.controlPanelIsOpen = true;
        this.eventEmmitter.emit('drawerDidOpen');
    },

    onDrawerOpen: function () {
        this.eventEmmitter.emit('drawerDidOpen');
        var that = this; //Setting a timeout for performance
        setTimeout(function () {
            that.controlPanelIsOpen = true;
            that.setState({
                acceptPan: true
            });

        }, 1);
    },

    onDrawerClosed: function () {
        this.eventEmmitter.emit('drawerDidClose');
        var that = this; //Setting a timeout for performance
        setTimeout(function () {
            that.controlPanelIsOpen = false;
            that.setState({
                acceptPan: false
            });
        }, 1);
    },

    //This will replace the current content view of the navigator
    //Used from the Drawer content instanitated above
    drawerChangeRoute: function (route) {


        this.refs.navigator.popToTop();
        this.refs.navigator.replace(route);

    },
    //</editor-fold>

    filterButtonTapped: function () {
        this.eventEmmitter.emit("filterButtonTapped");
    }
});

var styles = StyleSheet.create({
    navViewContainer: {
        paddingTop: 64
    },
    navBar: {
        backgroundColor: Theme.PrimaryColor(),
        //borderBottomWidth:1 / PixelRatio.get(),
        //borderBottomColor:"#EEE"
    },
    navBarIcon: {
        width: PixelRatio.getPixelSizeForLayoutSize(5),
        height: PixelRatio.getPixelSizeForLayoutSize(10),
        marginRight: 5,
        marginTop: 5
    },
    navBarTitle: {
        color: "#FFF",
        fontSize: 20,
    },
    navBarTitleText: {
        color: "#333",
        fontWeight: '500',
        marginVertical: 9,
    },
    navBarText: {
        fontSize: 17,
        width: 120,
    },
    navBarButtonText: {
        color: Theme.TintColor(),
    },
    navBarSearchIcon: {
        width: 50,
        flex: 1
    },

    navigateContainerView: {
        flex: 1,
        paddingTop: 64
    }
});

module.exports = Root;
