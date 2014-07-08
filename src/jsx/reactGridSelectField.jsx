var ngReactGridSelectFieldComponent = (function() {

    var ngReactGridSelectFieldComponent = React.createClass({
        getInitialState: function() {
            return {
                defaultValue: {
                    id: "",
                    name: ""
                }
            };
        },
        handleChange: function(e) {
            var value = e.target.value;
            this.props.updateValue(value);
            this.setState({
                defaultValue: {
                    id: value
                }
            });
        },
        componentWillReceiveProps: function(nextProps) {
            this.setState({
                defaultValue: nextProps.value || {}
            });
        },
        componentWillMount: function() {
            this.setState({
                defaultValue: this.props.value || {}
            });
        },
        render: function() {

            if(!this.props.referenceData) {
                this.props.referenceData = [];
            }

            var options = this.props.referenceData.map(function(option) {
                return (
                    <option value={option.id}>{option.name}</option>
                )
            });
        
            return (
                <select className="ngReactGridSelectField" value={this.state.defaultValue.id} onChange={this.handleChange}>
                    {options}
                </select>
            )
        }
    });

    return ngReactGridSelectFieldComponent;

})();