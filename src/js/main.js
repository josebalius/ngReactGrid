'use strict';

var ngReactGridDirective = require('./directives/ngReactGridDirective');
var ngReactGridCheckboxFactory = require('./factories/ngReactGridCheckboxFactory');
var ngReactGridTextFieldFactory = require("./factories/ngReactGridTextFieldFactory");
var ngReactGridFactory = require("./factories/ngReactGridFactory");

angular.module('ngReactGrid', [])
    .factory("ngReactGridCheckbox", [ngReactGridCheckboxFactory])
    .factory("ngReactGridTextField", [ngReactGridTextFieldFactory])
    .factory("ngReactGrid", ['$rootScope', ngReactGridFactory])
    .directive("ngReactGrid", ['ngReactGrid', ngReactGridDirective]);
