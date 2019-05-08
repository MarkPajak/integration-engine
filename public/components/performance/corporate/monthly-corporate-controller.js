exports.monthly_corporate_controller = function(yearly_percentage_difference,yearly_totals,getDateService,$route,$scope, $http, $q, $routeParams, $location,$rootScope, dynamicTableCellFilter_donations,Monthly_corporate,make_a_pie,make_a_line_chart,monthly_data_table_columns_retail,grid_ui_settings,data_table_reload,table_security,dynamicTableCellFilter_corporate
    ) {
		
		
			$scope.chart_class = "col-md-8 col-lg-8 col-sm-5 pull-right"
			$scope.table_class = "col-md-12 col-lg-12 col-sm-5"	
			$scope.chart_heading = "Fundraised income  by month"
			$scope.background_colour="corporate"
		$scope.show_all_Button=false
		console.log('controller go')
		$scope.table_heading = "Monthly Corporate income"
		$scope.pie_date = "Apr 2017"
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		$rootScope.canEdit_table=false
		var columnDefs= []
			$scope.filter_pie=[]
			columnDefs.push(
			{ field: 'museum',	cellFilter:'valueFilter',	name: "Museum",width: "200", pinnedLeft:true,cellClass:dynamicTableCellFilter_donations}//,
			//{ field: 'stat',	cellFilter:'valueFilter',	name: "Statistic",width: "300", pinnedLeft:true,cellClass:dynamicTableCellFilter_corporate}
					
			)
			dates=getDateService.getDate()
		$scope.start_date=dates[0]
		$scope.end_date=dates[1]
			columnDefs=columnDefs.concat(monthly_data_table_columns_retail.build($scope,$scope.start_date,$scope.end_date))
			console.log('columnDefs',columnDefs)		
				$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
	
			
			$scope.museums  =[]
			$scope.selected_chart_stats=["corporate"]
			
			
			Monthly_corporate.query({}, function(team) {
				$scope.rows=[]
				$scope.data_rows=[]
				$scope._rows=[]
				_.each(team,function(row){
					console.log(row)
						if(row.museum!=""){
							if($scope.museums.indexOf(row.museum)==-1){$scope.museums.push(row.museum)}
							
					$scope._rows.push(row)
					if(row.stat=="corporate"){
						console.log("corporate")
						$scope.data_rows.push(row)
						
					}
			}
					
							
				})
			
			$scope.gridOptions.data=$scope._rows;
			$scope.gridOptions.enableFiltering=false
			yearly_totals.build($scope)
			yearly_percentage_difference.build($scope)	

			
			
			
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
				
					
			  $scope.$on('date:updated', function(event,data) {
					console.log(data)
					$scope.start_date=data[0]
					$scope.end_date=	data[1]	
			
				});
			
				
				$scope.$watchGroup(['end_date','start_date'], function(newValue, oldValue) {
  
					columnDefs=[]
				columnDefs.push(	
				{ field: 'museum',	cellFilter:'valueFilter',	name: "Museum",width: "200", pinnedLeft:true,cellClass:dynamicTableCellFilter_donations}//,
			//{ field: 'stat',	cellFilter:'valueFilter',	name: "Statistic",width: "300", pinnedLeft:true,cellClass:dynamicTableCellFilter_donations}
					)
					columnDefs=columnDefs.concat(monthly_data_table_columns_retail.build($scope,$scope.start_date,$scope.end_date))
					$scope.gridOptions.columnDefs=columnDefs
					make_a_line_chart.build($scope,columnDefs,"museum")
			
			
			
			});
		})	
}				







