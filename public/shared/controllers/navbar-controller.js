	
exports.NavController = function($location,AuthService,$scope,$http) {

  $scope.user="not logged in"
  $scope.$location = $location;
 
 
 $scope.permissions = []
 $scope.user_groups = []
  $scope.user_groups['AV']=[]
    $scope.user_groups['ADMIN']=[]
   $scope.user_groups['RETAIL']=[]
    $scope.user_groups['DIGITAL']=[]
	
		   $scope.user_groups['STAFF']=[]
	
	
	   $scope.user_groups['DEFAULT']=[]
	
var timeline = {link:"timeline",value:"timeline"}
var dead ={link:"dead",value:"downtime"}
var activity = {link:"activity",value:"activity"}
var feedback = {link:"feedback",value:"feedback"}
var tech_support = {link:"tech-support",value:"tech-support"}
var shopify = {link:"shopify_app",value:"shopify"}
var users = {link:"users",value:"users"}
var doom = {link:"doom",value:"DOOM!"}
var performance = {link:"record-visitor-numbers",value:"enter data"}
var raw_visits = {link:"raw-visits",value:"raw visit data"}
var monthly_visits = {link:"monthly-visits",value:"monthly visit data"}



$scope.user_groups['ADMIN'].views=[]
$scope.user_groups['ADMIN'].views.push(timeline)
$scope.user_groups['ADMIN'].views.push(dead)
$scope.user_groups['ADMIN'].views.push(activity)
$scope.user_groups['ADMIN'].views.push(feedback)
$scope.user_groups['ADMIN'].views.push(tech_support)
$scope.user_groups['ADMIN'].views.push(shopify)
$scope.user_groups['ADMIN'].views.push(performance)
$scope.user_groups['ADMIN'].views.push(raw_visits)
$scope.user_groups['ADMIN'].views.push(monthly_visits)
  
  
$scope.user_groups['AV'].views=[]
$scope.user_groups['AV'].views.push(timeline)
$scope.user_groups['AV'].views.push(dead)
$scope.user_groups['AV'].views.push(activity)
$scope.user_groups['AV'].views.push(feedback)
$scope.user_groups['AV'].views.push(tech_support)

$scope.user_groups['DIGITAL'].views=[]
$scope.user_groups['DIGITAL'].views.push(timeline)
$scope.user_groups['DIGITAL'].views.push(dead)
$scope.user_groups['DIGITAL'].views.push(activity)
$scope.user_groups['DIGITAL'].views.push(tech_support)
$scope.user_groups['DIGITAL'].views.push(shopify)
$scope.user_groups['DIGITAL'].views.push(performance)
$scope.user_groups['DIGITAL'].views.push(raw_visits)
$scope.user_groups['DIGITAL'].views.push(monthly_visits)

$scope.user_groups['DEFAULT'].views=[]
$scope.user_groups['DEFAULT'].views.push(timeline) 
$scope.user_groups['DEFAULT'].views.push(monthly_visits)


$scope.user_groups['STAFF'].views=[]
$scope.user_groups['STAFF'].views.push(timeline) 
$scope.user_groups['STAFF'].views.push(performance) 
$scope.user_groups['STAFF'].views.push(monthly_visits)

$scope.user_groups['RETAIL'].views=[]
$scope.user_groups['RETAIL'].views.push(timeline)
$scope.user_groups['RETAIL'].views.push(shopify)
   
  AuthService.isLoggedIn().then(function(user){
	 
	  if(user.data.group){
	  user.data.views= $scope.user_groups[user.data.group].views
	  
	  if(user.data.lastName.toLowerCase()=="pace"){
		  
		 user.data.views.push(doom)
	  }
	  
	  }
	  else{
		user.data.views= $scope.user_groups['DEFAULT'].views  
		  
	  }
	  console.log(user)
	  $scope.user=(user.data)
  
  })
 
  
  
  
       
    
};
