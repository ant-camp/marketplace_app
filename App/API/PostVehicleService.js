"use strict";


var Config = require("../Config");


class PostVehicleService {
    constructor() {
        this.postVehicleUrl = Config.RootURL + "/api/vehicles/new";
    }

    execute(postVehicleModel, onSuccess) {
        var that = this;
        console.log("Posting vehicle..");
        console.log(postVehicleModel);
        console.log("/");
        fetch(this.postVehicleUrl, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postVehicleModel)
        })
            .then((response) => { console.log(response); return response.json();})
            .then((responseJson) => {
                var successful = true;
                if (responseJson == null) {
                    successful = false;
                }

                if (responseJson.ok != true && responseJson.id == null) {
                    successful = false;
                }

                onSuccess(successful);
                console.log(responseJson);
            })
            .catch(function (err) {
                onSuccess(false);
                console.log(err);
            });

    }
}


module.exports = PostVehicleService;
