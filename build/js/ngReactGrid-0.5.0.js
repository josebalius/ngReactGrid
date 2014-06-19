/**
 * @license ngReactGrid v0.5.0
 * (c) 2010-2014 Jose Garcia - http://josebalius.github.io/ngReactGrid/
 * License: MIT
 */
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
 * @module ngReactGrid
 */
angular.module("ngReactGrid", [])

/**
 * @directive ngReactGrid - <ng-react-grid grid="grid"></ng-react-grid>
 */
.directive("ngReactGrid", ['ngReactGrid', function(ngReactGrid) {
    return {
        restrict: "E",
        link: function(scope, element, attrs) {
            new ngReactGrid(scope, element, attrs);
        }
    };
}])

.factory("ngReactGridCheckbox", function() {
    var ngReactGridCheckbox = function(selectionTarget) {
        return {
            field: "",
            fieldName: "",
            render: function(row) {

                var handleClick = function() {
                    var index = selectionTarget.indexOf(row);
                    if(index === -1) {
                        selectionTarget.push(row);
                    } else {
                        selectionTarget.splice(index, 1);
                    }
                };

                return ngReactGridCheckboxComponent({selectionTarget: selectionTarget, handleClick: handleClick, row: row});;
            },
            sort: false,
            width: 1
        }
    };

    return ngReactGridCheckbox;
})

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
                pageSize: pageSize,
                currentPage: 1
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
            data: copy,
            currentPage: 1
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
                    data: filteredData,
                    currentPage: 1
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
/** @jsx React.DOM */
/**
 * ngReactGridComponent - React Component
 **/
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
            getInitialState: function() {
                return {
                    width: 0
                };
            },
            cellStyle: {},
            handleClick: function() {
                this.props.grid.react.setSortField(this.props.cell.field);
            },
            componentWillReceiveProps: function() {
                setCellWidth(this.props.grid, this.props.cell, this.cellStyle, this.props.last);
                this.setState({
                    width: this.cellStyle.width
                });
            },
            componentWillMount: function() {
                setCellWidth(this.props.grid, this.props.cell, this.cellStyle, this.props.last);
                this.setState({
                    width: this.cellStyle.width
                });
            },
            resize: function(delta) {
                console.debug(delta);
            },
            componentDidMount: function() {
                var e = this.getDOMNode();
                var resizeControl = e.querySelector(".ngGridHeaderResizeControl");
                var isDragging = false;
                var lastX = 0;
                var self = this;
                var head = document.getElementsByTagName('head')[0];

                /*var processMouseUp = function() {
                    var wasDragging = isDragging;
                    isDragging = false;
                    //$("#cursorChange").remove();
                    window.removeEventListener('mousemove');

                    console.debug('here');

                    if(wasDragging) {
                        //self.props.grid.resizeUpdateOriginalWidth(self.props.index);
                    }
                };

                resizeControl.addEventListener('mousedown', function() {
                    lastX = resizeControl.offsetLeft;

                    window.removeEventListener('mousemove');
                    window.addEventListener('mousemove', function(e) {
                        isDragging = true;
                        var delta = parseInt(e.pageX - lastX);
                        self.resize(delta);
                    });

                    window.removeEventListener('mouseup');
                    window.addEventListener('mouseup', function() {
                        processMouseUp();
                    });
                });

                /*resizeControl.on('mousedown', function() {
                    lastX = resizeControl.offsetLeft;
                    head.appendChild("<style type='text/css' id='cursorChange'>*{cursor:col-resize!important;-moz-user-select: none !important; -webkit-user-select: none !important; -ms-user-select:none !important; user-select:none; !important}</style>");

                    window.removeEventListener('mousemove');
                    window.addEventListener('mousemove', function(e) {
                        console.debug(e);
                    });
                    /*$(window).on('mousemove', function(e) {
                        isDragging = true;
                        var delta = parseInt(e.pageX - lastX);
                        self.props.grid.resize(self.props.cell.field, delta, self.props.index);
                    });

                    $(window).unbind('mouseup');
                    $(window).on('mouseup', function() {
                        processMouseUp();
                    });
                }).on('mouseup', function() {
                    //processMouseUp();
                });

                resizeControl.on('dblclick', function() {
                    var cellTextLength = self.props.cell.displayName.length;
                    var pixelsPerCharacter = 9;
                    var proposedWidth = cellTextLength * pixelsPerCharacter;
                    self.props.grid.doubleClickResize(proposedWidth, self.props.index);
                    self.props.grid.resizeUpdateOriginalWidth(self.props.index);
                });
                */
            },
            render: function() {

                var cellStyle = this.cellStyle;

                var sortStyle = {
                    cursor: "pointer",
                    width: "8%",
                    "float": "left",
                    textAlign: "right",
                    display: (this.props.cell.sort === false) ? "none": ""
                };

                var arrowStyle = {
                    marginTop: 3
                };

                var sortClassName = "icon-arrows";

                if(this.props.grid.sortInfo.field === this.props.cell.field) {
                    if(this.props.grid.sortInfo.dir === "asc") {
                        sortClassName += " icon-asc";
                    } else {
                        sortClassName += " icon-desc";
                    }

                    arrowStyle.marginTop = 5;
                } else {
                    sortClassName += " icon-both";
                }

                var resizeStyle = {
                    height: "21px",
                    marginTop: "-4px",
                    width: "1px",
                    background: "#999999",
                    borderRight: "1px solid #FFF",
                    "float": "right"
                };

                var resizeWrapperStyle = {
                    width: "2%",
                    cursor: "col-resize",
                    display: "none"
                };

                return (
                    React.DOM.th( {title:this.props.cell.displayName, style:cellStyle}, 
                        React.DOM.div( {className:"ngGridHeaderCellText", onClick:this.handleClick}, 
                            this.props.cell.displayName
                        ),
                        React.DOM.div( {style:sortStyle}, React.DOM.i( {className:sortClassName, style:arrowStyle})),
                        React.DOM.div( {style:resizeWrapperStyle, className:"ngGridHeaderResizeControl"}, 
                            React.DOM.div( {className:"ngGridHeaderCellResize", style:resizeStyle})
                        )
                    )
                )
            }
        });

        var ngReactGridShowPerPage = React.createClass({displayName: 'ngReactGridShowPerPage',
            handleChange: function() {
                this.props.grid.react.setPageSize(this.refs.showPerPage.getDOMNode().value);
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
                this.props.grid.react.setSearch(this.refs.searchField.getDOMNode().value);
            },
            render: function() {
                return (
                    React.DOM.div( {className:"ngReactGridSearch"}, 
                        React.DOM.input( {type:"input", placeholder:"Search...", ref:"searchField", onKeyUp:this.handleSearch} )
                    )
                )
            }
        });

        var ngReactGridHeader = React.createClass({displayName: 'ngReactGridHeader',
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

        return ngReactGridHeader;
    })();

    var ngReactGridBody = (function() {

        var ngReactGridBodyRowCell = React.createClass({displayName: 'ngReactGridBodyRowCell',
            handleClick: function() {
                this.props.grid.react.cell.events.onClick(this.props.cell, this.props.row);
            },
            render: function() {
                var cellText = this.props.row[this.props.cell.field];
                var cellStyle = {};
                setCellWidth(this.props.grid, this.props.cell, cellStyle, this.props.last, true);

                if(this.props.cell.render) {
                    cellText = this.props.cell.render(this.props.row);
                    cellTextType = typeof cellText;

                    if(cellTextType === 'string') {
                        return (React.DOM.td( {style:cellStyle}, cellText))
                    } else if(cellTextType === 'object') {

                        cellText = this.props.grid.react.wrapFunctionsInAngular(cellText);

                        return (
                            React.DOM.td( {style:cellStyle}, 
                                cellText
                            ) 
                        );
                    } else {
                        return (React.DOM.td( {style:cellStyle}));
                    }
                    
                } else {
                    return (
                        React.DOM.td( {style:cellStyle, title:cellText, onClick:this.handleClick}, 
                            React.DOM.div(null, cellText)
                        )
                    )
                }

                
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


        var ngReactGridBody = React.createClass({displayName: 'ngReactGridBody',
            getInitialState: function() {
                return {
                    fullRender: false,
                    needsUpdate: false
                }
            },
            calculateIfNeedsUpdate: function() {
                if(this.props.grid.data.length > 100) {
                    this.setState({
                        needsUpdate: true
                    });
                }
            },
            performFullRender: function() {
                if(this.state.needsUpdate) {
                    setTimeout(function() {
                        this.setState({
                            fullRender: true,
                            needsUpdate: false
                        });
                    }.bind(this), 0);
                }
            },
            componentWillMount: function() {
                this.calculateIfNeedsUpdate();
            },
            componentWillReceiveProps: function() {
                this.calculateIfNeedsUpdate();
            }, 
            componentDidMount: function() {
                var domNode = this.getDOMNode();
                var header = document.querySelector(".ngReactGridHeaderInner");
                var viewPort = document.querySelector(".ngReactGridViewPort");

                domNode.firstChild.addEventListener('scroll', function(e) {
                    header.scrollLeft = viewPort.scrollLeft;
                });

                this.performFullRender();
            },
            componentDidUpdate: function() {
                this.performFullRender();
            },
            render: function() {

                var mapRows = function(row, index) {
                    return ngReactGridBodyRow( {key:index, row:row, columns:this.props.columnDefs, grid:this.props.grid} )
                }.bind(this);

                var rows;

                if(this.props.grid.react.loading) {

                    var loadingStyle = {
                        textAlign: "center"
                    };

                    rows = (
                        React.DOM.tr(null, 
                            React.DOM.td( {colSpan:this.props.grid.columnDefs.length, style:loadingStyle}, 
                                "Loading..."
                            )
                        )
                    )
                } else {
                    if(!this.state.fullRender) {
                        rows = this.props.grid.data.slice(0, 100).map(mapRows);
                    } else {
                        rows = this.props.grid.data.map(mapRows);
                    }

                    if(this.props.grid.react.showingRecords === 0) {
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
                }
                
                
                var ngReactGridViewPortStyle = {}, tableStyle = {};

                if(!this.props.grid.horizontalScroll) {
                    ngReactGridViewPortStyle.overflowX = "hidden";
                } else {
                    tableStyle.width = "calc(100% - " + this.props.grid.scrollbarWidth + "px)";
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

        return ngReactGridBody;
    })();

    var ngReactGridFooter = (function() {

        var ngReactGridStatus = React.createClass({displayName: 'ngReactGridStatus',
            render: function() {

                return (
                    React.DOM.div( {className:"ngReactGridStatus"}, 
                        React.DOM.div(null, "Page ", React.DOM.strong(null, this.props.grid.currentPage), " of ", React.DOM.strong(null, this.props.grid.totalPages), " - Showing ", React.DOM.strong(null, this.props.grid.react.showingRecords), " of ", React.DOM.strong(null, this.props.grid.totalCount), " records")
                    )
                )
            }
        });

        var ngReactGridPagination = React.createClass({displayName: 'ngReactGridPagination',
            goToPage: function(page) {
                this.props.grid.react.goToPage(page);
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

        var ngReactGridFooter = React.createClass({displayName: 'ngReactGridFooter',
            render: function() {
                return (
                    React.DOM.div( {className:"ngReactGridFooter"}, 
                        ngReactGridStatus( {grid:this.props.grid} ),
                        ngReactGridPagination( {grid:this.props.grid} )
                    )
                )
            }
        });

        return ngReactGridFooter;
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
/** @jsx React.DOM */
var ngReactGridCheckboxComponent = (function() {
    var ngReactGridCheckboxComponent = React.createClass({displayName: 'ngReactGridCheckboxComponent',
        getInitialState: function() {
            return {
                checked: false
            };
        },
        handleClick: function() {
            this.setState({
                checked: (this.state.checked) ? false : true
            });

            this.props.handleClick();
        },
        componentWillReceiveProps: function(nextProps) {
            this.setState({
                checked: (nextProps.selectionTarget.indexOf(nextProps.row) === -1) ? false : true
            });
        },
        render: function() {
            var checkboxStyle = {
                textAlign: "center"
            };

            return (
                React.DOM.div( {style:checkboxStyle}, 
                    React.DOM.input( {type:"checkbox", onChange:this.handleClick, checked:this.state.checked} )
                )
            )
        }
    });

    return ngReactGridCheckboxComponent;
})();