module.exports = function(app) {

    var data_services = require('../shared/services/data-services');
    var app_services = require('../shared/services/app-services');
    var timeline_services = require('../components/timeline/timeline-services');
    var timeline_leave_services = require('../components/timeline/timeline-leave-services');
    var timeline_shopify_functions = require('../components/timeline/timeline-shopify-services');
    var timeline_install_functions = require('../components/timeline/timeline-installs-services');
    var timeline_exhibitions_functions = require('../components/timeline/timeline-exhibitions-services');
    var timeline_visitor_figures_functions = require('../components/timeline/timeline-visitor-figures-services');
    var timeline_googlesheets_functions = require('../components/timeline/timeline-googlesheets-services');
    var timeline_learning_services = require('../components/timeline/timeline-learning-bookings-services');
    var timeline_loans_services = require('../components/timeline/timeline-loans-services');
    var tech_trello_services = require('../components/tech-support/trello-services');
    var timeline_bookings_services = require('../components/timeline/timeline-bookings-services');
    var timeline_functions_resources = require('../components/resource-bookings/timeline-resources-services');
    var downtime_services = require('../components/machine-monitor/downtime-services');
    var feedback_services = require('../components/machine-monitor/feedback-services');

    var servicesArray = [
        data_services,
        app_services,
        downtime_services,
        feedback_services,
        timeline_services,
        timeline_leave_services,
        timeline_shopify_functions,
        timeline_install_functions,
        timeline_exhibitions_functions,
        timeline_functions_resources,
        timeline_bookings_services,
        timeline_visitor_figures_functions,
        timeline_googlesheets_functions,
        timeline_learning_services,
        timeline_loans_services,
        tech_trello_services
    ]
    
 
    _.each(servicesArray, function(services, names) {
        _.each(services, function(service, name) {
        app.factory(name, service);
        });
    });



    return module;
};