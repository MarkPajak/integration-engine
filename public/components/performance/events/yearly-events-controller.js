exports.yearly_events_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Yearly_events,make_a_pie,make_a_line_chart,yearly_data_table_columns,grid_ui_settings,table_security
    ) {
		
		$scope.table_class="col-md-4 col-lg-4 col-sm-5"
		$scope.monthWeek='month'
		$scope.show_all_Button=false
		console.log('controller go')
		$scope.table_heading = "Yearly stats"
		$scope.pie_date = "Apr 2017"
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		$rootScope.canEdit_table=false
		var columnDefs= []
			$scope.filter_pie=[]
			columnDefs.push(
			{ field: 'museum',		name: "Museum",width:80, pinnedLeft:true, enableColumnMoving:false  },
			{ field: 'on_off_site',		name: "Type",width:80, pinnedLeft:true, enableColumnMoving:false  },
			{ field: 'age_group',		name: "Age Group",width:80, pinnedLeft:true, enableColumnMoving:false  }
					
			)
			$scope.start_date=new Date("01/04/2017")
			$scope.end_date=new Date("01/04/2018")
			columnDefs=columnDefs.concat(yearly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
			console.log('columnDefs',columnDefs)		
			$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
		 console.log('getData')	
			Yearly_events.query({}, function(team) {
				$scope.rows=[]
				$scope.data_rows=[]
				$scope._rows=[]
				_.each(team,function(row){
					console.log(row)
					if(row.museum!=""){
					$scope._rows.push(row)
					if(row.stat=="count"){
					
						console.log("count")
						$scope.data_rows.push(row)
						
					}}
			
					
							
				})
			
			$scope.gridOptions.data=$scope._rows;
			
			_.each([2016,2017],function(year){
				_.each(moment.monthsShort(),function(month){				
						$scope.filter_pie.push({value:month+" "+year,name:month+" "+year})
					
				})
			})
			make_a_pie.build($scope,"Apr 2017","museum")
			make_a_line_chart.build($scope,columnDefs,"museum","count")
			$scope.changedValue = function(item){ 
					$scope.pie_date=item			
					make_a_pie.build($scope,item,"museum")
			}
			$scope.$watchGroup(['end_date','start_date'], function(newValue, oldValue) {
  
					columnDefs=[]
					columnDefs.push({ field: 'museum',		name: "Museum",width:80, pinnedLeft:true, enableColumnMoving:false  },
			{ field: 'on_off_site',		name: "Type",width:80, pinnedLeft:true, enableColumnMoving:false  },
			{ field: 'age_group',		name: "Age Group",width:80, pinnedLeft:true, enableColumnMoving:false  }
					)
					columnDefs=columnDefs.concat(yearly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
					$scope.gridOptions.columnDefs=columnDefs
					make_a_line_chart.build($scope,columnDefs,"museum","count")
			
			
			
			});
		})	
}				







