var ngReactGridTextFieldComponent = (function() {
    var ngReactGridTextFieldComponent = React.createClass({
        handleChange: function() {
            this.props.updateValue(this.refs.textField.getDOMNode().value);
        },
        render: function() {
            return (
                <input type="text" defaultValue={this.props.value} ref="textField" onChange={this.handleChange} />
            )
        }
    });

    return ngReactGridTextFieldComponent;
})();