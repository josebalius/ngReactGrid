/**
 * This class manages the editing/saving/reverting functionality to ngReactGrid
 * @param ngReactGrid
 * @constructor
 */
var NgReactGridEditManager = function(ngReactGrid) {
    this.ngReactGrid = ngReactGrid;
    this.dataCopy = [];
};

/**
 * This function is used to add the edit/save/cancel API to the grid object created by the user.
 * @param gridObject
 */
NgReactGridEditManager.prototype.mixinAPI = function(gridObject) {
    var self = this;

    /**
     * This is the function that puts the grid into edit mode
     */
    gridObject.edit = function() {
        self.edit.call(self);
    };

    /**
     * This is the function that will persist the modified data to the original model
     */
    gridObject.save = function() {
        self.save.call(self);
    };

    /**
     * This function is called whenever the modifications need to be reverted
     */
    gridObject.cancel = function() {
        self.cancel.call(self);
    };

};

/**
 * This is the function that puts the grid into edit mode
 */
NgReactGridEditManager.prototype.edit = function() {
    this.ngReactGrid.editing = true;
    this.dataCopy = JSON.parse(JSON.stringify(this.ngReactGrid.react.originalData));
    this.ngReactGrid.render();
};

/**
 * This is the function that will persist the modified data to the original model
 */
NgReactGridEditManager.prototype.save = function() {
    this.ngReactGrid.editing = false;
    this.ngReactGrid.render();
};

/**
 * This function is called whenever the modifications need to be reverted
 */
NgReactGridEditManager.prototype.cancel = function() {
    this.ngReactGrid.editing = false;

    this.ngReactGrid.update(this.ngReactGrid.events.DATA, {
        data: this.dataCopy
    });

    this.ngReactGrid.render();
};

module.exports = NgReactGridEditManager;