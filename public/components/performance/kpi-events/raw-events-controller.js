	


exports.raw_kpi_events_controller = function($route,$scope, AuthService,get_table_data_team,$http, $q, $routeParams, $location,$rootScope, Raw_kpi_events,data_table_reload,AuthService,grid_ui_settings,table_security
    ) {
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		$scope.table_class="col-md-5 col-5-12col-sm-5"
		$scope.show_all_Button=true
	
 // AuthService.isLoggedIn().then(function(user){
	
		
		
		$scope.featured_collection=Raw_kpi_events
		$rootScope.featured_collection=Raw_kpi_events
		$scope.table_heading = "Raw data (editable)"
		$rootScope.canEdit_table=true
	
		
		var teamfilter = $scope.user.team
		console.log('teamfilter',teamfilter)
		if($scope.user.group=="ADMIN") teamfilter ="#"
		
		$scope.extraQuery = { "team_id":teamfilter,"kpi_type":"#"}
		var columnDefs= []
	  $scope.moused = function(){console.log("moused over");}

		 columnDefs.push(
			{ field: 'team_id' ,name: "Team",resizable: true,width:150},
			{ field: 'kpi_type' ,name: "KPI Type",resizable: true,width:150,Editable:false},
			{ field: 'event_name',name: "Name of Event" ,resizable: true,width:250},	
			{ field: 'date_value_end' ,name: "End Date",resizable: true ,type: 'date', cellFilter: 'date:\'dd/MM/yy\'',width:200},
			{ field: 'no_sessions',name: "KPI value" ,resizable: true,width:100},
			{ field: 'no_visits',name: "No. participants" ,resizable: true,width:100},			
			{ field: 'no_enquiries',name: "No. Enquiries" ,resizable: true,width:100},				
			{ field: 'income',name: "Income" ,resizable: true,width:100,cellFilter:'currency:"&pound;" : 2'},
			{ field: 'comments' ,value: "comments by",resizable: true,visible:false},
			{ field: 'count',name: "Total" ,resizable: true,width:100,Editable:false},	
			{ field: 'logger_user_name' ,value: "Logged by",resizable: true,visible:false},
			{ field: 'date_logged', value: "Date logged" ,type: 'date', cellFilter: 'date:\'dd/MM/yy HH:mm\'',visible:false}
			)
			
			$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
			get_table_data_team.getData(moment(new Date()).subtract({'months':10000})._d,$scope)
				
				
			$scope.$watch('changed', function (newValue) {
				if(newValue>0){
					
					
					
					
					
					
					get_table_data_team.getData(moment(new Date()).subtract({'months':100000})._d,$scope)
					$scope.tableChanged++
				}				
  //})

})
	

	}

			







