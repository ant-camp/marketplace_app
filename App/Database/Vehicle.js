
var DatabaseObject = require("./DatabaseObject");

class Vehicle extends DatabaseObject {
    constructor(props) {
        if (props == null) {
            props = {};
        }

        var properties = {};
        properties.VehicleModel = props.VehicleModel;
        properties.VehicleMake = props.VehicleMake;
        properties.VehicleYear = props.VehicleYear;
        properties.VehicleImages = props.VehicleImages;
        properties.VehiclePriceText = props.VehiclePriceText;
        properties.VehicleColor = props.VehicleColor;
        properties.VehicleExteriorColor = props.VehicleExteriorColor;
        properties.VehicleInteriorColor = props.VehicleInteriorColor;
        properties.VehicleMileage = props.VehicleMileage;
        properties.VehicleVin = props.VehicleVin;
        properties.VehicleNotes = props.VehicleNotes;

        properties.SellerName = props.SellerName;
        properties.SellerPhone = props.SellerPhone;
        properties.SellerCity = props.SellerCity;
        properties.SellerState = props.SellerState;
        properties.SellerLat = parseFloat(props.SellerLat);
        properties.SellerLon = parseFloat(props.SellerLon);


        super(properties);
    }
}

module.exports = Vehicle;
