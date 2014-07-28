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
        return self.edit.call(self);
    };

    /**
     * This is the function that will persist the modified data to the original model
     */
    gridObject.save = function() {
        return self.save.call(self);
    };

    /**
     * This function is called whenever the modifications need to be reverted
     */
    gridObject.cancel = function() {
        return self.cancel.call(self);
    };

    /**
     * This function is called whenever the modifications need to be reverted
     */
    gridObject.getEditedData = function() {
        return self.getEditedData.call(self);
    };

};

/**
 * This is the function that puts the grid into edit mode
 */
NgReactGridEditManager.prototype.getEditedData = function() {
    return this.ngReactGrid.react.originalData;
};

/**
 * This is the function that puts the grid into edit mode
 */
NgReactGridEditManager.prototype.edit = function() {
    this.ngReactGrid.editing = true;
    this.dataCopy = this.copyData(this.ngReactGrid.react.originalData);
    this.ngReactGrid.render();
};

/**
 * This is the function that will persist the modified data to the original model
 */
NgReactGridEditManager.prototype.save = function() {
    this.ngReactGrid.editing = false;

    this.ngReactGrid.update(this.ngReactGrid.events.DATA, {
        data: this.ngReactGrid.react.originalData
    });

    return this.ngReactGrid.react.originalData;
};

/**
 * This function is called whenever the modifications need to be reverted
 */
NgReactGridEditManager.prototype.cancel = function() {
    this.ngReactGrid.editing = false;

    this.ngReactGrid.update(this.ngReactGrid.events.DATA, {
        data: this.dataCopy
    });
};

NgReactGridEditManager.prototype.copyData = function(data) {
    return JSON.parse(JSON.stringify(data));
};

module.exports = NgReactGridEditManager;