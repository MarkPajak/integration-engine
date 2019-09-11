	
exports.NavController = function($location,AuthService,$scope,$http) {


  $scope.path = $location.path();
  $scope.a = 10;
try{
  $scope.user="not logged in"
  $scope.$location = $location;
 function sortFunction(a, b) {
    if (a.value === b.value) {
        return 0;
    }
    else {
        return (a.value < b.value) ? -1 : 1;
    }
}

default_permissions = [{
						add_rooms:false,
						add_equipment:false,
						approve_room_bookings:false,
						approve_equipment_bookings:false
						
						}
						]







$scope.user_groups = []
$scope.user_groups['AV']=[]
$scope.user_groups['ADMIN']=[]
$scope.user_groups['RETAIL']=[]
$scope.user_groups['DIGITAL']=[]
$scope.user_groups['STAFF']=[]
$scope.user_groups['DEFAULT']=[]
$scope.user_groups['DEVELOPMENT']=[]	  
$scope.user_groups['VENUE HIRE']=[]	 
$scope.user_groups['LEARNING']=[]	
$scope.user_groups['EXHIBITIONS']=[]	
$scope.user_groups['ARTS AND EVENTS']=[]	
$scope.user_groups['OPERATIONS']=[]
$scope.user_groups['COMMERCIAL']=[]
	
var timeline 		  = {teamx:"_DONATIONS" ,link:"timeline",value:"Timeline"}
var masterkpi 		  = {teamx:"MASTER" ,link:"master",value:"Master KPIs"}
var dead 			  = {teamx:"_DONATIONS" ,link:"dead",value:"Downtime"}
var activity		  = {teamx:"_DONATIONS" ,link:"activity",value:"Machine Activity"}
var feedback		  = {teamx:"_DONATIONS" ,link:"feedback",value:"Kiosk feedback"}
var tech_support	  = {teamx:"_DONATIONS" ,link:"tech-support",value:"Tech-support"}
var shopify 		  = {teamx:"_DONATIONS" ,link:"shopify_app",value:"Shopify"}
var users 			  = {teamx:"_DONATIONS" ,link:"users",value:"ADMIN: Users"}
var timeline_settings = {teamx:"_DONATIONS" ,link:"timeline_settings",value:"Timeline settings"}
var doom 			  = {teamx:"_DONATIONS" ,link:"doom",value:"DOOM!"}
var analyser 		  = {teamx:"_DONATIONS" ,link:"analyser",value:"Performance analyser (BETA)"}

//resource booking

var rooms 			   = {teamx:"_DONATIONS" ,link:"rooms",value:"Add rooms"}
var equipment 		   = {teamx:"_DONATIONS" ,link:"equipment",value:"Add equipment"}
var equipment_bookings = {teamx:"_DONATIONS" ,link:"bookings/equipment",value:"Equipment booking"}
var room_bookings	   = {teamx:"_DONATIONS" ,link:"bookings/rooms",value:"Add a room booking"}
var room_bookings_list = {teamx:"_DONATIONS" ,link:"bookingslist/rooms",value:"Room bookings list"}
var bookings_report    = {teamx:"_DONATIONS" ,link:"bookings-report",value:"Bookings report"}


//signage
var posters_list 		= {teamx:"_DONATIONS" ,link:"posters",value:"Posters list"}
var add_posters 		= {teamx:"_DONATIONS" ,link:"add-poster",value:"Add poster"}


var room_hire = {teamx:"_DONATIONS" ,link:"room-hire",value:"Room booking timeline"}
var equipment_booking_timeline = {teamx:"_DONATIONS" ,link:"equipment-timeline",value:"Equipment booking timeline"}
var participation = {teamx:"PARTICIPATION" ,link:"participation-dashboard",value:"Participation dashboard"}


var performance = {teamx:"VISITS" ,link:"record-visitor-numbers",value:"Record visitor figures"}

var record_retail_sales = {teamx:"RETAIL" ,link:"record-retail-sales",value:"Record retail sales"}

var upload_retail_sales = {teamx:"RETAIL" ,link:"upload-retail-sales",value:"Upload retail sales"}

var raw_retail_sales = {teamx:"RETAIL" ,link:"raw-retail-sales",value:"Raw retail sales"}
var monthly_retail_sales = {teamx:"RETAIL" ,link:"monthly-retail-sales",value:"Monthly retail sales"}


var record_donations_other =		 {teamx:"DONATIONS" ,link:"record-donations-other",value:"Record exhibition ticket donations"}

var donations_other = 				 {teamx:"DONATIONS" ,link:"raw-donations-other",value:"Raw exhibition ticket donations"}

var monthly_donations_other = 		 {teamx:"DONATIONS" ,link:"monthly-donations-other",value:"Monthly exhibition ticket donations"}

var record_donations_kiosk =		 {teamx:"DONATIONS" ,link:"record-donations-kiosk",value:"Record kiosk donations"}
var upload_kiosk_donations =		 {teamx:"DONATIONS" ,link:"upload-kiosk-donations",value:"Upload kiosk donations"}

var donations_kiosk = 				 {teamx:"DONATIONS" ,link:"raw-donations-kiosk",value:"Raw kiosk donation data"}
var daily_donations_kiosk = 				 {teamx:"DONATIONS" ,link:"day-donations-kiosk",value:"Daily kiosk donation data"}

var monthly_donations_kiosk = 		 {teamx:"DONATIONS" ,link:"monthly-donations-kiosk",value:"Monthly kiosk donations"}




var record_site_permissions=		 {teamx:"ARTS AND EVENTS" ,link:"record-site-permissions",value:"Record  site permissions"}
var site_permissions = 				 {teamx:"ARTS AND EVENTS" ,link:"raw-site-permissions",value:"Raw site permissions data"}
var monthly_site_permissions = 		 {teamx:"ARTS AND EVENTS" ,link:"monthly-site-permissions",value:"Monthly site permissions"}



var record_donations =			 {teamx:"DONATIONS" ,link:"record-donations",value:"Record donation boxes"}
var donations = 				 {teamx:"DONATIONS" ,link:"raw-donations",value:"Raw donation boxes data"}
var monthly_donations_boxes = 	 {teamx:"DONATIONS" ,link:"monthly-donations-kiosks",value:"Monthly donation boxes and kiosks"}//still going
var monthly_donations = 		 {teamx:"DONATIONS" ,link:"monthly-donations",value:" Monthly total income"}

var record_patron =			 {teamx:"DONATIONS" ,link:"record-patron",value:"Record patron"}
var patron = 				 {teamx:"DONATIONS" ,link:"raw-patron",value:"Raw patron data"}
var monthly_patron = 		 {teamx:"DONATIONS" ,link:"monthly-patron",value:"Monthly patron"}

var record_corporate =			 {teamx:"DONATIONS" ,link:"record-corporate",value:"Record corporate"}
var corporate = 				 {teamx:"DONATIONS" ,link:"raw-corporate",value:"Raw corporate data"}
var monthly_corporate = 		 {teamx:"DONATIONS" ,link:"monthly-corporate",value:"Monthly corporate"}



var transformation_kpis = 		 {teamx:"TEAM" ,link:"transformation-kpis",value:"Transformation"}
var engagement_kpis = 		 {teamx:"TEAM" ,link:"engagement-kpis",value:"Engagement"}
var collections_kpis = 		 {teamx:"TEAM" ,link:"collections-kpis",value:"Collections"}

var record_operations = {teamx:"OPERATIONS" ,link:"record-operations",value:"Record operations"}
var operations = {teamx:"OPERATIONS" ,link:"raw-operations",value:"OPERATIONS: Raw operations data"}
var monthly_operations = {teamx:"OPERATIONS" ,link:"monthly-operations",value:"Monthly operations"}

var record_events = {teamx:"EVENTS" ,link:"record-events",value:"Record events"}
var record_kpi_events = {teamx:"TEAM" ,link:"record-kpi-events",value:"record income, enquiries, etc"}
var events = {teamx:"EVENTS" ,link:"raw-events",value:"EVENTS: Raw events data"}
var kpi_events = {teamx:"TEAM" ,link:"raw-kpi-events",value:"enquiries,income, sessions"}



var monthly_events = {teamx:"EVENTS" ,link:"monthly-events",value:"Monthly events"}

var record_teg = {teamx:"EXHIBITIONS" ,link:"record-teg",value:"Record TEG figures"}
var teg = {teamx:"EXHIBITIONS" ,link:"raw-teg",value:"Raw TEG figures"}
var monthly_teg = {teamx:"EXHIBITIONS" ,link:"monthly-teg",value:"Monthly TEG figures"}

 var record_exhibitions_pwyt = {teamx:"EXHIBITIONS" ,link:"record-exhibitions-pwyt",value:"Record income"}
// var exhibitions_pwyt_monthly = {link:"monthly-exhibitions-pwyt",value:"EXHIBITIONS: Monthly Pay What you think"}
 var raw_exhibitions_pwyt = {teamx:"EXHIBITIONS" ,link:"raw-exhibitions-pwyt",value:"income"}
  //var exhibitions_summary = {link:"exhibitions-summary",value:"EXHIBITIONS: summary"}
 
 
 var record_learning = {teamx:"LEARNING" ,link:"record-learning",value:"Record learning"}
var learning = {teamx:"LEARNING" ,link:"raw-learning",value:"Raw learning data"}
var monthly_learning = {teamx:"LEARNING" ,link:"monthly-learning",value:"Monthly learning"}

 
var raw_visits = {teamx:"VISITS" ,link:"raw-visits",value:"Raw visits data"}
var monthly_visits = {teamx:"VISITS" ,link:"monthly-visits",value:"Monthly visits"}

var record_venue_hire = {teamx:"VENUE HIRE" ,link:"record-venue-hire",value:"Record venue hire"}
var raw_venue_hire = {teamx:"VENUE HIRE" ,link:"raw-venue-hire",value:"Raw venue hire"}
var monthly_venue_hire = {teamx:"VENUE HIRE"  ,link:"monthly-venue-hire",value:"Monthly venue hire"}





var record_giftaid = {teamx:"DONATIONS" ,link:"record-giftaid",value:"Record gift aid"}
var raw_giftaid = {teamx:"DONATIONS" ,link:"raw-giftaid",value:"Raw gift aid"}
var monthly_giftaid = {teamx:"DONATIONS" ,link:"monthly-giftaid",value:"Monthly gift aid"}

//var raw_turnstiles = {link:"raw-turnstiles",value:"EXHIBITIONS: turnstiles raw data"}
//var monthly_turnstiles = {link:"monthly-turnstiles",value:"EXHIBITIONS: turnstiles Monthly"}

var record_welcomedesk = {teamx:"DONATIONS" ,link:"record-welcomedesk",value:"Record Welcome desk"}
var raw_welcomedesk = {teamx:"DONATIONS" ,link:"raw-welcomedesk",value:"Raw Welcome desk"}
var monthly_welcomedesk = {teamx:"DONATIONS" ,link:"monthly-welcomedesk",value:"Monthly Welcome desk"}



var signage=[]
signage.push(posters_list)
signage.push(add_posters)


var resources=[]

resources.push(rooms)
resources.push(equipment)
resources.push(equipment_bookings)
//resources.push(room_bookings)
//resources.push(room_bookings_list)
resources.push(bookings_report)

resources.push(room_hire)
resources.push(equipment_booking_timeline)



var performance_data=[]
performance_data.push(room_hire)

$scope.user_groups['COMMERCIAL'].views=[]
$scope.user_groups['COMMERCIAL'].enter_data=[]
$scope.user_groups['COMMERCIAL'].resources=[]
$scope.user_groups['COMMERCIAL'].permissions=default_permissions

$scope.user_groups['COMMERCIAL'].resources=resources
$scope.user_groups['COMMERCIAL'].performance=performance_data




var enter_data=[]
enter_data.push(performance)
//enter_data.push(record_retail_sales)
enter_data.push(record_corporate)
enter_data.push(record_patron)
enter_data.push(record_donations)
enter_data.push(record_donations_other)


enter_data.push(upload_kiosk_donations)
//enter_data.push(record_donations_kiosk)
enter_data.push(record_giftaid)
enter_data.push(record_welcomedesk)
enter_data.push(record_events)
enter_data.push(record_kpi_events)
enter_data.push(record_venue_hire)

var performance_data=[]
performance_data.push(raw_visits)
performance_data.push(monthly_visits)
performance_data.push(raw_venue_hire)
performance_data.push(monthly_venue_hire)


//performance_data.push(raw_retail_sales)
performance_data.push(monthly_retail_sales)

performance_data.push(raw_giftaid)
performance_data.push(monthly_giftaid)
performance_data.push(monthly_donations)
performance_data.push(monthly_donations_other)
performance_data.push(monthly_donations_kiosk)

performance_data.push(donations_other)
performance_data.push(monthly_patron)
performance_data.push(monthly_corporate)
performance_data.push(transformation_kpis)
performance_data.push(engagement_kpis)
performance_data.push(collections_kpis)

performance_data.push(donations_kiosk)
performance_data.push(daily_donations_kiosk)


performance_data.push(donations)

performance_data.push(donations_other)
performance_data.push(monthly_welcomedesk)
performance_data.push(raw_welcomedesk)

performance_data.push(participation)
performance_data.push(events)
performance_data.push(kpi_events)
performance_data.push(monthly_events)

$scope.user_groups['DEVELOPMENT'].permissions=default_permissions
$scope.user_groups['DEVELOPMENT'].views=[]
$scope.user_groups['DEVELOPMENT'].enter_data=[]
$scope.user_groups['DEVELOPMENT'].resources=[]

$scope.user_groups['DEVELOPMENT'].views.push(masterkpi)
$scope.user_groups['DEVELOPMENT'].views.push(timeline)
$scope.user_groups['DEVELOPMENT'].views.push(analyser)



$scope.user_groups['DEVELOPMENT'].enter_data=enter_data
$scope.user_groups['DEVELOPMENT'].performance=performance_data





var enter_data=[]

enter_data.push(record_site_permissions)


var performance_data=[]
performance_data.push(raw_visits)
performance_data.push(monthly_visits)


performance_data.push(monthly_site_permissions)
performance_data.push(site_permissions)

performance_data.push(events)


$scope.user_groups['ARTS AND EVENTS'].permissions=default_permissions
$scope.user_groups['ARTS AND EVENTS'].views=[]
$scope.user_groups['ARTS AND EVENTS'].enter_data=[]
$scope.user_groups['ARTS AND EVENTS'].resources=[]

$scope.user_groups['ARTS AND EVENTS'].views.push(masterkpi)
$scope.user_groups['ARTS AND EVENTS'].views.push(timeline)
$scope.user_groups['ARTS AND EVENTS'].views.push(analyser)



$scope.user_groups['ARTS AND EVENTS'].enter_data=enter_data
$scope.user_groups['ARTS AND EVENTS'].performance=performance_data
 
var enter_data=[]
enter_data.push(performance)
enter_data.push(record_retail_sales)
enter_data.push(upload_retail_sales)


enter_data.push(record_donations)
enter_data.push(record_site_permissions)
enter_data.push(record_donations_other)

//enter_data.push(record_donations_kiosk)
enter_data.push(upload_kiosk_donations)
enter_data.push(record_corporate)
enter_data.push(record_patron)
enter_data.push(record_giftaid)
enter_data.push(record_welcomedesk)
enter_data.push(record_learning)
enter_data.push(record_exhibitions_pwyt)
enter_data.push(record_teg)
enter_data.push(record_events)
enter_data.push(record_kpi_events)
enter_data.push(record_venue_hire)

enter_data.push(record_operations)


enter_data=enter_data.sort()

var performance_data=[]
performance_data.push(raw_visits)
performance_data.push(monthly_visits)
performance_data.push(raw_venue_hire)
performance_data.push(monthly_venue_hire)
performance_data.push(raw_retail_sales)
performance_data.push(monthly_retail_sales)
performance_data.push(monthly_site_permissions)
performance_data.push(site_permissions)
performance_data.push(raw_giftaid)
performance_data.push(monthly_giftaid)
performance_data.push(monthly_donations)
performance_data.push(monthly_patron)
performance_data.push(monthly_corporate)
performance_data.push(monthly_donations_other)
performance_data.push(monthly_donations_kiosk)
performance_data.push(donations)
performance_data.push(donations_kiosk)
performance_data.push(daily_donations_kiosk)
performance_data.push(donations_other)


performance_data.push(corporate)
performance_data.push(patron)
performance_data.push(raw_welcomedesk)
performance_data.push(monthly_welcomedesk)
performance_data.push(participation)
performance_data.push(learning)
performance_data.push(monthly_learning)
performance_data.push(raw_exhibitions_pwyt)
performance_data.push(teg)
performance_data.push(monthly_teg)
performance_data.push(events)
performance_data.push(kpi_events)
performance_data.push(monthly_events)
performance_data.push(operations)
performance_data.push(monthly_operations)
performance_data.push(transformation_kpis)
performance_data.push(engagement_kpis)
performance_data.push(collections_kpis)

performance_data=performance_data.sort()


$scope.user_groups['ADMIN'].views=[]
$scope.user_groups['ADMIN'].enter_data=[]
$scope.user_groups['ADMIN'].resources=[]
$scope.user_groups['ADMIN'].signage=[]
$scope.user_groups['ADMIN'].permissions=default_permissions


$scope.user_groups['ADMIN'].views.push(masterkpi)
$scope.user_groups['ADMIN'].views.push(room_hire)
$scope.user_groups['ADMIN'].views.push(timeline)
$scope.user_groups['ADMIN'].views.push(analyser)
$scope.user_groups['ADMIN'].views.push(dead)
$scope.user_groups['ADMIN'].views.push(activity)
$scope.user_groups['ADMIN'].views.push(feedback)
$scope.user_groups['ADMIN'].views.push(tech_support)
$scope.user_groups['ADMIN'].views.push(shopify)
$scope.user_groups['ADMIN'].views.push(users)
$scope.user_groups['ADMIN'].views.push(timeline_settings)


$scope.user_groups['ADMIN'].enter_data=enter_data
$scope.user_groups['ADMIN'].performance=performance_data
$scope.user_groups['ADMIN'].resources=resources
$scope.user_groups['ADMIN'].signage=signage

var enter_data=[]

enter_data.push(record_exhibitions_pwyt)
enter_data.push(record_teg)
enter_data.push(record_events)
enter_data.push(record_kpi_events)
enter_data.push(record_venue_hire)
var performance_data=[]
performance_data.push(raw_visits)
performance_data.push(monthly_visits)
performance_data.push(raw_venue_hire)
performance_data.push(monthly_venue_hire)
performance_data.push(monthly_retail_sales)
//performance_data.push(monthly_turnstiles)
performance_data.push(monthly_donations)
performance_data.push(transformation_kpis)
performance_data.push(engagement_kpis)
performance_data.push(collections_kpis)

performance_data.push(monthly_learning)
//performance_data.push(exhibitions_pwyt_monthly)
//performance_data.push(exhibitions_summary)
performance_data.push(raw_exhibitions_pwyt)
performance_data.push(teg)
performance_data.push(monthly_teg)
performance_data.push(events)
performance_data.push(kpi_events)
performance_data.push(monthly_events)
performance_data.push(participation)
$scope.user_groups['EXHIBITIONS'].views=[]
$scope.user_groups['EXHIBITIONS'].enter_data=enter_data
$scope.user_groups['EXHIBITIONS'].resources=[]
$scope.user_groups['EXHIBITIONS'].permissions=default_permissions


$scope.user_groups['EXHIBITIONS'].views.push(masterkpi)
$scope.user_groups['EXHIBITIONS'].views.push(timeline)
$scope.user_groups['EXHIBITIONS'].views.push(analyser)
$scope.user_groups['EXHIBITIONS'].performance=performance_data
$scope.user_groups['EXHIBITIONS'].views.push(room_hire)
$scope.user_groups['EXHIBITIONS'].resources=resources


var enter_data=[]
enter_data.push(record_learning)
enter_data.push(record_events)
enter_data.push(record_kpi_events)
enter_data.push(record_venue_hire)
var performance_data=[]
performance_data.push(raw_visits)


performance_data.push(learning)
performance_data.push(monthly_learning)
performance_data.push(events)
performance_data.push(kpi_events)

performance_data.push(monthly_events)

performance_data.push(participation)

$scope.user_groups['LEARNING'].views=[]
$scope.user_groups['LEARNING'].enter_data=[]
$scope.user_groups['LEARNING'].resources=[]
$scope.user_groups['LEARNING'].permissions=default_permissions

$scope.user_groups['LEARNING'].views.push(masterkpi)
$scope.user_groups['LEARNING'].views.push(timeline)
$scope.user_groups['LEARNING'].views.push(analyser)

$scope.user_groups['LEARNING'].enter_data=enter_data
$scope.user_groups['LEARNING'].performance=performance_data
$scope.user_groups['LEARNING'].resources=resources
$scope.user_groups['LEARNING'].views.push(room_hire)

var enter_data=[]
enter_data.push(performance)
enter_data.push(record_retail_sales)

enter_data.push(upload_retail_sales)
enter_data.push(record_donations)
enter_data.push(record_giftaid)
enter_data.push(record_welcomedesk)
enter_data.push(record_learning)
enter_data.push(record_exhibitions_pwyt)
enter_data.push(record_teg)
enter_data.push(record_events)
enter_data.push(record_kpi_events)
enter_data.push(record_venue_hire)
enter_data.push(record_operations)


enter_data=enter_data.sort()

var performance_data=[]
performance_data.push(raw_visits)
performance_data.push(monthly_visits)
performance_data.push(raw_venue_hire)
performance_data.push(monthly_venue_hire)

performance_data.push(teg)
performance_data.push(monthly_teg)
performance_data.push(events)
performance_data.push(kpi_events)
performance_data.push(participation)
performance_data=performance_data.sort()


$scope.user_groups['AV'].views=[]
$scope.user_groups['AV'].enter_data=[]
$scope.user_groups['AV'].resources=[]

$scope.user_groups['AV'].views.push(room_hire)
$scope.user_groups['AV'].views.push(timeline)
$scope.user_groups['AV'].views.push(analyser)
$scope.user_groups['AV'].views.push(dead)
$scope.user_groups['AV'].views.push(activity)
$scope.user_groups['AV'].views.push(feedback)
$scope.user_groups['AV'].views.push(tech_support)


$scope.user_groups['AV'].enter_data=enter_data
$scope.user_groups['AV'].performance=performance_data
$scope.user_groups['AV'].resources=resources
$scope.user_groups['AV'].permissions= [	]


var enter_data=[]
enter_data.push(performance)
enter_data.push(record_retail_sales)
enter_data.push(upload_retail_sales)
enter_data.push(record_donations)
enter_data.push(record_giftaid)
enter_data.push(record_events)
enter_data.push(record_kpi_events)
enter_data.push(record_venue_hire)

var performance_data=[]
performance_data.push(raw_visits)
performance_data.push(monthly_visits)
performance_data.push(raw_venue_hire)
performance_data.push(monthly_venue_hire)
performance_data.push(raw_retail_sales)
performance_data.push(monthly_retail_sales)
//performance_data.push(raw_turnstiles)
//performance_data.push(monthly_turnstiles)
performance_data.push(raw_giftaid)
performance_data.push(monthly_giftaid)
performance_data.push(monthly_donations)
performance_data.push(transformation_kpis)
performance_data.push(engagement_kpis)
performance_data.push(collections_kpis)

performance_data.push(donations)
performance_data.push(monthly_welcomedesk)
performance_data.push(events)
performance_data.push(kpi_events)
performance_data.push(monthly_events)
performance_data.push(participation)




$scope.user_groups['DIGITAL'].views=[]
$scope.user_groups['DIGITAL'].enter_data=[]
$scope.user_groups['DIGITAL'].resources=[]
$scope.user_groups['DIGITAL'].permissions=default_permissions

$scope.user_groups['DIGITAL'].views.push(masterkpi)
$scope.user_groups['DIGITAL'].views.push(timeline)
$scope.user_groups['DIGITAL'].views.push(analyser)
$scope.user_groups['DIGITAL'].views.push(dead)
$scope.user_groups['DIGITAL'].views.push(activity)
$scope.user_groups['DIGITAL'].views.push(tech_support)
$scope.user_groups['DIGITAL'].views.push(shopify)

$scope.user_groups['DIGITAL'].enter_data=enter_data
$scope.user_groups['DIGITAL'].performance=performance_data
$scope.user_groups['DIGITAL'].resources=[]
$scope.user_groups['DIGITAL'].resources=resources

var performance_data=[]
 var enter_data=[]

performance_data.push(raw_visits)
performance_data.push(monthly_visits)

performance_data.push(monthly_retail_sales)


performance_data.push(monthly_donations)
performance_data.push(transformation_kpis)
performance_data.push(engagement_kpis)
performance_data.push(collections_kpis)


performance_data.push(monthly_events)
performance_data.push(participation)


$scope.user_groups['DEFAULT'].views=[]
$scope.user_groups['DEFAULT'].enter_data=[]
$scope.user_groups['DEFAULT'].resources=[]
$scope.user_groups['DEFAULT'].permissions=default_permissions

$scope.user_groups['DEFAULT'].views.push(masterkpi)
$scope.user_groups['DEFAULT'].views.push(timeline) 
$scope.user_groups['DEFAULT'].views.push(analyser)
$scope.user_groups['DEFAULT'].views.push(monthly_visits)
//$scope.user_groups['DEFAULT'].views.push(monthly_turnstiles) 
$scope.user_groups['DEFAULT'].performance=performance_data
$scope.user_groups['DEFAULT'].enter_data=enter_data

var enter_data=[]
enter_data.push(performance)
enter_data.push(record_exhibitions_pwyt)
enter_data.push(record_events)
enter_data.push(record_kpi_events)
enter_data.push(record_venue_hire)
enter_data.push(record_operations)
enter_data.push(record_teg)
var resources=[]

performance_data.push(teg)

var performance_data=[]
performance_data.push(raw_visits)
performance_data.push(monthly_visits)
performance_data.push(raw_venue_hire)
performance_data.push(monthly_venue_hire)
performance_data.push(monthly_retail_sales)
//performance_data.push(monthly_turnstiles)
performance_data.push(monthly_donations)
performance_data.push(transformation_kpis)
performance_data.push(engagement_kpis)
performance_data.push(collections_kpis)

performance_data.push(raw_exhibitions_pwyt)
//performance_data.push(exhibitions_pwyt_monthly)
performance_data.push(monthly_teg)
performance_data.push(events)
performance_data.push(kpi_events)
performance_data.push(monthly_events)
performance_data.push(participation)

$scope.user_groups['STAFF'].views=[]
$scope.user_groups['STAFF'].enter_data=[]
$scope.user_groups['STAFF'].resources=[]
$scope.user_groups['STAFF'].permissions=default_permissions


$scope.user_groups['STAFF'].views.push(masterkpi)
$scope.user_groups['STAFF'].views.push(timeline) 
$scope.user_groups['STAFF'].views.push(analyser) 
resources.push(equipment_booking_timeline)

$scope.user_groups['STAFF'].enter_data=enter_data
$scope.user_groups['STAFF'].performance=performance_data
$scope.user_groups['STAFF'].resources=resources



var performance_data=[]
performance_data.push(raw_visits)
performance_data.push(monthly_visits)
performance_data.push(raw_venue_hire)
performance_data.push(monthly_venue_hire)
performance_data.push(monthly_retail_sales)
//performance_data.push(monthly_turnstiles)
performance_data.push(monthly_donations)
performance_data.push(transformation_kpis)
performance_data.push(engagement_kpis)
performance_data.push(collections_kpis)

performance_data.push(raw_exhibitions_pwyt)
//performance_data.push(exhibitions_pwyt_monthly)
performance_data.push(monthly_teg)
performance_data.push(events)
performance_data.push(kpi_events)
performance_data.push(monthly_events)
performance_data.push(operations)
performance_data.push(monthly_operations)
performance_data.push(monthly_welcomedesk)
performance_data.push(participation)

enter_data.push(record_teg)
enter_data.push(record_operations)
enter_data.push(record_exhibitions_pwyt)

$scope.user_groups['VENUE HIRE'].views=[]
$scope.user_groups['VENUE HIRE'].enter_data=[]
$scope.user_groups['VENUE HIRE'].resources=[]
$scope.user_groups['VENUE HIRE'].permissions=default_permissions

$scope.user_groups['VENUE HIRE'].views.push(masterkpi)
$scope.user_groups['VENUE HIRE'].views.push(timeline) 
$scope.user_groups['VENUE HIRE'].views.push(room_hire) 
$scope.user_groups['VENUE HIRE'].views.push(analyser) 

$scope.user_groups['VENUE HIRE'].enter_data=enter_data
$scope.user_groups['VENUE HIRE'].performance=performance_data

$scope.user_groups['VENUE HIRE'].resources=[]
$scope.user_groups['VENUE HIRE'].resources=resources



var performance_data=[]
performance_data.push(raw_visits)
performance_data.push(monthly_visits)
performance_data.push(raw_venue_hire)
performance_data.push(monthly_venue_hire)
performance_data.push(monthly_retail_sales)
//performance_data.push(monthly_turnstiles)
performance_data.push(monthly_donations)
performance_data.push(transformation_kpis)
performance_data.push(engagement_kpis)
performance_data.push(collections_kpis)

performance_data.push(raw_exhibitions_pwyt)
//performance_data.push(exhibitions_pwyt_monthly)
performance_data.push(monthly_teg)
performance_data.push(events)
performance_data.push(kpi_events)
performance_data.push(monthly_events)
performance_data.push(operations)
performance_data.push(monthly_operations)
performance_data.push(monthly_welcomedesk)
performance_data.push(participation)

enter_data.push(record_teg)
enter_data.push(record_operations)
enter_data.push(record_exhibitions_pwyt)

$scope.user_groups['OPERATIONS'].views=[]
$scope.user_groups['OPERATIONS'].enter_data=[]
$scope.user_groups['OPERATIONS'].resources=[]
$scope.user_groups['OPERATIONS'].permissions=default_permissions

$scope.user_groups['OPERATIONS'].views.push(masterkpi)
$scope.user_groups['OPERATIONS'].views.push(timeline) 
$scope.user_groups['OPERATIONS'].views.push(room_hire) 
$scope.user_groups['OPERATIONS'].views.push(analyser) 

$scope.user_groups['OPERATIONS'].enter_data=enter_data
$scope.user_groups['OPERATIONS'].performance=performance_data

$scope.user_groups['OPERATIONS'].resources=[]
$scope.user_groups['OPERATIONS'].resources=resources







var enter_data=[]
enter_data.push(record_retail_sales)
enter_data.push(upload_retail_sales)
enter_data.push(record_events)
enter_data.push(record_kpi_events)

var performance_data=[]
performance_data.push(monthly_visits)
performance_data.push(raw_venue_hire)
performance_data.push(monthly_venue_hire)
performance_data.push(raw_retail_sales)
performance_data.push(monthly_retail_sales)
performance_data.push(participation)


$scope.user_groups['RETAIL'].views=[]
$scope.user_groups['RETAIL'].enter_data=[]
$scope.user_groups['RETAIL'].resources=[]
$scope.user_groups['RETAIL'].performance=[]
$scope.user_groups['RETAIL'].permissions=default_permissions

$scope.user_groups['RETAIL'].views.push(masterkpi)
$scope.user_groups['RETAIL'].views.push(timeline)

$scope.user_groups['RETAIL'].enter_data=enter_data
$scope.user_groups['RETAIL'].performance=performance_data
	  
	  
  AuthService.isLoggedIn().then(function(user){
	 
	  if(user.data.group){
		 // console.log("user",user.data)
		
		
		user.data.permissions= $scope.user_groups[user.data.group].permissions  
		user.data.views= $scope.user_groups[user.data.group].views
		user.data.views=user.data.views.sort(sortFunction);
		
		user.data.resources= $scope.user_groups[user.data.group].resources
	    user.data.resources= user.data.resources.sort(sortFunction);
	   
	  	if( $scope.user_groups[user.data.group].signage){
		
			user.data.signage= $scope.user_groups[user.data.group].signage
			user.data.signage= user.data.signage.sort(sortFunction);
		}


	  
		
	   user.data.performance= $scope.user_groups[user.data.group].performance
	   user.data.performance= user.data.performance.sort(sortFunction);
	   
	   user.data.enter_data= $scope.user_groups[user.data.group].enter_data	   
	   user.data.enter_data=user.data.enter_data.sort(sortFunction);
	  
	  if(user.data.lastName.toLowerCase()=="pace"){
		  
		 user.data.views.push(doom)
	  }
	  
	  }
	  else{
		user.data.views= $scope.user_groups['DEFAULT'].views  
		  
	  }
	//  console.log(user)
	  $scope.user=(user.data)
  
  })
 
  
  }catch(err)
  
  {
  if(err) console.log(err)
  
  }
  
       
    
};
