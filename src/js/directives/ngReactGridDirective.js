var ngReactGrid = require("../classes/NgReactGrid");

var ngReactGridDirective = function ($rootScope) {
    return {
        restrict: "E",
        scope : {
            grid : "="
        },
        link: function (scope, element, attrs) {
            new ngReactGrid(scope, element, attrs, $rootScope);
        }
    }
};

module.exports = ngReactGridDirective;

