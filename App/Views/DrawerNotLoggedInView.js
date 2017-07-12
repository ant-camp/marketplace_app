"use strict";

var React = require("react-native");
var { Icon, } = require('react-native-icons');
var Theme = require("../Helpers/Theme");
var Subscribable = require('Subscribable');
var LoginService = require("../API/LoginService");
var Storage = require("../Helpers/Storage");
var Config = require("../Config");
var Routes = require("../Routes");
var {GiftedFormManager} = require('react-native-gifted-form');

var {
    Text,
    StyleSheet,
    View,
    PixelRatio,
    TextInput,
    TouchableHighlight,
    ActivityIndicatorIOS,
    Animated,
    TouchableOpacity
    } = React;


var DrawerContentNotLoggedInView = React.createClass({
    mixins: [Subscribable.Mixin],

    getInitialState: function () {
        return {
            isLoggingIn: false,
            email: "",
            password: "",
            containerViewOpacity: new Animated.Value(0)
        }
    },

    componentWillMount: function () {
        this.addListenerOn(this.props.events, 'drawerDidOpen', this.drawerDidOpen);
        this.addListenerOn(this.props.events, 'drawerDidClose', this.drawerDidClose);
    },

    componentDidMount: function () {
        var that = this;
        Animated.spring(                          // Base: spring, decay, timing
            that.state.containerViewOpacity,                 // Animate `bounceValue`
            {
                toValue: 1,
                tension: 15
            }
        ).start();
    },

    drawerDidOpen: function () {

    },

    drawerDidClose: function () {
        this.refs.emailTxt.blur();
        this.refs.passwordTxt.blur();
    },

    renderLoadingContainer: function () {
        if (this.state.isLoggingIn) {
            return (
                <View style={this.loginTextContainer()}>
                    <ActivityIndicatorIOS
                        animating={this.state.isLoggingIn}
                        style={[styles.loadingContainerImageView, {height: 80}]}
                        size="large"
                    />
                    <Text style={{height:50, textAlign:"center", color:"white"}}>
                        Logging in...
                    </Text>
                </View>
            );
        }
    },

    loginTextContainer: function () {
        return {
            position: "absolute",
            top: 0,
            left: 0,
            height: Theme.HeightOfDisplay(),
            width: this.props.drawerWidth
        };
    },

    render: function () {
        return (
            <View style={styles.containerView}>
                <Animated.View
                    style={[styles.loginViewContainer, {width: this.props.drawerWidth, opacity: this.state.containerViewOpacity}]}
                    shouldRasterizeIOS={true}>

                    <View style={styles.loginTextContainer}>
                        <Icon
                            style={{width:17, height:17, backgroundColor:"transparent", marginRight:5}}
                            name='ion|locked'
                            size={17}
                            color='#FFF'
                        />
                        <Text style={styles.loginText}>
                            Login
                        </Text>
                    </View>
                    <View style={styles.loginFieldsContainer}>
                        <TextInput
                            style={styles.textStyle}
                            placeholder={"Email Address"}
                            keyboardType={"email-address"}
                            autoCorrect={false}
                            clearButtonMode={"while-editing"}
                            ref="emailTxt"
                            onSubmitEditing={(event) => {
                              this.refs.passwordTxt.focus();
                            }}
                            returnKeyType="next"
                            onChangeText={(value) => this.setState({email: value})}
                        />
                        <TextInput
                            ref="passwordTxt"
                            style={[styles.textStyle]}
                            placeholder={"Password"}
                            secureTextEntry={true}
                            onSubmitEditing={this.executeLogin}
                            returnKeyType="go"
                            onChangeText={(value) => this.setState({password: value})}
                        />

                        <TouchableHighlight style={ styles.loginButtons }
                                            underlayColor={ Theme.DarkThirdTint() }
                                            onPress={ this.executeLogin }>
                            <Text style={styles.loginButtonText}>
                                Login
                            </Text>
                        </TouchableHighlight>

                        <TouchableOpacity onPress={() => this.navigateTo(Routes.getSearchView()) }>
                            <View style={styles.menuLinks}>
                                <Icon
                                    style={{width:20, height:20, marginRight:3, backgroundColor:"transparent" }}
                                    name='fontawesome|search'
                                    size={17}
                                    color={"white"}
                                >
                                </Icon>
                                <Text style={[styles.drawerButtonStyleText]}>
                                    Vehicle Search
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => { this.navigateTo(Routes.getPostVehicleView());  } }>
                            <View style={styles.menuLinks}>
                                <Icon
                                    style={{width:20, height:20, marginRight:3, marginTop:1, backgroundColor:"transparent" }}
                                    name='fontawesome|edit'
                                    size={17}
                                    color={"white"}
                                >
                                </Icon>
                                <Text style={[styles.drawerButtonStyleText]}>
                                    List Your Car
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => alert("TODO") }>
                            <View style={styles.menuLinks}>
                                <Icon
                                    style={{width:20, height:20, marginRight:3, backgroundColor:"transparent" }}
                                    name='fontawesome|user'
                                    size={17}
                                    color={"white"}
                                >
                                </Icon>
                                <Text style={[styles.drawerButtonStyleText]}>
                                    Sign Up
                                </Text>
                            </View>
                        </TouchableOpacity>


                    </View>
                </Animated.View>

                {this.renderLoadingContainer()}
            </View>
        );
    },

    executeLogin: function () {
        this.refs.emailTxt.blur();
        this.refs.passwordTxt.blur();

        var email = this.state.email;
        var password = this.state.password;


        this.setState({
            isLoggingIn: true
        });

        var that = this;

        var loginService = new LoginService(email, password);
        loginService.execute(function (data) {
            if (data.Success == false) {
                alert("Invalid credentials");
                that.setState({
                    isLoggingIn: false
                });
            }
            else {
                var storage = new Storage();
                storage.setValue(Config.LoggedInAuthKey, data.Token).then(function (result) {
                    that.props.events.emit('userLoggedIn', true);
                });
            }

        });
    },

    navigateTo: function (route) {
        this.props.rootView.drawerChangeRoute(route);
        this.props.rootView.closeControlPanel();
    }
});


var styles = StyleSheet.create({
    containerView: {
        flex: 1
    },
    loginViewContainer: {
        flex: 1,
        height: 200,

    },
    loginTextContainer: {
        height: 35,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: "#FFF",
        alignItems: "center",
        flexDirection: "row"
    },
    loginText: {
        color: "#FFF",
        fontSize: 17,
        fontWeight: "100"
    },
    loginFieldsContainer: {
        paddingTop: 10,
        flex: 1
    },
    textStyle: {
        height: 35,
        borderColor: 'gray',
        borderWidth: 1 / PixelRatio.get(),
        backgroundColor: "white",
        borderRadius: 5,
        paddingLeft: 10,
        marginBottom: 10
    },
    loginButtons: {
        height: 35,
        borderRadius: 5,
        backgroundColor: Theme.ThirdTint(),
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15
    },
    loginButtonText: {
        fontSize: 17,
        color: "#FFF"
    },
    menuLinks: {
        flexDirection: "row",
        alignItems: "center",
        height: 35,
    },
    drawerButtonStyleText: {
        color: Theme.TintColor(),
        fontSize: 17,
        fontWeight: "100",
        paddingTop: 10,
        paddingBottom: 10
    }
});

module.exports = DrawerContentNotLoggedInView;
