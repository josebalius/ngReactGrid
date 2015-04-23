var NgReactGridCheckboxComponent = (function() {
    // Class appended to table row whose checkbox cell value is true
    var SELECTED_ROW_CLASS = "selected";

    var NgReactGridCheckboxComponent = React.createClass({
        getInitialState: function() {
            var disableCheckboxField = this.props.options.disableCheckboxField;
            var disableCheckboxFieldValue = this.props.utils.getObjectPropertyByStringFn(this.props.row, disableCheckboxField);
            return {
                checked: false,
                disabled: disableCheckboxFieldValue ? disableCheckboxFieldValue : false
            }
        },
        setSelectedRowClass: function(checkedState) {
            var rowNode = this.getDOMNode().parentNode.parentNode;
            rowNode.classList.toggle(SELECTED_ROW_CLASS, checkedState);
        },

        handleClick: function(e) {
            var checkedState = !this.state.checked;
            this.setState({
                checked: checkedState
            });
            this.props.handleToggle(e, checkedState);
        },
        setNgReactGridCheckboxStateFromEvent: function(e) {
            if (!this.state.disabled) {
                 // Target rows with specified field value
                if (e.detail.targetCheckboxes.key) {
                    var checkedState = this.state.checked;
                    var fieldValue =
                        this.props.utils.getObjectPropertyByStringFn(
                            this.props.row,
                            e.detail.targetCheckboxes.key
                        );
                    if (fieldValue && fieldValue === e.detail.targetCheckboxes.value) {
                        checkedState = e.detail.checked;
                    }
                    this.setState({
                        checked: checkedState
                    });
                    this.props.handleToggle(e, checkedState);
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
            this.setSelectedRowClass(this.state.checked);
            window.addEventListener("setNgReactGridCheckboxStateFromEvent", this.setNgReactGridCheckboxStateFromEvent);
        },
        componentWillUnmount: function() {
            window.removeEventListener("setNgReactGridCheckboxStateFromEvent", this.setNgReactGridCheckboxStateFromEvent);
        },
        componentWillUpdate: function(_nextProps, nextState) {
          this.setSelectedRowClass(nextState.checked);
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
