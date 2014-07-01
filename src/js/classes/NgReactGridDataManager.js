var NgReactGridDataManager = function(ngReactGrid) {
    this.ngReactGrid = ngReactGrid;
};

NgReactGridDataManager.prototype.mixinAPI = function(gridObject) {
    var self = this;

    gridObject.edit = function() {
        self.edit.call(self);
    };

    gridObject.saveEdit = function() {
        self.saveEdit.call(self);
    };

    gridObject.cancelEdit = function() {
        self.cancelEdit.call(self);
    };

    gridObject.isEditing = function() {
        self.isEditing.call(self);
    };
};

NgReactGridDataManager.prototype.edit = function() {
    this.ngReactGrid.editing = true;
    this.ngReactGrid.render();
};

NgReactGridDataManager.prototype.saveEdit = function() {
    this.ngReactGrid.editing = false;
};

NgReactGridDataManager.prototype.cancelEdit = function() {
    this.ngReactGrid.editing = false;
};

NgReactGridDataManager.prototype.isEditing = function() {
    return this.ngReactGrid.editing;
};

module.exports = NgReactGridDataManager;