var NgReactGridCheckboxComponent = (function() {
    var NgReactGridCheckboxComponent = React.createClass({
        getInitialState: function() {
            var disableCheckboxField = this.props.options.disableCheckboxField;
            var disableCheckboxFieldValue = this.props.utils.getObjectPropertyByStringFn(this.props.row, disableCheckboxField);
            return {
                checked: false,
                disabled: disableCheckboxFieldValue ? disableCheckboxFieldValue : false
            }
        },

        handleClick: function(e) {
            var checkedStateValue = this.state.checked ? false : true;
            this.setState({
                checked: checkedStateValue
            });
            this.props.handleToggle(e, checkedStateValue);
        },
        setNgReactGridCheckboxStateFromEvent: function(e) {
            if (!this.state.disabled) {
                 // Target rows with specified field value
                if (e.detail.targetCheckboxes.key) {
                    var checkedStateValue = this.state.checked;
                    var fieldValue =
                        this.props.utils.getObjectPropertyByStringFn(
                            this.props.row,
                            e.detail.targetCheckboxes.key
                        );
                    if (fieldValue && fieldValue === e.detail.targetCheckboxes.value) {
                        checkedStateValue = e.detail.checked;
                    }
                    this.setState({
                        checked: checkedStateValue
                    });
                    this.props.handleToggle(e, checkedStateValue);
                } else { // Target all rows
                    this.setState({
                        checked: e.detail.checked
                    });
                    this.props.handleToggle(e, e.detail.checked);
                }
            }
        },
        componentWillReceiveProps: function(nextProps) {
            var disableCheckboxField = nextProps.options.disableCheckboxField;
            var disableCheckboxFieldValue = nextProps.utils.getObjectPropertyByStringFn(nextProps.row, disableCheckboxField);
            this.setState({
                checked: (nextProps.selectionTarget.indexOf(nextProps.row) === -1) ? false : true,
                disabled: disableCheckboxFieldValue ? disableCheckboxFieldValue : false
            });
        },
        componentDidMount: function() {
            window.addEventListener("setNgReactGridCheckboxStateFromEvent", this.setNgReactGridCheckboxStateFromEvent);
        },
        componentWillUnmount: function() {
            window.removeEventListener("setNgReactGridCheckboxStateFromEvent", this.setNgReactGridCheckboxStateFromEvent);
        },
        render: function() {
            var hideDisabledCheckboxField = this.props.options.hideDisabledCheckboxField;

            if (this.state.disabled && hideDisabledCheckboxField) {
              return (
                    <div style={this.props.options.headerStyle} />
              )
            } else {
                return (
                    <div style={this.props.options.headerStyle}>
                        <input type="checkbox" onChange={this.handleClick} checked={this.state.checked} disabled={this.state.disabled} />
                    </div>
                )
            }
        }
    });

    return NgReactGridCheckboxComponent;
})();
