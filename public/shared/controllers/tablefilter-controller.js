	
exports.TableFilterController = function(getDateService,$location,AuthService,tableFilterService, $scope,$http,get_table_data) {

  	$scope.start_date=new Date("2018/04/01")
	$scope.end_date= new Date(moment($scope.start_date).add('years', 1).format("YYYY/MM/DD"))
	 $scope.end_date.setDate($scope.end_date.getDate()-1);
  	$scope.start=	$scope.start_date
	$scope.end=$scope.end_date
  

	$scope.$watchGroup(['end','start'], function(newValue, oldValue) {
			
		getDateService.setDate($scope.start,$scope.end)	
		
		
			});

	
};
