var _ = {
    nativeForEach: Array.prototype.forEach,
    each: function(obj, iterator, context) {
        if (obj == null) return obj;
        if (this.nativeForEach && obj.forEach === this.nativeForEach) {
            obj.forEach(iterator, context);
        } else if (obj.length === +obj.length) {
            for (var i = 0, length = obj.length; i < length; i++) {
                if (iterator.call(context, obj[i], i, obj) === breaker) return;
            }
        } else {
            var keys = _.keys(obj);
            for (var i = 0, length = keys.length; i < length; i++) {
                if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
            }
        }
        return obj;
    },
    slice: Array.prototype.slice,
    extend: function(obj) {
        this.each(this.slice.call(arguments, 1), function(source) {
            if (source) {
                for (var prop in source) {
                    obj[prop] = source[prop];
                }
            }
        });
        return obj;
    }
};
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
        this.startIndex = 0;
        this.endIndex = 0;
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
            }, false, true);

            this.ngReactGrid.render();
        }.bind(this));

    };

    gridCore.prototype.goToPage = function(page) {
        $rootScope.$apply(function() {
            this.ngReactGrid.update({
                currentPage: page
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

    ngReactGrid.prototype.update = function(grid, dataUpdate, isSearch) {

        for(var i in grid) {
            if(grid.hasOwnProperty(i) && i === "core") {
                throw new Error("Trying to update the grid with the reserved 'core' property");
            }
        }

        this.grid = _.extend(this.grid, grid);
        
        if(dataUpdate)
            this.grid.core.originalData = this.grid.data.slice(0);

        var startIndex = (this.grid.currentPage - 1) * this.grid.pageSize;
        var endIndex = (this.grid.pageSize * this.grid.currentPage);

        this.grid.totalCount = (isSearch) ? grid.data.length : this.grid.core.originalData.length;
        this.grid.totalPages = Math.ceil(this.grid.totalCount / this.grid.pageSize);
        this.grid.data = (isSearch) ? grid.data.slice(startIndex, endIndex) : this.grid.core.originalData.slice(startIndex, endIndex);
        this.grid.core.showingRecords = this.grid.data.length;
        this.grid.core.startIndex = startIndex;
        this.grid.core.endIndex = endIndex;
    };

    ngReactGrid.prototype.render = function() {
        React.renderComponent(ngReactGridComponent({grid: this.grid}), this.element);
    };

    return ngReactGrid;
}])
/** @jsx React.DOM */
/**
 * @author Jose Garcia - jose.balius@gmail.com
 * ngReactGrid React component
 */
var ngReactGridComponent = (function() {

    var windowInnerWidth = window.innerWidth, windowInnerHeight = window.innerHeight;

    var setCellWidthPixels = function(cell) {

        var width = String(cell.width).replace("px", "");
        var isPercent = width.indexOf("%") !== -1;

        if(isPercent) {

            var widthInPixels = Math.floor((parseInt(width) * windowInnerWidth) / 100);
            cell.width = widthInPixels;

        }

    };

    var setCellWidth = function(grid, cell, cellStyle, isLast, bodyCell) {

        if(!cell.width) {
            cell.width = "10%";
        }

        if(grid.horizontalScroll) {
            setCellWidthPixels(cell);
        }

        cellStyle.width = cell.width;
    };

    var ngReactGridHeader = (function() {

        var ngGridHeaderCell = React.createClass({displayName: 'ngGridHeaderCell',
            handleClick: function() {
                this.props.grid.core.setSortField(this.props.cell.field);
            },
            render: function() {

                var cellStyle = {};
                setCellWidth(this.props.grid, this.props.cell, cellStyle, this.props.last);

                var sortStyle = {
                    display: "inline-block",
                    position: "absolute",
                    marginLeft: 5,
                    paddingTop: 2
                };

                var sortClassName = "icon-arrows";

                if(this.props.grid.sortInfo.field === this.props.cell.field) {
                    if(this.props.grid.sortInfo.dir === "asc") {
                        sortClassName += " icon-asc";
                    } else {
                        sortClassName += " icon-desc";
                    }

                    sortStyle.paddingTop = 4;
                } else {
                    sortClassName += " icon-both";
                }

                return (
                    React.DOM.th( {title:this.props.cell.displayName, style:cellStyle}, 
                        React.DOM.div( {className:"ngGridHeaderCellText", onClick:this.handleClick}, 
                            this.props.cell.displayName, 
                            React.DOM.div( {style:sortStyle}, React.DOM.i( {className:sortClassName}))
                        ),
                        React.DOM.div( {className:"ngGridHeaderCellResize"})
                    )
                )
            }
        });

        var ngReactGridShowPerPage = React.createClass({displayName: 'ngReactGridShowPerPage',
            handleChange: function() {
                this.props.grid.core.setPageSize(this.refs.showPerPage.getDOMNode().value);
            },
            render: function() {

                var options = this.props.grid.pageSizes.map(function(pageSize, key) {
                    return (React.DOM.option( {value:pageSize, key:key}, pageSize))
                }.bind(this));

                return (
                    React.DOM.div( {className:"ngReactGridShowPerPage"}, 
                        "Show ", React.DOM.select( {onChange:this.handleChange, ref:"showPerPage", value:this.props.grid.pageSize}, options), " entries"
                    )
                )
            }
        });

        var ngReactGridSearch = React.createClass({displayName: 'ngReactGridSearch',
            handleSearch: function() {
                this.props.grid.core.setSearch(this.refs.searchField.getDOMNode().value);
            },
            render: function() {
                return (
                    React.DOM.div( {className:"ngReactGridSearch"}, 
                        React.DOM.input( {type:"input", placeholder:"Search...", ref:"searchField", onKeyUp:this.handleSearch} )
                    )
                )
            }
        });

        return React.createClass({
            render: function() {

                var columnsLength = this.props.grid.columnDefs.length;
                var cells = this.props.grid.columnDefs.map(function(cell, key) {
                    var last = (columnsLength - 1) === key;
                    return (ngGridHeaderCell( {key:key, cell:cell, index:key, grid:this.props.grid, last:last} ))
                }.bind(this));

                var tableStyle = {
                    width: "calc(100% - " + this.props.grid.scrollbarWidth + "px)"
                };

                var ngReactGridHeader = {
                    paddingRight: (this.props.grid.horizontalScroll) ? this.props.grid.scrollbarWidth : 0
                };

                return (
                    React.DOM.div(null, 
                        React.DOM.div( {className:"ngReactGridHeaderToolbarWrapper"}, 
                            ngReactGridShowPerPage( {grid:this.props.grid, setGridState:this.props.setGridState} ),
                            ngReactGridSearch( {grid:this.props.grid} )
                        ),
                        React.DOM.div( {className:"ngReactGridHeaderWrapper"}, 
                            React.DOM.div( {className:"ngReactGridHeader", style:ngReactGridHeader}, 
                                React.DOM.div( {className:"ngReactGridHeaderInner"}, 
                                    React.DOM.table( {style:tableStyle}, 
                                        React.DOM.thead(null, 
                                            React.DOM.tr(null, 
                                                cells
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    )
                );
            }
        });
    })();

    var ngReactGridBody = (function() {

        var ngReactGridBodyRowCell = React.createClass({displayName: 'ngReactGridBodyRowCell',
            render: function() {
                var cellText = this.props.row[this.props.cell.field];
                var cellStyle = {};
                setCellWidth(this.props.grid, this.props.cell, cellStyle, this.props.last, true);
                return (
                    React.DOM.td( {style:cellStyle, title:cellText}, 
                        React.DOM.div(null, cellText)
                    )
                )
            }
        });

        var ngReactGridBodyRow = React.createClass({displayName: 'ngReactGridBodyRow',
            render: function() {

                var columnsLength = this.props.grid.columnDefs.length;
                var cells = this.props.grid.columnDefs.map(function(cell, key) {
                    var last = (columnsLength - 1) === key;
                    return ngReactGridBodyRowCell( {key:key, cell:cell, row:this.props.row, grid:this.props.grid, last:last} )
                }.bind(this));

                return (
                    React.DOM.tr(null, 
                        cells
                    )
                )
            }
        });


        return React.createClass({
            componentDidMount: function() {
                var domNode = this.getDOMNode();
                var header = document.querySelector(".ngReactGridHeaderInner");
                var viewPort = document.querySelector(".ngReactGridViewPort");

                domNode.firstChild.addEventListener('scroll', function(e) {
                    header.scrollLeft = viewPort.scrollLeft;
                });

            },
            render: function() {

                var mapRows = function(row, index) {
                    return ngReactGridBodyRow( {key:index, row:row, columns:this.props.columnDefs, grid:this.props.grid} )
                }.bind(this);
                var rows = this.props.grid.data.map(mapRows);
                
                var ngReactGridViewPortStyle = {}, tableStyle = {};

                if(!this.props.grid.horizontalScroll) {
                    ngReactGridViewPortStyle.overflowX = "hidden";
                } else {
                    tableStyle.width = "calc(100% - " + this.props.grid.scrollbarWidth + "px)";
                }

                if(this.props.grid.core.showingRecords === 0) {
                    var noDataStyle = {
                        textAlign: "center"
                    };

                    rows = (
                        React.DOM.tr(null, 
                            React.DOM.td( {colSpan:this.props.grid.columnDefs.length, style:noDataStyle}, 
                                "No records found"
                            )
                        )
                    )
                }

                return (
                    React.DOM.div( {className:"ngReactGridBody"}, 
                        React.DOM.div( {className:"ngReactGridViewPort", style:ngReactGridViewPortStyle}, 
                            React.DOM.div( {className:"ngReactGridInnerViewPort"}, 
                                React.DOM.table( {style:tableStyle}, 
                                    React.DOM.tbody(null,  
                                        rows
                                    )
                                )
                            )
                        )
                    )
                );
            }
        });
    })();

    var ngReactGridFooter = (function() {

        var ngReactGridStatus = React.createClass({displayName: 'ngReactGridStatus',
            render: function() {

                return (
                    React.DOM.div( {className:"ngReactGridStatus"}, 
                        React.DOM.div(null, "Showing ", React.DOM.strong(null, this.props.grid.core.startIndex+1), " to ", React.DOM.strong(null, this.props.grid.core.endIndex), " of ", React.DOM.strong(null, this.props.grid.totalCount), " entries")
                    )
                )
            }
        });

        var ngReactGridPagination = React.createClass({displayName: 'ngReactGridPagination',
            goToPage: function(page) {
                this.props.grid.core.goToPage(page);
            },
            goToLastPage: function() {
                this.goToPage(this.props.grid.totalPages);
            },
            goToFirstPage: function() {
                this.goToPage(1);
            },
            goToNextPage: function() {
                var nextPage = (this.props.grid.currentPage + 1);
                var diff = this.props.grid.totalPages - nextPage;

                if(diff >= 0) {
                    this.goToPage(nextPage);
                }
            },
            goToPrevPage: function() {
                var prevPage = (this.props.grid.currentPage - 1);
                if(prevPage > 0) {
                    this.goToPage(prevPage);
                }
            },
            render: function() {

                var pagerNum = 2;
                var totalPages = this.props.grid.totalPages;
                var currentPage = this.props.grid.currentPage;
                var indexStart = (currentPage - pagerNum) <= 0 ? 1 : (currentPage - pagerNum);
                var indexFinish = (currentPage + pagerNum) >= totalPages ? totalPages : (currentPage + pagerNum);
                var pages = [];

                for(var i = indexStart; i <= indexFinish; i++) {
                    pages.push(i);
                }

                pages = pages.map(function(page, key) {
                    var pageClass = (page === this.props.grid.currentPage) ? "active" : "";
                    return React.DOM.li( {key:key, className:pageClass, dataPage:page}, React.DOM.a( {href:"javascript:", onClick:this.goToPage.bind(null, page)}, page));
                }.bind(this));

                return (
                    React.DOM.div( {className:"ngReactGridPagination"}, 
                        React.DOM.ul(null, 
                            React.DOM.li(null, React.DOM.a( {href:"javascript:", onClick:this.goToPrevPage}, "Prev")),
                            React.DOM.li(null, React.DOM.a( {href:"javascript:", onClick:this.goToFirstPage}, "First")),
                            pages,
                            React.DOM.li(null, React.DOM.a( {href:"javascript:", onClick:this.goToLastPage}, "Last")),
                            React.DOM.li(null, React.DOM.a( {href:"javascript:", onClick:this.goToNextPage}, "Next"))
                        )
                    )
                )
            }
        });

        return React.createClass({
            render: function() {
                return (
                    React.DOM.div( {className:"ngReactGridFooter"}, 
                        ngReactGridStatus( {grid:this.props.grid} ),
                        ngReactGridPagination( {grid:this.props.grid} )
                    )
                )
            }
        });
    })();

    var ngReactGrid = React.createClass({displayName: 'ngReactGrid',
        render: function() {
            return (
                React.DOM.div( {className:"ngReactGrid"}, 
                    ngReactGridHeader( {grid:this.props.grid} ),
                    ngReactGridBody( {grid:this.props.grid} ),
                    ngReactGridFooter( {grid:this.props.grid} )
                )
            )
        }
    });

    return ngReactGrid;
})();