var NgReactGridReactManager = require("../classes/NgReactGridReactManager");

var ngReactGridCheckboxFieldFactory = function() {

    var ngReactGridCheckboxField = function(record, field, updateNotification) {
        this.record = record;
        this.field = field;
        this.updateNotification = updateNotification;

        var value = NgReactGridReactManager.getObjectPropertyByString(this.record, this.field);
        return ngReactGridCheckboxFieldComponent({value: value, updateValue: this.updateValue.bind(this)});
    };

    ngReactGridCheckboxField.prototype.updateValue = function(newValue) {
        NgReactGridReactManager.updateObjectPropertyByString(this.record, this.field, newValue);

        if(this.updateNotification) {
            this.updateNotification(this.record);
        }
    };

    return ngReactGridCheckboxField;

};

module.exports = ngReactGridCheckboxFieldFactory;