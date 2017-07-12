"use strict";

class FilterDataModel {
    constructor() {
        this.ALL_VALUE = 0;
        this.filterDefaults();
    }

    setMakeFilter(name, val) {
        this._setFilter("Make", name, val);
    }

    setModelFilter(name, val) {
        this._setFilter("Model", name, val);
    }

    setYearFilter(name, val) {
        this._setFilter("Year", name, val);
    }

    setMinimumFilter(name, val) {
        this._setFilter("Minimum", name, val);
    }

    setMaximumFilter(name, val) {
        this._setFilter("Maximum", name, val);
    }

    commitChanges() {
        for (var key in this.TempChanges) {
            var value = this.TempChanges[key];
            this[key] = value;
        }

        this._checkFilters();
    }

    filterDefaults() {
        this.Make = {Value: this.ALL_VALUE};
        this.Model = {Value: this.ALL_VALUE};
        this.Year = {Value: this.ALL_VALUE};
        this.Minimum = {Value: this.ALL_VALUE, Name: "None"};
        this.Maximum = {Value: this.ALL_VALUE, Name: "None"};
        this.HasFilters = false;
        this.TempChanges = {};
        console.log("Cleared filters");
    }

    filtersDisplayText() {
        if (this.HasFilters == false) {
            return null;
        }

        var filteredText = "Filtered by ";
        var filteredByArray = [];
        if (this.Make.Value != this.ALL_VALUE) {
            filteredByArray.push("Make: " + this.Make.Name);
        }

        if (this.Model.Value != this.ALL_VALUE) {
            filteredByArray.push("Model: " + this.Model.Name);
        }

        if (this.Year.Value != this.ALL_VALUE) {
            filteredByArray.push("Year: " + this.Year.Name);
        }

        if (this.Minimum.Value != this.ALL_VALUE) {
            filteredByArray.push("Minimum: " + this.Minimum.Name);
        }

        if (this.Maximum.Value != this.ALL_VALUE) {
            filteredByArray.push("Maximum: " + this.Maximum.Name);
        }

        filteredText = filteredText + filteredByArray.join(", ");

        return filteredText;
    }

    _setFilter(key, name, val) {
        this.TempChanges[key] = {Name: name, Value: val};
    }

    _checkFilters() {
        var listOfValuesToCheck = [
            this.Make,
            this.Model,
            this.Year,
            this.Minimum,
            this.Maximum
        ];

        this.HasFilters = false;
        for (var index in listOfValuesToCheck) {
            var data = listOfValuesToCheck[index];
            if (data.Value != this.ALL_VALUE) {
                this.HasFilters = true;
                break;
            }
        }

        console.log("Has filters? " + this.HasFilters);
        console.log(this);
    }
}


module.exports = FilterDataModel;
