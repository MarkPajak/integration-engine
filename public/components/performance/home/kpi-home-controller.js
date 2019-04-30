exports.kpi_home_controller = function(get_kpis,get_team_kpis,$route,$scope, $http, $q, $routeParams, $location,$rootScope, Raw_events,data_table_reload,AuthService,grid_ui_settings,get_table_data,table_security
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

 $scope.satisfied=false
$.getJSON('https://sheets.googleapis.com/v4/spreadsheets/1dZ1UMfIbNpbUEgGLy7nLeEwPaZ1xSlVyewSmK7jjWV0/values/satisfaction?key=AIzaSyCYImmjWQO1DVt0Wk3C2jUhQqRFQ1MgGfo', function(data) {
   //data is the JSON string
   console.log(parseInt(data.values[0][0].replace("%",""))>=75)
   if(parseInt(data.values[0][0].replace("%",""))>=75){
	whizz_number( data.values[0][0].replace("%",""),'satisfaction')
	$scope.satisfied=true
	}
});

		
		var current_year=moment(new Date()).format("YYYY")
		var current_month=moment(new Date()).format("MM")
		
		console.log('current month',current_month)
		
					get_team_kpis.query({}, function(team) {
						
						
				$scope.rows=[]
				$scope._rows=[]
				$scope.visits=0
				$scope.visits_num=0
				$scope.lte_visits=0
				$scope.lte_visits_num=0
				$scope.filming_days=0
				$scope.digitised=0
				$scope.objects_used=0
				
				
				_.each(team,function(row){
					
					console.log('kpi_row',row)
				row._id=[]
			
				 row._id.year=moment(new Date(row.date_value_end)).format("YYYY")
				 row._id.month=moment(new Date(row.date_value_end)).format("MM")	
							
					if(row._id.year && row.kpi_type=="objects used this month"){
							if( row._id.month>3&&current_month<=3 && (current_year-1).toString()==row._id.year.toString()){
								$scope.objects_used+=row.no_sessions							
							}							
							if(row._id.month>3 && current_month>3 && current_year.toString()==row._id.year.toString()){
								$scope.objects_used+=row.no_sessions			
							}
							if(row._id.month<=3&& current_month<=3 && current_year.toString()==row._id.year.toString()){
								$scope.objects_used+=row.no_sessions		
							}

					}
		
					if(row._id.year && row.kpi_type=="New emu object records"){
							if( row._id.month>3&&current_month<=3 && (current_year-1).toString()==row._id.year.toString()){
								$scope.digitised+=row.no_sessions							
							}							
							if(row._id.month>3 && current_month>3 && current_year.toString()==row._id.year.toString()){
								$scope.digitised+=row.no_sessions			
							}
							if(row._id.month<=3&& current_month<=3 && current_year.toString()==row._id.year.toString()){
								$scope.digitised+=row.no_sessions		
							}

					}
				
					
					
					if(row._id.year && row.kpi_type=="filming days"){
							if( row._id.month>3&&current_month<=3 && (current_year-1).toString()==row._id.year.toString()){
								$scope.filming_days+=row.no_sessions							
							}							
							if(row._id.month>3 &&current_month>3 && current_year.toString()==row._id.year.toString()){
								$scope.filming_days+=row.no_sessions			
							}
							if(row._id.month<=3&& current_month<=3 && current_year.toString()==row._id.year.toString()){
								$scope.filming_days+=row.no_sessions		
							}

					}
		
				})
				whizz_number( $scope.digitised,'digitised-objects')
				whizz_number( $scope.objects_used,'objects-used')
				whizz_number( $scope.filming_days,'filming-days')
				
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
				
			get_kpis.query({}, function(team) {
				$scope.rows=[]
				$scope._rows=[]
				$scope.visits=0
				$scope.visits_num=0
				$scope.lte_visits=0
				$scope.lte_visits_num=0
				_.each(team,function(row){
					
					
				
					
					if(row._id.year){
					
							if(current_month<=3 && (current_year-1).toString()==row._id.year.toString() && row._id.financial_yer=="this"){
							
								$scope.visits+=(row.total_sessions) 
								$scope.visits_num+=row.total_sessions
									console.log('this fianncial year$scope.visits_num',$scope.visits_num)
									console.log('(current_year-1).toString()',(current_year-1).toString())
									
							}
														
							if(current_month>3 && current_year.toString()==row._id.year.toString() && row._id.financial_yer=="this"){
							
								$scope.visits+=(row.total_sessions) 
								$scope.visits_num+=row.total_sessions
									console.log('$scope.visits_num',$scope.visits_num)
							}
							
								if(current_month<=3 && current_year.toString()==row._id.year.toString() && row._id.financial_yer=="last"){
								
									$scope.visits+=(row.total_sessions) 
									$scope.visits_num+=row.total_sessions
										console.log('$scope.visits_num_last'+current_year,row.total_sessions)
								}
							
					
					}
					
					if(row._id.ltd_year){

							if(current_month<=3 &&(current_year-2).toString()==(row._id.ltd_year).toString() && row._id.ltd_financial_yer=="this"){
							
								$scope.lte_visits+=(row.total_sessions) 
								$scope.lte_visits_num+=row.total_sessions
								console.log('$scope.lte_visits',$scope.lte_visits)
							}
							
							
							if((current_year-1).toString()==(row._id.ltd_year).toString() && row._id.ltd_financial_yer=="this"){
							
								$scope.lte_visits+=(row.total_sessions) 
								$scope.lte_visits_num+=row.total_sessions
								console.log('$scope.lte_visits',$scope.lte_visits)
							}
							
							if(current_month<=3 && (current_year-1).toString()==row._id.ltd_year.toString() && row._id.ltd_financial_yer=="last"){
							
								$scope.lte_visits+=(row.total_sessions) 
								$scope.lte_visits_num+=row.total_sessions
									console.log('$scope.visits_num_last'+current_year,row.total_sessions)
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