module.exports = function(app) {


    app.config(['$stateProvider', '$routeProvider', function($stateProvider, $routeProvider) {


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
       

            .when('/age-learning', {
                template: '<learning-dashboard></learning-dashboard>'
            })

            //PERFORMANCE	DONATIONS	    
            .when('/record-giftaid', {
                template: '<giftaid-Formdata></giftaid-Formdata>'
            })

            .when('/record-directdebit', {
                template: '<directdebit-Formdata></directdebit-Formdata>'
            })
            .when('/raw-directdebit', {
                template: '<raw-directdebit></raw-directdebit>'
            })
            .when('/monthly-directdebit', {
                template: '<directdebit-dashboard></directdebit-dashboard>'
            })

            .when('/record-treasure', {
                template: '<treasure-Formdata></treasure-Formdata>'
            })
            .when('/raw-treasure', {
                template: '<raw-treasure></raw-treasure>'
            })
            .when('/monthly-treasure', {
                template: '<treasure-dashboard></treasure-dashboard>'
            })


            //Major Donors
            .when('/record-donors', {
                template: '<donors-Formdata></donors-Formdata>'
            })
            .when('/raw-donors', {
                template: '<raw-donors></raw-donors>'
            })
            .when('/monthly-donors', {
                template: '<donors-dashboard></donors-dashboard>'
            })

     //#online
     .when('/record-online', {
        template: '<online-Formdata></online-Formdata>'
    })
    .when('/raw-online', {
        template: '<raw-online></raw-online>'
    })
    .when('/monthly-online', {
        template: '<online-dashboard></online-dashboard>'
    })


         //#online
         .when('/record-general', {
            template: '<donationsgeneral-Formdata></donationsgeneral-Formdata>'
        })
        .when('/raw-general', {
            template: '<raw-donationsgeneral></raw-donationsgeneral>'
        })
        .when('/monthly-general', {
            template: '<donationsgeneral-dashboard></donationsgeneral-dashboard>'
        })


                //#trusts and foundations
                .when('/record-trusts', {
                    template: '<trusts-Formdata></trusts-Formdata>'
                })
                .when('/raw-trusts', {
                    template: '<raw-trusts></raw-trusts>'
                })
                .when('/monthly-trusts', {
                    template: '<trusts-dashboard></trusts-dashboard>'
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


            .when('/monthly-donation-boxes', {
                template: '<donationboxes-dashboard></donationboxes-dashboard>'
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

            .when('/monthly-donations-box', {
                template: '<donationsboxes-dashboard></donationsboxes-dashboard>'
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


    app.config(function config(formlyConfigProvider) {


        formlyConfigProvider.setType([{
                name: 'radio',
                overwriteOk: true,
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
            overwriteOk: true,
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


    app.config(['$qProvider', function($qProvider) {
        $qProvider.errorOnUnhandledRejections(false); //prevents the Possibly unhandled rejection errror
    }]);



    return module;
};