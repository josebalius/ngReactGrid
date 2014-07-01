'use strict';

var ngReactGridDirective = require('./directives/ngReactGridDirective');
var ngReactGridCheckboxFactory = require('./factories/ngReactGridCheckboxFactory');
var ngReactGridTextFieldFactory = require("./factories/ngReactGridTextFieldFactory");

angular.module('ngReactGrid', [])
    .factory("ngReactGridCheckbox", [ngReactGridCheckboxFactory])
    .factory("ngReactGridTextField", [ngReactGridTextFieldFactory])
    .directive("ngReactGrid", ['$rootScope', ngReactGridDirective]);
