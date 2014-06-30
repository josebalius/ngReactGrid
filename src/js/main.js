'use strict';

var ngReactGridDirective = require('./directives/ngReactGridDirective');
var ngReactGridCheckboxFactory = require('./factories/ngReactGridCheckboxFactory');
var ngReactGridFactory = require("./factories/ngReactGridFactory");

angular.module('ngReactGrid', [])
    .factory("ngReactGridCheckbox", [ngReactGridCheckboxFactory])
    .factory("ngReactGrid", ['$rootScope', ngReactGridFactory])
    .directive("ngReactGrid", ['ngReactGrid', ngReactGridDirective]);
