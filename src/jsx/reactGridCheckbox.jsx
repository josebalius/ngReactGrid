var ngReactGridCheckboxComponent = (function() {
    var ngReactGridCheckboxComponent = React.createClass({
        handleClick: function() {
            this.props.handleClick();
        },
        render: function() {
            var checkboxStyle = {
                textAlign: "center"
            };

            return (
                <div style={checkboxStyle}>
                    <input type="checkbox" onClick={this.handleClick} />
                </div>
            )
        }
    });

    return ngReactGridCheckboxComponent;
})();