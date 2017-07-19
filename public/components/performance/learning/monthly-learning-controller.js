exports.monthly_learning_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Monthly_learning,make_a_pie,make_a_line_chart,monthly_data_table_columns,grid_ui_settings,table_security
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
			{ field: 'session_type',		name: "Type",width:80, pinnedLeft:true, enableColumnMoving:false  },
			{ field: 'age_group',		name: "Age Group",width:180, pinnedLeft:true, enableColumnMoving:false  },
			{ field: 'stat',		name: "Statistic",width:80, pinnedLeft:true, enableColumnMoving:false  }		
			)
			
			$scope.start_date=new Date("01/04/2017")
			$scope.end_date=new Date("01/04/2018")
			columnDefs=columnDefs.concat(monthly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
			console.log('columnDefs',columnDefs)		
			$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
			
			$scope.options_list=[]
			$scope.session_type="INDEPENDENT"
			option=[]
			option.name="INDEPENDENT"
			option.value="INDEPENDENT"
			$scope.options_list.push(option)
			option=[]
			option.name="FACILITATED"
			option.value="FACILITATED"
			$scope.options_list.push(option)
				
		
			$scope.get_data=function(session_type){
			console.log('get_data')
			Monthly_learning.query({"session_type":session_type}, function(team) {
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
			
		
			make_a_line_chart.build($scope,columnDefs,"age_group")
	
			$scope.$watchGroup(['end_date','start_date'], function(newValue, oldValue) {
  
			columnDefs=[]
			columnDefs.push(
			{ field: 'museum',		name: "Museum",width:80, pinnedLeft:true, enableColumnMoving:false  },
			{ field: 'session_type',		name: "Type",width:80, pinnedLeft:true, enableColumnMoving:false  },
			{ field: 'age_group',		name: "Age Group",width:180, pinnedLeft:true, enableColumnMoving:false  },
			{ field: 'stat',		name: "Statistic",width:80, pinnedLeft:true, enableColumnMoving:false  }
					
			)
			columnDefs=columnDefs.concat(monthly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
					$scope.gridOptions.columnDefs=columnDefs
					make_a_line_chart.build($scope,columnDefs,"age_group")
									
			
			
			});
	
			
		})	
		
		}
		
			$scope.get_data("FACILITATED")

			
			$scope.changedValue = function(item){ 
					console.log('filter')		
					$scope.get_data(item)
			}
		
}				







