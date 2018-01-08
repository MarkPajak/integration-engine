exports.kpi_home_controller = function(get_kpis,$route,$scope, $http, $q, $routeParams, $location,$rootScope, Raw_events,data_table_reload,AuthService,grid_ui_settings,get_table_data,table_security
    ) {
		
	
		
		
		function numberWithCommas(x) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1,$2");
    return x;
}

function whizz_number(number,id){

	console.log('whizz_number')

$('#'+id).each(function () {
    $(this).prop('Counter',0).animate({
        Counter: number
    }, {
        duration: 2000,
        easing: 'swing',
        step: function (now) {
            $(this).text(numberWithCommas(Math.ceil(now)));
        }
    });
});
		
		
		
}


		
		var current_year=moment(new Date()).format("YYYY")
		var current_month=moment(new Date()).format("MM")
		
		console.log('current month',current_month)
		
		
				
			get_kpis.query({}, function(team) {
				$scope.rows=[]
				$scope._rows=[]
				_.each(team,function(row){
					
					
				
					
					if(row._id.year){
					
							if(current_month<=3 && (current_year-1).toString()==row._id.year.toString() && row._id.financial_yer=="this"){
							
								$scope.visits=numberWithCommas(row.total_sessions) 
								$scope.visits_num=row.total_sessions
								console.log('$scope.visits_num',$scope.visits_num)
							}
														
							if(current_year.toString()==row._id.year.toString() && row._id.financial_yer=="this"){
							
								$scope.visits+=numberWithCommas(row.total_sessions) 
								$scope.visits_num+=row.total_sessions
								console.log('$scope.visits_num',$scope.visits_num)
							}
					
					}
					
					if(row._id.ltd_year){

							if((current_year-3).toString()==(row._id.ltd_year).toString() && row._id.ltd_financial_yer=="this"){
							
								$scope.lte_visits=numberWithCommas(row.total_sessions) 
								$scope.lte_visits_num=row.total_sessions
								console.log('$scope.lte_visits',$scope.lte_visits)
							}
							
							
							if((current_year-1).toString()==(row._id.ltd_year).toString() && row._id.ltd_financial_yer=="this"){
							
								$scope.lte_visits+=numberWithCommas(row.total_sessions) 
								$scope.lte_visits_num+=row.total_sessions
								console.log('$scope.lte_visits',$scope.lte_visits)
							}
							
					}
						
				})
				
				whizz_number( $scope.lte_visits_num,'lte_visits-level')
				whizz_number( $scope.visits_num,'visits-level')
				
			$scope.message=""
		
				
			if($scope.lte_visits_num < $scope.visits_num){
				
				$scope.plus=true
				$scope.percantage= Math.round( (($scope.visits_num / $scope.lte_visits_num)*100)-100 )
				console.log('$scope.percantage',$scope.percantage)
				whizz_number($scope.percantage,'diff-level1')
	
			}
			
			if($scope.lte_visits_num > $scope.visits_num){
			
				$scope.plus=false
				$scope.percantage= $scope.lte_visits_num - $scope.visits_num
				console.log('$scope.percantage',$scope.percantage)
				whizz_number( $scope.percantage,'diff-level2')
				
			
			}

		

		
})	

}