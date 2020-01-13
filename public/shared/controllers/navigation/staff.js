
module.exports = function ($scope,views) {

 
  $scope.user_groups['STAFF']=[]

  var signage=[]
signage.push(views.posters_list)
signage.push(views.add_posters)



var resources=[]

resources.push(views.rooms)
resources.push(views.equipment)
resources.push(views.equipment_bookings)
//resources.push(room_bookings)
//resources.push(room_bookings_list)
resources.push(views.bookings_report)

resources.push(views.room_hire)
resources.push(views.equipment_booking_timeline)

var enter_data=[]
enter_data.push(views.performance)
enter_data.push(views.record_exhibitions_pwyt)
enter_data.push(views.record_events)
enter_data.push(views.record_kpi_events)
enter_data.push(views.record_venue_hire)
enter_data.push(views.record_operations)
enter_data.push(views.record_teg)
var resources=[]


var performance_data=[]


performance_data.push(views.teg)
performance_data.push(views.raw_visits)
performance_data.push(views.monthly_visits)
performance_data.push(views.raw_venue_hire)
performance_data.push(views.monthly_venue_hire)
performance_data.push(views.monthly_retail_sales)
//performance_data.push(monthly_turnstiles)
performance_data.push(views.monthly_donations)
performance_data.push(views.transformation_kpis)
performance_data.push(views.engagement_kpis)
performance_data.push(views.collections_kpis)

performance_data.push(views.raw_exhibitions_pwyt)
//performance_data.push(exhibitions_pwyt_monthly)
performance_data.push(views.monthly_teg)
performance_data.push(views.events)
performance_data.push(views.kpi_events)
performance_data.push(views.monthly_events)
performance_data.push(views.participation)

$scope.user_groups['STAFF'].views=[]
$scope.user_groups['STAFF'].enter_data=[]
$scope.user_groups['STAFF'].resources=[]
$scope.user_groups['STAFF'].permissions=default_permissions


$scope.user_groups['STAFF'].views.push(views.masterkpi)
$scope.user_groups['STAFF'].views.push(views.timeline) 
$scope.user_groups['STAFF'].views.push(views.analyser) 


$scope.user_groups['STAFF'].enter_data=enter_data
$scope.user_groups['STAFF'].performance=performance_data
$scope.user_groups['STAFF'].resources=resources


return module;
};