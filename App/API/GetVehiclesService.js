
"use strict";

var Config = require("../Config");
var Vehicle = require("../Database/Vehicle");

class GetVehiclesService {
    constructor() {
        console.log("Instantiating new Get Vehicles Service");
    }

    getVehicleData(pageNumber, maxResults, filterDataModel) {
        var that = this;
        return new Promise(function (resolve, reject) {
            var apiUrl = Config.RootURL;
            apiUrl += "api/vehicles/search?page=" + pageNumber + "&per_page=" + maxResults;

            if (filterDataModel.HasFilters) {
                if (filterDataModel.Make.Value != filterDataModel.ALL_VALUE) {
                    apiUrl += "&make_name=" + filterDataModel.Make.Name;
                }

                if (filterDataModel.Model.Value != filterDataModel.ALL_VALUE) {
                    apiUrl += "&model_name=" + filterDataModel.Model.Name;
                }

                if (filterDataModel.Year.Value != filterDataModel.ALL_VALUE) {
                    apiUrl += "&make_year=" + filterDataModel.Year.Name;
                }

                if (filterDataModel.Minimum.Value != filterDataModel.ALL_VALUE) {
                    apiUrl += "&price_min=" + filterDataModel.Minimum.Value;

                }

                if (filterDataModel.Maximum.Value != filterDataModel.ALL_VALUE) {
                    apiUrl += "&price_max=" + filterDataModel.Maximum.Value;

                }

            }

            console.log(apiUrl);


            fetch(apiUrl).then((result) => {
                return result.json();
            }).then(function (json) {
                var vehiclesArray = that.processJson(json, pageNumber, maxResults);
                resolve(vehiclesArray);
            }).catch(function (err) {

                console.log("Error fetching data");
                reject(err);
            });
        });
    }


    processJson(json, pageNumber, maxResults) {
        var vehiclesArray = [];
        var maxCount = maxResults;

        for (var index in json.vehicles) {
            // if (index < (pageNumber * maxResults)) {
            //     continue;
            // }
            //
            // if (maxCount == 0) {
            //     break;
            // }

            var dataObject = json.vehicles[index];

            var newVehicle = new Vehicle({
                VehicleMake: dataObject["make"]["name"],
                VehicleModel: dataObject["model"]["name"],
                VehicleYear: dataObject["year"],
                VehicleColor: dataObject["exterior_color"] + "/" + dataObject["interior_color"],
                VehicleExteriorColor: dataObject["exterior_color"],
                VehicleInteriorColor: dataObject["interior_color"],
                VehiclePriceText: dataObject["price_in_cents"],
                VehicleMileage: dataObject["mileage"],
                VehicleVin: dataObject["vin"],
                VehicleNotes: dataObject["notes"],

                SellerName: dataObject["owners_attributes"]["name"],
                SellerPhone: dataObject["owners_attributes"]["phone_number"],
                SellerCity: dataObject["owners_attributes"]["city"],
                SellerState: dataObject["owners_attributes"]["state"],
                SellerLat: dataObject["owners_attributes"]["latitude"],
                SellerLon: dataObject["owners_attributes"]["longitude"]
            });

            var vehicleImages = [];
            var dataObjectVehicleImages = dataObject["image_attachments"];
            for (var imageIndex in dataObjectVehicleImages) {
                var imageObj = dataObjectVehicleImages[imageIndex];
                var imageUrl = imageObj["file_url"].trim();
                vehicleImages.push(imageUrl);
            }

            newVehicle.setProperties({
                VehicleImages: vehicleImages
            });

            vehiclesArray.push(newVehicle);
            maxCount--;
        }

        return vehiclesArray;
    }
}

module.exports = GetVehiclesService;
