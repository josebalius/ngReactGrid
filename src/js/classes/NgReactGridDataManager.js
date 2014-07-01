var NgReactGridDataManager = function(ngReactGrid) {
    this.ngReactGrid = ngReactGrid;
    this.dataCopy = [];
};

NgReactGridDataManager.prototype.mixinAPI = function(gridObject) {
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
NgReactGridDataManager.prototype.edit = function() {
    this.ngReactGrid.editing = true;
    this.dataCopy = JSON.parse(JSON.stringify(this.ngReactGrid.react.originalData));
    this.ngReactGrid.render();
};

/**
 * This is the function that will persist the modified data to the original model
 */
NgReactGridDataManager.prototype.save = function() {
    this.ngReactGrid.editing = false;
    this.ngReactGrid.render();
};

/**
 * This function is called whenever the modifications need to be reverted
 */
NgReactGridDataManager.prototype.cancel = function() {
    this.ngReactGrid.editing = false;

    this.ngReactGrid.update(this.ngReactGrid.events.DATA, {
        data: this.dataCopy
    });

    this.ngReactGrid.render();
};

module.exports = NgReactGridDataManager;