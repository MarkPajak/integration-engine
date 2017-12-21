exports.raw_events_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Raw_events,data_table_reload,AuthService,grid_ui_settings,get_table_data,table_security
    ) {
		
		$scope.table_class="col-md-12 col-lg-12col-sm-12 full-height"
		$scope.show_all_Button=true
		$scope.featured_collection=Raw_events
		$rootScope.featured_collection=Raw_events
		$rootScope.canEdit_table=true
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		$scope.extraQuery = { "on_site_off_site":"#"}
		var columnDefs= []
	  $scope.moused = function(){console.log("moused over");}

		 columnDefs.push(
			{ field: 'museum_id' ,name: "Museum",resizable: true,width:100},
			{ field: 'date_value' ,name: "Week beginning",resizable: true ,type: 'date', cellFilter: 'date:\'dd/MM/yy\'',width:90},
			{ field: 'on_site_off_site',name: "Site" ,resizable: true,width:100},
			{ field: 'event_lead',name: "Event Lead" ,resizable: true,width:140},		
			{ field: 'event_name',name: "Name of Event" ,resizable: true,width:250},	
			{ field: 'community_group',name: "Community Group" ,resizable: true,width:250},	
			
			
			{ field: 'under_5',name: "Under 5s" ,resizable: true,width:100,Editable:false},	
			{ field: '_5_15',name: "5 - 15" ,resizable: true,width:100,Editable:false},	
			{ field: '_16_over',name: "Adults 16+" ,resizable: true,width:100,Editable:false},	
			
			
			{ field: 'count',name: "Total" ,resizable: true,width:100,Editable:false},	
			{ field: 'logger_user_name' ,value: "Logged by",resizable: true,visible:false},
			{ field: 'date_logged', value: "Date logged" ,type: 'date', cellFilter: 'date:\'dd/MM/yy HH:mm\'',visible:false}
			)
			
				$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
				get_table_data.getData(moment(new Date()).subtract({'months':1})._d,$scope)
}			







