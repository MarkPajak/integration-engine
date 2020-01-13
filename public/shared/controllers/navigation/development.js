module.exports = function ($scope,views) {

 
var signage=[]
signage.push(views.posters_list)
signage.push(views.add_posters)


var resources=[]
resources.push(views.rooms)
resources.push(views.equipment)
resources.push(views.equipment_bookings)
resources.push(views.bookings_report)
resources.push(views.room_hire)
resources.push(views.equipment_booking_timeline)



var enter_data=[]
enter_data.push(views.performance)
enter_data.push(views.record_corporate)
enter_data.push(views.record_patron)
enter_data.push(views.record_donations)
enter_data.push(views.record_donations_other)
enter_data.push(views.upload_kiosk_donations)
enter_data.push(views.record_welcomedesk)
enter_data.push(views.record_directdebit)
enter_data.push(views.record_treasure)
enter_data.push(views.record_donors)
enter_data.push(views.record_trusts)
enter_data.push(views.record_online)
enter_data.push(views.record_general)

enter_data.push(views.record_events)
enter_data.push(views.record_kpi_events)
enter_data.push(views.record_venue_hire)

var performance_data=[]
performance_data.push(views.raw_visits)
performance_data.push(views.monthly_visits)
performance_data.push(views.raw_venue_hire)
performance_data.push(views.monthly_venue_hire)
performance_data.push(views.gift_aid_customers)
performance_data.push(views.monthly_retail_sales)
performance_data.push(views.raw_giftaid)
performance_data.push(views.raw_patron)
performance_data.push(views.raw_trusts)
performance_data.push(views.raw_directdebit)
performance_data.push(views.raw_treasure)
performance_data.push(views.raw_donors)
performance_data.push(views.raw_online)
performance_data.push(views.raw_general)

performance_data.push(views.raw_corporate)
performance_data.push(views.monthly_giftaid)
performance_data.push(views.monthly_directdebit)
performance_data.push(views.monthly_treasure)
performance_data.push(views.monthly_donors)
performance_data.push(views.monthly_trusts)
performance_data.push(views.monthly_online)
performance_data.push(views.monthly_general)

performance_data.push(views.monthly_donations)
performance_data.push(views.monthly_donations_other)
performance_data.push(views.monthly_donations_kiosk)
performance_data.push(views.monthly_donations_box)
performance_data.push(views.monthly_patron)
performance_data.push(views.monthly_corporate)
performance_data.push(views.transformation_kpis)
performance_data.push(views.engagement_kpis)
performance_data.push(views.collections_kpis)
performance_data.push(views.donations_kiosk)
performance_data.push(views.daily_donations_kiosk)
performance_data.push(views.donations)
performance_data.push(views.donations_other)
performance_data.push(views.monthly_welcomedesk)
performance_data.push(views.raw_welcomedesk)
performance_data.push(views.participation)
performance_data.push(views.events)
performance_data.push(views.kpi_events)
performance_data.push(views.monthly_events)


$scope.user_groups['DEVELOPMENT']=[]

$scope.user_groups['DEVELOPMENT'].views=[]
$scope.user_groups['DEVELOPMENT'].enter_data=[]
$scope.user_groups['DEVELOPMENT'].resources=[]

$scope.user_groups['DEVELOPMENT'].views.push(views.masterkpi)
$scope.user_groups['DEVELOPMENT'].views.push(views.timeline)
$scope.user_groups['DEVELOPMENT'].views.push(views.analyser)


$scope.user_groups['DEVELOPMENT'].enter_data=enter_data
$scope.user_groups['DEVELOPMENT'].performance=performance_data
$scope.user_groups['DEVELOPMENT'].permissions=default_permissions


return module;
};