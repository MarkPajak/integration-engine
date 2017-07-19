exports.raw_events_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Raw_events,data_table_reload,AuthService,grid_ui_settings,get_table_data,table_security
    ) {
		
	
		$scope.show_all_Button=true
		$scope.featured_collection=Raw_events
		$rootScope.featured_collection=Raw_events
		$rootScope.canEdit_table=true
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		$scope.extraQuery = { "on_site_off_site":"#"}
		var columnDefs= []
	

		 columnDefs.push(
			{ field: 'museum_id' ,name: "Museum",resizable: true,width:90},
			{ field: 'date_value' ,name: "Week beginning",resizable: true ,type: 'date', cellFilter: 'date:\'dd/MM/yy\'',width:90},
			{ field: 'on_site_off_site',name: "Site" ,resizable: true,width:40},
			{ field: 'event_lead',name: "Event Lead" ,resizable: true,width:200},
			{ field: 'age_groups',name: "Age Groups" ,resizable: true,width:200},
			{ field: 'target_groups',name: "Target Groups" ,resizable: true,width:200},
			{ field: 'event_name',name: "Name of Event" ,resizable: true,width:200},			
			{ field: 'comments' ,value: "comments",resizable: true,visible:true},
			{ field: 'logger_user_name' ,value: "Logged by",resizable: true,visible:true},
			{ field: 'date_logged', value: "Date logged" ,type: 'date', cellFilter: 'date:\'dd/MM/yy HH:mm\'',visible:true}
			)
			
				$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
				get_table_data.getData(moment(new Date()).subtract({'months':1})._d,$scope)
}			







