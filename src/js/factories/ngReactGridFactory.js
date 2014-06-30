var grid = require("../classes/grid");
var _ = require('../vendors/miniUnderscore');

var ngReactGridFactory = function($rootScope) {

    var ngReactGrid = function(scope, element, attrs) {

        this.scope = scope;
        this.element = element[0];
        this.attrs = attrs;
        this.grid = new grid(this, $rootScope);
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

        scope.$watch("grid.editing", function(newValue, oldValue) {
            if(newValue !== oldValue) {
                this.update({editing: newValue}, true);
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
};

module.exports = ngReactGridFactory;