'use strict';
/* app */
var underscore = angular.module('underscore', []);
var _ = require('underscore');

var async = require('async');

underscore.factory('_', ['$window', function($window) {
  return $window._; // assumes underscore has already been loaded on the page
}]);
 
 
var controllers = require('../shared/controllers/controllers');
var dead_controllers = require('../components/machine-monitor/dead-controller');

var nav_controller = require('../shared/controllers/navbar-controller');
var colourkey_controller = require('../shared/controllers/colourkey-controller');
var tablefilter_controller = require('../shared/controllers/tablefilter-controller');



var tech_support_controller = require('../components/tech-support/tech-support-controller');


//customers
var customers_controller = require('../components/gift-aid/raw-giftaid-controller');
var customersdirective = require('../components/gift-aid/customers-directive');

//signage
var  record_poster_controller = require('../components/signage/posters/form-controller');
var  raw_poster_controller = require('../components/signage/posters/raw-poster-controller');
var signage_settings_directives = require('../components/signage/directive');


//Exhibitions
var votes_form = require('../components/exhibitions/music/votes-form-controller');
var raw_votes_controller = require('../components/exhibitions/music/raw-votes-controller');
var monthly_votes_controller = require('../components/exhibitions/music/monthly-votes-controller');
var votes_directive = require('../components/exhibitions/directive');


//RESOURCE BOOKING
var  rooms_controller = require('../components/resource-bookings/rooms/raw-rooms-controller');
var  record_rooms_controller = require('../components/resource-bookings/rooms/form-controller');
var  equipment_controller = require('../components/resource-bookings/equipment/raw-equipment-controller');
var  record_equipment_controller = require('../components/resource-bookings/equipment/form-controller');
var  record_bookings_controller = require('../components/resource-bookings/bookings/form-controller');
var  recurring_events_controller = require('../components/resource-bookings/bookings/recurring-events-controller');



var  edit_bookings_controller = require('../components/resource-bookings/bookings/edit-form-controller');



var  bookings_controller = require('../components/resource-bookings/bookings/raw-bookings-controller');
var  monthly_bookings_controller = require('../components/resource-bookings/bookings/monthly-bookings-controller');
var  yearly_bookings_controller = require('../components/resource-bookings/bookings/yearly-bookings-controller');


var  timeline_bookings_services = require('../components/timeline/timeline-bookings-services');
var  timeline_functions_resources = require('../components/resource-bookings/timeline-resources-services');
var  timeline_resources_controller = require('../components/resource-bookings/timeline-resources-controller');








var dashboard_controllers = require('../components/machine-monitor/dashboard-controller');
var feedback_controllers = require('../components/machine-monitor/feedback-controller');
var satisfaction_controllers = require('../components/machine-monitor/satisfaction-controller');


var downtime_controllers = require('../components/machine-monitor/downtime-controller');


var performance_dashboard_controllers = require('../components/performance/dashboard-controllers');

var analyser_controller = require('../components/performance/analyser/analyser-controller');

var raw_visitor_numbers_controller = require('../components/performance/visits/raw-visits-controller');
var monthly_visitor_numbers_controller = require('../components/performance/visits/monthly-visits-controller');
var yearly_visitor_numbers_controller = require('../components/performance/visits/yearly-visits-controller');


var raw_venue_hire_controller = require('../components/performance/venue-hire/raw-visits-controller');
var monthly_venue_hire_controller = require('../components/performance/venue-hire/monthly-visits-controller');
var yearly_venue_hire_controller = require('../components/performance/venue-hire/yearly-visits-controller');



var raw_turnstiles_controller = require('../components/performance/turnstiles/raw-turnstiles-controller');
var monthly_turnstiles_controller = require('../components/performance/turnstiles/monthly-turnstiles-controller');



var kpi_home_controller = require('../components/performance/home/kpi-home-controller');
var master_kpi_home_controller = require('../components/performance/home/master-kpi-home-controller');
var yearly_retail_sales_controller = require('../components/performance/retail/yearly-retail-sales-controller');
var monthly_retail_sales_controller = require('../components/performance/retail/monthly-retail-sales-controller');
var raw_retail_sales_controller = require('../components/performance/retail/raw-retail-sales-controller');

var yearly_donations_controller = require('../components/performance/donations/yearly-donations-controller');
var monthly_donations_controller = require('../components/performance/donations/monthly-donations-controller');
var raw_donations_controller = require('../components/performance/donations/raw-donations-controller');
var donations_performance_form = require('../components/performance/donations/performance-form-controller');


var yearly_donations_other_controller = require('../components/performance/donations-other/yearly-donations_other-controller');
var monthly_donations_other_controller = require('../components/performance/donations-other/monthly-donations_other-controller');
var raw_donations_other_controller = require('../components/performance/donations-other/raw-donations_other-controller');

var donations_other_performance_form = require('../components/performance/donations-other/performance-form-controller');



var monthly_donations_kiosk_controller = require('../components/performance/donations-kiosk/monthly-donations_kiosk-controller');
var raw_donations_kiosk_controller = require('../components/performance/donations-kiosk/raw-donations_kiosk-controller');
var donations_kiosk_performance_form = require('../components/performance/donations-kiosk/performance-form-controller');
var kiosk_uploader = require('../components/performance/donations-kiosk/kiosk-uploader-controller');
var daily_donations_kiosk_controller = require('../components/performance/donations-kiosk/daily-donations_kiosk-controller');


var yearly_corporate_controller = require('../components/performance/corporate/yearly-corporate-controller');
var monthly_corporate_controller = require('../components/performance/corporate/monthly-corporate-controller');
var raw_corporate_controller = require('../components/performance/corporate/raw-corporate-controller');
var corporate_performance_form = require('../components/performance/corporate/performance-form-controller');


var yearly_patron_controller = require('../components/performance/patron/yearly-patron-controller');
var monthly_patron_controller = require('../components/performance/patron/monthly-patron-controller');
var raw_patron_controller = require('../components/performance/patron/raw-patron-controller');
var patron_performance_form = require('../components/performance/patron/performance-form-controller');


var yearly_site_permissions_controller = require('../components/performance/site_permissions/yearly-site_permissions-controller');
var monthly_site_permissions_controller = require('../components/performance/site_permissions/monthly-site_permissions-controller');
var raw_site_permissions_controller = require('../components/performance/site_permissions/raw-site_permissions-controller');
var site_permissions_performance_form = require('../components/performance/site_permissions/performance-form-controller');


var yearly_operations_controller = require('../components/performance/operations/yearly-operations-controller');
var monthly_operationss_controller = require('../components/performance/operations/monthly-operations-controller');
var raw_operations_controller = require('../components/performance/operations/raw-operations-controller');
var operations_performance_form = require('../components/performance/operations/performance-form-controller');



var monthly_exhibitions_pwyt_controller = require('../components/performance/exhibitions-pwyt/monthly-donations-controller');
var raw_exhibitions_pwyt_controller = require('../components/performance/exhibitions-pwyt/raw-donations-controller');
var exhibitions_pwyt_performance_form = require('../components/performance/exhibitions-pwyt/performance-form-controller');

var monthly_giftaid_controller = require('../components/performance/gift-aid/monthly-giftaid-controller');
var monthly_all_giftaid_controller = require('../components/performance/gift-aid/monthly-allgiftaid-controller');
var raw_giftaid_controller = require('../components/performance/gift-aid/raw-giftaid-controller');
var giftaid_performance_form = require('../components/performance/gift-aid/performance-form-controller');

var yearly_welcomedesk_controller = require('../components/performance/welcome-desk/yearly-welcomedesk-controller');
var monthly_welcomedesk_controller = require('../components/performance/welcome-desk/monthly-welcomedesk-controller');
var raw_welcomedesk_controller = require('../components/performance/welcome-desk/raw-welcomedesk-controller');
var welcomedesk_performance_form = require('../components/performance/welcome-desk/performance-form-controller');

var yearly_events_controller = require('../components/performance/events/yearly-events-controller');
var monthly_events_controller = require('../components/performance/events/monthly-events-controller');
var raw_events_controller = require('../components/performance/events/raw-events-controller');
var events_performance_form = require('../components/performance/events/performance-form-controller');

var raw_kpi_events_controller = require('../components/performance/kpi-events/raw-events-controller');
var events_kpi_performance_form = require('../components/performance/kpi-events/performance-form-controller');
var monthly_kpi_events_controller = require('../components/performance/kpi-events/monthly-events-controller');
var standard_monthly_kpi_events_controller = require('../components/performance/kpi-events/standard-monthly-events-controller');


var team_monthly_kpi_events_controller = require('../components/performance/team-kpis/standard-monthly-events-controller');




var yearly_participation_controller = require('../components/performance/participation/yearly-participation-controller');
var monthly_participation_controller = require('../components/performance/participation/monthly-participation-controller');
var raw_participation_controller = require('../components/performance/participation/raw-participation-controller');
var participation_performance_form = require('../components/performance/participation/performance-form-controller');

var target_audience_controller = require('../components/performance/participation/target-audience-controller');


var exhibition_teg_controller = require('../components/performance/gallery-visits/exhibitions-teg-controller');

var yearly_teg_controller = require('../components/performance/gallery-visits/yearly-teg-controller');
var weekly_teg_controller = require('../components/performance/gallery-visits/weekly-teg-controller');
var monthly_teg_controller = require('../components/performance/gallery-visits/monthly-teg-controller');
var raw_teg_controller = require('../components/performance/gallery-visits/raw-teg-controller');
var teg_performance_form = require('../components/performance/gallery-visits/performance-form-controller');

var yearly_learning_controller = require('../components/performance/learning/yearly-learning-controller');
var monthly_learning_controller = require('../components/performance/learning/monthly-learning-controller');
var age_learning_controller = require('../components/performance/learning/age-learning-controller');

var raw_learning_controller = require('../components/performance/learning/raw-learning-controller');
var learning_performance_form = require('../components/performance/learning/performance-form-controller');


var exhibitions_summary_controllers =  require('../components/performance/exhibitions/exhibitions-summary-controller');

var app_controllers = require('../components/team/app-controllers');
var leave_controllers = require('../components/team/leave-controller');
var team_controllers = require('../components/team/team-controller');
var member_controllers = require('../components/member/member-controller');
var form_controllers = require('../components/team/form-controller');
var timeline_controllers = require('../components/timeline/timeline-controller');



var shopify_controllers = require('../components/shopify/shopify-controller');
var shopify_monthly_controllers = require('../components/shopify/shopify-monthly-controller');



//var performance_controller = require('../components/performance/performance-controller');
var performance_form = require('../components/performance/visits/visits-form-controller');
var venue_hire_form = require('../components/performance/venue-hire/visits-form-controller');




var retail_uploader = require('../components/performance/retail/retail-uploader-controller');
var retail_performance_form = require('../components/performance/retail/performance-form-controller');


var raw_timelinesettings_controller = require('../components/timeline-settings/raw-timeline-settings-controller');
var timeline_settings_form = require('../components/timeline-settings/settings-form-controller');
var timeline_settings_directives = require('../components/timeline-settings/timeline-settings-directive');

var users_controller = require('../components/user-admin/users-controller');
var iframe_controller = require('../components/iframe/iframe-controller');
var turnstiles_controller = require('../components/turnstiles/turnstiles-controller');


var directives = require('../shared/directives/directives');
var tech_support_directives = require('../components/tech-support/tech-support-directive');
var users_directives = require('../components/user-admin/users-directive');
var timeline_directives = require('../components/timeline/timeline-directive');
var shopify_directives = require('../components/shopify/shopify-directive');
var performance_directives = require('../components/performance/performance-directive');
var iframe_directives = require('../components/iframe/iframe-directive');
var turnstiles_directives = require('../components/turnstiles/turnstiles-directive');
var resources_directives = require('../components/resource-bookings/directive');





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

var downtime_services = require('../components/machine-monitor/downtime-services');
var feedback_services = require('../components/machine-monitor/feedback-services');




var app =  angular.module('app', [

		'ng',
		'ui.select', 
		'ngRoute',
		'ngAnimate',		
		'ngResource',
		'ngSanitize',//,
		'angularUtils.directives.dirPagination',
		'underscore',//,
		'ngScrollbar',
		'ngMaterial',		
		'angularGrid',
		"ngSanitize",
		'formly', 
		'formlyBootstrap',
		"chart.js",
		'daterangepicker',
		'ngDragDrop',
		'md.data.table',
		'ui.router'	,
		'ui.grid','ui.bootstrap', 'ui.grid.selection', 'ui.grid.exporter', 'ui.grid.edit','ui.grid.resizeColumns','ui.grid.pinning',
		'ui.grid.autoResize','ngMessages', 'material.svgAssetsCache',	'moment-picker'
		
		])
		
	
	

_.each(yearly_events_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(monthly_events_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(raw_events_controller, function(controller, name) {
  app.controller(name, controller);
});
_.each(events_performance_form, function(controller, name) {
  app.controller(name, controller);
});

_.each(raw_kpi_events_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(events_kpi_performance_form, function(controller, name) {
  app.controller(name, controller);
});



_.each(customers_controller, function(controller, name) {
  app.controller(name, controller);
});



_.each(monthly_kpi_events_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(standard_monthly_kpi_events_controller, function(controller, name) {
  app.controller(name, controller);
});


_.each(team_monthly_kpi_events_controller, function(controller, name) {
  app.controller(name, controller);
});


_.each(yearly_participation_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(monthly_participation_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(raw_participation_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(participation_performance_form, function(controller, name) {
  app.controller(name, controller);
});

_.each(target_audience_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(votes_form, function(controller, name) {
  app.controller(name, controller);
});

_.each(raw_votes_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(monthly_votes_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(votes_directive, function(controller, name) {
  app.directive(name, controller);
});


_.each(customersdirective, function(controller, name) {
  app.directive(name, controller);
});



_.each(controllers, function(controller, name) {
  app.controller(name, controller);
});

_.each(feedback_controllers, function(controller, name) {
  app.controller(name, controller);
});

_.each(satisfaction_controllers, function(controller, name) {
  app.controller(name, controller);
});

_.each(operations_performance_form, function(controller, name) {
  app.controller(name, controller);
});

_.each(raw_operations_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(monthly_operationss_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(yearly_operations_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(giftaid_performance_form, function(controller, name) {
  app.controller(name, controller);
});
_.each(raw_giftaid_controller, function(controller, name) {
  app.controller(name, controller);
});
_.each(monthly_giftaid_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(monthly_all_giftaid_controller, function(controller, name) {
  app.controller(name, controller);
});





_.each(monthly_welcomedesk_controller, function(controller, name) {
  app.controller(name, controller);
});
_.each(yearly_welcomedesk_controller, function(controller, name) {
  app.controller(name, controller);
});
_.each(raw_welcomedesk_controller, function(controller, name) {
  app.controller(name, controller);
});
_.each(welcomedesk_performance_form, function(controller, name) {
  app.controller(name, controller);
});
_.each(yearly_learning_controller, function(controller, name) {
  app.controller(name, controller);
});
_.each(monthly_learning_controller, function(controller, name) {
  app.controller(name, controller);
});
_.each(age_learning_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(monthly_exhibitions_pwyt_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(raw_exhibitions_pwyt_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(exhibitions_pwyt_performance_form, function(controller, name) {
  app.controller(name, controller);
});



_.each(exhibition_teg_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(yearly_teg_controller, function(controller, name) {
  app.controller(name, controller);
});
_.each(weekly_teg_controller, function(controller, name) {
  app.controller(name, controller);
});
_.each(monthly_teg_controller, function(controller, name) {
  app.controller(name, controller);
});
_.each(raw_teg_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(teg_performance_form, function(controller, name) {
  app.controller(name, controller);
});

_.each(raw_learning_controller, function(controller, name) {
  app.controller(name, controller);
});
_.each(learning_performance_form, function(controller, name) {
  app.controller(name, controller);
});

_.each(exhibitions_summary_controllers, function(controller, name) {
  app.controller(name, controller);
});




_.each(dead_controllers, function(controller, name) {
  app.controller(name, controller);
});
_.each(nav_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(colourkey_controller, function(controller, name) {
  app.controller(name, controller);
});



_.each(tablefilter_controller, function(controller, name) {
  app.controller(name, controller);
});




_.each(tech_support_controller, function(controller, name) {
  app.controller(name, controller);
});



_.each(edit_bookings_controller, function(controller, name) {
  app.controller(name, controller);
});


_.each(record_bookings_controller, function(controller, name) {
  app.controller(name, controller);
});


_.each(recurring_events_controller, function(controller, name) {
  app.controller(name, controller);
});




_.each(yearly_bookings_controller, function(controller, name) {
  app.controller(name, controller);
});
_.each(monthly_bookings_controller, function(controller, name) {
  app.controller(name, controller);
});


_.each(bookings_controller, function(controller, name) {
  app.controller(name, controller);
});


_.each(record_equipment_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(equipment_controller, function(controller, name) {
  app.controller(name, controller);
});



_.each(record_rooms_controller, function(controller, name) {
  app.controller(name, controller);
});




_.each(signage_settings_directives, function(controller, name) {
  app.directive(name, controller);
});



_.each(raw_poster_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(record_poster_controller, function(controller, name) {
  app.controller(name, controller);
});


_.each(rooms_controller, function(controller, name) {
  app.controller(name, controller);
});



_.each(downtime_controllers, function(controller, name) {
  app.controller(name, controller);
});
_.each(raw_visitor_numbers_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(performance_dashboard_controllers, function(controller, name) {
  app.controller(name, controller);
});

_.each(analyser_controller, function(controller, name) {
  app.controller(name, controller);
});




_.each(raw_turnstiles_controller, function(controller, name) {
  app.controller(name, controller);
});


_.each(yearly_visitor_numbers_controller, function(controller, name) {
  app.controller(name, controller);
});



_.each(raw_venue_hire_controller, function(controller, name) {
  app.controller(name, controller);
});


_.each(monthly_venue_hire_controller, function(controller, name) {
  app.controller(name, controller);
});


_.each(yearly_venue_hire_controller, function(controller, name) {
  app.controller(name, controller);
});




_.each(monthly_visitor_numbers_controller, function(controller, name) {
  app.controller(name, controller);
});


_.each(yearly_retail_sales_controller, function(controller, name) {
  app.controller(name, controller);
});
_.each(monthly_retail_sales_controller, function(controller, name) {
  app.controller(name, controller);
});
_.each(raw_retail_sales_controller, function(controller, name) {
  app.controller(name, controller);
});


_.each(raw_corporate_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(yearly_corporate_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(monthly_corporate_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(corporate_performance_form, function(controller, name) {
  app.controller(name, controller);
});


_.each(raw_donations_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(yearly_donations_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(monthly_donations_controller, function(controller, name) {
  app.controller(name, controller);
});


_.each(yearly_site_permissions_controller, function(controller, name) {
  app.controller(name, controller);
});
_.each(monthly_site_permissions_controller, function(controller, name) {
  app.controller(name, controller);
});
_.each(raw_site_permissions_controller, function(controller, name) {
  app.controller(name, controller);
});
_.each(site_permissions_performance_form, function(controller, name) {
  app.controller(name, controller);
});

_.each(patron_performance_form, function(controller, name) {
  app.controller(name, controller);
});

_.each(raw_patron_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(yearly_patron_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(monthly_patron_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(donations_performance_form, function(controller, name) {
  app.controller(name, controller);
});

_.each(yearly_donations_other_controller, function(controller, name) {
  app.controller(name, controller);
});
_.each(monthly_donations_other_controller, function(controller, name) {
  app.controller(name, controller);
});
_.each(raw_donations_other_controller, function(controller, name) {
  app.controller(name, controller);
});
_.each(donations_other_performance_form, function(controller, name) {
  app.controller(name, controller);
});




_.each(monthly_donations_kiosk_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(raw_donations_kiosk_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(daily_donations_kiosk_controller, function(controller, name) {
  app.controller(name, controller);
});






_.each(donations_kiosk_performance_form, function(controller, name) {
  app.controller(name, controller);
});

_.each(kiosk_uploader, function(controller, name) {
  app.controller(name, controller);
});



_.each(monthly_events_controller, function(controller, name) {
  app.controller(name, controller);
});
_.each(raw_events_controller, function(controller, name) {
  app.controller(name, controller);
});
_.each(events_performance_form, function(controller, name) {
  app.controller(name, controller);
});
_.each(master_kpi_home_controller, function(controller, name) {
  app.controller(name, controller);
});


_.each(kpi_home_controller, function(controller, name) {
  app.controller(name, controller);
});




_.each(monthly_turnstiles_controller, function(controller, name) {
  app.controller(name, controller);
});




_.each(app_controllers, function(controller, name) {
  app.controller(name, controller);
});

_.each(leave_controllers, function(controller, name) {
  app.controller(name, controller);
});

_.each(team_controllers, function(controller, name) {
  app.controller(name, controller);
});

_.each(member_controllers, function(controller, name) {
  app.controller(name, controller);
});
_.each(users_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(iframe_controller, function(controller, name) {
  app.controller(name, controller);
});


_.each(turnstiles_controller, function(controller, name) {
  app.controller(name, controller);
});


_.each(form_controllers, function(controller, name) {
  app.controller(name, controller);
});
_.each(timeline_controllers, function(controller, name) {
  app.controller(name, controller);
});

_.each(shopify_controllers, function(controller, name) {
  app.controller(name, controller);
});

_.each(shopify_monthly_controllers, function(controller, name) {
  app.controller(name, controller);
});



_.each(venue_hire_form, function(controller, name) {
  app.controller(name, controller);
});
_.each(performance_form, function(controller, name) {
  app.controller(name, controller);
});
_.each(retail_performance_form, function(controller, name) {
  app.controller(name, controller);
});

_.each(retail_uploader, function(controller, name) {
  app.controller(name, controller);
});




_.each(raw_timelinesettings_controller, function(controller, name) {
  app.controller(name, controller);
});


_.each(timeline_settings_form, function(controller, name) {
  app.controller(name, controller);
});

_.each(timeline_settings_directives, function(controller, name) {
  app.directive(name, controller);
});






 _.each(directives, function(directive, name) {
  app.directive(name, directive);
});
 _.each(tech_support_directives, function(directive, name) {
  app.directive(name, directive);
});
 _.each(users_directives, function(directive, name) {
  app.directive(name, directive);
});



 _.each(timeline_directives, function(directive, name) {
  app.directive(name, directive);
});

 _.each(shopify_directives, function(directive, name) {
  app.directive(name, directive);
});

 _.each(performance_directives, function(directive, name) {
  app.directive(name, directive);
});


 _.each(iframe_directives, function(directive, name) {
  app.directive(name, directive);
});
 _.each(turnstiles_directives, function(directive, name) {
  app.directive(name, directive);
});


 _.each(resources_directives, function(directive, name) {
  app.directive(name, directive);
});


_.each(data_services, function(factory, name) {
  app.factory(name, factory);
});
_.each(app_services, function(factory, name) {
  app.factory(name, factory);
});
_.each(downtime_services, function(factory, name) {
  app.factory(name, factory);
});
_.each(feedback_services, function(factory, name) {
  app.factory(name, factory);
});
_.each(timeline_services, function(factory, name) {
  app.factory(name, factory);
});
_.each(timeline_leave_services, function(factory, name) {
  app.factory(name, factory);
});

_.each(timeline_shopify_functions, function(factory, name) {
  app.factory(name, factory);
});

_.each(timeline_install_functions, function(factory, name) {
  app.factory(name, factory);
});

_.each(timeline_exhibitions_functions, function(factory, name) {
  app.factory(name, factory);
});


_.each(timeline_resources_controller, function(factory, name) {
  app.controller(name, factory);
});



_.each(timeline_functions_resources, function(factory, name) {
  app.factory(name, factory);
});

_.each(timeline_bookings_services, function(factory, name) {
  app.factory(name, factory);
});



_.each(timeline_visitor_figures_functions, function(factory, name) {
  app.factory(name, factory);
});



_.each(timeline_googlesheets_functions, function(factory, name) {
  app.factory(name, factory);
});
_.each(timeline_learning_services, function(factory, name) {
  app.factory(name, factory);
});
_.each(timeline_loans_services, function(factory, name) {
  app.factory(name, factory);
});
_.each(tech_trello_services, function(factory, name) {
  app.factory(name, factory);
});

app.filter('valueFilter_retail', function (){
  return  function (value, entity){
	  

if(value){
	if( !isNaN(value)&& (entity.typex=="retail" || entity.typex=="currency" )){
		
			return "£"+ Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			
	 }
	 else if( !isNaN(value)&&  entity.stat=="Average transaction"){
		 
			return "£"+ value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	 }
	  else if(  entity.stat==" % net_sales last year"){
			
			return value
	 }
	 
	 else if(typeof value.replace === "function"){
	 {
		 value=value.replace("M-SHED","M Shed")
		 value=value.replace("GEORGIAN-HOUSE","Georgian House")
		 value=value.replace("RED-LODGE","Red Lodge")
		  value=value.replace("BLAISE","Blaise Castle")
		 value=value.replace("BRISTOL-ARCHIVES","Bristol Archives")
	     value=value.replace("ROMAN-VILLA","Kings Weston")
		 
		 return value
	 }
		 
	 }
	 else{
		 
		  return value
	 }
}
  };
})

app.filter('valueFilter', function () {
  return  function (value, entity){
	 if( !isNaN(value)&& (entity.typex=="retail" || entity.typex=="currency" )){
			return "£"+ Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	 }
	 else if( !isNaN(value) ){
			return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	 }
	 else if(value){
	 {
		 value=value.replace("M-SHED","M Shed")
		 value=value.replace("GEORGIAN-HOUSE","Georgian House")
		 value=value.replace("RED-LODGE","Red Lodge")
		 value=value.replace("BLAISE","Blaise Castle")
		 value=value.replace("BRISTOL-ARCHIVES","Bristol Archives")
	     value=value.replace("ROMAN-VILLA","Kings Weston")
		 
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
    filtered.sort(function (a, b) {
      return (a[field] > b[field] ? 1 : -1);
    });
    if(reverse) filtered.reverse();
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


app.config(function config(formlyConfigProvider) {


  formlyConfigProvider.setType([
  {
    name: 'radio',
	overwriteOk:true,
    templateUrl: 'views/formly-radio.html'
  },
  {
    name: 'button',
    templateUrl: '<button ng-click="options.templateOptions">{{options.label}}</button>'
  }
]);

 app.config(function($mdIconProvider) {
    $mdIconProvider
      .iconSet("call", 'img/icons/sets/communication-icons.svg', 24)
      .iconSet("social", 'img/icons/sets/social-icons.svg', 24);
  })

  formlyConfigProvider.setType({
    name: 'input',
	overwriteOk:true,
    template: '<input class="form-control_CHEESE" ng-model="model[options.key]">',
    wrapper: ['helper', 'bootstrapLabel', 'bootstrapHasError']
  });
  

  
  formlyConfigProvider.setType({
    name: 'file',
     templateUrl: 'views/formly-file.html'
  });

});
/*
this breaks the timeline
app.config([
    "$routeProvider",
    "$httpProvider",
    function($routeProvider, $httpProvider){
        $httpProvider.defaults.headers.common['Access-Control-Allow-Headers'] = '*';
    }
]);

*/
app.config(['$locationProvider', function($locationProvider) {
  $locationProvider.hashPrefix('');
  //$locationProvider.html5Mode(true).hashPrefix('!');
}]);


app.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false); //prevents the Possibly unhandled rejection errror
}]);

       
app.config(['$stateProvider','$routeProvider', function ($stateProvider,$routeProvider) {
         

			$routeProvider.when('/', {
               template: '<kpihome-dashboard></kpihome-dashboard>',
             // controller: 'kpi_home_controller'
           })            

	.when('/home', {
                template: '<kpihome-dashboard></kpihome-dashboard>',
              controller: 'kpi_home_controller'
            })
			
		
		     .when('/timeline', {
              template: '<time-line  timeline_mode="Timeline" ng-init="init(\'timeline\')"  ></time-line>'
			  
           })
		    .when('/master', {
              template: '<master-kpi></master-kpi>'
			  
           })
		   
		      //DEV
			  
				.when('/downtime/:kiosk', {
		  templateUrl: '../components/machine-monitor/downtime.html',
		  controller: 'downtimeCtrl'
	   })
		 .when('/downtime', {
		  templateUrl: '../components/machine-monitor/downtime.html',
		  controller: 'downtimeCtrl'
	   })
	   .when('/activity', {
              templateUrl: '../components/machine-monitor/downtime.html',
              controller: 'downtimeCtrl'
           })
		   
		    .when('/feedback', {
              templateUrl: '../components/machine-monitor/feedback.html',
              controller: 'feedbackCtrl'
           })
		   
		      .when('/satisfaction', {
              templateUrl: '../components/machine-monitor/satisfaction.html',
              controller: 'satisfaction'
           })
		   
			  
			  	   .when('/open_badges', {
              templateUrl: '../views/open_badges.html',
              controller: 'open_badgesCtrl'
           })
		   
		     .when('/dead', {
              templateUrl: '../components/machine-monitor/dead.html',
              controller: 'deadCtrl'
           })
		   
		   
		    .when('/todo', {
              templateUrl: '../components/machine-monitor/page-feedback.html',
              controller: 'form_to_trellox'
           })
		   
		    .when('/timeline_settings', {
               template: '<timelinesettings-formdata></timelinesettings-formdata>'
           })
		    .when('/room-hire', {
              template: '<timeline-bookings timeline_mode="Bookings" ng-init="init(\'room-hire\')"  ></timeline-bookings>'
			  
           })
		   
		     .when('/equipment-timeline', {
              template: '<timeline-bookings timeline_mode="Bookings" ng-init="init(\'equipment-booking\')"  ></timeline-bookings>'
			  
           })
		   
		   	.when('/shopify_app', {
               template: '<shopify-status></shopify-status>'
           })
		   
		   
		   .when('/shopify_monthly', {
               template: '<shopify-monthly></shopify-monthly>'
           })
		   
		   
		    .when('/doom', {
               template: '<i-frame></i-frame>'
           })
		   
		   .when('/turnstiles', {
               template: '<turnstiles-controller></turnstiles-controller>'
           })
	
		   
		   .when('/timeline/:track', {
              template: '<time-line></time-line>'
           })
			 .when('/leave/:team', {
              templateUrl: '../components/team/leave-page.html',
              controller: 'leave_controller'
           })
		   	 .when('/team/:team', {
              templateUrl: '../components/team/team-page.html',
              controller: 'team_controller'
           })
		   
		   .when('/tech-support', {
               template: '<tech-support></tech-support>'
           })
		   
		   .when('/-:view', {
              templateUrl: '../components/team/trello.html',
              controller: 'trello'
            })
			/*
			 .when('/', {
              templateUrl: '../components/machine-monitor/dashboard.html',
              controller: 'boardCtrl'
           })
		   */
	
	
		       .when('/people', {
              templateUrl: '../views/people.html',
              controller: 'peoplecounter'
           })
		   
		   
		   //ADMIN
		   
		    .when('/users', {
               template: '<user-admin></user-admin>'
           })
		   

	//PERFORMANCE		   
		   .when('/record-visitor-numbers', {
                template: '<visits-formdata></visits-formdata>'
           })
		   
		    .when('/record-venue-hire', {
                template: '<venuehire-formdata></venuehire-formdata>'
           })
		   
	   
		     .when('/record-visitor-numbers/:kpi', {
               template: '<performance-panel></performance-panel>'
           })
		   
		     .when('/record-kpi-events', {
               template: '<kpievents-formdata></kpievents-formdata>'
           })
		     .when('/raw-kpi-events', {
               template: '<raw-kpieventsfilter></raw-kpieventsfilter>'
           })
		  
		   
		    .when('/record-operations', {
               template: '<operations-formdata></operations-formdata>'
           })
		   
		   .when('/monthly-operations', {
               template: '<operations-dashboard></operations-dashboard>'
           })
		   .when('/raw-operations', {
               template: '<raw-operations></raw-operations>'
           })
		  
		  .when('/record-retail-sales', {
               template: '<retail-formdata></retail-formdata>'
           })


           .when('/upload-retail-sales', {
            template: '<retail-uploader></retail-uploader>'
        })
		   
		   .when('/monthly-retail-sales', {
               template: '<retail-dashboard></retail-dashboard>'
           })
		   .when('/raw-retail-sales', {
               template: '<raw-retailsalesfilter></raw-retailsalesfilter>'
           })
		   
		      
		   
		   
		    .when('/record-exhibitions-pwyt', {
               template: '<exhibitionspwyt-formdata></exhibitionspwyt-formdata>'
           })
		   
		   .when('/monthly-exhibitions-pwyt', {
               template: '<exhibitionspwyt-dashboard></exhibitionspwyt-dashboard>'
           })
		   .when('/raw-exhibitions-income', {
               template: '<data-exhibitionspwyt></data-exhibitionspwyt>'
           })
		      .when('/raw-exhibitions-pwyt', {
               template: '<datax-exhibitionspwyt></datax-exhibitionspwyt>'
           })
		   
		   //team kpis
		    .when('/transformation-kpis', {
               template: '<standardkpieventstransformation-dashboard  team="TRANSFORMATION"  ></standardkpieventstransformation-dashboard>'
           })
		   
		      .when('/collections-kpis', {
               template: '<standardkpieventscollections-dashboard  team="TRANSFORMATION"  ></standardkpieventscollections-dashboard>'
           })
		       .when('/engagement-kpis', {
               template: '<standardkpieventsengagement-dashboard  team="TRANSFORMATION"  ></standardkpieventsengagement-dashboard>'
           })

		   .when('/raw-visits', {
               template: '<datax-visits></datax-visits>'
           })
		   
			.when('/monthly-visits', {
               template: '<visits-dashboard></visits-dashboard>'
           })
		   
		   
		     .when('/raw-venue-hire', {
               template: '<datax-venuehire></datax-venuehire>'
           })
		   
			.when('/monthly-venue-hire', {
               template: '<venuehire-dashboard></venuehire-dashboard>'
           })
		   
		   
		   
		//PERFORMANCE	LEARNING	    
		    	   .when('/record-learning', {
               template: '<learning-Formdata></learning-Formdata>'
           })
		   
		   
		   	   .when('/raw-learning', {
               template: '<raw-learning></raw-learning>'
           })
		   
			.when('/monthly-learning', {
              template: '<learning-dashboard></learning-dashboard>'
           })
	//PERFORMANCE	DONATIONS	    
		    	   .when('/record-giftaid', {
               template: '<giftaid-Formdata></giftaid-Formdata>'
           })
		   
		   	.when('/age-learning', {
               template: '<learning-dashboard></learning-dashboard>'
           })
	//PERFORMANCE	DONATIONS	    
		    .when('/record-giftaid', {
               template: '<giftaid-Formdata></giftaid-Formdata>'
           })
           
//customers-shopify

.when('/gift-aid-customers', {
  templateUrl: './components/gift-aid/data.html'
})

	//EXHIBITIONS		    
		    .when('/record-votes', {
               template: '<votes-Formdata></votes-Formdata>'
           })   
		   
		      .when('/raw-votes', {
               template: '<raw-votes></raw-votes>'
           })  
		   
		   .when('/raw-giftaid', {
              templateUrl: './components/performance/gift-aid/data.html'
           })
		   
			.when('/monthly-giftaid', {
               template: '<giftaid-dashboard></giftaid-dashboard>'
           })
		   
		   .when('/record-donations', {
               template: '<donations-Formdata></donations-Formdata>'
           })
		   
		    .when('/record-donations-other', {
               template: '<donationsother-Formdata></donationsother-Formdata>'
           })
		      .when('/record-donations-kiosk', {
               template: '<donationskiosk-Formdata></donationskiosk-Formdata>'
           })
		   
		   
		   .when('/raw-donations-kiosk', {
                 templateUrl: './components/performance/donations-kiosk/data.html'
           })
		      .when('/day-donations-kiosk', {
                 templateUrl: './components/performance/donations-kiosk/day-data.html'
           })
		   
		   
		   .when('/monthly-donations', {
               template: '<donations-dashboard></donations-dashboard>'
           })
		   
		      .when('/record-patron', {
               template: '<patron-Formdata></patron-Formdata>'
           })
		   
		   .when('/raw-patron', {
                 templateUrl: './components/performance/patron/data.html'
           })
		   
		   .when('/monthly-patron', {
               template: '<patron-dashboard></patron-dashboard>'
           })
		   
		   	     .when('/record-site-permissions', {
               template: '<sitepermissions-Formdata></sitepermissions-Formdata>'
           })
		   
		   .when('/raw-site-permissions', {
                 templateUrl: './components/performance/site_permissions/data.html'
           })
		   
		   .when('/monthly-site-permissions', {
               template: '<sitepermissions-dashboard></sitepermissions-dashboard>'
           })
		   
		   
		   
		     .when('/record-corporate', {
               template: '<corporate-Formdata></corporate-Formdata>'
           })
		   
		   .when('/raw-corporate', {
                 templateUrl: './components/performance/corporate/data.html'
           })
		   
		   .when('/monthly-corporate', {
               template: '<corporate-dashboard></corporate-dashboard>'
           })
		   
		   	.when('/raw-donations', {
                 templateUrl: './components/performance/donations/data.html'
           })
		   
			.when('/monthly-donations', {
               template: '<donations-dashboard></donations-dashboard>'
           })
		   
		    .when('/raw-donations-other', {
                 templateUrl: './components/performance/donations-other/data.html'
           })
		   
			.when('/monthly-donations-other', {
               template: '<donations_otherdashboard></donations_otherdashboard>'
           })
		   
		   
		   .when('/raw-donations-kiosk', {
                 templateUrl: './components/performance/donations-kiosk/data.html'
           })
		   
			.when('/monthly-donations-kiosk', {
               template: '<donations_kioskdashboard></donations_kioskdashboard>'
           })
		   
		        .when('/upload-kiosk-donations', {
            template: '<kiosk-uploader></kiosk-uploader>'
        })
		   
		   
		   
		   .when('/record-events', {
               template: '<events-Formdata></events-Formdata>'
           })
		   
		   
		   
		   
		   	.when('/raw-events', {
               template: '<raw-eventsfilter></raw-eventseventsfilter>'
           })
		   
			.when('/monthly-events', {
               template: '<events-dashboard></events-dashboard>'
           })
		   
		    	   .when('/participation-dashboard', {
               template: '<participation-Dashboard></participation-Dashboard>'
           })
		   
		   	.when('/record-welcomedesk', {
               template: '<welcomedesk-Formdata></welcomedesk-Formdata>'
           })
		   
		   
		   .when('/raw-welcomedesk', {
               templateUrl: './components/performance/welcome-desk/data.html'
           })
		   
			.when('/monthly-welcomedesk', {
               template: '<welcomedesk-dashboard></welcomedesk-dashboard>'
           })
		   
		   	   
			.when('/monthly-teg', {
               template: '<teg-dashboard></teg-dashboard>'
           })
		   
		   	 .when('/record-teg', {
               template: '<teg-Formdata></teg-Formdata>'
           })
		   
		   
		   	.when('/raw-teg', {
               template: '<raw-teg></raw-teg>'
           })
		   
		   
			.when('/exhibitions-summary', {
               template: '<exhibitions-dashboard></exhibitions-dashboard>'
           })
		   
		   .when('/analyser', {
               template: '<analyser-dashboard></analyser-dashboard>'
           })
		   

		    .when('/raw-turnstiles', {
               template: '<raw-turnstiles></raw-turnstiles>'
           })
		   
			.when('/monthly-turnstiles', {
               template: '<monthly-turnstiles></monthly-turnstiles>'
           })
		   
		 //signage
		 	.when('/add-poster', {
               template: '<posters-Form></posters-Form>'
          })
		 
		 	.when('/posters', {
               template: '<raw-Posters></raw-Posters>'
          })
		 
		 //RESOURCE BOOKING 
		  .when('/recurring', {
               template: '<recurring-Event></recurring-Event>'
           })
		   

		  .when('/rooms', {
               template: '<rooms-Formdata></rooms-Formdata>'
           })
		   
		    .when('/bookings-report', {
               template: '<bookings-dashboard></bookings-dashboard>'
           })
		   
		   
		    .when('/edit-booking/:mode/:booking_id', {
               template: '<edit-booking></edit-booking_id>'
           })
		   
		   
			.when('/equipment', {
               template: '<equipment-Formdata></equipment-Formdata>'
           })
		   
			.when('/bookings/:mode', {
               template: '<bookings-Form></bookings-Form>'
          })
		  
			.when('/bookingslist/:mode', {
               template: '<bookings-data></bookings-data>'
          })

		    .when('/turnstiles/:venue', {
               template: '<turnstiles-controller></turnstiles-controller>'
           })
		      .when('/tech-support:token', {
              templateUrl: '../components/tech-support/tech-support-page.html',
              controller: 'tech_support_controller'
           })
		  
		  
		  
			.when('/me/:member', {
              templateUrl: '../components/member/member-page.html',
              controller: 'member_controller',
			  data: {
				//authorizedRoles: [USER_ROLES.admin, USER_ROLES.editor]
				}
           })
		   
		    // .otherwise({redirectTo : 'timeline'    })
		   
		   
          
        }])
