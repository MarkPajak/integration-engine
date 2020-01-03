module.exports = function(app) {

    app.filter('valueFilter_retail', function() {
        return function(value, entity) {


            if (value) {
                if (!isNaN(value) && (entity.typex == "retail" || entity.typex == "currency")) {

                    return "£" + Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                } else if (!isNaN(value) && entity.stat == "Average transaction") {

                    return "£" + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                } else if (entity.stat == " % net_sales last year") {

                    return value
                } else if (typeof value.replace === "function") {
                    {
                        value = value.replace("M-SHED", "M Shed")
                        value = value.replace("GEORGIAN-HOUSE", "Georgian House")
                        value = value.replace("RED-LODGE", "Red Lodge")
                        value = value.replace("BLAISE", "Blaise Museum")
                        value = value.replace("BRISTOL-ARCHIVES", "Bristol Archives")
                        value = value.replace("ROMAN-VILLA", "Kings Weston")

                        return value
                    }

                } else {

                    return value
                }
            }
        };
    })

    app.filter('valueFilter', function() {
        return function(value, entity) {
            if (!isNaN(value) && (entity.typex == "retail" || entity.typex == "currency")) {
                return "£" + Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            } else if (!isNaN(value)) {
                return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            } else if (value) {
                {
                    value = value.replace("M-SHED", "M Shed")
                    value = value.replace("GEORGIAN-HOUSE", "Georgian House")
                    value = value.replace("RED-LODGE", "Red Lodge")
                    value = value.replace("BLAISE", "Blaise Museum")
                    value = value.replace("BRISTOL-ARCHIVES", "Bristol Archives")
                    value = value.replace("ROMAN-VILLA", "Kings Weston")

                    return value
                }

            }
        };
    })

    app.filter('orderByDayNumber', function() {
        return function(items, field, reverse) {
            var filtered = [];
            angular.forEach(items, function(item) {
                filtered.push(item);
            });
            filtered.sort(function(a, b) {
                return (a[field] > b[field] ? 1 : -1);
            });
            if (reverse) filtered.reverse();
            return filtered;
        };
    });


    app.filter('propsFilter', function() {
        return function(items, props) {
            var out = [];

            if (angular.isArray(items)) {
                var keys = Object.keys(props);

                items.forEach(function(item) {
                    var itemMatches = false;

                    for (var i = 0; i < keys.length; i++) {
                        var prop = keys[i];
                        var text = props[prop].toLowerCase();
                        if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                            itemMatches = true;
                            break;
                        }
                    }

                    if (itemMatches) {
                        out.push(item);
                    }
                });
            } else {
                // Let the output be the input untouched
                out = items;
            }

            return out;
        };
    });

    return module;
};