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

    var gridReact = function(grid, ngReactGrid) {
        this.ngReactGrid = ngReactGrid;
        this.grid = grid;
        this.showingRecords = 0;
        this.startIndex = 0;
        this.endIndex = 0;
        this.originalData = [];
        this.loading = false;
    };

    gridReact.prototype.setPageSize = function(pageSize) {
        $rootScope.$apply(function() {

            this.ngReactGrid.update({
                pageSize: pageSize
            });

            if(!this.grid.localMode) {
                if(this.grid.setPageSize) {
                    this.loading = true;
                    this.grid.setPageSize(pageSize);
                } else {
                    throw new Error("localMode is false, please implement the setPageSize function on the grid object");
                }
                
            }

            this.ngReactGrid.render();
            
        }.bind(this));
    };

    gridReact.prototype.setSortField = function(field) {
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

            if(!this.grid.localMode) {
                if(this.grid.setSortField) {
                    this.loading = true;
                    this.grid.setSortField(this.grid.sortInfo);
                    this.ngReactGrid.render();
                } else {
                    throw new Error("localMode is false, please implement the setSortField function on the grid object");
                }
                
            } else {
                this.sort();
            }

            
        }.bind(this));
    };

    gridReact.prototype.sort = function() {
        this.grid.data.sort(function(a, b) {
            if(this.grid.sortInfo.dir === "asc") {
                return a[this.grid.sortInfo.field] <= b[this.grid.sortInfo.field] ? -1 : 1;
            } else {
                return a[this.grid.sortInfo.field] >= b[this.grid.sortInfo.field] ? -1 : 1;
            }
        }.bind(this));

        this.ngReactGrid.render();
    };

    gridReact.prototype.setSearch = function(search) {

        $rootScope.$apply(function() {
            search = String(search).toLowerCase();

            if(this.localMode) {

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
                }, false, true);

            } else {
                if(this.grid.setSearch) {
                    this.loading = true;
                    this.grid.setSearch(search);
                } else {
                    throw new Error("localMode is false, please implement the setSearch function on the grid object");
                }
                
            }

            this.ngReactGrid.render();
        }.bind(this));

    };

    gridReact.prototype.goToPage = function(page) {
        $rootScope.$apply(function() {
            this.ngReactGrid.update({
                currentPage: page
            });

            if(!this.grid.localMode) {
                if(this.grid.goToPage) {
                    this.loading = true;
                    this.grid.goToPage(page);
                } else {
                    throw new Error("localMode is false, please implement the goToPage function on the grid object");
                }
                
            }

            this.ngReactGrid.render();

        }.bind(this));
    };

    var grid = function(ngReactGrid) {
        this.columnDefs = [];
        this.data = [];
        this.height = 500;
        this.localMode = true;
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

        this.react = new gridReact(this, ngReactGrid);

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

    ngReactGrid.prototype.update = function(grid, dataUpdate, isSearch) {

        for(var i in grid) {
            if(grid.hasOwnProperty(i) && i === "react") {
                throw new Error("Trying to update the grid with the reserved 'react' property");
            }
        }

        this.grid = _.extend(this.grid, grid);
        
        if(dataUpdate)
            this.grid.react.originalData = this.grid.data.slice(0);

        var startIndex = (this.grid.currentPage - 1) * this.grid.pageSize;
        var endIndex = (this.grid.pageSize * this.grid.currentPage);

        if(this.grid.localMode) {
            if(isSearch) {
                this.grid.totalCount = grid.data.length;
                this.grid.data = grid.data.slice(startIndex, endIndex);
            } else {
                this.grid.totalCount = this.grid.react.originalData.length;
                this.grid.data = this.grid.react.originalData.slice(startIndex, endIndex);
            }
        }

        this.grid.react.showingRecords = this.grid.data.length;
        this.grid.react.startIndex = startIndex;
        this.grid.react.endIndex = endIndex;
        this.grid.react.loading = false;
        this.grid.totalPages = Math.ceil(this.grid.totalCount / this.grid.pageSize);
    };

    ngReactGrid.prototype.render = function() {
        React.renderComponent(ngReactGridComponent({grid: this.grid}), this.element);
    };

    return ngReactGrid;
}])