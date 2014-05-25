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
.factory("ngReactGrid", function() {

    var getScrollbarWidth = function() {
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
    };

    var ngReactGrid = function(scope, element, attrs) {
        var render = function(grid) {
            React.renderComponent(ngReactGridComponent({grid:grid}), element[0]);
        };

        var gridDefault = {
            columnDefs: [],
            data: [],
            height: 500,
            scrollbarWidth: getScrollbarWidth(),
            sort: function(field) {

            },
            columnResize: function(field, delta, index) {

            },
            autoColumnResize: function(width, index) {

            }
        };

        var grid = _.extend(gridDefault, scope.grid);

        /**
         * Watchers
         */
        scope.$watch("grid.data", function(newValue, oldValue) {
            _.extend(grid, {data: newValue});
            render(grid);
        });

        render(grid);
    };

    return ngReactGrid;
})
/** @jsx React.DOM */
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

        var ngGridHeaderCell = React.createClass({displayName: 'ngGridHeaderCell',
            render: function() {

                var cellStyle = {};
                setCellWidth(this.props.cell, cellStyle, this.props.last);

                return (
                    React.DOM.th( {title:this.props.cell.displayName, style:cellStyle}, 
                        React.DOM.div(null, 
                            this.props.cell.displayName
                        )
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

                return (
                    React.DOM.div( {className:"ngReactGridHeader"}, 
                        React.DOM.div(null),
                        React.DOM.div(null, 
                            React.DOM.table(null, 
                                React.DOM.tbody(null, 
                                    React.DOM.tr(null, 
                                        cells
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
                setCellWidth(this.props.cell, cellStyle);
                return (
                    React.DOM.td( {style:cellStyle, title:cellText}, cellText)
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
            render: function() {

                var rows = this.props.grid.data.slice(0, 100).map(function(row, index) {
                    return ngReactGridBodyRow( {key:index, row:row, columns:this.props.columnDefs, grid:this.props.grid} )
                }.bind(this));

                return (
                    React.DOM.div( {className:"ngReactGridBody"}, 
                        React.DOM.div( {className:"ngReactGridViewPort"}, 
                            React.DOM.div( {className:"ngReactGridInnerViewPort"}, 
                                React.DOM.table(null, 
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
        return React.createClass({
            render: function() {
                return (
                    React.DOM.div( {className:"ngReactGridFooter"}, "-")
                );
            }
        });
    })();

    var ngReactGrid = React.createClass({displayName: 'ngReactGrid',
        render: function() {
            scrollbarWidth = this.props.grid.scrollbarWidth;
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