var ngReactGridCheckboxComponent = (function() {
    var ngReactGridCheckboxComponent = React.createClass({
        getInitialState: function() {
            return {
                checked: false
            };
        },
        getDefaultProps: function() {
            var disableCheckboxField = this.props.disableCheckboxField;
            return {
                disabled: this.props.row.hasOwnProperty(disableCheckboxField) ? this.props.row[disableCheckboxField] : false
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
                    <input type="checkbox" onChange={this.handleClick} checked={this.state.checked} disabled={this.props.disabled} />
                </div>
            )
        }
    });

    return ngReactGridCheckboxComponent;
})();
