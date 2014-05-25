/**
 * @author Jose Garcia - jose.balius@gmail.com
 * @module ngReactGrid
 */
angular.module("ngReactGrid", [])

/**
 * @directive ngReactGrid
 */
.directive("ngReactGrid", function() {
    return {
        restrict: "E",
        link: function(scope, element, attrs) {
            new ngReactGrid(scope, element, attrs);
        }
    };
})

/**
 * @factory ngReactGrid
 */
.factory("ngReactGrid", function() {
    var ngReactGrid = function(scope, element, attrs) {
        var render = function(grid) {
            React.renderComponent(ngReactGridComponent({grid:grid}), element[0]);
        };

        var gridDefault = {
            columnDefs: [],
            data: [],
            height: 500,
            sort: function(field) {

            },
            columnResize: function(field, delta, index) {

            },
            autoColumnResize: function(width, index) {

            }
        };

        var grid = _.extend(gridDefault, scope.grid);

        /**
         * Watchers
         */
        scope.$watch("grid.data", function(newValue, oldValue) {
            _.extend(grid, {data: newValue});
            render(grid);
        });

        render(grid);
    };

    return ngReactGrid;
})