exports.exhibitions_summary_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Monthly_teg,make_a_pie,make_a_line_chart,monthly_data_table_columns,grid_ui_settings,table_security
    ) {
		
		
		$scope.monthWeek='month'
		$scope.show_all_Button=false
		console.log('controller go')
		$scope.table_heading = "Monthly TEG stats"
		$scope.chart_class = "col-md-8 col-lg-8 col-sm-5 pull-right"
		$scope.table_class = "col-md-12 col-lg-12 col-sm-5"
		$scope.chart_heading= "Gallery visits by monthx"
		$scope.pie_date = "Apr 2017"
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		$rootScope.canEdit_table=false
		var columnDefs= []
			$scope.filter_pie=[]
			columnDefs.push(
			{ field: 'museum',	name: "Museum",width: 80, pinnedLeft:true},
			{ field: 'exhibition',	name: "Exhibition",width: 200},
			{ field: 'stat',	name: "Statistic",width: 100}
					
			)
		$scope.start_date=new Date("01/04/2017")
			$scope.end_date=new Date("01/04/2018")
			columnDefs=columnDefs.concat(monthly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
			columnDefs.enableFiltering=false
			console.log('columnDefs',columnDefs)		
			$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
		 console.log('getData')	
			Monthly_teg.query({}, function(team) {
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
				_.each(moment.monthsShort(),function(month){				
						$scope.filter_pie.push({value:month+" "+year,name:month+" "+year})
					
				})
			})
			make_a_pie.build($scope,"Apr 2017","museum")
			make_a_line_chart.build($scope,columnDefs,"museum","gallery_visits")
			$scope.changedValue = function(item){ 
					$scope.pie_date=item			
					make_a_pie.build($scope,item,"museum")
			}
			$scope.$watchGroup(['end_date','start_date'], function(newValue, oldValue) {
  
					columnDefs=[]
					columnDefs.push({ field: 'museum',		name: "Museum",width: 90},
					{ field: 'exhibition',	name: "Exhibition",width: 200},
								{ field: 'stat',		name: "Statistic",width: 150}
					)
					columnDefs=columnDefs.concat(monthly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
					columnDefs.enableFiltering=false
					$scope.gridOptions.columnDefs=columnDefs
					make_a_line_chart.build($scope,columnDefs,"museum","gallery_visits")
			
			
			
			});
		})	
}				







