
'use strict'
var React = require('react-native');
var {
    ActionSheetIOS,
    } = React;

class CustomActionSheet {
    constructor(options) {
        this.title = options.title;
        this.buttons = options.buttons;
        this.cancelButtonIndex = options.cancelButtonIndex;
        this.destructiveButtonIndex = options.destructiveButtonIndex
    }

    show(onButtonSelection) {
        ActionSheetIOS.showActionSheetWithOptions({
            options:this.buttons,
            title: this.title,
            cancelButtonIndex: this.cancelButtonIndex,
            destructiveButtonIndex: this.destructiveButtonIndex
        }, onButtonSelection);
    }
}


module.exports = CustomActionSheet;
