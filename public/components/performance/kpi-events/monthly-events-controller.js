exports.monthly_kpi_events_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope,Monthly_kpi_events,make_a_pie,make_a_line_chart,monthly_data_table_columns,grid_ui_settings,table_security
    ) {
		
		
		
		
			$scope.chart_class = "col-md-6 col-lg-6 col-sm-6 pull-right"
			$scope.table_class = "col-md-6 col-lg-6 col-sm-6"
			$scope.table_heading = "Monthly kpi stats (automatically calulated)"
			$scope.chart_heading = "Data  by month"
			$scope.pie_date = "Apr 2017"
			$rootScope.canEdit_table=false
			$scope.gridOptions=[]
			$scope.gridOptions.data=[]
			var columnDefs= []
			$scope.extraQuery = { "team_id":$scope.user.team,"kpi_type":"#"}
			$scope.filter_pie=[]
			columnDefs.push(
			{ field: 'date',		name: "Date",width:80, pinnedLeft:true, enableColumnMoving:false  }//,
			//{ field: 'kpi_type',		name: "Type",width:80, pinnedLeft:true, enableColumnMoving:false  },
			//{ field: 'income',		name: "income",width:80, pinnedLeft:true, enableColumnMoving:false  },
			//{ field: 'no_people',		name: "No. people",width:80, pinnedLeft:true, enableColumnMoving:false  },
			//{ field: 'no_enquiries',		name: "No. enquiries",width:80, pinnedLeft:true, enableColumnMoving:false  }
		//	{ field: 'value',		name: "value",width:80, pinnedLeft:true, enableColumnMoving:false  }
					
			)
			
			$scope.start_date=new Date("01/04/2018")
			$scope.end_date=new Date("01/04/2019")
			
			
			
			
			console.log('columnDefs',columnDefs)		
		

		

	
			$scope.teams  =[]
			$scope.selected_chart_stats=[]
			$scope.chart_stats=[]
			$scope.selected_teams=[]
			$scope.data_columns=[]
			
			$scope.data_columns.push("date")
			
			$scope.get_data=function(event_type){
			console.log('get_data')
			Monthly_kpi_events.query( { "team_id":$scope.user.team,"kpi_type":"#"}, function(team) {
		console.log('team',team)
				$scope.rows=[]
				$scope._rows=[]
				$scope.columns=[]
				$scope.data_rows=[]
		
				
				
			start=moment($scope.start_date).year()
			end=moment($scope.end_date).year()					
			for (year = start; year <= end; year++) { 
				_.each(moment.monthsShort(),function(month){
				
				var month_year = month+" "+year
				column_data = { "date":month_year}
				
						
								
								
							
								
								
								_.each(team,function(row){
								
									if(row.team!=""){
										if($scope.teams.indexOf(row.team)==-1){$scope.teams.push(row.team)}
										//$scope._rows.push(row)
										if(row.team.indexOf('%')==-1){
											if($scope.selected_teams.indexOf(row.team)==-1){$scope.selected_teams.push(row.team)}	
											
											
											var keys = Object.keys(row);
											$scope.data_rows.push(row)
											
											var heading_name = row.kpi_type
											
										if($scope.columns.indexOf(heading_name)==-1 && heading_name!="team"){
										
												$scope.columns.push(heading_name)
												heading ={ field:heading_name,	name:heading_name,width:150 } 
												
												if(heading_name=="total_income") {
													heading.cellFilter='currency:"&pound;" : 2' 
												}
												
												
												columnDefs.push(heading)
										}	
												
												
												column_data[heading_name]=row[month_year]
												//column_data.income=row.income
												//column_data.no_people=row.no_people
												//column_data.no_enquiries=row.no_enquiries
												
												
										//}
										}
								}
		
								})
						
						console.log('column_data',column_data)
						
						$scope._rows.push(column_data)	
					
					})
			}
			
			console.log('team $scope._rows',$scope._rows)
			$scope.gridOptions.data=$scope._rows;

		
			
			
			$scope.changedValue = function(item){ 
					$scope.pie_date=item			
					make_a_pie.build($scope,item,"team")
						$scope.get_data(item)
			}
		})	
		}
		
		
			
			$scope.$watch('changed', function (newValue) {
					if(newValue>0){
						$scope.get_data()
					}
				
				})
				
				$scope.$watch('tableChanged', function (newValue) {
					
					if(newValue>0){
						$scope.get_data()
					}
				
				})
				
		$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
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







