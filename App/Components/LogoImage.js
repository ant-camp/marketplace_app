
var React = require("react-native");
var Theme = require("../Helpers/Theme");

var {
    StyleSheet,
    Image,
    } = React;

var LogoImage = React.createClass({
    render: function() {
        return (
            <Image source={require('../Resources/Images/logo.png')} style={[styles.logo, this.props.style]} resizeMode="contain"/>
        );
    }
});

var styles = StyleSheet.create({
    logo: {
        width:Theme.WidthOfDisplay() * 0.75
    },
});



module.exports = LogoImage;
