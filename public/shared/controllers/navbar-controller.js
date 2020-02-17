//NB this errors silently and causes issues with nav bar so users dont think they are logged in

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



var views = {}


$scope.user_groups = []
$scope.user_groups['AV']=[]
$scope.user_groups['RETAIL']=[]
$scope.user_groups['DIGITAL']=[]

$scope.user_groups['DEFAULT']=[]	  
$scope.user_groups['VENUE HIRE']=[]	 
$scope.user_groups['LEARNING']=[]	
$scope.user_groups['EXHIBITIONS']=[]	
$scope.user_groups['ARTS AND EVENTS']=[]	
$scope.user_groups['OPERATIONS']=[]
$scope.user_groups['COMMERCIAL']=[]
	
var timeline 		  = {teamx:"_DONATIONS" ,link:"timeline",value:"Timeline"}
views.timeline=timeline

var masterkpi 		  = {teamx:"MASTER" ,link:"master",value:"Master KPIs"}
views.masterkpi=masterkpi


var dead 			  = {teamx:"_DONATIONS" ,link:"dead",value:"Downtime"}
views.dead=dead


var activity		  = {teamx:"_DONATIONS" ,link:"activity",value:"Machine Activity"}
views.activity=activity



var feedback		  = {teamx:"_DONATIONS" ,link:"raw-feedback",value:"Kiosk feedback"}
views.feedback=feedback
var nominate		  = {teamx:"_DONATIONS" ,link:"raw-nominate",value:"Youmake Bristol"}
views.nominate=nominate



var tech_support	  = {teamx:"_DONATIONS" ,link:"tech-support",value:"Tech-support"}
views.tech_support=tech_support


var shopify 		  = {teamx:"_DONATIONS" ,link:"shopify_app",value:"Shopify"}
views.shopify=shopify



var users 			  = {teamx:"_DONATIONS" ,link:"users",value:"ADMIN: Users"}
views.users=users







var timeline_settings = {teamx:"_DONATIONS" ,link:"timeline_settings",value:"Timeline settings"}
views.timeline_settings=timeline_settings




var doom 			  = {teamx:"_DONATIONS" ,link:"doom",value:"DOOM!"}
views.doom=doom




var analyser 		  = {teamx:"_DONATIONS" ,link:"analyser",value:"Performance analyser (BETA)"}
views.analyser=analyser
//resource booking

var rooms 			   = {teamx:"_DONATIONS" ,link:"rooms",value:"Add rooms"}
views.rooms=rooms


var equipment 		   = {teamx:"_DONATIONS" ,link:"equipment",value:"Add equipment"}
views.equipment=equipment



var equipment_bookings = {teamx:"_DONATIONS" ,link:"bookings/equipment",value:"Equipment booking"}
views.equipment_bookings=equipment_bookings



var room_bookings	   = {teamx:"_DONATIONS" ,link:"bookings/rooms",value:"Add a room booking"}
views.room_bookings=room_bookings


var room_bookings_list = {teamx:"_DONATIONS" ,link:"bookingslist/rooms",value:"Room bookings list"}
views.room_bookings_list=room_bookings_list



var bookings_report    = {teamx:"_DONATIONS" ,link:"bookings-report",value:"Bookings report"}
views.bookings_report=bookings_report





//signage
var posters_list 		= {teamx:"_DONATIONS" ,link:"posters",value:"Posters list"}
views.posters_list=posters_list



var add_posters 		= {teamx:"_DONATIONS" ,link:"add-poster",value:"Add poster"}
views.add_posters=add_posters




var room_hire = {teamx:"_DONATIONS" ,link:"room-hire",value:"Room booking timeline"}
views.room_hire=room_hire



var equipment_booking_timeline = {teamx:"_DONATIONS" ,link:"equipment-timeline",value:"Equipment booking timeline"}
views.equipment_booking_timeline=equipment_booking_timeline


var participation = {teamx:"PARTICIPATION" ,link:"participation-dashboard",value:"Participation dashboard"}
views.participation=participation

var performance = {teamx:"VISITS" ,link:"record-visitor-numbers",value:"Record visitor figures"}
views.performance=performance



var record_retail_sales = {teamx:"RETAIL" ,link:"record-retail-sales",value:"Record retail sales"}
views.record_retail_sales=record_retail_sales




var upload_retail_sales = {teamx:"RETAIL" ,link:"upload-retail-sales",value:"Upload retail sales"}
views.upload_retail_sales=upload_retail_sales





var raw_retail_sales = {teamx:"RETAIL" ,link:"raw-retail-sales",value:"Raw retail sales"}
views.raw_retail_sales=raw_retail_sales





var monthly_retail_sales = {teamx:"RETAIL" ,link:"monthly-retail-sales",value:"Monthly retail sales"}
views.monthly_retail_sales=monthly_retail_sales



var record_donations_other =		 {teamx:"DONATIONS" ,link:"record-donations-other",value:"Record exhibition ticket donations"}
views.record_donations_other=record_donations_other





var donations_other = 				 {teamx:"DONATIONS" ,link:"raw-donations-other",value:"Raw exhibition ticket donations"}
views.donations_other=donations_other





var gift_aid_customers = 				 {teamx:"DONATIONS" ,link:"gift-aid-customers",value:"Gift Aid Customers"}
views.gift_aid_customers=gift_aid_customers


var monthly_donations_other = 		 {teamx:"DONATIONS" ,link:"monthly-donations-other",value:"Monthly exhibition ticket donations"}
views.monthly_donations_other=monthly_donations_other





var record_donations_kiosk =		 {teamx:"DONATIONS" ,link:"record-donations-kiosk",value:"Record kiosk donations"}
views.record_donations_kiosk=monthly_donations_other




var upload_kiosk_donations =		 {teamx:"DONATIONS" ,link:"upload-kiosk-donations",value:"Upload kiosk donations"}
views.upload_kiosk_donations=upload_kiosk_donations





var donations_kiosk = 				 {teamx:"DONATIONS" ,link:"raw-donations-kiosk",value:"Raw kiosk donation data"}
views.donations_kiosk=donations_kiosk




var daily_donations_kiosk = 				 {teamx:"DONATIONS" ,link:"day-donations-kiosk",value:"Daily kiosk donation data"}
views.daily_donations_kiosk=daily_donations_kiosk




var monthly_donations_kiosk = 		 {teamx:"DONATIONS" ,link:"monthly-donations-kiosk",value:"Monthly kiosk donations"}
views.monthly_donations_kiosk=monthly_donations_kiosk


var monthly_donations_box = 		 {teamx:"DONATIONS" ,link:"monthly-donations-box",value:"Monthly donations boxes"}
views.monthly_donations_box=monthly_donations_box


var record_site_permissions=		 {teamx:"ARTS AND EVENTS" ,link:"record-site-permissions",value:"Record  site permissions"}
views.record_site_permissions=record_site_permissions




var site_permissions = 				 {teamx:"ARTS AND EVENTS" ,link:"raw-site-permissions",value:"Raw site permissions data"}
views.site_permissions=site_permissions



var monthly_site_permissions = 		 {teamx:"ARTS AND EVENTS" ,link:"monthly-site-permissions",value:"Monthly site permissions"}
views.monthly_site_permissions=monthly_site_permissions


var record_donations =			 {teamx:"DONATIONS" ,link:"record-donations",value:"Record donation boxes"}
views.record_donations=record_donations






var donations = 				 {teamx:"DONATIONS" ,link:"raw-donations",value:"Raw donation boxes data"}
views.donations=donations






var monthly_donations_boxes = 	 {teamx:"DONATIONS" ,link:"monthly-donations-kiosks",value:"Monthly donation boxes and kiosks"}//still going
views.monthly_donations_boxes=monthly_donations_boxes







var monthly_donations = 		 {teamx:"DONATIONS" ,link:"monthly-donations",value:" Monthly total income"}
views.monthly_donations=monthly_donations






var record_patron =			 {teamx:"DONATIONS" ,link:"record-patron",value:"Record patron"}
views.record_patron=record_patron





var raw_patron = 				 {teamx:"DONATIONS" ,link:"raw-patron",value:"Raw patron data"}
views.raw_patron=raw_patron




var monthly_patron = 		 {teamx:"DONATIONS" ,link:"monthly-patron",value:"Monthly patron"}
views.monthly_patron=monthly_patron




var record_corporate =			 {teamx:"DONATIONS" ,link:"record-corporate",value:"Record corporate"}
views.record_corporate=record_corporate


var raw_corporate = 				 {teamx:"DONATIONS" ,link:"raw-corporate",value:"Raw corporate data"}
views.raw_corporate=raw_corporate


var monthly_corporate = 		 {teamx:"DONATIONS" ,link:"monthly-corporate",value:"Monthly corporate"}
views.monthly_corporate=monthly_corporate


var transformation_kpis = 		 {teamx:"TEAM" ,link:"transformation-kpis",value:"Transformation"}
views.transformation_kpis=transformation_kpis


var engagement_kpis = 		 {teamx:"TEAM" ,link:"engagement-kpis",value:"Engagement"}
views.engagement_kpis=engagement_kpis


var collections_kpis = 		 {teamx:"TEAM" ,link:"collections-kpis",value:"Collections"}
views.collections_kpis=collections_kpis




var record_operations = {teamx:"OPERATIONS" ,link:"record-operations",value:"Record operations"}
views.record_operations=record_operations



var operations = {teamx:"OPERATIONS" ,link:"raw-operations",value:"OPERATIONS: Raw operations data"}
views.operations=operations



var monthly_operations = {teamx:"OPERATIONS" ,link:"monthly-operations",value:"Monthly operations"}
views.monthly_operations=monthly_operations




var record_events = {teamx:"EVENTS" ,link:"record-events",value:"Record events"}
views.record_events=record_events


var record_kpi_events = {teamx:"TEAM" ,link:"record-kpi-events",value:"record income, enquiries, etc"}
views.record_kpi_events=record_kpi_events



var events = {teamx:"EVENTS" ,link:"raw-events",value:"EVENTS: Raw events data"}
views.events=events

var kpi_events = {teamx:"TEAM" ,link:"raw-kpi-events",value:"enquiries,income, sessions"}
views.kpi_events=kpi_events


var monthly_events = {teamx:"EVENTS" ,link:"monthly-events",value:"Monthly events"}
views.monthly_events=monthly_events


var record_teg = {teamx:"EXHIBITIONS" ,link:"record-teg",value:"Record TEG figures"}
views.record_teg=record_teg


var teg = {teamx:"EXHIBITIONS" ,link:"raw-teg",value:"Raw TEG figures"}
views.teg=teg


var monthly_teg = {teamx:"EXHIBITIONS" ,link:"monthly-teg",value:"Monthly TEG figures"}
views.monthly_teg=monthly_teg


 var record_exhibitions_pwyt = {teamx:"EXHIBITIONS" ,link:"record-exhibitions-pwyt",value:"Record income"}
 views.record_exhibitions_pwyt=record_exhibitions_pwyt


 var raw_exhibitions_pwyt = {teamx:"EXHIBITIONS" ,link:"raw-exhibitions-pwyt",value:"income"}
 views.raw_exhibitions_pwyt=raw_exhibitions_pwyt
 
 var record_learning = {teamx:"LEARNING" ,link:"record-learning",value:"Record learning"}
 views.record_learning=record_learning



var learning = {teamx:"LEARNING" ,link:"raw-learning",value:"Raw learning data"}
views.learning=learning


var monthly_learning = {teamx:"LEARNING" ,link:"monthly-learning",value:"Monthly learning"}
views.monthly_learning=monthly_learning
 
var raw_visits = {teamx:"VISITS" ,link:"raw-visits",value:"Raw visits data"}
views.raw_visits=raw_visits


var monthly_visits = {teamx:"VISITS" ,link:"monthly-visits",value:"Monthly visits"}
views.monthly_visits=monthly_visits




var record_venue_hire = {teamx:"VENUE HIRE" ,link:"record-venue-hire",value:"Record venue hire"}
views.record_venue_hire=record_venue_hire


var raw_venue_hire = {teamx:"VENUE HIRE" ,link:"raw-venue-hire",value:"Raw venue hire"}
views.raw_venue_hire=raw_venue_hire


var monthly_venue_hire = {teamx:"VENUE HIRE"  ,link:"monthly-venue-hire",value:"Monthly venue hire"}
views.monthly_venue_hire=monthly_venue_hire




var record_giftaid = {teamx:"DONATIONS" ,link:"record-giftaid",value:"Record gift aid"}
views.record_giftaid=record_giftaid


var raw_giftaid = {teamx:"DONATIONS" ,link:"raw-giftaid",value:"Raw gift aid"}
views.raw_giftaid=raw_giftaid


var monthly_giftaid = {teamx:"DONATIONS" ,link:"monthly-giftaid",value:"Monthly gift aid"}
views.monthly_giftaid=monthly_giftaid

//DIRECT DEBIT

var raw_directdebit = {teamx:"DONATIONS" ,link:"raw-directdebit",value:"Raw direct debit"}
views.raw_giftaid=raw_directdebit


var monthly_directdebit = {teamx:"DONATIONS" ,link:"monthly-directdebit",value:"Monthly direct debit"}
views.monthly_directdebit=monthly_directdebit


var record_directdebit = {teamx:"DONATIONS" ,link:"record-directdebit",value:"Record direct debit"}
views.record_directdebit=record_directdebit

//Major Donors
//Treasure

var raw_donors = {teamx:"DONATIONS" ,link:"raw-donors",value:"Raw Major Donors"}
views.raw_donors=raw_donors


var monthly_donors = {teamx:"DONATIONS" ,link:"monthly-donors",value:"Monthly Major Donors"}
views.monthly_donors=monthly_donors


var record_donors  = {teamx:"DONATIONS" ,link:"record-donors",value:"Record Major Donors"}
views.record_donors=record_donors


//trusts and foundations
var raw_trusts = {teamx:"DONATIONS" ,link:"raw-trusts",value:"Raw Trusts and foundations"}
views.raw_trusts=raw_trusts


var monthly_trusts = {teamx:"DONATIONS" ,link:"monthly-trusts",value:"Monthly Trusts and foundations"}
views.monthly_trusts=monthly_trusts


var record_trusts  = {teamx:"DONATIONS" ,link:"record-trusts",value:"Record Trusts and foundationss"}
views.record_trusts=record_trusts


//online donations
var raw_online = {teamx:"DONATIONS" ,link:"raw-online",value:"Raw online donations"}
views.raw_online=raw_online


var monthly_online = {teamx:"DONATIONS" ,link:"monthly-online",value:"Monthly online donations"}
views.monthly_online=monthly_online


var record_online = {teamx:"DONATIONS" ,link:"record-online",value:"Record online donations"}
views.record_online=record_online

//general donations
var raw_general = {teamx:"DONATIONS" ,link:"raw-general",value:"Raw general donations"}
views.raw_general=raw_general


var monthly_general = {teamx:"DONATIONS" ,link:"monthly-general",value:"Monthly general donations"}
views.monthly_general=monthly_general


var record_general = {teamx:"DONATIONS" ,link:"record-general",value:"Record general donations"}
views.record_general=record_general


//Treasure

var raw_treasure = {teamx:"DONATIONS" ,link:"raw-treasure",value:"Raw treasure"}
views.raw_treasure=raw_treasure


var monthly_treasure = {teamx:"DONATIONS" ,link:"monthly-treasure",value:"Monthly treasure"}
views.monthly_treasure=monthly_treasure


var record_treasure = {teamx:"DONATIONS" ,link:"record-treasure",value:"Record treasure"}
views.record_treasure=record_treasure



var record_welcomedesk = {teamx:"DONATIONS" ,link:"record-welcomedesk",value:"Record Welcome desk"}
views.record_welcomedesk=record_welcomedesk


var raw_welcomedesk = {teamx:"DONATIONS" ,link:"raw-welcomedesk",value:"Raw Welcome desk"}
views.raw_welcomedesk=raw_welcomedesk


var monthly_welcomedesk = {teamx:"DONATIONS" ,link:"monthly-welcomedesk",value:"Monthly Welcome desk"}
views.monthly_welcomedesk=monthly_welcomedesk


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
 
require('./navigation/admin')($scope,views);
require('./navigation/development')($scope,views);
require('./navigation/staff')($scope,views);

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
