'use strict';

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

var SignUpView = React.createClass({
    getInitialState: function () {
        this.postVehicleModel = PostVehicleModel.getInstance();

        this.states = [
            {DisplayName: "Florida", Value: "Florida"}
        ];
        return {}
    },

    render: function () {


        return (
            <GiftedForm
                formName='signupForm' // GiftedForm instances that use the same name will also share the same states
                openModal={(route) => {
                    route.giftedForm = true;
                    this.props.navigator.push(route); // The ModalWidget will be opened using this method. Tested with ExNavigator
                }}
                validators={{
                    name: {
                        title: "Name",
                        validate: [
                            { validator: "isLength", arguments: [1] }
                        ],
                    },
                    city: {
                        title: "City",
                        validate: [
                            { validator: "isLength", arguments: [1] }
                        ],
                    },
                    state: {
                        title: "State",
                        validate: [
                            { validator: "isLength", arguments: [1] }
                        ],
                    },
                    postalCode: {
                        title: "Postal Code",
                        validate: [
                            { validator: "isLength", arguments: [5, 9] }
                        ],
                    },
                    phone: {
                        title: "Phone",
                        validate: [
                            { validator: "isLength", arguments: [1] }
                        ],
                    },
                    email: {
                        title: "Email",
                        validate: [
                            { validator: "isLength", arguments: [1] }
                        ],
                    },
                }}
            >

                <GiftedForm.GroupWidget title="Contact Information">
                    <GiftedForm.TextInputWidget
                        name='name'
                        title='Name*'
                        placeholder='John Smith'
                        clearButtonMode='while-editing'
                        textAlign="right"
                        style={{paddingRight:10, flex:1}}
                        autoCapitalize="words"
                    />
                    <GiftedForm.TextInputWidget
                        name='city'
                        title='City*'
                        placeholder='Orlando'
                        clearButtonMode='while-editing'
                        textAlign="right"
                        style={{paddingRight:10, flex:1}}
                        autoCapitalize="words"
                    />

                    <GiftedForm.ModalWidget
                        title='State*'
                        displayValue='state'
                        scrollEnabled={true} // true by default
                    >
                        <GiftedForm.SeparatorWidget/>

                        <GiftedForm.SelectWidget name='state' title='State' multiple={false}>
                            {this.states.map(function (record, index) {
                                return <GiftedForm.OptionWidget key={"state-" + index}
                                                                title={record.DisplayName} value={record.Value}/>;
                            })}

                        </GiftedForm.SelectWidget>

                    </GiftedForm.ModalWidget>


                    <GiftedForm.TextInputWidget
                        name='postalCode'
                        title='Postal Code*'
                        placeholder='32801'
                        clearButtonMode='while-editing'
                        keyboardType="numeric"
                        textAlign="right"
                        style={{paddingRight:10, flex:1}}
                    />
                    <GiftedForm.TextInputWidget
                        name='phone'
                        title='Phone*'
                        placeholder='999-999-9999'
                        clearButtonMode='while-editing'
                        keyboardType="numbers-and-punctuation"
                        textAlign="right"
                        style={{paddingRight:10, flex:1}}
                    />
                    <GiftedForm.TextInputWidget
                        name='email'
                        title='Email*'
                        placeholder='jsmith@email.com'
                        clearButtonMode='while-editing'
                        keyboardType="email-address"
                        textAlign="right"
                        autoCorrect={false}
                        style={{paddingRight:10, flex:1}}
                    />

                </GiftedForm.GroupWidget>

                <GiftedForm.SubmitWidget
                    title='Submit Car Listing'
                    widgetStyles={{
                        submitButton: {
                          backgroundColor: Theme.PrimaryColor(),
                        }
                      }}
                    onSubmit={(isValid, values, validationResults, postSubmit = null, modalNavigator = null) => {



                        if (isValid === true) {
                            this.postVehicleModel.owner_attributes.name = values.name;
                            this.postVehicleModel.owner_attributes.city = values.city;
                            this.postVehicleModel.owner_attributes.state = values.state[0];
                            this.postVehicleModel.owner_attributes.postal_code = values.postalCode;
                            this.postVehicleModel.owner_attributes.phone_number = values.phone;
                            this.postVehicleModel.owner_attributes.email = values.email;


                            var pss = new PostVehicleService();
                            var that = this;
                            pss.execute(this.postVehicleModel, function(success) {
                                if (success) {
                                    alert("Successfully listed your car. Thank you for using Veehic!");
                                    that.props.navigator.resetTo(Routes.getPostVehicleView());
                                } else {
                                    postSubmit(["An error has occurred submitting your listing. Please verify that all required fields have been entered, and that your VIN number is valid. If the problem persists, please contact support or try again later. We apologize for the inconvenience."]);
                                }

                            });


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
            ;
    }

});


module.exports = SignUpView;
