var ngReactGridTextFieldComponent = (function() {
    var ngReactGridTextFieldComponent = React.createClass({
        getInitialState: function() {
            return {
                defaultValue: ""
            };
        },
        handleChange: function() {
            var value = this.refs.textField.getDOMNode().value;
            this.props.updateValue(value);
            this.setState({
                defaultValue: value
            });
        },
        componentWillReceiveProps: function(nextProps) {
            this.setState({
                defaultValue: nextProps.value
            });
        },
        componentWillMount: function() {
            this.setState({
                defaultValue: this.props.value
            });
        },
        render: function() {
            return (
                <input type="text" value={this.state.defaultValue} className="ngReactTextField" ref="textField" onChange={this.handleChange} />
            )
        }
    });

    return ngReactGridTextFieldComponent;
})();