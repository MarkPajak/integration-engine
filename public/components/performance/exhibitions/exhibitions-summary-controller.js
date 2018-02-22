exports.exhibitions_summary_controller = function(monthly_data_table_columns,$route,$scope, $http, $q, $routeParams, $location,$rootScope,Emu_events,grid_ui_settings)
     {
		
	
			$scope.chart_class = "col-md-8 col-lg-8 col-sm-5 pull-right"
			$scope.table_class = "col-md-6 col-lg-6 col-sm-6 pull-right"
			$scope.table_heading = "Exhibition dates"
			$scope.chart_heading = "Data  by month"
			$scope.gridOptions=[]
			$scope.gridOptions.data=[]
			var columnDefs= []
			$scope.start_date=new Date("01/04/2017")
			$scope.end_date=new Date("01/04/2018")
			$scope.filter_pieSelected=[]
		
			
			
			build_report = function(){
			
			$scope.filter_pie=[]
			
			columnDefs.push(
				{ field: 'name',		name: "Name",width:350, pinnedLeft:true, enableColumnMoving:false },
				{ field: 'venue',		name: "Venue",width:110, pinnedLeft:true, enableColumnMoving:false },
				{ field: 'event_space',		name: "Gallery",width:110, pinnedLeft:true, enableColumnMoving:false },
				{ field: 'startDate',		name: "Start",width:100, pinnedLeft:true, enableColumnMoving:false },
				{ field: 'endDate',		name: "End",width:100, pinnedLeft:true, enableColumnMoving:false }
			)

			 Emu_events.getData().then(function(response){
	
							$scope._rows=[]
						  $scope.options_list = [];
							_.each(response,function(event){
								if(event.type=="Exhibition" && new Date(event.startDate)>=$scope.start_date ){	
										$scope.options_list.push(event)
										$scope._rows.push(event)
										console.log(event)
								}
							})

							$scope.gridOptions.data=$scope._rows;
							$scope.gridOptions.columnDefs=columnDefs
			 });

		

			}	
			
				$scope.$watchGroup(['end_date','start_date'], function(newValue, oldValue) {
  
					build_report()		
			
			
			});


			
}






