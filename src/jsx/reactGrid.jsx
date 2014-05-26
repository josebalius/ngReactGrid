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

        var ngGridHeaderCell = React.createClass({
            handleClick: function() {
                this.props.grid.react.setSortField(this.props.cell.field);
            },
            render: function() {

                var cellStyle = {};
                setCellWidth(this.props.grid, this.props.cell, cellStyle, this.props.last);

                var sortStyle = {
                    cursor: "pointer",
                    width: "10%",
                    "float": "left",
                    textAlign: "right"
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

                return (
                    <th title={this.props.cell.displayName} style={cellStyle}>
                        <div className="ngGridHeaderCellText" onClick={this.handleClick}>
                            {this.props.cell.displayName}
                        </div>
                        <div style={sortStyle}><i className={sortClassName} style={arrowStyle}></i></div>
                        <div className="ngGridHeaderCellResize"></div>
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

        return React.createClass({
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
                    return (<td style={cellStyle} dangerouslySetInnerHTML={{__html: cellText}} onClick={this.handleClick}></td>)
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


        return React.createClass({
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

                if(this.state.needsUpdate) {
                    setTimeout(function() {
                        this.setState({
                            fullRender: true,
                            needsUpdate: false
                        });
                    }.bind(this), 0);
                }
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
                }
                
                
                var ngReactGridViewPortStyle = {}, tableStyle = {};

                if(!this.props.grid.horizontalScroll) {
                    ngReactGridViewPortStyle.overflowX = "hidden";
                } else {
                    tableStyle.width = "calc(100% - " + this.props.grid.scrollbarWidth + "px)";
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
    })();

    var ngReactGridFooter = (function() {

        var ngReactGridStatus = React.createClass({
            render: function() {

                return (
                    <div className="ngReactGridStatus">
                        <div>Showing <strong>{this.props.grid.react.startIndex+1}</strong> to <strong>{this.props.grid.react.endIndex}</strong> of <strong>{this.props.grid.totalCount}</strong> entries</div>
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

        return React.createClass({
            render: function() {
                return (
                    <div className="ngReactGridFooter">
                        <ngReactGridStatus grid={this.props.grid} />
                        <ngReactGridPagination grid={this.props.grid} />
                    </div>
                )
            }
        });
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