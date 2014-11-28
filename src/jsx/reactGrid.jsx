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
        var hasColumnFilter = function(grid) {
            return grid.columnDefs.some(function(cell) {
                return cell.columnFilter;
            });
        };

        var ngGridColumnFilterCell = React.createClass({
            handleSearchInputChange: function() {
              this.props.onSearchInput(this.refs[this.props.cell.field].getDOMNode().value,
                                       this.props.cell.field);
            },
            render: function() {
                return (
                    <th title={this.props.cell.field + " Search"}>
                        <input type="text"
                            placeholder={"Filter " + this.props.cell.displayName}
                            ref={this.props.cell.field}
                            onKeyUp={this.handleSearchInputChange} />
                    </th>
                )
            }
        });

        // For input in header. Expandable to additional types.
        var ngGridHeaderCellInput = React.createClass({
            getInitialState: function() {
                return {
                    checked: false
                };
            },
            setNgReactGridCheckboxHeaderStateFromEvent: function(e) {
                this.setState({
                    checked: e.detail.checked
                });
            },
            componentDidMount: function() {
                window.addEventListener("setNgReactGridCheckboxHeaderStateFromEvent", this.setNgReactGridCheckboxHeaderStateFromEvent);
            },
            componentWillUnmount: function() {
                window.removeEventListener("setNgReactGridCheckboxHeaderStateFromEvent", this.setNgReactGridCheckboxHeaderStateFromEvent);
            },
            handleCheckboxClick: function(e) {
                e.stopPropagation();
                var newCheckedValue = (this.state.checked) ? false : true;
                this.props.cell.handleHeaderClick(newCheckedValue, this.props.grid.react.getFilteredAndSortedData());
                this.setState({
                    checked: newCheckedValue
                });
            },
            render: function() {
                var headerStyle = this.props.cell.options ?
                        (this.props.cell.options.headerStyle || {}) : {};
                if (this.props.cell.inputType !== undefined) {
                    switch (this.props.cell.inputType) {
                        case "checkbox":
                            return (
                                <div title={this.props.cell.title} className="ngGridHeaderCellCheckboxInput" style={headerStyle}>
                                    <input type={this.props.cell.inputType} onChange={this.handleCheckboxClick} checked={this.state.checked}/>
                                </div>
                            );
                            break;
                        default:
                            return (<div/>);
                    }
                } else {
                    return (<div/>);
                }
            }
        });

        var ngGridHeaderCell = React.createClass({
            getInitialState: function() {
                return {
                    width: 0
                };
            },
            cellStyle: {},
            handleClick: function() {
                if (this.props.cell.sort !== false) {
                    this.props.grid.react.setSortField(this.props.cell.field);
                }
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
                this.cellStyle.cursor = (this.props.cell.sort !== false) ? "pointer" : "default";
                var cellStyle = this.cellStyle;

                var sortStyle = {
                    cursor: "pointer",
                    width: "8%",
                    "float": "left",
                    textAlign: "right",
                    display: (this.props.cell.sort === false) ? "none": "inline-block",
                    overflow: "visible"
                };

                var arrowStyle = {
                    marginTop: 2
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
                    <th title={this.props.cell.displayName} onClick={this.handleClick} style={cellStyle}>
                        <div className="ngGridHeaderCellText">
                            {this.props.cell.displayName}
                        </div>
                        <ngGridHeaderCellInput cell={this.props.cell} grid={this.props.grid} />
                        <div style={sortStyle} ><i className={sortClassName} style={arrowStyle}></i></div>
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

                if (this.props.grid.showGridShowPerPage) {
                  return (
                      <div className="ngReactGridShowPerPage">
                          Show <select onChange={this.handleChange} ref="showPerPage" value={this.props.grid.pageSize}>{options}</select> entries
                      </div>
                  )
                } else {
                  return (<div/>)
                }
            }
        });

        var ngReactGridSearch = React.createClass({
            handleSearch: function() {
                this.props.grid.react.setSearch(this.refs.searchField.getDOMNode().value);
            },
            render: function() {
                if (this.props.grid.showGridSearch) {
                  return (
                      <div className="ngReactGridSearch">
                          <input type="text" placeholder="Search..." ref="searchField" onKeyUp={this.handleSearch} />
                      </div>
                  )
                } else {
                  return (<div/>)
                }
            }
        });

        var ngReactGridColumnFilter = React.createClass({
            handleSearch: function(search, column) {
                this.props.grid.react.setSearch(search, column);
            },
            render: function() {
                if (hasColumnFilter(this.props.grid) && this.props.grid.localMode) {
                    var cells = this.props.grid.columnDefs.map(function(cell, key) {
                        if (cell.columnFilter) {
                            return (<ngGridColumnFilterCell key={key} cell={cell} onSearchInput={this.handleSearch} />)
                        } else {
                            return (<th key={key}/>)
                        }
                    }.bind(this));

                  return (
                      <tr className="ngReactGridColumnFilter">
                          {cells}
                      </tr>
                  )
                } else {
                    return (<tr/>)
                }
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
                    paddingRight: (this.props.grid.horizontalScroll) ? this.props.grid.scrollbarWidth : 0,
                    height: hasColumnFilter(this.props.grid) ? "auto" : "27px"
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
                                            <ngReactGridColumnFilter grid={this.props.grid} />
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
            cell: function(cellText, cellStyle) {
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
                } else {
                    return this.defaultCell;
                }
            },
            render: function() {
                var cellText = this.props.grid.react.getObjectPropertyByString(this.props.row, this.props.cell.field);
                var cellStyle = {};
                setCellWidth(this.props.grid, this.props.cell, cellStyle, this.props.last, true);

                if(this.props.grid.singleLineCell) {
                    cellStyle.overflow = "hidden";
                    cellStyle.textOverflow = "ellipsis";
                    cellStyle.whiteSpace = "nowrap";
                }
                
                if (cellText === null || typeof cellText == 'undefined') {
                    cellText = '';
                }

                this.defaultCell = (
                        <td style={cellStyle} title={String(cellText)}>
                            <div>{String(cellText)}</div>
                        </td>
                    );

                if(this.props.grid.editing && this.props.cell.edit) {
                    cellText = this.props.cell.edit(this.props.row);
                    return this.cell(cellText, cellStyle);
                } else if(this.props.cell.render) {
                    cellText = this.props.cell.render(this.props.row);
                    return this.cell(cellText, cellStyle);
                } else {
                    return this.defaultCell;
                }


            }
        });

        var ngReactGridBodyRow = React.createClass({
            handleClick: function(e) {
                // Prevents triggering 'rowClick' event when toggling checkboxes
                if (e.target.type !== 'checkbox') {
                  this.props.grid.react.rowClick(this.props.row);
                }
            },
            render: function() {

                var columnsLength = this.props.grid.columnDefs.length;
                var cells = this.props.grid.columnDefs.map(function(cell, key) {
                    var last = (columnsLength - 1) === key;
                    return <ngReactGridBodyRowCell key={key} cell={cell} row={this.props.row} grid={this.props.grid} last={last} />
                }.bind(this));

                return (
                    <tr onClick={this.handleClick}>
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
                var domContainer = domNode.parentNode;
                var header = domContainer.querySelector(".ngReactGridHeaderInner");
                var viewPort = domContainer.querySelector(".ngReactGridViewPort");

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


                var ngReactGridViewPortStyle = {
                    maxHeight: this.props.grid.height,
                    minHeight: this.props.grid.height
                };

                var tableStyle = {};

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
                if (this.props.grid.totalCount == 0) {
                    return null;
                }
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
