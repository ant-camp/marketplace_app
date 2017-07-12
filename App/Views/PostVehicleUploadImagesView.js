"use strict";

var React = require("react-native");
var {GiftedForm, GiftedFormManager} = require('react-native-gifted-form');
var Theme = require("../Helpers/Theme");
var Routes = require("../Routes");
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;
var FilePickerModule = React.NativeModules.FilePickerModule;
var PostVehicleModel = require("../Database/PostVehicleModel");

var {
    Text,
    StyleSheet,
    View,
    TouchableHighlight,
    TouchableOpacity,
    ScrollView,
    Image,
    ActionSheetIOS,
    ActivityIndicatorIOS
    } = React;


var PostVehicleUploadImagesView = React.createClass({
    getInitialState: function () {
        this.postVehicleModel = PostVehicleModel.getInstance();
        var existingPhotoData = [];
        this.postVehicleModel.attachments.map(function(attach, index) {
            var source = {uri: attach, isStatic: true}
            existingPhotoData.push(source);
        });

        return {
            photoData: existingPhotoData,
            animating: false
        };
    },

    render: function () {
        return (
            <ScrollView style={style.container}>
                {this.renderPhotoRows()}
                {
                    (() => {
                        if (this.state.animating) {
                            return (

                                    <ActivityIndicatorIOS
                                        animating={this.state.animating}
                                        style={[style.centering, {height: 60}]}
                                        size="large"
                                    />

                            );
                        }
                    }).call()
                }
                <View style={{flex:1, paddingLeft:10, paddingRight: 10, marginTop:10}}>
                    <TouchableOpacity style={style.uploadPhoto} onPress={this.pressedOnUploadButton}>
                        <Text style={style.uploadPhotoText}>Upload Photo</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    },

    renderPhotoRows: function () {
        var that = this;
        var photoRows = this.state.photoData.map(function (obj, index) {
            return (

                <TouchableHighlight key={"photo-" + index} onPress={() => that.tappedOnExistingPhotoIndex(index)}>
                    <View style={style.row}>
                        <Image
                            source={obj}
                            style={style.rowImage}
                        />
                        <Text style={style.rowText}>
                            {"Upload " + (index + 1)}
                        </Text>
                    </View>
                </TouchableHighlight>
            );
        });

        return photoRows;
    },

    tappedOnExistingPhotoIndex: function(index) {
        var currentIndex = index;
        var that = this;
        ActionSheetIOS.showActionSheetWithOptions({
                options: ["Cancel", "Remove"],
                cancelButtonIndex: 0
            },
            (buttonIndex) => {
                //delete
                if (buttonIndex == 1) {
                    var photoData = that.state.photoData;
                    photoData.splice(currentIndex, 1);

                    this.setState({
                        photoData: photoData
                    });
                }
            });
    },

    pressedOnUploadButton: function () {
        var that = this;
        var options = {
            title: 'Select a photo',
            maxWidth: 1000
        };

        UIImagePickerManager.showImagePicker(options, (response) => {
            if (response.data != null) {
                that.setState({
                    animating:true
                });
                //upload file
                FilePickerModule.uploadFile(response.data, function (urlOfFile, error) {
                    if (error == null) {
                        that.postVehicleModel.attachments.push(urlOfFile);

                        var source = {uri: urlOfFile, isStatic: true};

                        var photoData = that.state.photoData;
                        photoData.push(source);

                        that.setState({
                            photoData: photoData,
                            animating:false
                        });
                    }
                });
            }

        });
    }

});

var style = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
        backgroundColor: "#EEEEEE"
    },
    row: {
        height: 80,
        backgroundColor: "white",
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#CCC"
    },
    rowImage: {
        width: 100
    },
    rowText: {
        flex: 5,
        paddingLeft: 10,
        fontSize: 17,
        paddingTop: 30,
    },
    uploadPhoto: {
        backgroundColor: "#0C6EB0",
        padding: 10,
    },
    uploadPhotoText: {
        color: "white",
        fontSize: 15,
        textAlign: "center"
    },
    centering: {
        justifyContent:"center",
        alignItems:"center"
    }

});

module.exports = PostVehicleUploadImagesView;
