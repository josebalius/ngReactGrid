var NgReactGridReactManager = require("../classes/NgReactGridReactManager");

var ngReactGridSelectFieldFactory = function($rootScope) {

    var ngReactGridSelectField = function(record, field, referenceData, updateNotification) {
        this.record = record;
        this.field = field;
        this.updateNotification = updateNotification;

        var value = NgReactGridReactManager.getObjectPropertyByString(this.record, this.field);

        return ngReactGridSelectFieldComponent({value: value, updateValue: this.updateValue.bind(this), referenceData: (referenceData || [])});
    };

    ngReactGridSelectField.prototype.updateValue = function(newValue) {
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

    return ngReactGridSelectField;

};

module.exports = ngReactGridSelectFieldFactory;