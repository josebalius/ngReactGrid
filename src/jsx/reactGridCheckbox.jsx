var ngReactGridCheckboxComponent = (function() {
    var ngReactGridCheckboxComponent = React.createClass({
        getInitialState: function() {
            var disableCheckboxField = this.props.options.disableCheckboxField;
            return {
                checked: false,
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
            var disableCheckboxField = nextProps.options.disableCheckboxField;
            this.setState({
                checked: (nextProps.selectionTarget.indexOf(nextProps.row) === -1) ? false : true,
                disabled: nextProps.row.hasOwnProperty(disableCheckboxField) ? nextProps.row[disableCheckboxField] : false
            });
        },
        render: function() {
            var checkboxStyle = {
                textAlign: "center"
            };
            var hideDisabledCheckboxField = this.props.options.hideDisabledCheckboxField;

            if (this.state.disabled && hideDisabledCheckboxField) {
              return (
                    <div style={checkboxStyle} />
              )
            } else {
                return (
                    <div style={checkboxStyle}>
                        <input type="checkbox" onChange={this.handleClick} checked={this.state.checked} disabled={this.state.disabled} />
                    </div>
                )
            }
        }
    });

    return ngReactGridCheckboxComponent;
})();
