var ngReactGridSelectFieldFactory = function() {

    var ngReactGridSelectField = function(record, field, referenceData) {
        this.record = record;
        this.field = field;
        return ngReactGridSelectFieldComponent({value: this.record[field], updateValue: this.updateValue.bind(this), referenceData: referenceData});
    };

    ngReactGridSelectField.prototype.updateValue = function(newValue) {
        this.record[this.field] = newValue;
    };

    return ngReactGridSelectField;

};

module.exports = ngReactGridSelectFieldFactory;