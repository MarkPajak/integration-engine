exports.monthly_exhibitions_pwyt_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Monthly_exhibitions_pwyt,make_a_pie,make_a_line_chart,monthly_data_table_columns,grid_ui_settings,table_security
    ) {
		
		
			
		$scope.show_all_Button=false
		console.log('controller go')
		$scope.table_heading = "Monthly total"
		$scope.pie_date = "Apr 2017"
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		$rootScope.canEdit_table=false
		var columnDefs= []
			$scope.filter_pie=[]
			columnDefs.push(
			{ field: 'museum',		name: "Museum",width: "250", pinnedLeft:true},
			{ field: 'stat',		name: "Statistic",width: "250", pinnedLeft:true}
					
			)
		$scope.start_date=new Date("01/04/2017")
			$scope.end_date=new Date("01/04/2018")
			columnDefs=columnDefs.concat(monthly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
			console.log('columnDefs',columnDefs)		
		$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
		 console.log('getData')	
			Monthly_exhibitions_pwyt.query({}, function(team) {
				$scope.rows=[]
				$scope.data_rows=[]
				$scope._rows=[]
				_.each(team,function(row){
					console.log(row)
					$scope._rows.push(row)
					if(row.stat=="Donations"){
						console.log("Donations")
						$scope.data_rows.push(row)
						
					}
			
					
							
				})
			
			$scope.gridOptions.data=$scope._rows;
			
			_.each([2016,2017],function(year){
				_.each(moment.monthsShort(),function(month){				
						$scope.filter_pie.push({value:month+" "+year,name:month+" "+year})
					
				})
			})
			make_a_pie.build($scope,"Apr 2017","museum")
			make_a_line_chart.build($scope,columnDefs,"museum","donation_box_amount")
			$scope.changedValue = function(item){ 
					$scope.pie_date=item			
					make_a_pie.build($scope,item,"museum")
			}
				$scope.$watch('end_date', function(newValue, oldValue) {
  
					columnDefs=[]
					columnDefs.push({ field: 'museum',		name: "Museum",width: "250"},
								{ field: 'stat',		name: "Statistic",width: "250"}
					)
					columnDefs=columnDefs.concat(monthly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
					$scope.gridOptions.columnDefs=columnDefs
					make_a_line_chart.build($scope,columnDefs,"donation_box_amount")
			
			
			
			});
		})	
}				







