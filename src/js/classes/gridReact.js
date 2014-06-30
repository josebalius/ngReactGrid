var NO_GET_DATA_CALLBACK_ERROR = "localMode is false, please implement the getData function on the grid object";

var gridReact = function(grid, ngReactGrid, $rootScope) {
    this.ngReactGrid = ngReactGrid;
    this.grid = grid;
    this.showingRecords = 0;
    this.startIndex = 0;
    this.endIndex = 0;
    this.originalData = [];
    this.loading = false;
    this.rootScope = $rootScope;
};

gridReact.prototype.setPageSize = function(pageSize) {
    this.rootScope.$apply(function() {

        var update = {
            pageSize: pageSize,
            currentPage: 1
        };

        if(this.grid.search.length > 0) {
            update.data = this.filteredData;
            this.ngReactGrid.update(update, false, true)
        } else {
            this.ngReactGrid.update(update);
        }

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
    this.rootScope.$apply(function() {
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
    var copy;

    if(this.grid.search.length > 0) {
        copy = this.filteredData;
    } else {
        copy = this.grid.react.originalData.slice(0);
    }

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
    }, false, true);

    this.ngReactGrid.render();
};

gridReact.prototype.setSearch = function(search) {

    this.rootScope.$apply(function() {
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

            this.filteredData = filteredData;

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
    this.rootScope.$apply(function() {

        this.ngReactGrid.update({
            data: (this.grid.search.length > 0) ? this.filteredData : this.originalData,
            currentPage: page
        }, false, true);

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
};

gridReact.prototype.wrapWithRootScope = function(func) {
    return function() {
        this.rootScope.$apply(function() {
            func();
        });
    };
};

module.exports = gridReact;