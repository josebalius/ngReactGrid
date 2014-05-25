/**
 * @author Jose Garcia - jose.balius@gmail.com
 * ngReactGrid React component
 */
var ngReactGridComponent = (function() {
    var ngReactGridHeader = (function() {
        return React.createClass({
            render: function() {
                return (
                    <div className="ngReactGridHeader">
                        <div></div>
                        <div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Status</th>
                                        <th>Notes</th>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                    </div> 
                );
            }
        });
    })();

    var ngReactGridBody = (function() {
        return React.createClass({
            render: function() {
                return (
                    <div className="ngReactGridBody">
                        <div className="ngReactGridViewPort">
                            <div className="ngReactGridInnerViewPort">
                                <table>
                                    <tbody> 
                                        <tr>
                                            <td>John</td>
                                            <td>Approved</td>
                                            <td>None</td>
                                        </tr>
                                        <tr>
                                            <td>Jamie</td>
                                            <td>Approved</td>
                                            <td>Requires call</td>
                                        </tr>
                                        <tr>
                                            <td>Jill</td>
                                            <td>Denied</td>
                                            <td>None</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );
            }
        });
    })();

    var ngReactGridFooter = (function() {
        return React.createClass({
            render: function() {
                return (
                    <div className="ngReactGridFooter">-</div>
                );
            }
        });
    })();

    var ngReactGrid = React.createClass({
        render: function() {
            return (
                <div className="ngReactGrid">
                    <ngReactGridHeader grid={this.props.grid} />
                    <ngReactGridBody grid={this.props.grid} />
                    <ngReactGridFooter grid={this.props.grid} />
                </div>
            )
        }
    });

    return ngReactGrid;
})();