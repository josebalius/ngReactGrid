'use strict';

var ngReactGridDirective = require('./directives/ngReactGridDirective');
var ngReactGridCheckboxFactory = require('./factories/ngReactGridCheckboxFactory');
var ngReactGridTextFieldFactory = require("./factories/ngReactGridTextFieldFactory");
var ngReactGridCheckboxFieldFactory = require("./factories/ngReactGridCheckboxFieldFactory");

angular.module('ngReactGrid', [])
    .factory("ngReactGridCheckbox", [ngReactGridCheckboxFactory])
    .factory("ngReactGridTextField", [ngReactGridTextFieldFactory])
    .factory("ngReactGridCheckboxField", [ngReactGridCheckboxFieldFactory])
    .directive("ngReactGrid", ['$rootScope', ngReactGridDirective]);
