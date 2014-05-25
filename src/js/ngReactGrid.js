/**
 * @author Jose Garcia - jose.balius@gmail.com
 * @module ngReactGrid
 */
angular.module("ngReactGrid", [])

/**
 * @directive ngReactGrid
 */
.directive("ngReactGrid", ['ngReactGrid', function(ngReactGrid) {
    return {
        restrict: "E",
        link: function(scope, element, attrs) {
            new ngReactGrid(scope, element, attrs);
        }
    };
}])

/**
 * @factory ngReactGrid
 */
.factory("ngReactGrid", function() {

    var getScrollbarWidth = function() {
        var outer = document.createElement("div");
        outer.style.visibility = "hidden";
        outer.style.width = "100px";
        outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps

        document.body.appendChild(outer);

        var widthNoScroll = outer.offsetWidth;
        // force scrollbars
        outer.style.overflow = "scroll";

        // add innerdiv
        var inner = document.createElement("div");
        inner.style.width = "100%";
        outer.appendChild(inner);        

        var widthWithScroll = inner.offsetWidth;

        // remove divs
        outer.parentNode.removeChild(outer);

        return widthNoScroll - widthWithScroll;
    };

    var ngReactGrid = function(scope, element, attrs) {
        var render = function(grid) {
            React.renderComponent(ngReactGridComponent({grid:grid}), element[0]);
        };

        var gridDefault = {
            columnDefs: [],
            data: [],
            height: 500,
            scrollbarWidth: getScrollbarWidth(),
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