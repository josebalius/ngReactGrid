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
                // resize functionality coming soon
            },
            componentDidMount: function() {
                // resize functionality coming soon
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
            cell: function(cellText, cellStyle) {
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
                    return defaultCell;
                }
            },
            render: function() {
                var cellText = this.props.row[this.props.cell.field];
                var cellStyle = {};
                setCellWidth(this.props.grid, this.props.cell, cellStyle, this.props.last, true);

                var defaultCell = (
                        React.DOM.td( {style:cellStyle, title:cellText}, 
                            React.DOM.div(null, cellText)
                        )
                    );

                if(this.props.grid.editing && this.props.cell.edit) {
                    cellText = this.props.cell.edit(this.props.row);
                    return this.cell(cellText, cellStyle);
                } else if(this.props.cell.render) {
                    cellText = this.props.cell.render(this.props.row);
                    return this.cell(cellText, cellStyle);
                } else {
                    return defaultCell;
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
/** @jsx React.DOM */
var ngReactGridCheckboxFieldComponent = (function() {
    var ngReactGridCheckboxFieldComponent = React.createClass({displayName: 'ngReactGridCheckboxFieldComponent',
        getInitialState: function() {
            return {
                checked: false
            }
        },
        handleClick: function() {
            var newState = {
                checked: (this.state.checked) ? false : true
            };

            this.setState(newState);

            this.props.updateValue(newState.checked);
        },
        componentWillReceiveProps: function(nextProps) {
            this.setState({
                checked: (nextProps.value) ? true : false
            });
        },
        componentWillMount: function() {
            this.setState({
                checked: (this.props.value === true) ? true : false
            });
        },
        render: function() {
            return (
                React.DOM.input( {type:"checkbox", checked:this.state.checked, onChange:this.handleClick} )
            )
        }
    });

    return ngReactGridCheckboxFieldComponent;
})();
/** @jsx React.DOM */
var ngReactGridTextFieldComponent = (function() {
    var ngReactGridTextFieldComponent = React.createClass({displayName: 'ngReactGridTextFieldComponent',
        getInitialState: function() {
            return {
                defaultValue: ""
            };
        },
        handleChange: function() {
            var value = this.refs.textField.getDOMNode().value;
            this.props.updateValue(value);
            this.setState({
                defaultValue: value
            });
        },
        componentWillReceiveProps: function(nextProps) {
            this.setState({
                defaultValue: nextProps.value
            });
        },
        componentWillMount: function() {
            this.setState({
                defaultValue: this.props.value
            });
        },
        render: function() {
            return (
                React.DOM.input( {type:"text", value:this.state.defaultValue, className:"ngReactTextField", ref:"textField", onChange:this.handleChange} )
            )
        }
    });

    return ngReactGridTextFieldComponent;
})();
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var _ = require('../vendors/miniUnderscore');
var NgReactGridReactManager = require("./NgReactGridReactManager");
var NgReactGridDataManager = require("./NgReactGridDataManager");
var NO_GET_DATA_CALLBACK_ERROR = "localMode is false, please implement the getData function on the grid object";

/**
 * NgReactGrid - Main class
 * @param scope
 * @param element
 * @param attrs
 * @param $rootScope
 * @constructor
 */
var NgReactGrid = function (scope, element, attrs, $rootScope) {
    this.columnDefs = scope.grid.columnDefs || [];
    this.data = [];
    this.height = 500;
    this.localMode = true;
    this.editing = false;
    this.totalCount = 0;
    this.totalPages = 0;
    this.currentPage = 1;
    this.pageSize = 25;
    this.pageSizes = [25, 50, 100, 500];
    this.sortInfo = {field: "", dir: ""};
    this.search = "";
    this.horizontalScroll = false;
    this.scrollbarWidth = this.getScrollbarWidth();
    this.scope = scope;
    this.element = element;
    this.attrs = attrs;
    this.rootScope = $rootScope;

    /**
     * Initialize the NgReactGridReact class
     */
    this.react = new NgReactGridReactManager(this);
    this.dataManager = new NgReactGridDataManager(this);

    /**
     * Initialize events
     */
    this.setupUpdateEvents();

    /**
     * Initialize scope watchers
     */
    this.initWatchers();

    /**
     * Init the grid
     */
    this.init();
};

NgReactGrid.prototype.init = function () {

    /**
     * Check if getData is set, override with our own and keep a private copy
     */
    if (typeof this.scope.grid.localMode && this.scope.grid.localMode === false) {
        if (this.scope.grid.getData) {
            this._getData = this.scope.grid.getData;
            delete this.scope.grid.getData;
        } else {
            throw new Error(NO_GET_DATA_CALLBACK_ERROR);
        }
    }

    _.extend(this, this.scope.grid);

    /**
     * Provide the editing API interface
     */
    this.dataManager.mixinAPI(this.scope.grid);

    /**
     * If we are in server mode, perform the first call to load the data
     */
    if(this.isServerMode()) {
        this.getData();
    } else {
        this.updateData({
            data: this.data
        });
    }

    this.render();

};

/**
 * Get data wrapper, at the moment it doesn't do much but expect some hooks and functionality being added in the future
 */
NgReactGrid.prototype.getData = function () {
    this.react.loading = true;
    this._getData(this);
    this.render();
};

/**
 * This is called once during initialization to figure out the width of the scrollbars
 * @returns {number}
 */
NgReactGrid.prototype.getScrollbarWidth = function () {
    var outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.width = "100px";
    outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps

    document.body.appendChild(outer);

    var widthNoScroll = outer.offsetWidth;

    /*
     * Force scroll bars
     */
    outer.style.overflow = "scroll";

    /*
     * Add innerDiv
     */
    var inner = document.createElement("div");
    inner.style.width = "100%";
    outer.appendChild(inner);

    var widthWithScroll = inner.offsetWidth;

    // remove divs
    outer.parentNode.removeChild(outer);

    return widthNoScroll - widthWithScroll;
};

/**
 * Returns whether there is an active search on the grid
 * @returns {string|boolean}
 */
NgReactGrid.prototype.isSearching = function () {
    return this.search && this.search.length > 0;
};

/**
 * Returns whether the grid is in local mode
 * @returns {boolean|*}
 */
NgReactGrid.prototype.isLocalMode = function () {
    return this.localMode;
};

/**
 * Returns whether the grid is in server mode
 * @returns {boolean}
 */
NgReactGrid.prototype.isServerMode = function () {
    return !this.localMode;
};

/**
 * Manages the different events that can update the grid
 */
NgReactGrid.prototype.setupUpdateEvents = function () {
    this.events = {
        PAGESIZE: "PAGESIZE",
        SORTING: "SORTING",
        SEARCH: "SEARCH",
        PAGINATION: "PAGINATION",
        DATA: "DATA",
        TOTALCOUNT: "TOTALCOUNT"
    };
};

/**
 * Initializes the scope watchers needed for the grid
 */
NgReactGrid.prototype.initWatchers = function () {
    this.scope.$watch("grid.data", function (newValue, oldValue) {
        if (newValue !== oldValue) {
            if(this.isServerMode() && this.react.loading) {
                this.react.loading = false;
            }

            this.update(this.events.DATA, {
                data: newValue
            });
        }
    }.bind(this));

    this.scope.$watch("grid.totalCount", function (newValue) {
        if (newValue) {
            this.update(this.events.TOTALCOUNT, {totalCount: newValue});
        }
    }.bind(this));
};

/**
 * Updates the grid model, re-renders the react component
 * @param updateEvent
 * @param updates
 */
NgReactGrid.prototype.update = function (updateEvent, updates) {

    switch(updateEvent) {
        case this.events.DATA:
            this.updateData(updates);
            break;

        case this.events.PAGESIZE:
            this.updatePageSize(updates);
            break;

        case this.events.PAGINATION:
            this.updatePagination(updates);
            break;

        case this.events.SEARCH:
            this.updateSearch(updates);
            break;

        case this.events.SORTING:
            this.updateSorting(updates);
            break;

        case this.events.TOTALCOUNT:
            this.updateTotalCount(updates);
            break;
    }

    this.render();

};

/**
 * This function takes care of updating all data related properties. The second param will not the update the originalData
 * property in the react manager
 * @param updates
 * @param updateContainsData
 */
NgReactGrid.prototype.updateData = function(updates, updateContainsData) {

    this.react.startIndex = (this.currentPage - 1) * this.pageSize;
    this.react.endIndex = (this.pageSize * this.currentPage);

    if(this.isLocalMode()) {
        if(updateContainsData) {

            this.data = updates.data.slice(this.react.startIndex, this.react.endIndex);
            this.totalCount = updates.data.length;

        } else {
            this.react.originalData = updates.data.slice(0);
            this.totalCount = this.react.originalData.length;
            this.data = this.react.originalData.slice(this.react.startIndex, this.react.endIndex);
        }

    } else {
        this.data = updates.data;
    }

    this.react.showingRecords = this.data.length;

    this.totalPages = Math.ceil(this.totalCount / this.pageSize);
};

/**
 * This function updates the necessary properties for a successful page size update
 * @param updates
 */
NgReactGrid.prototype.updatePageSize = function(updates) {
    this.pageSize = updates.pageSize;
    this.currentPage = updates.currentPage;
    this.updateData({
        data: (this.isSearching()) ? this.react.filteredData : this.react.originalData
    }, true);
};

/**
 * This function updates the necessary properties for a successful pagination update
 * @param updates
 */
NgReactGrid.prototype.updatePagination = function(updates) {
    this.currentPage = updates.currentPage;
    this.updateData({
        data: (this.isSearching()) ? this.react.filteredData : this.react.originalData
    }, true);
};

/**
 * This function updates the necessary properties for a successful search update
 * @param updates
 */
NgReactGrid.prototype.updateSearch = function(updates) {
    this.search = updates.search;
    this.currentPage = 1;
    this.updateData({
        data: updates.data
    }, true);
};

/**
 * This function updates the necessary properties for a successful sorting update
 * @param updates
 */
NgReactGrid.prototype.updateSorting = function(updates) {
    this.sortInfo = updates.sortInfo;

    if(updates.data) {
        this.currentPage = 1;
        this.updateData({
            data: updates.data
        }, true);
    }
};

/**
 * This function updates the necessary properties for a successful total count update
 * @param updates
 */
NgReactGrid.prototype.updateTotalCount = function(updates) {
    this.totalCount = updates.totalCount;
    this.totalPages = Math.ceil(this.totalCount / this.pageSize);
};

/**
 * Calls React to render the grid component on the given element
 */
NgReactGrid.prototype.render = function() {
    React.renderComponent(ngReactGridComponent({grid: this}), this.element[0]);
};

module.exports = NgReactGrid;
},{"../vendors/miniUnderscore":9,"./NgReactGridDataManager":2,"./NgReactGridReactManager":3}],2:[function(require,module,exports){
/**
 * This class manages the editing/saving/reverting functionality to ngReactGrid
 * @param ngReactGrid
 * @constructor
 */
var NgReactGridDataManager = function(ngReactGrid) {
    this.ngReactGrid = ngReactGrid;
    this.dataCopy = [];
};

/**
 * This function is used to add the edit/save/cancel API to the grid object created by the user.
 * @param gridObject
 */
NgReactGridDataManager.prototype.mixinAPI = function(gridObject) {
    var self = this;

    /**
     * This is the function that puts the grid into edit mode
     */
    gridObject.edit = function() {
        self.edit.call(self);
    };

    /**
     * This is the function that will persist the modified data to the original model
     */
    gridObject.save = function() {
        self.save.call(self);
    };

    /**
     * This function is called whenever the modifications need to be reverted
     */
    gridObject.cancel = function() {
        self.cancel.call(self);
    };

};

/**
 * This is the function that puts the grid into edit mode
 */
NgReactGridDataManager.prototype.edit = function() {
    this.ngReactGrid.editing = true;
    this.dataCopy = JSON.parse(JSON.stringify(this.ngReactGrid.react.originalData));
    this.ngReactGrid.render();
};

/**
 * This is the function that will persist the modified data to the original model
 */
NgReactGridDataManager.prototype.save = function() {
    this.ngReactGrid.editing = false;
    this.ngReactGrid.render();
};

/**
 * This function is called whenever the modifications need to be reverted
 */
NgReactGridDataManager.prototype.cancel = function() {
    this.ngReactGrid.editing = false;

    this.ngReactGrid.update(this.ngReactGrid.events.DATA, {
        data: this.dataCopy
    });

    this.ngReactGrid.render();
};

module.exports = NgReactGridDataManager;
},{}],3:[function(require,module,exports){
/**
 * This class is the bridge between the ngReactGrid class and React
 * @param ngReactGrid
 * @constructor
 */
var NgReactGridReactManager = function (ngReactGrid) {
    /**
     * Reference to the ngReactGrid main class
     */
    this.ngReactGrid = ngReactGrid;

    /**
     * How many records we are currently showing with filters, search, pageSize and pagination applied
     * @type {number}
     */
    this.showingRecords = 0;

    /**
     * The starting index by which we are filtering the local data
     * @type {number}
     */
    this.startIndex = 0;

    /**
     * The end index by which we are filtering local data
     * @type {number}
     */
    this.endIndex = 0;

    /**
     * This is a copy of the data given to ngReactGrid (local data only)
     * @type {Array}
     */
    this.originalData = [];

    /**
     * This is a copy of the data given to ngReactGrid whenever it is filtered (local data only)
     * @type {Array}
     */
    this.filteredData = [];

    /**
     * Loading indicator
     * @type {boolean}
     */
    this.loading = false;
};

/**
 * Page size setter, this is called for the ngReactGridComponent (React class)
 * @param pageSize
 */
NgReactGridReactManager.prototype.setPageSize = function (pageSize) {

    var update = {
        pageSize: pageSize,
        currentPage: 1
    };

    /*
     * Is there a search in place
     */
    if (this.ngReactGrid.isSearching()) {
        update.data = this.filteredData;
    }

    /**
     * Send the update event to the main class
     */
    this.ngReactGrid.update(this.ngReactGrid.events.PAGESIZE, update);

    /**
     * If we are in server mode, call getData
     */
    if (this.ngReactGrid.isServerMode()) {
        this.ngReactGrid.getData();
    }
};

/**
 * Sorting callback, this is called from the ngReactGridComponent whenever a header cell is clicked (and is sortable)
 * @param field
 */
NgReactGridReactManager.prototype.setSortField = function (field) {

    /**
     * The initial update to the grid
     * @type {{sortInfo: {field: string, dir: string}}}
     */
    var update = {
        sortInfo: {
            field: field,
            dir: ""
        }
    };

    /**
     * Are we sorting on a new field
     */
    if (this.ngReactGrid.sortInfo.field !== field) {
        update.sortInfo.dir = "asc";
    } else {
        /**
         * Switch the sorting direction
         */
        if (this.ngReactGrid.sortInfo.dir === "asc") {
            update.sortInfo.dir = "desc";
        } else {
            update.sortInfo.dir = "asc";
        }

    }

    /**
     * Call getData for Server Mode or perform a local sort
     */
    if (this.ngReactGrid.isServerMode()) {
        this.ngReactGrid.update(this.ngReactGrid.events.SORTING, update);
        this.ngReactGrid.getData();
    } else {
        this.performLocalSort(update);
    }
};

/**
 * Simple asc -> desc, desc -> asc sorting, used for local data, resets the current page to 1
 * @param update
 */
NgReactGridReactManager.prototype.performLocalSort = function (update) {
    var copy;

    if (this.ngReactGrid.isSearching()) {
        copy = this.filteredData;
    } else {
        copy = this.originalData.slice(0);
    }

    var isAsc = update.sortInfo.dir === "asc";

    copy.sort(function (a, b) {
        if (isAsc) {
            return a[update.sortInfo.field] <= b[update.sortInfo.field] ? -1 : 1;
        } else {
            return a[update.sortInfo.field] >= b[update.sortInfo.field] ? -1 : 1;
        }
    }.bind(this));

    update.data = copy;
    update.currentPage = 1;

    this.ngReactGrid.update(this.ngReactGrid.events.SORTING, update);
};

/**
 * Search callback for everytime the user updates the search box, supports local mode and server mode
 * @param search
 */
NgReactGridReactManager.prototype.setSearch = function (search) {
    var update = {
        search: search
    };

    if (this.ngReactGrid.isLocalMode()) {
        search = String(search).toLowerCase();

        this.filteredData = this.originalData.slice(0).filter(function (obj) {
            var result = false;
            for (var i in obj) {
                if (obj.hasOwnProperty(i)) {
                    if (String(obj[i]).toLowerCase().indexOf(search) !== -1) {
                        result = true;
                        break;
                    }
                }
            }
            return result;
        });

        update.data = this.filteredData;
        update.currentPage = 1;

        this.ngReactGrid.update(this.ngReactGrid.events.SEARCH, update);

    } else {
        this.ngReactGrid.search = search;
        this.ngReactGrid.getData();
    }
};

/**
 * Pagination call back, called every time a pagination change is made
 * @param page
 */
NgReactGridReactManager.prototype.goToPage = function (page) {

    var update = {
        currentPage: page
    };

    this.ngReactGrid.update(this.ngReactGrid.events.PAGINATION, update);

    if (this.ngReactGrid.isServerMode()) {
        this.ngReactGrid.getData();
    }
};

/**
 * This function is called from React to make sure that any callbacks being passed into react cell components, update the
 * angular scope
 * @param cell
 * @returns {*}
 */
NgReactGridReactManager.prototype.wrapFunctionsInAngular = function (cell) {
    for (var key in cell.props) {
        if (cell.props.hasOwnProperty(key)) {
            if (key === "children") {
                this.wrapFunctionsInAngular(cell.props[key]);
            } else if (typeof cell.props[key] === 'function') {
                cell.props[key] = this.wrapWithRootScope(cell.props[key]);
            }
        }

    }
    return cell;
};

/**
 * This is the wrapping function on all callbacks passed into the React cell components for ngReactGrid
 * @param func
 * @returns {Function}
 */
NgReactGridReactManager.prototype.wrapWithRootScope = function (func) {
    var self = this;
    return function () {
        var args = arguments;
        var phase = self.ngReactGrid.rootScope.$$phase;

        if (phase == '$apply' || phase == '$digest') {
            func.apply(null, args);
        } else {
            self.ngReactGrid.rootScope.$apply(function () {
                func.apply(null, args);
            });
        }
    };
};

module.exports = NgReactGridReactManager;
},{}],4:[function(require,module,exports){
var ngReactGrid = require("../classes/NgReactGrid");

var ngReactGridDirective = function ($rootScope) {
    return {
        restrict: "E",
        link: function (scope, element, attrs) {
            new ngReactGrid(scope, element, attrs, $rootScope);
        }
    }
};

module.exports = ngReactGridDirective;


},{"../classes/NgReactGrid":1}],5:[function(require,module,exports){
var ngReactGridCheckboxFactory = function() {
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
};

module.exports = ngReactGridCheckboxFactory;
},{}],6:[function(require,module,exports){
var ngReactGridCheckboxFieldFactory = function() {

    var ngReactGridCheckboxField = function(record, field) {
        this.record = record;
        this.field = field;
        return ngReactGridCheckboxFieldComponent({value: this.record[field], updateValue: this.updateValue.bind(this)});
    };

    ngReactGridCheckboxField.prototype.updateValue = function(newValue) {
        this.record[this.field] = newValue;
    };

    return ngReactGridCheckboxField;

};

module.exports = ngReactGridCheckboxFieldFactory;
},{}],7:[function(require,module,exports){
var ngReactGridTextFieldFactory = function() {

    var ngReactGridTextField = function(record, field) {
        this.record = record;
        this.field = field;
        return ngReactGridTextFieldComponent({value: this.record[field], updateValue: this.updateValue.bind(this)});
    };

    ngReactGridTextField.prototype.updateValue = function(newValue) {
        this.record[this.field] = newValue;
    };

    return ngReactGridTextField;

};

module.exports = ngReactGridTextFieldFactory;
},{}],8:[function(require,module,exports){
'use strict';

var ngReactGridDirective = require('./directives/ngReactGridDirective');
var ngReactGridCheckboxFactory = require('./factories/ngReactGridCheckboxFactory');
var ngReactGridTextFieldFactory = require("./factories/ngReactGridTextFieldFactory");
var ngReactGridCheckboxFieldFactory = require("./factories/ngReactGridCheckboxFieldFactory");

angular.module('ngReactGrid', [])
    .factory("ngReactGridCheckbox", [ngReactGridCheckboxFactory])
    .factory("ngReactGridTextField", [ngReactGridTextFieldFactory])
    .factory("ngReactGridCheckboxField", [ngReactGridCheckboxFieldFactory])
    .directive("ngReactGrid", ['$rootScope', ngReactGridDirective]);

},{"./directives/ngReactGridDirective":4,"./factories/ngReactGridCheckboxFactory":5,"./factories/ngReactGridCheckboxFieldFactory":6,"./factories/ngReactGridTextFieldFactory":7}],9:[function(require,module,exports){
var _ = {
    nativeForEach: Array.prototype.forEach,
    each: function (obj, iterator, context) {
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
    extend: function (obj) {
        this.each(this.slice.call(arguments, 1), function (source) {
            if (source) {
                for (var prop in source) {
                    obj[prop] = source[prop];
                }
            }
        });
        return obj;
    }
};

module.exports = _;

},{}]},{},[8])