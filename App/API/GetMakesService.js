'use strict';

var Config = require("../Config");
var React = require("react-native");

var {
    AsyncStorage
    } = React;


class GetMakesService {
    constructor() {
        this.MAKES_STORAGE_KEY = "MAKES";
        this.apiUrl = Config.RootURL + "api/vehicles/make.json";
    }

    Execute() {
        var that = this;
        return new Promise(function (resolve, reject) {
            fetch(that.apiUrl).then((result) => {
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

module.exports = GetMakesService;
