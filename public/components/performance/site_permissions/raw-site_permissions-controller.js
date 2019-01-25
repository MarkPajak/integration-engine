

exports.raw_site_permissions_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Raw_site_permissions,data_table_reload,get_table_data_nomusem,grid_ui_settings,make_a_pie,make_a_line_chart,monthly_data_table_columns,table_security
    ) {
		
		
		$scope.show_all_Button=true
		$scope.featured_collection=Raw_site_permissions
		$rootScope.featured_collection=Raw_site_permissions
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		$scope.extraQuery = { "type":"#","donation_box_no":"#"}
		
		var columnDefs= []
		

		$rootScope.canEdit_table=true
		 columnDefs.push(
			
			{ field: 'date_value' ,name: "Date",resizable: true ,type: 'date', cellFilter: 'date:\'dd/MM/yy\''},
			{ field: 'no_events' ,name: "no_events",resizable: true },
			{ field: 'no_cancelled_events' ,name: "no_cancelled_events",resizable: true },
			{ field: 'audience_figures' ,name: "audience_figures",resizable: true },
			{ field: 'income_bcc' ,name: "income_bcc",resizable: true ,cellFilter:'currency:"&pound;" : 2'},
			{ field: 'income_site_permissions' ,name: "income_site_permissions",resizable: true ,cellFilter:'currency:"&pound;" : 2'},
			{ field: 'income_remaining' ,name: "income_remaining",resizable: true ,cellFilter:'currency:"&pound;" : 2'},

			
			{ field: 'comments' ,value: "comments",resizable: true,visible:true},
			{ field: 'logger_user_name' ,value: "Logged by",resizable: true,visible:false},
			{ field: 'date_logged', value: "Date logged" ,type: 'date', cellFilter: 'date:\'dd/MM/yy HH:mm\'',visible:false}
			)
			
			$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
			
			get_table_data_nomusem.getData(moment(new Date()).subtract({'months':1})._d,$scope,true)
			
}				







