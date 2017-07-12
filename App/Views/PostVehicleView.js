"use strict";

var React = require("react-native");
var {GiftedForm, GiftedFormManager} = require('react-native-gifted-form');
var Theme = require("../Helpers/Theme");
var Routes = require("../Routes");
var PostVehicleModel = require("../Database/PostVehicleModel");
var PostVehicleService = require("../API/PostVehicleService");

var {
    Text,
    StyleSheet,
    View,
    ScrollView,
    } = React;


var PostVehicleView = React.createClass({
    getInitialState() {
        this.interiorColors = [
            {DisplayName: "Beige", Value: "Beige"},
            {DisplayName: "Black", Value: "Black"},
            {DisplayName: "Blue", Value: "Blue"},
            {DisplayName: "Brown", Value: "Brown"},
            {DisplayName: "Burgandy", Value: "Burgandy"},
            {DisplayName: "Charcoal", Value: "Charcoal"},
            {DisplayName: "Gold", Value: "Gold"},
            {DisplayName: "Grey", Value: "Grey"},
            {DisplayName: "Green", Value: "Green"},
            {DisplayName: "White", Value: "White"},
            {DisplayName: "Off White", Value: "Off White"},
            {DisplayName: "Orange", Value: "Orange"},
            {DisplayName: "Pink", Value: "Pink"},
            {DisplayName: "Purple", Value: "Purple"},
            {DisplayName: "Red", Value: "Red"},
            {DisplayName: "Silver", Value: "Silver"},
            {DisplayName: "Tan", Value: "Tan"},
            {DisplayName: "Turquoise", Value: "Turquoise"},
            {DisplayName: "Yellow", Value: "Yellow"}
        ];

        this.exteriorColors = this.interiorColors;

        PostVehicleModel.clearInstance();
        this.postVehicleModel = PostVehicleModel.getInstance();

        GiftedFormManager.reset("postVehicleForm");
        GiftedFormManager.reset("signupForm")

        return {}
    },

    componentWillUnmount: function () {

    },

    render: function () {
        return (
            <GiftedForm
                formName='postVehicleForm' // GiftedForm instances that use the same name will also share the same states
                openModal={(route) => {
                    route.giftedForm = true;
                    this.props.navigator.push(route); // The ModalWidget will be opened using this method. Tested with ExNavigator
                }}
                validators={{
                    carInfoVin: {
                        title: "VIN",
                        validate: [
                            { validator: "isLength", arguments: [17, 17], message: '{TITLE} is required. Must be {ARGS[0]} characters long'  }
                        ],

                    },
                    carInfoAskingPrice: {
                        title: "Asking Price",
                        validate: [
                            { validator: "isLength", arguments: [1]  }
                        ]
                    },
                    carInfoMileage: {
                        title: "Mileage",
                        validate: [
                            { validator: "isLength", arguments: [1]  }
                        ]
                    },
                    carInfoInteriorColor: {
                        title: "Interior Color",
                        validate: [
                            { validator: "isLength", arguments: [1]  }
                        ]
                    },
                    carInfoExteriorColor: {
                        title: "Exterior Color",
                        validate: [
                            { validator: "isLength", arguments: [1]  }
                        ]
                    }
                }}
            >

                <GiftedForm.GroupWidget title="Car Information">
                    <GiftedForm.TextInputWidget
                        name='carInfoVin'
                        title='VIN*'
                        placeholder='XXXXXXXXXXXXXXXXX'
                        clearButtonMode='while-editing'
                        textAlign="right"
                        maxLength={17}
                        style={{paddingRight:10, flex:1}}
                        autoCorrect={false}
                        autoCapitalize="characters"
                    />

                    <GiftedForm.TextInputWidget
                        name='carInfoAskingPrice'
                        title='Asking Price*'
                        placeholder='$5000'
                        clearButtonMode='while-editing'
                        textAlign="right"
                        style={{paddingRight:10, flex:1}}
                        keyboardType="numeric"
                    />

                    <GiftedForm.TextInputWidget
                        name='carInfoMileage'
                        title='Mileage*'
                        placeholder='100'
                        clearButtonMode='while-editing'
                        textAlign="right"
                        style={{paddingRight:10, flex:1}}
                        keyboardType="numeric"
                    />


                    <GiftedForm.ModalWidget
                        title='Interior Color*'
                        displayValue='carInfoInteriorColor'
                        scrollEnabled={true} // true by default
                    >
                        <GiftedForm.SeparatorWidget/>

                        <GiftedForm.SelectWidget name='carInfoInteriorColor' title='Interior Color' multiple={false}>
                            {this.interiorColors.map(function (record, index) {
                                return <GiftedForm.OptionWidget key={"interior-color-" + index}
                                                                title={record.DisplayName} value={record.Value}/>;
                            })}

                        </GiftedForm.SelectWidget>

                    </GiftedForm.ModalWidget>

                    <GiftedForm.ModalWidget
                        title='Exterior Color*'
                        displayValue='carInfoExteriorColor'
                        scrollEnabled={true} // true by default
                    >
                        <GiftedForm.SeparatorWidget/>

                        <GiftedForm.SelectWidget name='carInfoExteriorColor' title='Exterior Color' multiple={false}>
                            {this.exteriorColors.map(function (record, index) {
                                return <GiftedForm.OptionWidget key={"exterior-color-" + index}
                                                                title={record.DisplayName} value={record.Value}/>;
                            })}
                        </GiftedForm.SelectWidget>

                    </GiftedForm.ModalWidget>


                </GiftedForm.GroupWidget>


                <GiftedForm.TextAreaWidget
                    name='carInfoSellerComments'
                    placeholder='Seller Comments'
                />

                <GiftedForm.SeparatorWidget/>
                <GiftedForm.SubmitWidget
                    title='Next'
                    widgetStyles={{
                        submitButton: {
                          backgroundColor: Theme.PrimaryColor(),
                        }
                      }}
                    onSubmit={(isValid, values, validationResults, postSubmit = null, modalNavigator = null) => {
                         //testing this
                        var postVehicleModel = {
                            attachments: ["https://www.filepicker.io/api/file/94Zy6dYsQkCSgtZeBfLJ"],
                            exterior_color: "Grey",
                            interior_color: "Blue",
                            mileage: "2",
                            notes: undefined,
                            owner_attributes: {
                                city: "Orlando",
                                email: "123@asd.com",
                                name: "Marco Ledesma",
                                phone_number: "123",
                                postal_code: "23123",
                                state: "Florida"
                            },
                            price_in_cents: 300,
                            vin: "2HGES16505H527128"
                        };

                        var testService = new PostVehicleService();
                        testService.execute(postVehicleModel, function(result) {
                            alert(result);
                        });
                        //testing this


                        if (isValid === true) {
                            this.postVehicleModel.vin = values.carInfoVin;

                            if (values.carInfoAskingPrice.indexOf(".") == -1)
                            {
                                values.carInfoAskingPrice += "00";
                            }


                            this.postVehicleModel.price_in_cents = parseFloat(values.carInfoAskingPrice);
                            this.postVehicleModel.mileage = values.carInfoMileage;
                            this.postVehicleModel.interior_color = values.carInfoInteriorColor[0];
                            this.postVehicleModel.exterior_color = values.carInfoExteriorColor[0];
                            this.postVehicleModel.notes = values.carInfoSellerComments;

                            this.props.navigator.push(Routes.getPostVehicleUploadImagesView());
                            postSubmit();

                          /* Implement the request to your server using values variable
                          ** then you can do:
                          ** postSubmit(); // disable the loader
                          ** postSubmit(['An error occurred, please try again']); // disable the loader and display an error message
                          ** postSubmit(['Username already taken', 'Email already taken']); // disable the loader and display an error message
                          ** GiftedFormManager.reset('signupForm'); // clear the states of the form manually. 'signupForm' is the formName used
                          */
                        }
                      }}
                />
            </GiftedForm>
        )
    }
});

var style = StyleSheet.create({});


module.exports = PostVehicleView;
