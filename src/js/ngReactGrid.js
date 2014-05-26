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
.factory("ngReactGrid", ['$rootScope', function($rootScope) {

    var gridCore = function(grid, ngReactGrid) {
        this.ngReactGrid = ngReactGrid;
        this.grid = grid;
        this.showingRecords = 0;
        this.originalData = [];
    };

    gridCore.prototype.setPageSize = function(pageSize) {
        $rootScope.$apply(function() {
            this.ngReactGrid.update({
                pageSize: pageSize
            });

            this.ngReactGrid.render();
        }.bind(this));
    };

    gridCore.prototype.setSortField = function(field) {
        $rootScope.$apply(function() {
            if(this.grid.sortInfo.field !== field) {
                this.grid.sortInfo.field = field;
                this.grid.sortInfo.dir = "asc";
            } else {
                if(this.grid.sortInfo.dir === "asc") {
                    this.grid.sortInfo.dir = "desc";
                } else {
                    this.grid.sortInfo.dir = "asc";
                }
            }

            this.sort();
        }.bind(this));
    };

    gridCore.prototype.sort = function() {
        this.grid.data.sort(function(a, b) {
            if(this.grid.sortInfo.dir === "asc") {
                return a[this.grid.sortInfo.field] <= b[this.grid.sortInfo.field] ? -1 : 1;
            } else {
                return a[this.grid.sortInfo.field] >= b[this.grid.sortInfo.field] ? -1 : 1;
            }
        }.bind(this));

        this.ngReactGrid.render();
    };

    gridCore.prototype.setSearch = function(search) {

        $rootScope.$apply(function() {
            search = String(search).toLowerCase();

            this.grid.data = this.originalData.slice(0);

            var filteredData = this.grid.data.filter(function(obj) {
                var result = false;
                for(var i in obj) {
                    if(obj.hasOwnProperty(i)) {
                        if(String(obj[i]).toLowerCase().indexOf(search) !== -1) {
                            result = true;
                            break;
                        }
                    }
                }
                return result;
            });

            this.ngReactGrid.update({
                data: filteredData
            });

            this.ngReactGrid.render();
        }.bind(this));

    };

    var grid = function(ngReactGrid) {
        this.columnDefs = [];
        this.data = [];
        this.height = 500;
        this.totalCount = 0;
        this.totalPages = 0;
        this.currentPage = 1;
        this.pageSize = 25;
        this.pageSizes = [25, 50, 100, 500];
        this.sortInfo = {
            field: "",
            dir: ""
        };
        this.horizontalScroll = false;
        this.scrollbarWidth = (function() {
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
        })();

        this.core = new gridCore(this, ngReactGrid);

        return this;
    };

    var ngReactGrid = function(scope, element, attrs) {

        this.scope = scope;
        this.element = element[0];
        this.attrs = attrs;
        this.grid = new grid(this);

        /**
         * Watchers
         */
        scope.$watch("grid.data", function(newValue, oldValue) {
            this.update({data: newValue}, true);
            this.render();
        }.bind(this));

        this.update(scope.grid, true);
        this.render();
    };

    ngReactGrid.prototype.update = function(grid, dataUpdate) {

        for(var i in grid) {
            if(grid.hasOwnProperty(i) && i === "core") {
                throw new Error("Trying to update the grid with the reserved 'core' property");
            }
        }

        this.grid = _.extend(this.grid, grid);
        this.grid.totalCount = this.grid.data.length;
        this.grid.totalPages = Math.ceil(this.grid.totalCount / this.grid.pageSize);

        if(dataUpdate)
            this.grid.core.originalData = this.grid.data.slice(0);
    };

    ngReactGrid.prototype.render = function() {
        React.renderComponent(ngReactGridComponent({grid: this.grid}), this.element);
    };

    return ngReactGrid;
}])