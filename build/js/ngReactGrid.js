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
.directive("ngReactGrid", function() {
    return {
        restrict: "E",
        link: function(scope, element, attrs) {
            new ngReactGrid(scope, element, attrs);
        }
    };
})

/**
 * @factory ngReactGrid
 */
.factory("ngReactGrid", function() {
    var ngReactGrid = function(scope, element, attrs) {
        var render = function(grid) {
            React.renderComponent(ngReactGridComponent({grid:grid}), element[0]);
        };

        var gridDefault = {
            columnDefs: [],
            data: [],
            height: 500,
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
    var ngReactGridHeader = (function() {
        return React.createClass({
            render: function() {
                return (
                    React.DOM.div( {className:"ngReactGridHeader"}, 
                        React.DOM.div(null),
                        React.DOM.div(null, 
                            React.DOM.table(null, 
                                React.DOM.thead(null, 
                                    React.DOM.tr(null, 
                                        React.DOM.th(null, "Name"),
                                        React.DOM.th(null, "Status"),
                                        React.DOM.th(null, "Notes")
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
        return React.createClass({
            render: function() {
                return (
                    React.DOM.div( {className:"ngReactGridBody"}, 
                        React.DOM.div( {className:"ngReactGridViewPort"}, 
                            React.DOM.div( {className:"ngReactGridInnerViewPort"}, 
                                React.DOM.table(null, 
                                    React.DOM.tbody(null,  
                                        React.DOM.tr(null, 
                                            React.DOM.td(null, "John"),
                                            React.DOM.td(null, "Approved"),
                                            React.DOM.td(null, "None")
                                        ),
                                        React.DOM.tr(null, 
                                            React.DOM.td(null, "Jamie"),
                                            React.DOM.td(null, "Approved"),
                                            React.DOM.td(null, "Requires call")
                                        ),
                                        React.DOM.tr(null, 
                                            React.DOM.td(null, "Jill"),
                                            React.DOM.td(null, "Denied"),
                                            React.DOM.td(null, "None")
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