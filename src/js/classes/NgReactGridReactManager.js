var NgReactGridReactManager = function(ngReactGrid) {
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
NgReactGridReactManager.prototype.setPageSize = function(pageSize) {

    var update = {
        pageSize: pageSize,
        currentPage: 1
    };

    /*
     * Is there a search in place
     */
    if(this.ngReactGrid.isSearching()) {
        update.data = this.filteredData;
    }

    /**
     * Send the update event to the main class
     */
    this.ngReactGrid.update(this.ngReactGrid.events.PAGESIZE, update);

    /**
     * If we are in server mode, call getData
     */
    if(this.ngReactGrid.isServerMode()) {
        this.ngReactGrid.getData();
    }
};

/**
 * Sorting callback, this is called from the ngReactGridComponent whenever a header cell is clicked (and is sortable)
 * @param field
 */
NgReactGridReactManager.prototype.setSortField = function(field) {

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
    if(this.ngReactGrid.sortInfo.field !== field) {
        update.sortInfo.dir = "asc";
    } else {
        /**
         * Switch the sorting direction
         */
        if(this.ngReactGrid.sortInfo.dir === "asc") {
            update.sortInfo.dir = "desc";
        } else {
            update.sortInfo.dir = "asc";
        }

    }

    /**
     * Call getData for Server Mode or perform a local sort
     */
    if(this.ngReactGrid.isServerMode()) {
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
NgReactGridReactManager.prototype.performLocalSort = function(update) {
    var copy;

    if(this.ngReactGrid.isSearching()) {
        copy = this.filteredData;
    } else {
        copy = this.originalData.slice(0);
    }

    var isAsc = update.sortInfo.dir === "asc";

    copy.sort(function(a, b) {
        if(isAsc) {
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
NgReactGridReactManager.prototype.setSearch = function(search) {
    var update = {
        search: search
    };

    if(this.ngReactGrid.isLocalMode()) {
        search = String(search).toLowerCase();

        this.filteredData = this.originalData.slice(0).filter(function(obj) {
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

        update.data = this.filteredData;
        update.currentPage = 1;

        this.ngReactGrid.update(this.ngReactGrid.events.SEARCH, update);

    } else {
        this.ngReactGrid.getData();
    }
};

/**
 * Pagination call back, called every time a pagination change is made
 * @param page
 */
NgReactGridReactManager.prototype.goToPage = function(page) {

    var update = {
        currentPage: page
    };

    this.ngReactGrid.update(this.ngReactGrid.events.PAGINATION, update);

    if(this.ngReactGrid.isServerMode()) {
        this.ngReactGrid.getData();
    }
};

/**
 * This function is called from React to make sure that any callbacks being passed into react cell components, update the
 * angular scope
 * @param cell
 * @returns {*}
 */
NgReactGridReactManager.prototype.wrapFunctionsInAngular = function(cell) {
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

/**
 * This is the wrapping function on all callbacks passed into the React cell components for ngReactGrid
 * @param func
 * @returns {Function}
 */
NgReactGridReactManager.prototype.wrapWithRootScope = function(func) {
    var self = this;
    return function() {
        var args = arguments;
        self.rootScope.$apply(function() {
            func.apply(null, args);
        });
    };
};

module.exports = NgReactGridReactManager;