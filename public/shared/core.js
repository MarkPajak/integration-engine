'use strict';
/* app */
var underscore = angular.module('underscore', []);
var _ = require('underscore');


underscore.factory('_', ['$window', function($window) {
  return $window._; // assumes underscore has already been loaded on the page
}]);
 
var controllers = require('../shared/controllers/controllers');
var dead_controllers = require('../components/machine-monitor/dead-controller');

var nav_controller = require('../shared/controllers/navbar-controller');
var tech_support_controller = require('../components/tech-support/tech-support-controller');


//RESOURCE BOOKING
var  rooms_controller = require('../components/resource-bookings/rooms/raw-rooms-controller');
var  record_rooms_controller = require('../components/resource-bookings/rooms/form-controller');
var  equipment_controller = require('../components/resource-bookings/equipment/raw-equipment-controller');
var  record_equipment_controller = require('../components/resource-bookings/equipment/form-controller');
var  record_bookings_controller = require('../components/resource-bookings/bookings/form-controller');
var  bookings_controller = require('../components/resource-bookings/bookings/raw-bookings-controller');
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
var raw_turnstiles_controller = require('../components/performance/turnstiles/raw-turnstiles-controller');
var monthly_turnstiles_controller = require('../components/performance/turnstiles/monthly-turnstiles-controller');


var yearly_retail_sales_controller = require('../components/performance/retail/yearly-retail-sales-controller');
var monthly_retail_sales_controller = require('../components/performance/retail/monthly-retail-sales-controller');
var raw_retail_sales_controller = require('../components/performance/retail/raw-retail-sales-controller');

var yearly_donations_controller = require('../components/performance/donations/yearly-donations-controller');
var monthly_donations_controller = require('../components/performance/donations/monthly-donations-controller');
var raw_donations_controller = require('../components/performance/donations/raw-donations-controller');
var donations_performance_form = require('../components/performance/donations/performance-form-controller');


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
//var performance_controller = require('../components/performance/performance-controller');
var performance_form = require('../components/performance/visits/visits-form-controller');
var retail_performance_form = require('../components/performance/retail/performance-form-controller');


var timeline_settings_controller = require('../components/timeline-settings/timeline-settings-controller');
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
		'ui.grid', 'ui.grid.selection', 'ui.grid.exporter', 'ui.grid.edit','ui.grid.resizeColumns','ui.grid.pinning',
		 'ui.grid.autoResize','ngMessages', 'material.svgAssetsCache'
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

_.each(tech_support_controller, function(controller, name) {
  app.controller(name, controller);
});




_.each(record_bookings_controller, function(controller, name) {
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
_.each(raw_donations_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(yearly_donations_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(monthly_donations_controller, function(controller, name) {
  app.controller(name, controller);
});
_.each(donations_performance_form, function(controller, name) {
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


_.each(performance_form, function(controller, name) {
  app.controller(name, controller);
});
_.each(retail_performance_form, function(controller, name) {
  app.controller(name, controller);
});





_.each(timeline_settings_controller, function(controller, name) {
  app.controller(name, controller);
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

app.filter('mapGender', function() {
  var genderHash = {
    1: 'male',
    2: 'female'
  };
})



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
         

             $routeProvider.when('/-:view', {
              templateUrl: '../components/team/trello.html',
              controller: 'trello'
            })
			/*
			 .when('/', {
              templateUrl: '../components/machine-monitor/dashboard.html',
              controller: 'boardCtrl'
           })
		   */
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
		   
		       .when('/people', {
              templateUrl: '../views/people.html',
              controller: 'peoplecounter'
           })
		   
		    .when('/todo', {
              templateUrl: '../components/machine-monitor/page-feedback.html',
              controller: 'form_to_trellox'
           })
		     .when('/timeline', {
              template: '<time-line  timeline_mode="Timeline" ng-init="init(\'timeline\')"  ></time-line>'
			  
           })
		    .when('/timeline_settings', {
              templateUrl: '../components/timeline-settings/timeline-settings-page.html',
              controller: 'timeline_settings_controller'
           })
		    .when('/room-hire', {
              template: '<timeline-bookings timeline_mode="Bookings" ng-init="init(\'room-hire\')"  ></timeline-bookings>'
			  
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
		   
		    .when('/users', {
               template: '<user-admin></user-admin>'
           })
		   
		     .when('/shopify_app', {
               template: '<shopify-status></shopify-status>'
           })
		   
		      .when('/doom', {
               template: '<i-frame></i-frame>'
           })
		      .when('/turnstiles', {
               template: '<turnstiles-controller></turnstiles-controller>'
           })
	
	//PERFORMANCE		   
		   .when('/record-visitor-numbers', {
                template: '<visits-formdata></visits-formdata>'
           })
	   
		     .when('/record-visitor-numbers/:kpi', {
               template: '<performance-panel></performance-panel>'
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
		   
		   .when('/monthly-retail-sales', {
               template: '<retail-dashboard></retail-dashboard>'
           })
		   .when('/raw-retail-sales', {
               template: '<raw-retailsales></raw-retailsales>'
           })
		   
		   
		   
		    .when('/record-exhibitions-pwyt', {
               template: '<exhibitionspwyt-formdata></exhibitionspwyt-formdata>'
           })
		   
		   .when('/monthly-exhibitions-pwyt', {
               template: '<exhibitionspwyt-dashboard></exhibitionspwyt-dashboard>'
           })
		   .when('/raw-exhibitions-pwyt', {
               template: '<raw-exhibitionspwyt></raw-exhibitionspwyt>'
           })
		   
		   
		   
		   

		   .when('/raw-visits', {
               template: '<raw-visits></raw-visits>'
           })
		   
			.when('/monthly-visits', {
               template: '<visits-dashboard></visits-dashboard>'
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
		   
		   
		   
		   	   .when('/raw-giftaid', {
               template: '<raw-giftaid></raw-giftaid>'
           })
		   
			.when('/monthly-giftaid', {
               template: '<giftaid-dashboard></giftaid-dashboard>'
           })
		   
		    	   .when('/record-donations', {
               template: '<donations-Formdata></donations-Formdata>'
           })
		   
		   
		   	   .when('/raw-donations', {
               template: '<raw-donations></raw-donations>'
           })
		   
			.when('/monthly-donations', {
               template: '<donations-dashboard></donations-dashboard>'
           })
		   
		   
		   
		   .when('/record-events', {
               template: '<events-Formdata></events-Formdata>'
           })
		   
		   
		   	.when('/raw-events', {
               template: '<raw-events></raw-events>'
           })
		   
			.when('/monthly-events', {
               template: '<events-dashboard></events-dashboard>'
           })
		   
		   
		   	.when('/record-welcomedesk', {
               template: '<welcomedesk-Formdata></welcomedesk-Formdata>'
           })
		   
		   
		   .when('/raw-welcomedesk', {
               template: '<raw-welcomedesk></raw-welcomedesk>'
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
		   
		 //RESOURCE BOOKING 

		  .when('/rooms', {
               template: '<rooms-Formdata></rooms-Formdata>'
           })
		   
			.when('/equipment', {
               template: '<equipment-Formdata></equipment-Formdata>'
           })
		   
		.when('/bookings', {
               template: '<bookings-Formdata></bookings-Formdata>'
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
