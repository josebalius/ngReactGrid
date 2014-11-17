/**
 * This class is the bridge between the ngReactGrid class and React
 * @param ngReactGrid
 * @constructor
 */
var NgReactGridReactManager = function (ngReactGrid) {
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
     * Values of all filter fields
     * @type {Object}
     */
    this.filterValues = {};

    /**
     * This is a copy of the pagination-independent viewable data in table that
     *     can be affected by filter and sort
     * @type {Array}
     */
    this.filteredAndSortedData = [];

    /**
     * Loading indicator
     * @type {boolean}
     */
    this.loading = false;

    /**
     * Instance pointer to a static function
     * @type {Function}
     */
    this.getObjectPropertyByString = NgReactGridReactManager.getObjectPropertyByString;
};

/**
 * This function is used to add API to the grid object created by the user.
 * @param gridObject
 */
NgReactGridReactManager.prototype.mixinAPI = function(gridObject) {
    var self = this;

    /**
     * Get filtered and sorted data
     */
    gridObject.getFilteredAndSortedData = function() {
        return self.getFilteredAndSortedData.call(self);
    };
};

/**
 * Get table data wrapper
 */
NgReactGridReactManager.prototype.getFilteredAndSortedData = function() {
    return this.filteredAndSortedData;
};

/**
 * Page size setter, this is called for the ngReactGridComponent (React class)
 * @param pageSize
 */
NgReactGridReactManager.prototype.setPageSize = function (pageSize) {

    var update = {
        pageSize: pageSize,
        currentPage: 1
    };

    /*
     * Is there a search in place
     */
    if (this.ngReactGrid.isSearching()) {
        update.data = this.filteredData;
    }

    /**
     * Send the update event to the main class
     */
    this.ngReactGrid.update(this.ngReactGrid.events.PAGESIZE, update);

    /**
     * If we are in server mode, call getData
     */
    if (this.ngReactGrid.isServerMode()) {
        this.ngReactGrid.getData();
    }
};

/**
 * Sorting callback, this is called from the ngReactGridComponent whenever a header cell is clicked (and is sortable)
 * @param field
 */
NgReactGridReactManager.prototype.setSortField = function (field) {

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
    if (this.ngReactGrid.sortInfo.field !== field) {
        update.sortInfo.dir = "asc";
    } else {
        /**
         * Switch the sorting direction
         */
        if (this.ngReactGrid.sortInfo.dir === "asc") {
            update.sortInfo.dir = "desc";
        } else {
            update.sortInfo.dir = "asc";
        }

    }

    /**
     * Call getData for Server Mode or perform a local sort
     */
    if (this.ngReactGrid.isServerMode()) {
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
NgReactGridReactManager.prototype.performLocalSort = function (update) {
    var copy;

    if (this.ngReactGrid.isSearching()) {
        copy = this.filteredData;
    } else {
        copy = this.originalData.slice(0);
    }

    var isAsc = update.sortInfo.dir === "asc";

    copy.sort(function (a, b) {
        var aField = this.getObjectPropertyByString(a, update.sortInfo.field);
        var bField = this.getObjectPropertyByString(b, update.sortInfo.field);

        if (isAsc) {
            return aField <= bField ? -1 : 1;
        } else {
            return aField >= bField ? -1 : 1;
        }
    }.bind(this));

    update.data = copy;
    update.currentPage = 1;

    this.ngReactGrid.update(this.ngReactGrid.events.SORTING, update);
};

/**
 * This is a recursive search function that will transverse an object searching for an index of a string
 * @param obj
 * @param search
 * @param (Optional) column
 * @returns {boolean}
 */
NgReactGridReactManager.prototype.deepSearch = function(obj, search, column) {
    var found = false;

    if (obj) {
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {

                var prop = obj[i];

                if (typeof prop === "object") {
                    found = this.deepSearch(prop, search, column);
                    if (found === true) break;
                } else {
                    if (column && column !== '_global') {
                      if (i !== column.split('.').pop()) continue;
                    }
                    if (String(obj[i]).toLowerCase().indexOf(search.toLowerCase()) !== -1) {
                        found = true;
                        break;
                    }
                }


            }
        }
    }

    return found;
};

/**
 * Search callback for everytime the user updates the search box.
 *   Supports local mode and server mode; local mode only for column search.
 * @param search
 * @param (Optional) column
 */
NgReactGridReactManager.prototype.setSearch = function (search, column) {
    var column = column ? column : '_global';
    this.filterValues[column] = search;

    var update = {
        search: search
    };

    if (this.ngReactGrid.isLocalMode()) {
        this.filteredData = this.originalData.slice(0);
        for (var column in this.filterValues) {
            if (this.filterValues.hasOwnProperty(column)) {
                this.filteredData = this.filteredData.filter(function (obj) {
                    var found = false;
                    found = this.deepSearch(obj, this.filterValues[column], column);
                    return found;
                }.bind(this));
            }
        }

        update.data = this.filteredData;
        update.currentPage = 1;

        this.ngReactGrid.update(this.ngReactGrid.events.SEARCH, update);
    } else {
        this.ngReactGrid.search = search;
        this.ngReactGrid.getData();
    }
};

/**
 * Pagination call back, called every time a pagination change is made
 * @param page
 */
NgReactGridReactManager.prototype.goToPage = function (page) {

    var update = {
        currentPage: page
    };

    this.ngReactGrid.update(this.ngReactGrid.events.PAGINATION, update);

    if (this.ngReactGrid.isServerMode()) {
        this.ngReactGrid.getData();
    }
};

/**
 * Row click callback
 * @param row
 */
NgReactGridReactManager.prototype.rowClick = function(row) {
    this.ngReactGrid.rowClick(row);
};

/**
 * This function is called from React to make sure that any callbacks being passed into react cell components, update the
 * angular scope
 * @param cell
 * @returns {*}
 */
NgReactGridReactManager.prototype.wrapFunctionsInAngular = function (cell) {
    for (var key in cell.props) {
        if (cell.props.hasOwnProperty(key)) {
            if (key === "children" && cell.props[key]) {
                this.wrapFunctionsInAngular(cell.props[key]);
            } else if (typeof cell.props[key] === 'function') {
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
NgReactGridReactManager.prototype.wrapWithRootScope = function (func) {
    var self = this;
    return function () {
        var args = arguments;
        var phase = self.ngReactGrid.rootScope.$$phase;

        if (phase == '$apply' || phase == '$digest') {
            func.apply(null, args);
        } else {
            self.ngReactGrid.rootScope.$apply(function () {
                func.apply(null, args);
            });
        }
    };
};

/**
 * This function allows you to get a property from any object, no matter how many levels deep it is
 * MOVE THIS FUNCTION INTO ITS OWN CLASS
 * @param object
 * @param str
 * @static
 * @returns {*}
 */
NgReactGridReactManager.getObjectPropertyByString = function (object, str) {

    /**
     * Convert indexes to properties
     */
    str = str.replace(/\[(\w+)\]/g, '.$1');

    /**
     * Strip a leading dot
     */
    str = str.replace(/^\./, '');
    var a = str.split('.');
    while (a.length) {
        var n = a.shift();
        if (object != null && n in object) {
            object = object[n];
        } else {
            return;
        }
    }
    return object;
};

/**
 * Updates an object property given a specified path, it will create the object if it doesn't exist
 * @static
 * @param obj
 * @param path
 * @param value
 */
NgReactGridReactManager.updateObjectPropertyByString = function(obj, path, value) {
    var a = path.split('.');
    var o = obj;
    for (var i = 0; i < a.length - 1; i++) {
        var n = a[i];
        if (n in o) {
            o = o[n];
        } else {
            o[n] = {};
            o = o[n];
        }
    }
    o[a[a.length - 1]] = value;
};

module.exports = NgReactGridReactManager;
