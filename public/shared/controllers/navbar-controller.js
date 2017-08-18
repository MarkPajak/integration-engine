	
exports.NavController = function($location,AuthService,$scope,$http) {

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

$scope.permissions = []
$scope.user_groups = []
$scope.user_groups['AV']=[]
$scope.user_groups['ADMIN']=[]
$scope.user_groups['RETAIL']=[]
$scope.user_groups['DIGITAL']=[]
$scope.user_groups['STAFF']=[]
$scope.user_groups['DEFAULT']=[]
$scope.user_groups['DEVELOPMENT']=[]	   
$scope.user_groups['LEARNING']=[]	
$scope.user_groups['EXHIBITIONS']=[]	
$scope.user_groups['OPERATIONS']=[]
$scope.user_groups['COMMERCIAL']=[]
	
var timeline = {link:"timeline",value:"Timeline"}
var dead ={link:"dead",value:"Downtime"}
var activity = {link:"activity",value:"Machine Activity"}
var feedback = {link:"feedback",value:"Kiosk feedback"}
var tech_support = {link:"tech-support",value:"Tech-support"}
var shopify = {link:"shopify_app",value:"Shopify"}
var users = {link:"users",value:"ADMIN: Users"}
var doom = {link:"doom",value:"DOOM!"}

var analyser = {link:"analyser",value:"Performance analyser (BETA)"}


var rooms = {link:"rooms",value:"Add rooms"}
var equipment = {link:"equipment",value:"Add equipment"}
var equipment_bookings = {link:"bookings/equipment",value:"Equipment booking"}
var room_bookings = {link:"bookings/rooms",value:"Room booking"}
var room_hire = {link:"room-hire",value:"Room booking timeline"}

var performance = {link:"record-visitor-numbers",value:"VISITS: Record visitor figures"}
var record_retail_sales = {link:"record-retail-sales",value:"RETAIL:Record retail sales"}
var raw_retail_sales = {link:"raw-retail-sales",value:"RETAIL:Raw retail sales"}
var monthly_retail_sales = {link:"monthly-retail-sales",value:"RETAIL: Monthly retail sales"}



var record_donations = {link:"record-donations",value:"DONATIONS: Record donations"}
var donations = {link:"raw-donations",value:"DONATIONS: Raw donation data"}
var monthly_donations = {link:"monthly-donations",value:"DONATIONS: Monthly donations"}

var record_operations = {link:"record-operations",value:"OPERATIONS: Record operations"}
var operations = {link:"raw-operations",value:"OPERATIONS: Raw operations data"}
var monthly_operations = {link:"monthly-operations",value:"OPERATIONS: Monthly operations"}

var record_events = {link:"record-events",value:"EVENTS: Record events"}
var events = {link:"raw-events",value:"EVENTS: Raw events data"}
var monthly_events = {link:"monthly-events",value:"EVENTS: Monthly events"}

var record_teg = {link:"record-teg",value:"EXHIBITIONS: Record TEG figures"}
var teg = {link:"raw-teg",value:"EXHIBITIONS: Raw TEG figures"}
var monthly_teg = {link:"monthly-teg",value:"EXHIBITIONS: Monthly TEG figures"}

 var record_exhibitions_pwyt = {link:"record-exhibitions-pwyt",value:"EXHIBITIONS: Record Pay What you think"}
 var exhibitions_pwyt_monthly = {link:"monthly-exhibitions-pwyt",value:"EXHIBITIONS: Monthly Pay What you think"}
 var raw_exhibitions_pwyt = {link:"raw-exhibitions-pwyt",value:"EXHIBITIONS: Pay What you think data"}
  var exhibitions_summary = {link:"exhibitions-summary",value:"EXHIBITIONS: summary"}
 
 
 var record_learning = {link:"record-learning",value:"LEARNING: Record learning"}
var learning = {link:"raw-learning",value:"LEARNING:Raw learning data"}
var monthly_learning = {link:"monthly-learning",value:"LEARNING:Monthly learning"}

 
var raw_visits = {link:"raw-visits",value:"VISITS: Raw visits data"}
var monthly_visits = {link:"monthly-visits",value:"VISITS:Monthly visits"}



var record_giftaid = {link:"record-giftaid",value:"DONATIONS: Record gift aid"}
var raw_giftaid = {link:"raw-giftaid",value:"DONATIONS: Raw gift aid"}
var monthly_giftaid = {link:"monthly-giftaid",value:"DONATIONS: Monthly gift aid"}

var raw_turnstiles = {link:"raw-turnstiles",value:"EXHIBITIONS: turnstiles raw data"}
var monthly_turnstiles = {link:"monthly-turnstiles",value:"EXHIBITIONS: turnstiles Monthly"}

var record_welcomedesk = {link:"record-welcomedesk",value:"DONATIONS: Record Welcome desk"}
var raw_welcomedesk = {link:"raw-welcomedesk",value:"DONATIONS: Raw Welcome desk"}
var monthly_welcomedesk = {link:"monthly-welcomedesk",value:"DONATIONS: Monthly Welcome desk"}







var resources=[]

resources.push(rooms)
resources.push(equipment)
resources.push(equipment_bookings)
resources.push(room_bookings)
resources.push(room_hire)

var performance_data=[]
performance_data.push(room_hire)

$scope.user_groups['COMMERCIAL'].resources=[]
$scope.user_groups['COMMERCIAL'].resources=resources
$scope.user_groups['COMMERCIAL'].performance=performance_data










var enter_data=[]
//enter_data.push(performance)
//enter_data.push(record_retail_sales)
enter_data.push(record_donations)
enter_data.push(record_giftaid)
enter_data.push(record_welcomedesk)
enter_data.push(record_events)




var performance_data=[]
performance_data.push(raw_visits)
performance_data.push(monthly_visits)
//performance_data.push(raw_retail_sales)
performance_data.push(monthly_retail_sales)
//performance_data.push(raw_turnstiles)
performance_data.push(monthly_turnstiles)
performance_data.push(raw_giftaid)
performance_data.push(monthly_giftaid)
performance_data.push(monthly_donations)
performance_data.push(donations)
performance_data.push(monthly_welcomedesk)
performance_data.push(raw_welcomedesk)

performance_data.push(events)
performance_data.push(monthly_events)


$scope.user_groups['DEVELOPMENT'].views=[]

$scope.user_groups['DEVELOPMENT'].views.push(timeline)
$scope.user_groups['DEVELOPMENT'].views.push(analyser)



$scope.user_groups['DEVELOPMENT'].enter_data=enter_data
$scope.user_groups['DEVELOPMENT'].performance=performance_data




 
var enter_data=[]
enter_data.push(performance)
enter_data.push(record_retail_sales)
enter_data.push(record_donations)
enter_data.push(record_giftaid)
enter_data.push(record_welcomedesk)
enter_data.push(record_learning)
enter_data.push(record_exhibitions_pwyt)
enter_data.push(record_teg)
enter_data.push(record_events)
enter_data.push(record_operations)


enter_data=enter_data.sort()

var performance_data=[]
performance_data.push(raw_visits)
performance_data.push(monthly_visits)
performance_data.push(raw_retail_sales)
performance_data.push(monthly_retail_sales)
performance_data.push(raw_turnstiles)
performance_data.push(monthly_turnstiles)
performance_data.push(raw_giftaid)
performance_data.push(monthly_giftaid)
performance_data.push(monthly_donations)
performance_data.push(donations)
performance_data.push(raw_welcomedesk)
performance_data.push(monthly_welcomedesk)

performance_data.push(learning)
performance_data.push(monthly_learning)

performance_data.push(exhibitions_pwyt_monthly)
performance_data.push(raw_exhibitions_pwyt)
performance_data.push(exhibitions_summary)



performance_data.push(teg)
performance_data.push(monthly_teg)
performance_data.push(events)
performance_data.push(monthly_events)
performance_data.push(operations)
performance_data.push(monthly_operations)

performance_data=performance_data.sort()


$scope.user_groups['ADMIN'].views=[]
$scope.user_groups['ADMIN'].enter_data=[]
$scope.user_groups['ADMIN'].resources=[]

$scope.user_groups['ADMIN'].views.push(room_hire)
$scope.user_groups['ADMIN'].views.push(timeline)
$scope.user_groups['ADMIN'].views.push(analyser)
$scope.user_groups['ADMIN'].views.push(dead)
$scope.user_groups['ADMIN'].views.push(activity)
$scope.user_groups['ADMIN'].views.push(feedback)
$scope.user_groups['ADMIN'].views.push(tech_support)
$scope.user_groups['ADMIN'].views.push(shopify)
$scope.user_groups['ADMIN'].views.push(users)

$scope.user_groups['ADMIN'].enter_data=enter_data
$scope.user_groups['ADMIN'].performance=performance_data
$scope.user_groups['ADMIN'].resources=resources

var enter_data=[]

enter_data.push(record_exhibitions_pwyt)
enter_data.push(record_teg)
enter_data.push(record_events)

var performance_data=[]
performance_data.push(raw_visits)
performance_data.push(monthly_visits)
performance_data.push(monthly_retail_sales)
performance_data.push(monthly_turnstiles)
performance_data.push(monthly_donations)
performance_data.push(monthly_learning)
performance_data.push(exhibitions_pwyt_monthly)
performance_data.push(exhibitions_summary)
performance_data.push(raw_exhibitions_pwyt)
performance_data.push(teg)
performance_data.push(monthly_teg)
performance_data.push(events)
performance_data.push(monthly_events)

$scope.user_groups['EXHIBITIONS'].views=[]
$scope.user_groups['EXHIBITIONS'].enter_data=[]
$scope.user_groups['EXHIBITIONS'].resources=[]

$scope.user_groups['EXHIBITIONS'].views.push(timeline)
$scope.user_groups['EXHIBITIONS'].views.push(analyser)
$scope.user_groups['EXHIBITIONS'].performance=performance_data
$scope.user_groups['EXHIBITIONS'].views.push(room_hire)
$scope.user_groups['EXHIBITIONS'].resources=resources


var enter_data=[]
enter_data.push(record_learning)
enter_data.push(record_events)

var performance_data=[]
performance_data.push(raw_visits)


performance_data.push(learning)
performance_data.push(monthly_learning)
performance_data.push(events)
performance_data.push(monthly_events)


$scope.user_groups['LEARNING'].views=[]
$scope.user_groups['LEARNING'].enter_data=[]

$scope.user_groups['LEARNING'].views.push(timeline)
$scope.user_groups['LEARNING'].views.push(analyser)

$scope.user_groups['LEARNING'].enter_data=enter_data
$scope.user_groups['LEARNING'].performance=performance_data
$scope.user_groups['LEARNING'].views.push(room_hire)

var enter_data=[]
enter_data.push(performance)
enter_data.push(record_retail_sales)
enter_data.push(record_donations)
enter_data.push(record_giftaid)
enter_data.push(record_welcomedesk)
enter_data.push(record_learning)
enter_data.push(record_exhibitions_pwyt)
enter_data.push(record_teg)
enter_data.push(record_events)
enter_data.push(record_operations)


enter_data=enter_data.sort()

var performance_data=[]
performance_data.push(raw_visits)
performance_data.push(monthly_visits)

performance_data.push(teg)
performance_data.push(monthly_teg)
performance_data.push(events)

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



var enter_data=[]
enter_data.push(performance)
enter_data.push(record_retail_sales)
enter_data.push(record_donations)
enter_data.push(record_giftaid)
enter_data.push(record_events)


var performance_data=[]
performance_data.push(raw_visits)
performance_data.push(monthly_visits)
performance_data.push(raw_retail_sales)
performance_data.push(monthly_retail_sales)
performance_data.push(raw_turnstiles)
performance_data.push(monthly_turnstiles)
performance_data.push(raw_giftaid)
performance_data.push(monthly_giftaid)
performance_data.push(monthly_donations)
performance_data.push(donations)
performance_data.push(monthly_welcomedesk)
performance_data.push(events)
performance_data.push(monthly_events)



$scope.user_groups['DIGITAL'].views=[]
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
  
$scope.user_groups['DEFAULT'].views=[]
$scope.user_groups['DEFAULT'].views.push(timeline) 
$scope.user_groups['DEFAULT'].views.push(analyser)
$scope.user_groups['DEFAULT'].views.push(monthly_visits)
$scope.user_groups['DEFAULT'].views.push(monthly_turnstiles) 
$scope.user_groups['DEFAULT'].performance=performance_data
$scope.user_groups['DEFAULT'].enter_data=enter_data

var enter_data=[]
enter_data.push(performance)
enter_data.push(record_exhibitions_pwyt)
enter_data.push(record_events)

performance_data.push(teg)

var performance_data=[]
performance_data.push(raw_visits)
performance_data.push(monthly_visits)
performance_data.push(monthly_retail_sales)
performance_data.push(monthly_turnstiles)
performance_data.push(monthly_donations)
performance_data.push(raw_exhibitions_pwyt)
performance_data.push(exhibitions_pwyt_monthly)
performance_data.push(monthly_teg)
performance_data.push(events)
performance_data.push(monthly_events)

enter_data.push(record_teg)

$scope.user_groups['STAFF'].views=[]
$scope.user_groups['STAFF'].views.push(timeline) 
$scope.user_groups['STAFF'].views.push(analyser) 


$scope.user_groups['STAFF'].enter_data=enter_data
$scope.user_groups['STAFF'].performance=performance_data

$scope.user_groups['STAFF'].enter_data=enter_data
$scope.user_groups['STAFF'].performance=performance_data



var performance_data=[]
performance_data.push(raw_visits)
performance_data.push(monthly_visits)
performance_data.push(monthly_retail_sales)
performance_data.push(monthly_turnstiles)
performance_data.push(monthly_donations)
performance_data.push(raw_exhibitions_pwyt)
performance_data.push(exhibitions_pwyt_monthly)
performance_data.push(monthly_teg)
performance_data.push(events)
performance_data.push(monthly_events)
performance_data.push(operations)
performance_data.push(monthly_operations)
performance_data.push(monthly_welcomedesk)


enter_data.push(record_teg)
enter_data.push(record_operations)
enter_data.push(record_exhibitions_pwyt)

$scope.user_groups['OPERATIONS'].views=[]
$scope.user_groups['OPERATIONS'].views.push(timeline) 
$scope.user_groups['OPERATIONS'].views.push(room_hire) 
$scope.user_groups['OPERATIONS'].views.push(analyser) 

$scope.user_groups['OPERATIONS'].enter_data=enter_data
$scope.user_groups['OPERATIONS'].performance=performance_data

$scope.user_groups['OPERATIONS'].resources=[]
$scope.user_groups['OPERATIONS'].resources=resources







var enter_data=[]
enter_data.push(record_retail_sales)
enter_data.push(record_events)

var performance_data=[]
performance_data.push(monthly_visits)
performance_data.push(raw_retail_sales)
performance_data.push(monthly_retail_sales)



$scope.user_groups['RETAIL'].views=[]
$scope.user_groups['RETAIL'].views.push(timeline)
//$scope.user_groups['RETAIL'].views.push(shopify)
$scope.user_groups['RETAIL'].enter_data=enter_data
$scope.user_groups['RETAIL'].performance=performance_data
	  
	  
  AuthService.isLoggedIn().then(function(user){
	 
	  if(user.data.group){
		 // console.log("user",user.data)
		  
		user.data.views= $scope.user_groups[user.data.group].views
		user.data.views=user.data.views.sort(sortFunction);
		
		user.data.resources= $scope.user_groups[user.data.group].resources
	   user.data.resources= user.data.resources.sort(sortFunction);
	   
	   
		
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
 
  
  
  
       
    
};
