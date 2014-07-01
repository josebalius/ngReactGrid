var ngReactGridCheckboxFieldComponent = (function() {
    var ngReactGridCheckboxFieldComponent = React.createClass({
        getInitialState: function() {
            return {
                checked: false
            }
        },
        handleClick: function() {
            var newState = {
                checked: (this.state.checked) ? false : true
            };

            this.setState(newState);

            this.props.updateValue(newState.checked);
        },
        componentWillReceiveProps: function(nextProps) {
            this.setState({
                checked: (nextProps.value) ? true : false
            });
        },
        componentWillMount: function() {
            this.setState({
                checked: (this.props.value === true) ? true : false
            });
        },
        render: function() {
            return (
                <input type="checkbox" checked={this.state.checked} onChange={this.handleClick} />
            )
        }
    });

    return ngReactGridCheckboxFieldComponent;
})();