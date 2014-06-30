var ngReactGridDirective = function (ngReactGrid) {
    return {
        restrict: "E",
        link: function (scope, element, attrs) {
            new ngReactGrid(scope, element, attrs);
        }
    }
};

module.exports = ngReactGridDirective;

