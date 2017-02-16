        angular.module('app').config(['$stateProvider','$routeProvider', function ($stateProvider,$routeProvider) {
         

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
              template: '<time-line></time-line>'
			  
           })
		    .when('/timeline_settings', {
              templateUrl: '../components/timeline-settings/timeline-settings-page.html',
              controller: 'timeline_settings_controller'
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