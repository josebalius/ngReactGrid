var NgReactGridReactManager = require("../classes/NgReactGridReactManager");

var ngReactGridTextFieldFactory = function($rootScope) {

    var ngReactGridTextField = function(record, field, updateNotification) {
        this.record = record;
        this.field = field;
        this.updateNotification = updateNotification;

        var value = NgReactGridReactManager.getObjectPropertyByString(this.record, this.field);

        return ngReactGridTextFieldComponent({value: value, updateValue: this.updateValue.bind(this)});
    };

    ngReactGridTextField.prototype.updateValue = function(newValue) {
        NgReactGridReactManager.updateObjectPropertyByString(this.record, this.field, newValue);

        if(this.updateNotification) {
            if($rootScope.$$phase) {
                this.updateNotification(this.record);
            } else {
                $rootScope.$apply(function () {
                    this.updateNotification(this.record);
                }.bind(this));
            }
        }
    };

    return ngReactGridTextField;

};

module.exports = ngReactGridTextFieldFactory;