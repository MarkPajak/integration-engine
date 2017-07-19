exports.monthly_donations_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Monthly_donations,make_a_pie,make_a_line_chart,monthly_data_table_columns,grid_ui_settings,data_table_reload,table_security
    ) {
		
		
			$scope.chart_class = "col-md-8 col-lg-8 col-sm-5 pull-right"
			$scope.table_class = "col-md-12 col-lg-12 col-sm-5"	
					$scope.chart_heading = "Donations  by month"
		$scope.show_all_Button=false
		console.log('controller go')
		$scope.table_heading = "Monthly donations"
		$scope.pie_date = "Apr 2017"
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		$rootScope.canEdit_table=false
		var columnDefs= []
			$scope.filter_pie=[]
			columnDefs.push(
			{ field: 'museum',		name: "Museum",width: "100", pinnedLeft:true},
			{ field: 'stat',		name: "Statistic",width: "100", pinnedLeft:true}
					
			)
		$scope.start_date=new Date("01/04/2017")
			$scope.end_date=new Date("01/04/2018")
			columnDefs=columnDefs.concat(monthly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
			console.log('columnDefs',columnDefs)		
				$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
	
			
			$scope.museums  =[]
			$scope.selected_chart_stats=["Donations"]
			
			
			Monthly_donations.query({}, function(team) {
				$scope.rows=[]
				$scope.data_rows=[]
				$scope._rows=[]
				_.each(team,function(row){
					console.log(row)
						if(row.museum!=""){
							if($scope.museums.indexOf(row.museum)==-1){$scope.museums.push(row.museum)}
							
					$scope._rows.push(row)
					if(row.stat=="Donations"){
						console.log("Donations")
						$scope.data_rows.push(row)
						
					}
			}
					
							
				})
			
			$scope.gridOptions.data=$scope._rows;
			
			_.each([2016,2017],function(year){
				_.each(moment.monthsShort(),function(month){				
						$scope.filter_pie.push({value:month+" "+year,name:month+" "+year})
					
				})
			})
			make_a_pie.build($scope,"Apr 2017","museum")
			make_a_line_chart.build($scope,columnDefs,"museum")
			$scope.changedValue = function(item){ 
					$scope.pie_date=item			
					make_a_pie.build($scope,item,"museum")
			}
				$scope.$watchGroup(['end_date','start_date'], function(newValue, oldValue) {
  
					columnDefs=[]
					columnDefs.push(	{ field: 'museum',		name: "Museum",width: "100", pinnedLeft:true},
			{ field: 'stat',		name: "Statistic",width: "100", pinnedLeft:true}
					)
					columnDefs=columnDefs.concat(monthly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
					$scope.gridOptions.columnDefs=columnDefs
					make_a_line_chart.build($scope,columnDefs,"museum")
			
			
			
			});
		})	
}				







