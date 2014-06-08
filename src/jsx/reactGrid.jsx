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

        var ngGridHeaderCell = React.createClass({
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
                    <th title={this.props.cell.displayName} style={cellStyle}>
                        <div className="ngGridHeaderCellText" onClick={this.handleClick}>
                            {this.props.cell.displayName}
                        </div>
                        <div style={sortStyle}><i className={sortClassName} style={arrowStyle}></i></div>
                        <div style={resizeWrapperStyle} className="ngGridHeaderResizeControl">
                            <div className="ngGridHeaderCellResize" style={resizeStyle}></div>
                        </div>
                    </th>
                )
            }
        });

        var ngReactGridShowPerPage = React.createClass({
            handleChange: function() {
                this.props.grid.react.setPageSize(this.refs.showPerPage.getDOMNode().value);
            },
            render: function() {

                var options = this.props.grid.pageSizes.map(function(pageSize, key) {
                    return (<option value={pageSize} key={key}>{pageSize}</option>)
                }.bind(this));

                return (
                    <div className="ngReactGridShowPerPage">
                        Show <select onChange={this.handleChange} ref="showPerPage" value={this.props.grid.pageSize}>{options}</select> entries
                    </div>
                )
            }
        });

        var ngReactGridSearch = React.createClass({
            handleSearch: function() {
                this.props.grid.react.setSearch(this.refs.searchField.getDOMNode().value);
            },
            render: function() {
                return (
                    <div className="ngReactGridSearch">
                        <input type="input" placeholder="Search..." ref="searchField" onKeyUp={this.handleSearch} />
                    </div>
                )
            }
        });

        var ngReactGridHeader = React.createClass({
            render: function() {

                var columnsLength = this.props.grid.columnDefs.length;
                var cells = this.props.grid.columnDefs.map(function(cell, key) {
                    var last = (columnsLength - 1) === key;
                    return (<ngGridHeaderCell key={key} cell={cell} index={key} grid={this.props.grid} last={last} />)
                }.bind(this));

                var tableStyle = {
                    width: "calc(100% - " + this.props.grid.scrollbarWidth + "px)"
                };

                var ngReactGridHeader = {
                    paddingRight: (this.props.grid.horizontalScroll) ? this.props.grid.scrollbarWidth : 0
                };

                return (
                    <div>
                        <div className="ngReactGridHeaderToolbarWrapper">
                            <ngReactGridShowPerPage grid={this.props.grid} setGridState={this.props.setGridState} />
                            <ngReactGridSearch grid={this.props.grid} />
                        </div>
                        <div className="ngReactGridHeaderWrapper">
                            <div className="ngReactGridHeader" style={ngReactGridHeader}>
                                <div className="ngReactGridHeaderInner">
                                    <table style={tableStyle}>
                                        <thead>
                                            <tr>
                                                {cells}
                                            </tr>
                                        </thead>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
        });

        return ngReactGridHeader;
    })();

    var ngReactGridBody = (function() {

        var ngReactGridBodyRowCell = React.createClass({
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
                        return (<td style={cellStyle}>{cellText}</td>)
                    } else if(cellTextType === 'object') {

                        cellText = this.props.grid.react.wrapFunctionsInAngular(cellText);

                        return (
                            <td style={cellStyle}>
                                {cellText}
                            </td>
                        );
                    }
                    
                } else {
                    return (
                        <td style={cellStyle} title={cellText} onClick={this.handleClick}>
                            <div>{cellText}</div>
                        </td>
                    )
                }

                
            }
        });

        var ngReactGridBodyRow = React.createClass({
            render: function() {

                var columnsLength = this.props.grid.columnDefs.length;
                var cells = this.props.grid.columnDefs.map(function(cell, key) {
                    var last = (columnsLength - 1) === key;
                    return <ngReactGridBodyRowCell key={key} cell={cell} row={this.props.row} grid={this.props.grid} last={last} />
                }.bind(this));

                return (
                    <tr>
                        {cells}
                    </tr>
                )
            }
        });


        var ngReactGridBody = React.createClass({
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
                    return <ngReactGridBodyRow key={index} row={row} columns={this.props.columnDefs} grid={this.props.grid} />
                }.bind(this);

                var rows;

                if(this.props.grid.react.loading) {

                    var loadingStyle = {
                        textAlign: "center"
                    };

                    rows = (
                        <tr>
                            <td colSpan={this.props.grid.columnDefs.length} style={loadingStyle}>
                                Loading...
                            </td>
                        </tr>
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
                            <tr>
                                <td colSpan={this.props.grid.columnDefs.length} style={noDataStyle}>
                                    No records found
                                </td>
                            </tr>
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
                    <div className="ngReactGridBody">
                        <div className="ngReactGridViewPort" style={ngReactGridViewPortStyle}>
                            <div className="ngReactGridInnerViewPort">
                                <table style={tableStyle}>
                                    <tbody> 
                                        {rows}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );
            }
        });

        return ngReactGridBody;
    })();

    var ngReactGridFooter = (function() {

        var ngReactGridStatus = React.createClass({
            render: function() {

                return (
                    <div className="ngReactGridStatus">
                        <div>Page <strong>{this.props.grid.currentPage}</strong> of <strong>{this.props.grid.totalPages}</strong> - Showing <strong>{this.props.grid.react.showingRecords}</strong> of <strong>{this.props.grid.totalCount}</strong> records</div>
                    </div>
                )
            }
        });

        var ngReactGridPagination = React.createClass({
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
                    return <li key={key} className={pageClass} dataPage={page}><a href="javascript:" onClick={this.goToPage.bind(null, page)}>{page}</a></li>;
                }.bind(this));

                return (
                    <div className="ngReactGridPagination">
                        <ul>
                            <li><a href="javascript:" onClick={this.goToPrevPage}>Prev</a></li>
                            <li><a href="javascript:" onClick={this.goToFirstPage}>First</a></li>
                            {pages}
                            <li><a href="javascript:" onClick={this.goToLastPage}>Last</a></li>
                            <li><a href="javascript:" onClick={this.goToNextPage}>Next</a></li>
                        </ul>
                    </div>
                )
            }
        });

        var ngReactGridFooter = React.createClass({
            render: function() {
                return (
                    <div className="ngReactGridFooter">
                        <ngReactGridStatus grid={this.props.grid} />
                        <ngReactGridPagination grid={this.props.grid} />
                    </div>
                )
            }
        });

        return ngReactGridFooter;
    })();

    var ngReactGrid = React.createClass({
        render: function() {
            return (
                <div className="ngReactGrid">
                    <ngReactGridHeader grid={this.props.grid} />
                    <ngReactGridBody grid={this.props.grid} />
                    <ngReactGridFooter grid={this.props.grid} />
                </div>
            )
        }
    });

    return ngReactGrid;
})();