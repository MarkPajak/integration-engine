exports.standard_monthly_kpi_events_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope,Monthly_standard_kpi_events,make_a_pie,make_a_line_chart,monthly_data_table_columns,grid_ui_settings,table_security,dynamicTableCellFilter_retail
    ) {
		
		
		


			$scope.chart_class = "col-md-8 col-lg-8 col-sm-5 pull-right"
			$scope.table_class = "col-md-12 col-lg-12 col-sm-5"
			//var session_type = $scope.session_type
			$scope.background_colour="events"
			$scope.table_heading =$scope.user.team+ " monthly kpis" 
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
			
			$scope.start_date=new Date("04/01/2018")
			$scope.end_date= moment($scope.start_date).add('years', 1).format("DD/MM/YYYY")
			
			
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
				
		
		get_data=function(){
		
			Monthly_standard_kpi_events.query( { "team_id":$scope.user.team,"kpi_type":"#"}, function(team) {
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
		
			get_data()

			
			$scope.changedValue = function(item){ 
					console.log('filter')		
					$scope.get_data(item)
			}
			
		
	
	
}				







