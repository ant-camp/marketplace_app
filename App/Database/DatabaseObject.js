
'use strict';

class DatabaseObject {
    constructor(props) {
        if (props != undefined) {
            this.DBProperties = props;
        }
        else  {
            this.DBProperties = {};
        }
    }

    setId(id) {
        this.DBProperties.id = parseInt(id);
    }

    getId() {
        return this.DBProperties.id;
    }

    setProperties(props) {
        for (var key in props) {
            this.DBProperties[key] = props[key];
        }
    }

    getProperties() {
        return this.DBProperties;
    }
}

module.exports = DatabaseObject;
