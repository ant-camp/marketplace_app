
"use strict";

var React = require("react-native");
var Routes = require("../Routes");
var { Icon, } = require('react-native-icons');
var Theme = require("../Helpers/Theme");
var numeral = require('numeral');
var Communications = require('react-native-communications');
var CustomActionSheet = require("../Components/CustomActionSheet");
var SellerLocationMapView = require("../Components/SellerLocationMapView");
var ImageGalleryView = require("../Components/ImageGalleryView");

var {
  StyleSheet,
  View,
  Image,
  ScrollView,
  PixelRatio,
  Text,
  TouchableOpacity
} = React;

var imageHeightPercentage = .6666666666;

var VehicleDetailsView = React.createClass({
  getInitialState: function () {
    return {
      renderMapView: false
    }
  },

  componentDidMount: function () {
    var that = this;

    setTimeout(function () {
      that.setState({
        renderMapView: true
      });
    }, 500);
  },

  renderMapView: function (vehicle) {
    if (this.state.renderMapView) {
      if (vehicle.SellerLat != null && vehicle.SellerLon != null) {

        return (<SellerLocationMapView style={styles.mapViewStyle}
          region={{
            latitude: vehicle.SellerLat,
            longitude: vehicle.SellerLon,
            latitudeDelta:0.1,
            longitudeDelta:0.1
          }}/>)
        }
      }
    },

    phoneNumberTapped: function (vehicle) {
      var actionSheet = new CustomActionSheet({
        title: "Select a messaging option",
        buttons: ["Cancel", "Text Message", "Phone call"],
        cancelButtonIndex: 0
      });

      actionSheet.show((buttonIndex) => {
        if (buttonIndex == 1) //Text Message
        {
          Communications.text(vehicle.SellerPhone);
        }
        else if (buttonIndex == 2) //Phone call
        {
          Communications.phonecall(vehicle.SellerPhone);
        }
      });

    },

    render: function () {
      var vehicle = this.props.vehicleData.getProperties();

      return (
        <View style={styles.container}>
          <ScrollView>
            <View style={styles.imageGalleryView}>
              <ImageGalleryView style={{flex:1, backgroundColor:"black"}} imageUrls={vehicle.VehicleImages} ref="imageGallery" shouldShowGalleryWhenTapped={true}/>
            </View>

            <View style={[styles.vehicleDataView]}>
              <Text style={styles.tableSectionTitle}>
                Vehicle Info
              </Text>
              <View
                style={[styles.tableViewRow, {borderTopWidth:1 / PixelRatio.get(), borderTopColor:"#CCC"}]}>
                <Text style={styles.tableViewKeyText}>
                  Vehicle Make
                </Text>
                <Text style={styles.tableViewValueText}>
                  {vehicle.VehicleMake}
                </Text>
              </View>

              <View style={styles.tableViewRow}>
                <Text style={styles.tableViewKeyText}>
                  Vehicle Model
                </Text>
                <Text style={styles.tableViewValueText}>
                  {vehicle.VehicleModel}
                </Text>
              </View>

              <View style={styles.tableViewRow}>
                <Text style={styles.tableViewKeyText}>
                  Vehicle Year
                </Text>
                <Text style={styles.tableViewValueText}>
                  {vehicle.VehicleYear}
                </Text>
              </View>

              <View style={styles.tableViewRow}>
                <Text style={styles.tableViewKeyText}>
                  Price
                </Text>
                <Text style={styles.tableViewValueText}>
                  $ {numeral(vehicle.VehiclePriceText).format("0,0")}
                </Text>
              </View>

              <View style={styles.tableViewRow}>
                <Text style={styles.tableViewKeyText}>
                  Mileage
                </Text>
                <Text style={styles.tableViewValueText}>
                  {numeral(vehicle.VehicleMileage).format("0,0")}
                </Text>
              </View>

              <View style={styles.tableViewRow}>
                <Text style={styles.tableViewKeyText}>
                  Exterior Color
                </Text>
                <Text style={styles.tableViewValueText}>
                  {vehicle.VehicleExteriorColor}
                </Text>
              </View>

              <View style={styles.tableViewRow}>
                <Text style={styles.tableViewKeyText}>
                  Interior Color
                </Text>
                <Text style={styles.tableViewValueText}>
                  {vehicle.VehicleInteriorColor}
                </Text>
              </View>

              <View style={styles.tableViewRow}>
                <Text style={styles.tableViewKeyText}>
                  Vin
                </Text>
                <Text style={[styles.tableViewValueText, {flex:2}]}>
                  {vehicle.VehicleVin}
                </Text>
              </View>

              <Text style={styles.tableSectionTitle}>
                Notes By Seller
              </Text>
              <View style={styles.tableViewNotes}>
                <Text style={[styles.tableViewNotes]}>
                  {vehicle.VehicleNotes}
                </Text>
              </View>



              <Text style={styles.tableSectionTitle}>
                Seller Information
              </Text>

              <View
                style={[styles.tableViewRow, {borderTopWidth:1 / PixelRatio.get(), borderTopColor:"#CCC"}]}>
                <Text style={styles.tableViewKeyText}>
                  Name
                </Text>
                <Text style={styles.tableViewValueText}>
                  {(vehicle.SellerName != null) ? vehicle.SellerName : "N/A"}
                </Text>
              </View>

              <View style={styles.tableViewRow}>
                <Text style={styles.tableViewKeyText}>
                  Phone
                </Text>
                <TouchableOpacity style={{flex:1}} onPress={() => this.phoneNumberTapped(vehicle)}>
                  <View
                    style={{flex:1, flexDirection:"row", alignItems:"flex-end", justifyContent:"flex-end"}}>
                    <Icon
                      style={{width:17, height:17, backgroundColor:"transparent", marginRight:5}}
                      name='ion|ios-telephone'
                      size={17}
                      color={Theme.SecondaryTint()}
                      />
                    <Text style={[{color:Theme.SecondaryTint()}]}>
                      {vehicle.SellerPhone}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.tableViewRow}>
                <Text style={styles.tableViewKeyText}>
                  City/State
                </Text>
                <Text style={styles.tableViewValueText}>
                  {vehicle.SellerCity} / {vehicle.SellerState}
                </Text>
              </View>

              <Text style={styles.tableSectionTitle}>
                Seller Location
              </Text>
              {this.renderMapView(vehicle)}
            </View>
          </ScrollView>
        </View>
      )
    }
  });

  var styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#EFEFF4",
    },
    imageGalleryView: {
      flex: 1,
      height: Theme.WidthOfDisplay() * imageHeightPercentage,
      backgroundColor: "#000"
    },
    vehicleDataView: {
      flex: 1.5
    },

    vehicleImage: {
      height: Theme.WidthOfDisplay() * imageHeightPercentage,
      width: Theme.WidthOfDisplay(),
      backgroundColor: "#000"
    },
    tableSectionTitle: {
      color:"#555",
      fontSize:15,
      paddingLeft:7,
      paddingTop:12,
      paddingBottom:7
    },
    tableViewRow: {
      height: 45,
      backgroundColor: "white",
      borderBottomWidth: 1 / PixelRatio.get(),
      borderBottomColor: "#CCC",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
      paddingLeft: 10,
      paddingRight: 10
    },
    tableViewNotes: {
      backgroundColor: "white",
      borderBottomWidth: 1 / PixelRatio.get(),
      borderBottomColor: "#CCC",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      paddingLeft: 4,
      paddingRight: 4,
      paddingTop:4,
      paddingBottom:4
    },
    tableViewKeyText: {
      textAlign: "left",
      flex: 1,
      color: "#333",
      fontSize: 15
    },
    tableViewValueText: {
      textAlign: "right",
      flex: 1,
      fontWeight: "bold",
      fontSize: 15
    },
    mapViewStyle: {
      height: 200,
      borderWidth: 1 / PixelRatio.get(),
      borderColor: "#CCC"
    }
  });

  module.exports = VehicleDetailsView;
