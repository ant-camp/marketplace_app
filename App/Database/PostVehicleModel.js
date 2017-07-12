"use strict";

var instance = null;

class PostVehicleModel {
    constructor() {
        this.vin = null; //string
        this.price_in_cents = null; //integer
        this.mileage = null; //integer
        this.interior_color = null; //string
        this.exterior_color = null; //string
        this.notes = null; //string
        this.attachments = []; //array

        this.owner_attributes = {
            name: null, //string
            city: null, //string
            state: null, //string
            postal_code: null, //string
            phone_number: null, //string
            email: null //string
        };
    }

    static getInstance() {
        if (instance == null) {
            instance = new PostVehicleModel();
        }

        return instance;
    }

    static clearInstance() {
        if (instance != null) {
            instance = null;
        }
    }
}

module.exports = PostVehicleModel;
