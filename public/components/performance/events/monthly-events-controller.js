exports.monthly_events_controller = function(yearly_totals,yearly_percentage_difference,getDateService,$route,$scope, $http, $q, $routeParams, $location,$rootScope, Monthly_events,make_a_pie,make_a_line_chart,monthly_data_table_columns,grid_ui_settings,table_security,dynamicTableCellFilter_retail
    ) {
		
		
	 $scope.init = function(event_type)
    {

			$scope.chart_class = "col-md-8 col-lg-8 col-sm-5 pull-right"
			$scope.table_class = "col-md-12 col-lg-12 col-sm-5"
			//var session_type = $scope.session_type
			$scope.background_colour="events"
			$scope.table_heading =event_type+ " monthly event attendees" 
			$scope.chart_heading = "Data  by month"
			$scope.pie_date = "Apr 2017"
			$rootScope.canEdit_table=false
			$scope.gridOptions=[]
			$scope.gridOptions.data=[]
			var columnDefs= []
			$scope.filter_pie=[]
			
			columns=	
					{ field: 'stat',cellFilter:'valueFilter',name: "Statistic",width:300, pinnedLeft:true, enableColumnMoving:false  ,cellClass:dynamicTableCellFilter_retail}		
			
			columnDefs.push(columns	)
				dates=getDateService.getDate()
		$scope.start_date=dates[0]
		$scope.end_date=dates[1]
			
			columnDefs=columnDefs.concat(monthly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
			console.log('columnDefs',columnDefs)		
			$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
			
			$scope.options_list=[]
			//$scope.session_type="INDEPENDENT"
			option=[]
			option.name="INDEPENDENT"
			option.value="INDEPENDENT"
			$scope.options_list.push(option)
			option=[]
			option.name="FACILITATED"
			option.value="FACILITATED"
			$scope.options_list.push(option)
				
		
		get_data=function(event_type){
			console.log('get_data')
			Monthly_events.query({"event_type":event_type,cache:true}, function(team) {
				$scope.rows=[]
				$scope._rows=[]
				$scope.data_rows=[]
				_.each(team,function(row){
				if(row.museum!=""){	
					$scope._rows.push(row)
					if(row.stat=="age_group"){	
					$scope.data_rows.push(row)
				}					
				}
		
				})
			
		
			$scope.gridOptions.data=$scope._rows;
			$scope.gridOptions.enableFiltering=false
		
		
				yearly_totals.build($scope)
			yearly_percentage_difference.build($scope)
			
			
			make_a_line_chart.build($scope,columnDefs,"age_group")
	
			$scope.$watchGroup(['end_date','start_date'], function(newValue, oldValue) {
  
			columnDefs=[]
			columnDefs.push(columns
					
			)
			columnDefs=columnDefs.concat(monthly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
					$scope.gridOptions.columnDefs=columnDefs
					make_a_line_chart.build($scope,columnDefs,"age_group")
									
			
			
			});
	
			
		})	
		
		}
		
			get_data(event_type)
 $scope.$on('date:updated', function(event,data) {
					console.log(data)
					$scope.start_date=data[0]
					$scope.end_date=	data[1]	
			
				});
			
			$scope.changedValue = function(item){ 
					console.log('filter')		
					$scope.get_data(item)
			}
			
		
			
	}
		
}		
			







