/**
 * @author Jose Garcia - jose.balius@gmail.com
 * ngReactGrid React component
 */
var ngReactGridComponent = (function() {

    var windowInnerWidth = window.innerWidth, winderInnerHeight = window.innerHeight, scrollbarWidth;

    var setCellWidth = function(cell, cellStyle, isLast) {

        var originalWidth = false;

        if(!cell.width)
            cell.width = "10%";

        var percentIndex = cell.width.indexOf("%");

        if(percentIndex !== -1) {
            var percentWidth = parseInt(cell.width.replace("%", ""));
            var viewPortWidth = (windowInnerWidth);
            var cellWidth = parseInt(((percentWidth * viewPortWidth) / 100) - 24);
            cell.width = String(cellWidth);
            cellStyle.width = cell.width + "px";
        } else {
            originalWidth = true;
            cellStyle.width = cell.width;
        }

        if(isLast) {
            if(originalWidth) {
                cell.width = cell.width.replace("px", "");
            }

            cellStyle.width = (parseInt(cell.width) + 0) + "px";
        }
    };

    var ngReactGridHeader = (function() {

        var ngGridHeaderCell = React.createClass({
            render: function() {

                var cellStyle = {};
                setCellWidth(this.props.cell, cellStyle, this.props.last);

                return (
                    <th title={this.props.cell.displayName} style={cellStyle}>
                        <div>
                            {this.props.cell.displayName}
                        </div>
                    </th>
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

                return (
                    <div className="ngReactGridHeader">
                        <div></div>
                        <div>
                            <table>
                                <tbody>
                                    <tr>
                                        {cells}
                                    </tr>
                                </tbody>
                            </table>
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
                setCellWidth(this.props.cell, cellStyle);
                return (
                    <td style={cellStyle} title={cellText}>{cellText}</td>
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
            render: function() {

                var rows = this.props.grid.data.slice(0, 100).map(function(row, index) {
                    return <ngReactGridBodyRow key={index} row={row} columns={this.props.columnDefs} grid={this.props.grid} />
                }.bind(this));

                return (
                    <div className="ngReactGridBody">
                        <div className="ngReactGridViewPort">
                            <div className="ngReactGridInnerViewPort">
                                <table>
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
        return React.createClass({
            render: function() {
                return (
                    <div className="ngReactGridFooter">-</div>
                );
            }
        });
    })();

    var ngReactGrid = React.createClass({
        render: function() {
            scrollbarWidth = this.props.grid.scrollbarWidth;
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