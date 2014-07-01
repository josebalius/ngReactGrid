var ngReactGridCheckboxFieldFactory = function() {

    var ngReactGridCheckboxField = function(record, field) {
        this.record = record;
        this.field = field;
        return ngReactGridCheckboxFieldComponent({value: this.record[field], updateValue: this.updateValue.bind(this)});
    };

    ngReactGridCheckboxField.prototype.updateValue = function(newValue) {
        this.record[this.field] = newValue;
    };

    return ngReactGridCheckboxField;

};

module.exports = ngReactGridCheckboxFieldFactory;