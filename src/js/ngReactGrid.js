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

    var NO_GET_DATA_CALLBACK_ERROR = "localMode is false, please implement the getData function on the grid object";

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
                if(this.grid.getData) {
                    this.loading = true;
                    this.grid.getData();
                } else {
                    throw new Error(NO_GET_DATA_CALLBACK_ERROR);
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
                if(this.grid.getData) {
                    this.loading = true;
                    this.grid.getData();
                    this.ngReactGrid.render();
                } else {
                    throw new Error(NO_GET_DATA_CALLBACK_ERROR);
                }
                
            } else {
                this.sort();
            }

            
        }.bind(this));
    };

    gridReact.prototype.sort = function() {

        var copy = this.grid.react.originalData.slice(0);
        var isAsc = this.grid.sortInfo.dir === "asc";

        copy.sort(function(a, b) {
            if(isAsc) {
                return a[this.grid.sortInfo.field] <= b[this.grid.sortInfo.field] ? -1 : 1;
            } else {
                return a[this.grid.sortInfo.field] >= b[this.grid.sortInfo.field] ? -1 : 1;
            }
        }.bind(this));

        this.ngReactGrid.update({
            data: copy
        }, true);

        this.ngReactGrid.render();
    };

    gridReact.prototype.setSearch = function(search) {

        $rootScope.$apply(function() {
            this.ngReactGrid.update({
                search: search
            });

            search = String(search).toLowerCase();

            if(this.grid.localMode) {

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
                if(this.grid.getData) {
                    this.loading = true;
                    this.grid.getData();
                } else {
                    throw new Error(NO_GET_DATA_CALLBACK_ERROR);
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
                if(this.grid.getData) {
                    this.loading = true;
                    this.grid.getData();
                } else {
                    throw new Error(NO_GET_DATA_CALLBACK_ERROR);
                }
                
            }

            this.ngReactGrid.render();

        }.bind(this));
    };

    gridReact.prototype.wrapFunctionsInAngular = function(cell) {  
        for(var key in cell.props) {
            if(cell.props.hasOwnProperty(key)) {
                if(key === "children") {
                    this.wrapFunctionsInAngular(cell.props[key]);
                } else if(typeof cell.props[key] === 'function') {
                    cell.props[key] = this.wrapWithRootScope(cell.props[key]);
                }
            }
            
        }
        return cell;
    }

    gridReact.prototype.wrapWithRootScope = function(func) {
        return function() {
            $rootScope.$apply(function() {
                func();
            });
        };
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
        this.search = "";
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
        this.initWithGetData = false;

        this.update(scope.grid, true);

        /**
         * Watchers
         */
        scope.$watch("grid.data", function(newValue, oldValue) {
            if(newValue) {
                this.update({data: newValue}, true);
                this.render();
            }
        }.bind(this));

        scope.$watch("grid.totalCount", function(newValue, oldValue) {
            if(newValue) {
                this.update({totalCount: newValue}, true);
                this.render();
            }
        }.bind(this));

        if(this.grid.getData) {
            this.initWithGetData = true;
            this.grid.react.loading = true;
            this.grid.getData(this.grid);
        }

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

        if(!this.initWithGetData)
            this.grid.react.loading = false;
        else
            this.initWithGetData = false;

        this.grid.totalPages = Math.ceil(this.grid.totalCount / this.grid.pageSize);
    };

    ngReactGrid.prototype.render = function() {
        React.renderComponent(ngReactGridComponent({grid: this.grid}), this.element);
    };

    return ngReactGrid;
}])