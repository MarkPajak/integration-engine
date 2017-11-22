exports.kpi_home_controller = function(get_kpis,$route,$scope, $http, $q, $routeParams, $location,$rootScope, Raw_events,data_table_reload,AuthService,grid_ui_settings,get_table_data,table_security
    ) {
		
	
		
		
		function numberWithCommas(x) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1,$2");
    return x;
}
		
		var current_year=moment(new Date()).format("YYYY")
		
				
			get_kpis.query({}, function(team) {
				$scope.rows=[]
				$scope._rows=[]
				_.each(team,function(row){
					
					
				
					
					if(row._id.year){
					
		
							
							if(current_year.toString()==row._id.year.toString() && row._id.financial_yer=="this"){
							
								$scope.visits=numberWithCommas(row.total_sessions) 
								$scope.visits_num=row.total_sessions
							}
					
					}
					
					if(row._id.ltd_year){
						
						
							
							
							if((current_year-1).toString()==(row._id.ltd_year).toString() && row._id.ltd_financial_yer=="this"){
							
								$scope.lte_visits=numberWithCommas(row.total_sessions) 
								$scope.lte_visits_num=row.total_sessions
							}
							
					}
		
							
				})
				
			$scope.message=""
		
				
			if($scope.lte_visits_num < $scope.visits_num){
			
			$scope.message="This is a " + Math.round( (($scope.visits_num / $scope.lte_visits_num)*100)-100 ) +  "% increase compared to this time last year!"
			
			}
			
			if($scope.lte_visits > $scope.visits){
			
			$scope.message="We have "  +  ($scope.lte_visits_num - $scope.visits_num) +  " to go to beat last year!"
			
			}
		})	

}			







