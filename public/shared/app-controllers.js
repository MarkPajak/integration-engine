module.exports = function(app) {
   

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
    var record_poster_controller = require('../components/signage/posters/form-controller');
    var raw_poster_controller = require('../components/signage/posters/raw-poster-controller');
    var signage_settings_directives = require('../components/signage/directive');


    //Exhibitions
    var votes_form = require('../components/exhibitions/music/votes-form-controller');
    var raw_votes_controller = require('../components/exhibitions/music/raw-votes-controller');
    var monthly_votes_controller = require('../components/exhibitions/music/monthly-votes-controller');
    var votes_directive = require('../components/exhibitions/directive');


    //RESOURCE BOOKING
    var rooms_controller = require('../components/resource-bookings/rooms/raw-rooms-controller');
    var record_rooms_controller = require('../components/resource-bookings/rooms/form-controller');
    var equipment_controller = require('../components/resource-bookings/equipment/raw-equipment-controller');
    var record_equipment_controller = require('../components/resource-bookings/equipment/form-controller');
    var record_bookings_controller = require('../components/resource-bookings/bookings/form-controller');
    var recurring_events_controller = require('../components/resource-bookings/bookings/recurring-events-controller');



    var edit_bookings_controller = require('../components/resource-bookings/bookings/edit-form-controller');



    var bookings_controller = require('../components/resource-bookings/bookings/raw-bookings-controller');
    var monthly_bookings_controller = require('../components/resource-bookings/bookings/monthly-bookings-controller');
    var yearly_bookings_controller = require('../components/resource-bookings/bookings/yearly-bookings-controller');


    var timeline_resources_controller = require('../components/resource-bookings/timeline-resources-controller');




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
    var monthly_donations_box_controller = require('../components/performance/donations-boxes/monthly-donations-controller');



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


    var exhibitions_summary_controllers = require('../components/performance/exhibitions/exhibitions-summary-controller');

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

    var users_controller = require('../components/user-admin/users-controller');
    var iframe_controller = require('../components/iframe/iframe-controller');
    var turnstiles_controller = require('../components/turnstiles/turnstiles-controller');



var controllersArray=[
    kpi_home_controller,
    nav_controller,
    turnstiles_controller,
    iframe_controller,
    timeline_resources_controller,
    timeline_settings_form,
    yearly_events_controller,
    monthly_events_controller,
    raw_events_controller,
    events_performance_form,
    raw_kpi_events_controller,
    events_kpi_performance_form,
    customers_controller,
    monthly_kpi_events_controller,
    standard_monthly_kpi_events_controller,
    team_monthly_kpi_events_controller,
    yearly_participation_controller,
    monthly_participation_controller,
    raw_participation_controller,
    participation_performance_form,
    target_audience_controller,
    votes_form,
    raw_votes_controller,
    monthly_votes_controller,
    votes_directive,
    customersdirective,
    controllers,
    feedback_controllers,
    satisfaction_controllers,
    operations_performance_form,
    raw_operations_controller,
    monthly_operationss_controller,
    yearly_operations_controller,
    giftaid_performance_form,
    raw_giftaid_controller,
    monthly_giftaid_controller,
    monthly_all_giftaid_controller,
    monthly_welcomedesk_controller,
    yearly_welcomedesk_controller,
    raw_welcomedesk_controller,
    welcomedesk_performance_form,
    yearly_learning_controller,
    monthly_learning_controller,
    age_learning_controller,
    monthly_exhibitions_pwyt_controller,
    raw_exhibitions_pwyt_controller,
    exhibitions_pwyt_performance_form,
    exhibition_teg_controller,
    yearly_teg_controller,
    weekly_teg_controller,
    monthly_teg_controller,
    raw_teg_controller,
    teg_performance_form,
    raw_learning_controller,
    learning_performance_form,
    exhibitions_summary_controllers,
    dead_controllers,
    nav_controller,
    colourkey_controller,
    tablefilter_controller,
    tech_support_controller,
    edit_bookings_controller,
    record_bookings_controller,
    recurring_events_controller,
    yearly_bookings_controller,
    monthly_bookings_controller,
    bookings_controller,
    record_equipment_controller,
    equipment_controller,
    record_rooms_controller,
    signage_settings_directives,
    raw_poster_controller,
    record_poster_controller,
    rooms_controller,
    downtime_controllers,
    raw_visitor_numbers_controller,
    performance_dashboard_controllers,
    analyser_controller,
    raw_turnstiles_controller,
    yearly_visitor_numbers_controller,
    raw_venue_hire_controller,
    monthly_venue_hire_controller,
    yearly_venue_hire_controller,
    monthly_visitor_numbers_controller,
    yearly_retail_sales_controller,
    monthly_retail_sales_controller,
    raw_retail_sales_controller,
    raw_corporate_controller,
    yearly_corporate_controller,
    monthly_corporate_controller,
    corporate_performance_form,
    raw_donations_controller,
    yearly_donations_controller,
    monthly_donations_controller,
    yearly_site_permissions_controller,
    monthly_site_permissions_controller,
    raw_site_permissions_controller,
    site_permissions_performance_form,
    patron_performance_form,
    raw_patron_controller,
    yearly_patron_controller,
    monthly_patron_controller,
    donations_performance_form,
    yearly_donations_other_controller,
    monthly_donations_other_controller,
    raw_donations_other_controller,
    donations_other_performance_form,
    monthly_donations_box_controller,
    monthly_donations_kiosk_controller,
    raw_donations_kiosk_controller,
    daily_donations_kiosk_controller,
    donations_kiosk_performance_form,
    kiosk_uploader,
    monthly_events_controller,
    raw_events_controller,
    events_performance_form,
    master_kpi_home_controller,
    app_controllers,
    leave_controllers,
    team_controllers,
    member_controllers,
    users_controller,
    turnstiles_controller,
    form_controllers,
    timeline_controllers,
    shopify_controllers,
    shopify_monthly_controllers,
    venue_hire_form,
    performance_form,
    retail_performance_form,
    retail_uploader,
    raw_timelinesettings_controller


]

    _.each(controllersArray, function(controllers, names) {
        _.each(controllers, function(controller, name) {
        app.controller(name, controller);
        });
    });


    return module;
};