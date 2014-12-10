var _ = require('../vendors/miniUnderscore');
var NgReactGridReactManager = require("../classes/NgReactGridReactManager");

var ngReactGridCheckboxFactory = function($rootScope) {
    var ngReactGridCheckbox = function(selectionTarget, options) {
        var defaultOptions = {
            disableCheckboxField: '',
            hideDisabledCheckboxField: false,
            batchToggle: false,
            headerStyle: {
                textAlign: "center"
            }
        };
        var _options = _.extend({}, defaultOptions, options);
        var utils = {
            getObjectPropertyByStringFn: NgReactGridReactManager.getObjectPropertyByString,
        };

        return {
            field: "",
            fieldName: "",
            displayName: "",
            title: "Select/Deselect All",
            options: _options,
            utils: utils,
            setAllCheckboxStates: this.setAllCheckboxStates,
            setHeaderCheckboxState: this.setHeaderCheckboxState,
            setVisibleCheckboxState: this.setVisibleCheckboxState,
            inputType: (_options.batchToggle) ? "checkbox" : undefined,
            handleHeaderClick: function(checkedValue, data) {
                this.setVisibleCheckboxState(checkedValue);

                // Empties bounded selected target or populates with
                //   non-disabled checkbox rows data
                $rootScope.$apply(function() {
                    while (selectionTarget.length) {selectionTarget.pop();}
                    if (checkedValue) {
                        data.forEach(function(row) {
                            if (!utils.getObjectPropertyByStringFn(row, _options.disableCheckboxField)) {
                                selectionTarget.push(row);
                            }
                        });
                    }
                });
            },
            render: function(row) {
                var handleToggle = (function(e, checkedValue) {
                    e.stopPropagation();

                    // Sends event to uncheck header 'batch toggle' checkbox
                    this.setHeaderCheckboxState(false);

                    var index = selectionTarget.indexOf(row);
                    if(index === -1) {
                        if (checkedValue) {selectionTarget.push(row);}
                    } else {
                        if (!checkedValue) {selectionTarget.splice(index, 1);}
                    }
                }).bind(this);
                var ngReactGridCheckboxElement = React.createFactory(NgReactGridCheckboxComponent);
                return ngReactGridCheckboxElement({selectionTarget: selectionTarget, handleToggle: handleToggle, row: row, utils: this.utils, options: this.options});;
            },
            sort: false,
            width: 1
        }
    };

    ngReactGridCheckbox.prototype.setHeaderCheckboxState = function(checkedValue) {
        window.dispatchEvent(new CustomEvent("setNgReactGridCheckboxHeaderStateFromEvent", {detail: {checked: checkedValue}}));
    };

    ngReactGridCheckbox.prototype.setVisibleCheckboxState = function(checkedValue, options) {
        var defaultOptions = {
            checked: checkedValue,
            targetCheckboxes: {
                key: null,
                value: null
            }
        };
        var _options = _.extend({}, defaultOptions, options);
        window.dispatchEvent(new CustomEvent("setNgReactGridCheckboxStateFromEvent", {detail: _options}));
    };

    return ngReactGridCheckbox;
};

module.exports = ngReactGridCheckboxFactory;
