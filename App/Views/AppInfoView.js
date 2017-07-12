"use strict";

var React = require("react-native");
var Routes = require("../Routes");
var { Icon, } = require('react-native-icons');
var Theme = require("../Helpers/Theme");
var LogoImage = require("../Components/LogoImage");

var {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    ScrollView
    } = React;

var AppInfoView = React.createClass({
    closeModal: function () {
        this.props.vehicleSearchView.setState({shouldShowNewUserModal: false});
    },

    //TODO: Need to figure out proper scrollview implementation for Android
    render: function () {
        return (
            <View style={styles.container}>
                <Image
                    style={styles.backgroundImage}
                    source={require('../Resources/Images/bg.png')}>

                    <ScrollView style={styles.scrollView} horizontal={true} pagingEnabled={true}>
                        <View style={[styles.firstInnerView, styles.contentView]}>
                            <LogoImage style={styles.logo}/>

                            <Text style={styles.messageContent}>
                                Buying a vehicle in the private-party market has never been safer, or smarter
                            </Text>

                            <View style={{alignItems:"center", flex:1, justifyContent: "flex-end", marginBottom:20 }}>
                                <View style={styles.swipeButton} activeOpacity={0.85}>
                                    <Text style={styles.nextButtonTextColor}>
                                        Swipe Right For More
                                    </Text>
                                    <Icon
                                        name='fontawesome|chevron-right'
                                        size={15}
                                        color='#FFF'
                                        style={styles.icon}
                                    />
                                </View>
                            </View>
                        </View>

                        <View style={[styles.secondInnerView, styles.contentView]}>
                            <LogoImage style={styles.logo}/>

                            <Text style={styles.headerStyle}>
                                Private Party Only
                            </Text>
                            <Text style={styles.paragraphStyle}>
                                No Dealers - Peer to Peer "For Sale by Owner" Only
                            </Text>

                            <View style={styles.break}></View>

                            <Text style={styles.headerStyle}>
                                Safety
                            </Text>
                            <Text style={styles.paragraphStyle}>
                                Safety is our #1 mission at Veehic!
                                Deal with verified sellers and buyers only
                                conveniently and completely online.
                            </Text>

                            <View style={styles.break}></View>

                            <Text style={styles.headerStyle}>
                                Secure Transaction
                            </Text>
                            <Text style={styles.paragraphStyle}>
                                Cashier checks are a thing of the past.
                                Ditch the cashier check and seamlessly manage your transaction through Veehic's Escrow Service.
                            </Text>


                            <View style={{alignItems:"center", flex:1, justifyContent: "flex-end", marginBottom:20 }}>
                                <TouchableOpacity style={styles.nextButton} activeOpacity={0.85} onPress={this.closeModal}>
                                    <Text style={styles.nextButtonTextColor}>
                                        Get Started!
                                    </Text>

                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </Image>
            </View>
        );
    },
});

var styles = StyleSheet.create({
    container: {
        backgroundColor: '#444',
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        width: null,
        height: null, //Strange, but this actually makes the background image cover the entire background
    },
    firstInnerView: {},
    secondInnerView: {},
    contentView: {
        backgroundColor: "transparent",
        alignItems: "center",
        width:Theme.WidthOfDisplay(),
        height:Theme.HeightOfDisplay()
    },
    logo: {
        marginTop: 60,
    },
    messageContent: {
        paddingLeft: 25,
        paddingRight: 25,
        textAlign: "center",
        color: "white",
        fontSize: 19,
        marginTop: 15
    },
    paragraphStyle: {
        paddingLeft: 25,
        paddingRight: 25,
        textAlign: "center",
        color: "white",
        fontSize: 15,
        marginTop: 2
    },
    headerStyle: {
        paddingLeft: 25,
        paddingRight: 25,
        textAlign: "center",
        color: "white",
        fontSize: 21,
        marginTop: 20,
        fontWeight: "bold"
    },
    swipeButton: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 30,
        paddingRight: 30,
        borderRadius: 8,
        flexDirection:"row",
    },
    nextButton: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 30,
        paddingRight: 30,
        borderRadius: 8,
        flexDirection:"row",
        backgroundColor: Theme.PrimaryColor()
    },
    nextButtonTextColor: {
        color: "white",
        fontSize: 18
    },
    scrollView: {
        backgroundColor: "transparent",
        flex: 1,
        flexDirection: "row",
    },
    icon: {
        width:25,
        height:25
    },
    break: {
        height:15
    }
});

module.exports = AppInfoView;