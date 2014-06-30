var ngReactGridTextFieldFactory = function() {

    var ngReactGridTextField = function(record, field) {
        this.record = record;
        this.field = field;
        return ngReactGridTextFieldComponent({value: this.record[field], updateValue: this.updateValue.bind(this)});
    };

    ngReactGridTextField.prototype.updateValue = function(newValue) {
        this.record[this.field] = newValue;
    };

    return ngReactGridTextField;

};

module.exports = ngReactGridTextFieldFactory;