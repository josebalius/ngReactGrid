var gridReact = require("./gridReact");

var grid = function(ngReactGrid, $rootScope) {
    this.columnDefs = [];
    this.data = [];
    this.height = 500;
    this.localMode = true;
    this.totalCount = 0;
    this.totalPages = 0;
    this.currentPage = 1;
    this.pageSize = 25;
    this.pageSizes = [25, 50, 100, 500];
    this.sortInfo = {
        field: "",
        dir: ""
    };
    this.search = "";
    this.horizontalScroll = false;
    this.scrollbarWidth = (function() {
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
    })();

    this.react = new gridReact(this, ngReactGrid, $rootScope);

    return this;
};

module.exports = grid;