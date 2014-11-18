var _ = require('../vendors/miniUnderscore');
var NgReactGridReactManager = require("../classes/NgReactGridReactManager");

var ngReactGridCheckboxFactory = function($rootScope) {
    var ngReactGridCheckbox = function(selectionTarget, options) {
        var defaultOptions = {
            disableCheckboxField: '',
            hideDisabledCheckboxField: false,
            getObjectPropertyByStringFn: NgReactGridReactManager.getObjectPropertyByString,
            batchToggle: false,
            headerStyle: {
                textAlign: "center"
            }
        };
        var _options = _.extend({}, defaultOptions, options);

        return {
            field: "",
            fieldName: "",
            displayName: "",
            title: "Select/Deselect All",
            options: _options,
            inputType: (_options.batchToggle) ? "checkbox" : undefined,
            handleHeaderClick: function(checkedValue, data) {
                // Sends header 'batch toggle' checkbox value to rows
                window.dispatchEvent(new CustomEvent("setNgReactGridCheckboxStateFromEvent", {detail: {checked: checkedValue}}));

                // Empties bounded selected target or populates with
                //   non-disabled checkbox rows data
                $rootScope.$apply(function() {
                  while (selectionTarget.length) {selectionTarget.pop();}
                  if (checkedValue) {
                    data.forEach(function(row) {
                      if (!_options.getObjectPropertyByStringFn(row, _options.disableCheckboxField)) {
                        selectionTarget.push(row);
                      }
                    });
                  }
                });
            },
            render: function(row) {
                var handleClick = function(e) {
                    e.stopPropagation();
                    // Sends event to uncheck header 'batch toggle' checkbox
                    window.dispatchEvent(new CustomEvent("setNgReactGridCheckboxHeaderStateFromEvent", {detail: {checked: false}}));

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
