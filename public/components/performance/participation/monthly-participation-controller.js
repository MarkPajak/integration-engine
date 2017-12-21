exports.community_events_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Monthly_events,make_a_pie,make_a_line_chart,monthly_data_table_columns,grid_ui_settings,table_security
    ) {
		
		
		
		
			$scope.chart_class = "col-md-8 col-lg-8 col-sm-5 pull-right"
			$scope.table_class = "col-md-12 col-lg-12 col-sm-5"
			$scope.table_heading = "Monthly event figues"
			$scope.chart_heading = "Data  by month"
			$scope.pie_date = "Apr 2017"
			$rootScope.canEdit_table=false
			$scope.gridOptions=[]
			$scope.gridOptions.data=[]
			var columnDefs= []
		
			$scope.filter_pie=[]
			columnDefs.push(
			{ field: 'museum',		name: "Museum",width:80, pinnedLeft:true, enableColumnMoving:false  },
			{ field: 'on_off_site',		name: "Type",width:80, pinnedLeft:true, enableColumnMoving:false  },
			{ field: 'age_group',		name: "Age Group",width:80, pinnedLeft:true, enableColumnMoving:false  }
					
			)
			
			$scope.start_date=new Date("01/04/2017")
			$scope.end_date=new Date("01/04/2018")
			columnDefs=columnDefs.concat(monthly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
			console.log('columnDefs',columnDefs)		
			$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);

	
			$scope.museums  =[]
			$scope.selected_chart_stats=[]
			$scope.chart_stats=[]
			$scope.selected_museums=[]
			
			$scope.get_data=function(event_type){
			console.log('get_data')
			Monthly_events.query({"event_type":event_type}, function(team) {
		
				$scope.rows=[]
				$scope._rows=[]
				$scope.data_rows=[]
				_.each(team,function(row){
				if(row.museum!=""){	
					if($scope.museums.indexOf(row.museum)==-1){$scope.museums.push(row.museum)}
						if($scope.chart_stats.indexOf(row.museum)==-1){$scope.chart_stats.push(row.stat)}
						if($scope.selected_chart_stats.indexOf(row.museum)==-1){$scope.selected_chart_stats.push(row.stat)}
					$scope._rows.push(row)
					
					if(row.museum.indexOf('%')==-1){
					if($scope.selected_museums.indexOf(row.museum)==-1){$scope.selected_museums.push(row.museum)}	
						$scope.data_rows.push(row)
						
					}
				}
		
				})
			
		
			$scope.gridOptions.data=$scope._rows;
			
			make_a_pie.build($scope,"Apr 2017","museum")
			make_a_line_chart.build($scope,columnDefs,"museum")
	
			$scope.$watchGroup(['end_date','start_date'], function(newValue, oldValue) {
  
					columnDefs=[]
					columnDefs.push(
			{ field: 'museum',		name: "Museum",width:80, pinnedLeft:true, enableColumnMoving:false  },
			{ field: 'on_off_site',		name: "Type",width:80, pinnedLeft:true, enableColumnMoving:false  },
			{ field: 'age_group',		name: "Age Group",width:80, pinnedLeft:true, enableColumnMoving:false  }
					
			)
					columnDefs=columnDefs.concat(monthly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
					$scope.gridOptions.columnDefs=columnDefs
					make_a_line_chart.build($scope,columnDefs,"museum")
									
			
			
			});
	
			$scope.changedValue = function(item){ 
					$scope.pie_date=item			
					make_a_pie.build($scope,item,"museum")
						$scope.get_data(item)
			}
		})	
		}
		
			$scope.options_list=[]
			$scope.session_type="OFF SITE"
			option=[]
			option.name="OFF SITE"
			option.value="OFF SITE"
			$scope.options_list.push(option)
			option=[]
			option.name="ON SITE"
			option.value="ON SITE"
			$scope.options_list.push(option)
			$scope.get_data("OFF SITE")
			$scope.changedValue = function(item){ 
					console.log('filter')		
					$scope.get_data(item)
			}
}				







