'use strict';

var Config = require("../Config");

class GetModelsService {
    constructor() {
        this.MAKES_STORAGE_KEY = "MODELS";
        this.apiUrl = Config.RootURL + "api/vehicles/model.json";
    }

    Execute(makeName) {
        var that = this;
        makeName = makeName.replace(" ", "");
        return new Promise(function (resolve, reject) {
            fetch(that.apiUrl + "?make_name=" + makeName).then((result) => {
                return result.json();
            }).then(function (json) {
                resolve(json);
            }).catch(function (err) {
                console.log("Error fetching data");
                reject(err);
            });
        });
    }
}

module.exports = GetModelsService;
