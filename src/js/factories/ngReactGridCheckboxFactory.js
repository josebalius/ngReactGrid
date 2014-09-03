var _ = require('../vendors/miniUnderscore');

var ngReactGridCheckboxFactory = function() {
    var ngReactGridCheckbox = function(selectionTarget, options) {
        var defaultOptions = {
          disableCheckboxField: '',
          hideDisabledCheckboxField: false
        },
        _options = _.extend({}, defaultOptions, options);
        return {
            field: "",
            fieldName: "",
            render: function(row) {

                var handleClick = function() {
                    var index = selectionTarget.indexOf(row);
                    if(index === -1) {
                        selectionTarget.push(row);
                    } else {
                        selectionTarget.splice(index, 1);
                    }
                };

                return ngReactGridCheckboxComponent({selectionTarget: selectionTarget, handleClick: handleClick, row: row, options: _options});;
            },
            sort: false,
            width: 1
        }
    };

    return ngReactGridCheckbox;
};

module.exports = ngReactGridCheckboxFactory;
