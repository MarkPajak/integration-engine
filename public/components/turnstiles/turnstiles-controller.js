
exports.turnstiles_controller = function(log_messages,$scope, AuthService,$http, $q, $routeParams, $location,$rootScope, turnstile_app
    ) {
	

$scope.operation_in_progress=false
$scope.settings=[]
$scope.test_ticket=""
 $scope.venue =$routeParams.venue
$scope.settings.venue=$routeParams.venue


$scope.open_turnstile = function(){
$scope.settings.ticket=$scope.test_ticket
$scope.settings.venue=$scope.venue
			$scope.operation_in_progress=true
			turnstile_app.openGates($scope.settings,function(team){
			$scope.operation_in_progress=false
		})
}


				
	}


exports.turnstiles_buttons = function(log_messages,$scope, $http, $q, $routeParams, $location,$rootScope, shopify_app
    ) {
$scope.report_running=true
  $scope.title1 = 'Button';
  $scope.title4 = 'Warn';
  $scope.isDisabled = true;

  $scope.googleUrl = 'http://google.com';
  $scope.messages=[]
  
  


	log_messages.query({}, function(messages) {
	/*
	setInterval(function(){
	$scope.messages[0]='checking logs'
				 }, 1 * 60 * 1000)
	
	setInterval(function(){
			
			log_messages.query({}, function(team) {
				_.each(team, function(row,index) {
						$scope.messages[0]=	row.username+" "+row.date+" "+row.message
		
				})
			})	
		 }, 3000);
	})
*/
})

}



