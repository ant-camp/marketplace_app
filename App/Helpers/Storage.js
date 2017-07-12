
var React = require('react-native');
var {
    AsyncStorage,
    } = React;

class Storage {
    constructor() {

    }

    setValue(key, value) {
        return AsyncStorage.setItem(key, value);
    }

    getValue(key) {
        return AsyncStorage.getItem(key);
    }

    removeItem(key) {
        return AsyncStorage.removeItem(key);
    }
}



module.exports = Storage;
