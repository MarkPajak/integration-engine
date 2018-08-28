	
exports.TableFilterController = function($location,AuthService,tableFilterService, $scope,$http) {

  	$scope.start_date=new Date("04/01/2018")
	$scope.end_date= moment($scope.start_date).add('years', 1).format("DD/MM/YYYY")
  
 $scope.end=new Date()
       console.log(' $scope.end', $scope.end)
    
};
