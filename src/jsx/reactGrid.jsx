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
            render: function() {

                var cellStyle = {};
                setCellWidth(this.props.grid, this.props.cell, cellStyle, this.props.last);

                return (
                    <th title={this.props.cell.displayName} style={cellStyle}>
                        <div>
                            {this.props.cell.displayName}
                        </div>
                    </th>
                )
            }
        });

        var ngReactGridShowPerPage = React.createClass({
            render: function() {

                var options = this.props.grid.pageSizes.map(function(pageSize) {
                    return (<option value={pageSize}>{pageSize}</option>)
                });

                return (
                    <div className="ngReactGridShowPerPage">
                        Show <select>{options}</select> entries
                    </div>
                )
            }
        });

        var ngReactGridSearch = React.createClass({
            render: function() {
                return (
                    <div className="ngReactGridSearch">
                        <input type="search" placeholder="Search..." />
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
                            <ngReactGridShowPerPage grid={this.props.grid} />
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
            render: function() {
                var cellText = this.props.row[this.props.cell.field];
                var cellStyle = {};
                setCellWidth(this.props.grid, this.props.cell, cellStyle, this.props.last, true);
                return (
                    <td style={cellStyle} title={cellText}>
                        <div>{cellText}</div>
                    </td>
                )
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
            calculateNeedsUpdate: function() {
                if(this.props.grid.data.length > 100) {
                    this.setState({
                        needsUpdate: true
                    });
                }
            },
            componentWillMount: function() {
                this.calculateNeedsUpdate();
            },
            componentWillReceiveProps: function() {
                this.calculateNeedsUpdate();
            }, 
            componentDidMount: function() {
                var domNode = this.getDOMNode();
                var header = document.querySelector(".ngReactGridHeaderInner");
                var viewPort = document.querySelector(".ngReactGridViewPort");

                domNode.firstChild.addEventListener('scroll', function(e) {
                    header.scrollLeft = viewPort.scrollLeft;
                });

                if(this.state.needsUpdate) {
                    this.setState({
                        fullRender: true,
                        needsUpdate: false
                    });
                }
            },
            render: function() {

                var mapRows = function(row, index) {
                    return <ngReactGridBodyRow key={index} row={row} columns={this.props.columnDefs} grid={this.props.grid} />
                }.bind(this);

                var rows;

                if(!this.state.fullRender) {
                    rows = this.props.grid.data.slice(0, 100).map(mapRows);
                } else {
                    rows = this.props.grid.data.map(mapRows);
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
    })();

    var ngReactGridFooter = (function() {

        var ngReactGridStatus = React.createClass({
            render: function() {
                return (
                    <div className="ngReactGridStatus">
                        <div>Showing <strong>1</strong> to <strong>10</strong> of <strong>{this.props.grid.totalCount}</strong> entries</div>
                    </div>
                )
            }
        });

        var ngReactGridPagination = React.createClass({
            render: function() {
                return (
                    <div className="ngReactGridPagination">
                        <ul>
                            <li><a href="#">Prev</a></li>
                            <li><a href="#">First</a></li>
                            <li><a href="#">1</a></li>
                            <li><a href="#">2</a></li>
                            <li><a href="#">3</a></li>
                            <li><a href="#">4</a></li>
                            <li><a href="#">5</a></li>
                            <li><a href="#">Last</a></li>
                            <li><a href="#">Next</a></li>
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