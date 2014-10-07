'use strict';

var ngReactGridDirective = require('./directives/ngReactGridDirective');
var ngReactGridCheckboxFactory = require('./factories/ngReactGridCheckboxFactory');
var ngReactGridTextFieldFactory = require("./factories/ngReactGridTextFieldFactory");
var ngReactGridCheckboxFieldFactory = require("./factories/ngReactGridCheckboxFieldFactory");
var ngReactGridSelectFieldFactory = require("./factories/ngReactGridSelectFieldFactory");

angular.module('ngReactGrid', [])
    .factory("ngReactGridCheckbox", ['$rootScope', ngReactGridCheckboxFactory])
    .factory("ngReactGridTextField", ['$rootScope', ngReactGridTextFieldFactory])
    .factory("ngReactGridCheckboxField", [ngReactGridCheckboxFieldFactory])
    .factory("ngReactGridSelectField", ['$rootScope', ngReactGridSelectFieldFactory])
    .directive("ngReactGrid", ['$rootScope', ngReactGridDirective]);
