'use strict';

var RNDBModel = require('react-native-db-models');
var DatabaseObject = require('./DatabaseObject');
var PageItem = require("./PageItem");
var Vehicle = require("./Vehicle");

var DataTables = {
    PageItem : new RNDBModel.create_db(new PageItem().constructor.name),
    Vehicle : new RNDBModel.create_db(new Vehicle().constructor.name)
};



class DB {
    constructor() {
        this.objectsToAdd = [];
        this.objectsToModifyById = [];
        this.objectsToModify = [];
        this.objectsToDelete = [];
        this.objectsToDeleteById = [];
    }

    get(model, paramsObj) {
        var that = this;
        return new Promise(function(resolve, reject) {
            var handleResult = function(results) {
                var resultArray = [];

                var iterateRows = results;
                if (results.rows != undefined) {
                    iterateRows = results.rows;
                }

                for (var rowIndex in iterateRows) {
                    var dbObj = new DatabaseObject(iterateRows[rowIndex]);
                    dbObj.setId(rowIndex);

                    resultArray.push(dbObj);
                }

                resolve(resultArray);
            };

            try {
                if (paramsObj != null) {
                    DataTables[model.constructor.name].get(paramsObj, function (results) {
                        handleResult(results);
                    });
                }
                else
                {
                    DataTables[model.constructor.name].get_all(function (results) {
                        handleResult(results);
                    });
                }
            }
            catch (err) {
                reject(err);
            }
        });
    }

    get_all(model) {
        return this.get(model, null);
    }

    get_id(model, id) {
        return new Promise(function(resolve, reject) {
            try {
                DataTables[model.constructor.name].get_id(id, function (results) {
                    resolve(results);
                });
            }
            catch (err) {
                reject(err);
            }
        });
    }

    add(model) {
        this.objectsToAdd.push({ tableName: model.constructor.name, modelObject: model });
    }

    update(query, model) {
        this.objectsToModify.push({ tableName: model.constructor.name, query: query, modelObject: model });
    }

    update_id(id, model) {
        this.objectsToModifyById.push({ tableName: model.constructor.name, ID: id, modelObject: model });
    }


    delete_id(id) {
        this.objectsToDeleteById.push({ tableName: model.constructor.name, ID: id });
    }

    delete(query) {
        this.objectsToDelete.push({ tableName: model.constructor.name, query: query });
    }

    log(logText) {
        console.log(logText);
    }

    _asyncLoop(iterationLength, iterationFunction) {
        return new Promise(function(resolve, reject) {
            var index = 0;
            var done = false;

            var loop = {
                next: function() {
                    try {
                        if (done) {
                            loop.complete();
                            return;
                        }

                        if (index < iterationLength) {
                            index++;
                            iterationFunction(index - 1, loop);
                        }
                        else {
                            done = true;
                            loop.complete();
                        }
                    }
                    catch (ex) {
                        done = true;
                        loop.error(ex);
                    }
                },
                complete: function() {
                    resolve();
                },
                error: function(e) {
                    alert(e);
                    reject();
                }
            };

            loop.next();
        });
    }

    commit() {
        var that = this;
        return new Promise(function(success, fail) {
            that._asyncLoop(that.objectsToAdd.length, function(index, loop) {
                var model = that.objectsToAdd[index];
                DataTables[model.tableName].add(model.modelObject.getProperties(), function (result) {
                    model.modelObject.setId(result._id);
                    that.log("Processed: " + index);
                    loop.next();
                });

            }).then(function() {
                that.log("Committed objectsToAdd");

                return new Promise(function(resolve, reject) {
                    that._asyncLoop(that.objectsToModifyById.length, function(index, loop) {
                        var model = that.objectsToModifyById[index];
                        DataTables[model.tableName].update_id(model.ID, model.modelObject.getProperties(), function (result) {
                            loop.next();
                        });

                    }).then(function() {
                        resolve();
                    }).catch(function(e) {
                        reject(e);
                    });
                });
            }).then(function() {
                that.log("Committed objectsToModifyById");

                return new Promise(function(resolve, reject) {
                    that._asyncLoop(that.objectsToModify.length, function(index, loop) {
                        var model = that.objectsToModify[index];
                        DataTables[model.tableName].update(model.query, model.modelObject.getProperties(), function (result) {
                            loop.next();
                        });
                    }).then(function() {
                        resolve();
                    }).catch(function(e) {
                        reject(e);
                    });
                });
            }).then(function() {
                that.log("Committed objectsToModify");

                return new Promise(function(resolve, reject) {
                    that._asyncLoop(that.objectsToDeleteById.length, function(index, loop) {
                        var model = that.objectsToDeleteById[index];
                        DataTables[model.tableName].remove_id(model.ID, function (result) {
                            loop.next();
                        });
                    }).then(function() {
                        resolve();
                    }).catch(function(e) {
                        reject(e);
                    });
                });
            }).then(function() {
                that.log("Committed objectsToDeleteById");

                return new Promise(function(resolve, reject) {
                    that._asyncLoop(that.objectsToDelete.length, function(index, loop) {
                        var model = that.objectsToDelete[index];
                        DataTables[model.tableName].remove(model.query, function (result) {
                            loop.next();
                        });
                    }).then(function() {
                        resolve();
                    }).catch(function(e) {
                        reject(e);
                    });
                });
            }).then(function() {
                that.log("Committed objectsToDelete");

                that.objectsToAdd = [];
                that.objectsToModifyById = [];
                that.objectsToModify = [];
                that.objectsToDeleteById = [];
                that.objectsToDelete = [];

                that.log("Committed Success");

                success();
            }).catch(function(err) {
                that.log("Committed Error " + err);
                fail(err);
            });
        });
    }

    //region: - Static Methods
    static nukeDb() {
        return new Promise(function(resolve, reject) {
            try {
                DataTables.PageItem.erase_db(function (removedData) {
                    DataTables.Vehicle.erase_db(function(removedData) {
                        resolve(removedData);
                    });
                });
            }
            catch (err) {
                reject(err);
            }
        });
    }

    static seedDb() {
        return new Promise(function(resolve, reject) {
            try {
                var db = new DB();

                db.add(new Vehicle({
                    VehicleMake: "Chevrolette",
                    VehicleModel: "Camaro",
                    VehicleYear: 2010,
                    VehicleColor: "Yellow/Black",
                    VehicleImages: ["http://images.autotrader.com/scaler/544/408/images/2015/5/12/400/268/41978682386.400268965.IM1.MAIN.565x421_A.562x421.jpg",
                                    "http://images.autotrader.com/scaler/544/408/images/2015/5/12/400/268/41978682388.400268965.IM1.03.565x421_A.562x421.jpg",
                                    "http://images.autotrader.com/scaler/544/408/images/2015/5/12/400/268/41978682389.400268965.IM1.04.565x421_A.562x421.jpg",
                                    "http://images.autotrader.com/scaler/544/408/images/2015/5/12/400/268/41978682387.400268965.IM1.02.565x421_A.562x421.jpg"
                                    ],
                    VehiclePriceText: "26,900",
                    VehicleMileage: 14700
                }));

                db.add(new Vehicle({
                    VehicleMake: "Toyota",
                    VehicleModel: "Corolla",
                    VehicleYear: 2001,
                    VehicleColor: "Gray/Brown",
                    VehicleImages: ["https://upload.wikimedia.org/wikipedia/commons/d/d5/2005-2007_Toyota_Corolla.jpg"],
                    VehiclePriceText: "14,900",
                    VehicleMileage: 200000
                }));
                db.add(new Vehicle({
                    VehicleMake: "Nissan",
                    VehicleModel: "Sentra",
                    VehicleYear: 2010,
                    VehicleColor: "Gray/Silver",
                    VehicleImages: ["https://upload.wikimedia.org/wikipedia/commons/5/52/Nissan_Sentra_SL.jpg"],
                    VehiclePriceText: "10,900",
                    VehicleMileage: 200000
                }));
                db.add(new Vehicle({
                    VehicleMake: "Toyota",
                    VehicleModel: "Prius",
                    VehicleYear: 2015,
                    VehicleColor: "Black/Red",
                    VehicleImages: ["http://zombdrive.com/images/2014-toyota-prius-v-4.jpg"],
                    VehiclePriceText: "5,000",
                    VehicleMileage: 200000
                }));

                db.commit().then(resolve);
            }
            catch (err) {
                reject(err);
            }
        });
    }
}

module.exports = DB;