var ngReactGridCheckboxComponent = (function() {
    var ngReactGridCheckboxComponent = React.createClass({
        getInitialState: function() {
            return {
                checked: false
            };
        },
        handleClick: function() {
            this.setState({
                checked: (this.state.checked) ? false : true
            });

            this.props.handleClick();
        },
        componentWillReceiveProps: function(nextProps) {
            this.setState({
                checked: (nextProps.selectionTarget.indexOf(nextProps.row) === -1) ? false : true
            });
        },
        render: function() {
            var checkboxStyle = {
                textAlign: "center"
            };

            return (
                <div style={checkboxStyle}>
                    <input type="checkbox" onChange={this.handleClick} checked={this.state.checked} />
                </div>
            )
        }
    });

    return ngReactGridCheckboxComponent;
})();