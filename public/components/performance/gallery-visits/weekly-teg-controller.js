exports.weekly_teg_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Weekly_teg,make_a_pie,make_a_line_chart,weekly_data_table_columns,grid_ui_settings,table_security
    ) {
		
		
		$scope.table_class = "col-md-12 col-lg-12 col-sm-5"
		$scope.show_all_Button=false
		console.log('controller go')
		$scope.table_heading = "Weekly TEG stats"
		$scope.pie_date = "Apr 2017"
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		$rootScope.canEdit_table=false
		var columnDefs= []
			$scope.filter_pie=[]
			columnDefs.push(
			{ field: 'museum',		name: "Museum",width: "70", pinnedLeft:true},
			{ field: 'stat',		name: "Statistic",width: "50", pinnedLeft:true}
					
			)
			$scope.start_date=new Date("01/04/2017")
			$scope.end_date=new Date("01/04/2018")
			columnDefs=columnDefs.concat(weekly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
			console.log('columnDefs',columnDefs)		
				$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
			
			Weekly_teg.query({}, function(team) {
				$scope.rows=[]
				$scope.data_rows=[]
				$scope._rows=[]
				_.each(team,function(row){
					console.log(row)
					if(row.museum!=""){
					$scope._rows.push(row)
					if(row.stat=="gallery_visits"){
						console.log("gallery_visits")
						$scope.data_rows.push(row)
						
					}
					}
			
				})
			
			$scope.gridOptions.data=$scope._rows;
			
			_.each([2016,2017],function(year){
				for (week = 0; week < moment().isoWeeksInYear(); week++) { 
							
						$scope.filter_pie.push({value:week+" "+year,name:week+" "+year})
				}	
				
			})
			make_a_pie.build($scope,"Apr 2017","museum")
			make_a_line_chart.build($scope,columnDefs,"museum","gallery_visits")
			$scope.changedValue = function(item){ 
					$scope.pie_date=item			
					make_a_pie.build($scope,item,"museum")
			}
				$scope.$watch('end_date', function(newValue, oldValue) {
  
					columnDefs=[]
					columnDefs.push({ field: 'museum',		name: "Museum",width: "250"},
								{ field: 'stat',		name: "Statistic",width: "250"}
					)
					columnDefs=columnDefs.concat(weekly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
					$scope.gridOptions.columnDefs=columnDefs
					make_a_line_chart.build($scope,columnDefs,"museum","gallery_visits")
			
			
			
			});
		})	
}				







