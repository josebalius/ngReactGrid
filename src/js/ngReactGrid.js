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

    var ngReactGrid = function(scope, element, attrs) {

        this.scope = scope;
        this.element = element[0];
        this.attrs = attrs;

        /**
         * @todo find a better way to deal with this
         * needs better protection for _ private functions
         */
        this.grid = {
            columnDefs: [],
            data: [],
            height: 500,
            totalCount: 0,
            currentPage: 1,
            pageSize: 25,
            pageSizes: [25, 50, 100, 500],
            scrollbarWidth: this.getScrollbarWidth(),
            _nextPage: function() {

            },
            _prevPage: function() {

            },
            _goToPage: function() {

            },
            _sort: function(field) {

            },
            _columnResize: function(field, delta, index) {

            },
            _autoColumnResize: function(width, index) {

            }
        };

        /**
         * Watchers
         */
        scope.$watch("grid.data", function(newValue, oldValue) {
            _.extend(this.grid, {data: newValue});
            this.render();
        }.bind(this));

        this.update(scope.grid);
        this.render();
    };

    ngReactGrid.prototype.update = function(grid) {
        this.grid = _.extend(this.grid, grid);
        this.grid.totalCount = this.grid.data.length;
    };

    ngReactGrid.prototype.render = function() {
        React.renderComponent(ngReactGridComponent({grid: this.grid}), this.element);
    };

    ngReactGrid.prototype.getScrollbarWidth = function() {
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

    return ngReactGrid;
})