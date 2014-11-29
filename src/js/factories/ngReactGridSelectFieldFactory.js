var NgReactGridReactManager = require("../classes/NgReactGridReactManager");

var ngReactGridSelectFieldFactory = function($rootScope) {

    var ngReactGridSelectField = function(record, field, referenceData, updateNotification) {
        this.record = record;
        this.field = field;
        this.updateNotification = updateNotification;
        this.referenceData = referenceData;

        var value = NgReactGridReactManager.getObjectPropertyByString(this.record, this.field);

        var ngReactGridSelectFieldElement = React.createFactory(NgReactGridSelectFieldComponent);

        return ngReactGridSelectFieldElement({value: value, updateValue: this.updateValue.bind(this), referenceData: (referenceData || [])});
    };

    ngReactGridSelectField.prototype.updateValue = function(newValue) {

        var updateValue = {};

        for(var i in this.referenceData) {
            var option = this.referenceData[i];

            if(option.id == newValue) {
                updateValue = option;
            }
        }

        NgReactGridReactManager.updateObjectPropertyByString(this.record, this.field, updateValue);

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