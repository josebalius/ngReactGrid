var ngReactGridSelectFieldComponent = (function() {

    var ngReactGridSelectFieldComponent = React.createClass({
        render: function() {

            if(!this.props.referenceData) {}

            var options = this.props.referenceData.map(function(option) {
                return (
                    <option value={option.id}>{option.name}</option>
                )
            });
        
            return (
                <select className="ngReactGridSelectField">
                    {options}
                </select>
            )
        }
    });

    return ngReactGridSelectFieldComponent;

})();