'use strict';

var React = require('react-native');
var { Icon, } = require('react-native-icons');
var Theme = require("../Helpers/Theme");
var Routes = require("../Routes");
var LogoImage = require("../Components/LogoImage");
var DrawerNotLoggedInView = require("./DrawerNotLoggedInView");
var Subscribable = require('Subscribable');
var Storage = require("../Helpers/Storage");
var Config = require("../Config");

var {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Animated
    } = React;


var DrawerContentView = React.createClass({
    mixins: [Subscribable.Mixin],

    //<editor-fold desc="Render Delegate">
    getInitialState: function () {
        this.VEHICLE_SEARCH_VIEW = 0;
        this.POST_YOUR_VEHICLE_VIEW = 1;
        this.LOGOUT = 2;

        return {
            selectedMenuItem: this.VEHICLE_SEARCH_VIEW,
            isLoggedIn: false,
            drawerWidth: Theme.WidthOfDisplay() - this.props.drawerOffset - 40,
            loggedInOpacity: new Animated.Value(0),
        }
    },

    componentWillMount: function () {
        this.addListenerOn(this.props.events, 'userLoggedIn', this.userLoggedIn);
        var that = this;

        var storage = new Storage();
        storage.getValue(Config.LoggedInAuthKey).then(function (result) {
            if (result != null) {
                that.setState({isLoggedIn: true});
            }
        });
    },

    userLoggedIn: function (isLoggedIn) {
        var that = this;
        if (isLoggedIn) {
            that.setState({isLoggedIn: true, selectedMenuItem: that.VEHICLE_SEARCH_VIEW })

            Animated.spring(                          // Base: spring, decay, timing
                that.state.loggedInOpacity,                 // Animate `bounceValue`
                {
                    toValue: 1,                          // Bouncier spring
                    tension: 5
                }
            ).start(function() {
                setTimeout(function() {
                    Animated.spring(                          // Base: spring, decay, timing
                        that.state.loggedInOpacity,                 // Animate `bounceValue`
                        {
                            toValue: 0,
                            tension: 5
                        }
                    ).start();
                }, 1000);
            });
        }
        else {
            this.setState({isLoggedIn: false})
        }
    },

    renderDrawerContent: function () {
        if (this.state.isLoggedIn == false) {
            return <DrawerNotLoggedInView rootView={this.props.rootView} events={this.props.events} drawerWidth={this.state.drawerWidth}/>;
        }
        else {
            return (
                <View style={{ flex:1 }}>
                    <TouchableOpacity style={styles.drawerButtonStyle}
                                      onPress={() => this.menuItemTapped(this.VEHICLE_SEARCH_VIEW)}>
                        <Text style={[styles.drawerButtonStyleText, this.isSelectedStyle(0)]}>
                            Vehicle Search
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.drawerButtonStyle}
                                      onPress={() => this.menuItemTapped(this.POST_YOUR_VEHICLE_VIEW)}>
                        <Text style={[styles.drawerButtonStyleText, this.isSelectedStyle(1)]}>
                            List Your Car
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.drawerButtonStyle} onPress={() => this.menuItemTapped(this.LOGOUT)}>
                        <Text style={[styles.drawerButtonStyleText, this.isSelectedStyle(2)]}>
                            Logout
                        </Text>
                    </TouchableOpacity>
                    {(() => {
                        if (this.state.isLoggedIn) {
                            return (
                                <Animated.View style={{ height:30, opacity:this.state.loggedInOpacity, width:this.state.drawerWidth, backgroundColor:Theme.SecondaryTint(), borderRadius:3, alignItems:"center", justifyContent:"center", marginTop:20 }}>
                                    <Text style={{color:"white"}}>
                                        Welcome!
                                    </Text>
                                </Animated.View>
                            );
                        }
                        else {
                            return null;
                        }
                    })()}

                </View>
            );
        }
    },

    render: function () {
        return (
            <View style={styles.drawerContentStyle}>
                <LogoImage style={{width:this.state.drawerWidth}}/>
                {this.renderDrawerContent()}
            </View>
        );
    },
    //</editor-fold>

    //<editor-fold desc="Helpers">
    isSelectedStyle: function (index) {
        if (index == this.state.selectedMenuItem) {
            return {color: Theme.SecondaryTint()};
        }
        return {};
    },

    menuItemTapped: function (index) {
        if (index == this.state.selectedMenuItem) {
            this.props.rootView.closeControlPanel();
            return;
        }

        this.setState({
            selectedMenuItem: index
        });

        switch (index) {
            case this.VEHICLE_SEARCH_VIEW:
                this.props.rootView.drawerChangeRoute(Routes.getSearchView());
                this.props.rootView.closeControlPanel();
                break;
            case this.POST_YOUR_VEHICLE_VIEW:
                this.props.rootView.drawerChangeRoute(Routes.getPostVehicleView());
                this.props.rootView.closeControlPanel();
                break;
            case this.LOGOUT:
                var storage = new Storage();
                var that = this;
                storage.removeItem(Config.LoggedInAuthKey).then(function () {
                    that.setState({isLoggedIn: false});
                });

                break;
        }
    },
    //</editor-fold>
});


var styles = StyleSheet.create({
    drawerContentStyle: {
        backgroundColor: "#132E38",
        flex: 1,
        paddingLeft: 20,
        paddingTop: 30,
        height: Theme.HeightOfDisplay()
    },
    drawerButtonStyle: {},
    drawerButtonStyleText: {
        color: Theme.TintColor(),
        fontSize: 20,
        fontWeight: "200",
        paddingTop: 10,
        paddingBottom: 10
    }
});


module.exports = DrawerContentView;
