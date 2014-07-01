var ngReactGridSelectFieldComponent = (function() {

    var ngReactGridSelectFieldComponent = React.createClass({
        render: function() {

            var options = this.props.referenceData.map(function(data) {
                return (
                    <option value={data.id}>{data.name}</option>
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