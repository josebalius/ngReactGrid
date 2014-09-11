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
        setNgReactGridCheckboxStateFromEvent: function(event) {
            this.setState({
                checked: event.detail.checked
            });
        },
        componentWillReceiveProps: function(nextProps) {
            this.setState({
                checked: (nextProps.selectionTarget.indexOf(nextProps.row) === -1) ? false : true
            });
        },
        componentDidMount: function() {
            window.addEventListener("setNgReactGridCheckboxStateFromEvent", this.setNgReactGridCheckboxStateFromEvent);
        },
        componentWillUnmount: function() {
            window.removeEventListener("setNgReactGridCheckboxStateFromEvent", this.setNgReactGridCheckboxStateFromEvent);
        },
        render: function() {
            return (
                <div style={this.props.options.headerStyle}>
                    <input type="checkbox" onChange={this.handleClick} checked={this.state.checked} />
                </div>
            )
        }
    });

    return ngReactGridCheckboxComponent;
})();
