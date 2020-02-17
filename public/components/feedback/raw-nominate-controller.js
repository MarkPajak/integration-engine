

exports.raw_nominate_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Raw_nominate,data_table_reload,get_table_data_nomusem,grid_ui_settings,make_a_pie,make_a_line_chart,monthly_data_table_columns,table_security
    ) {
		
		
		$scope.show_all_Button=true
		$scope.featured_collection=Raw_nominate
		$rootScope.featured_collection=Raw_nominate
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		$scope.extraQuery = { "type":"#","donation_box_no":"#"}
		
		var columnDefs= []
		

		$rootScope.canEdit_table=true
		 columnDefs.push(
			{ field: 'nomination_name' ,name: "name",resizable: true,width:"150"},
			{ field: 'kiosk' ,name: "kiosk",resizable: true,width:"150"},
			{ field: 'reason' ,name: "reason",resizable: true,width:"300"},
			{ field: 'date' ,name: "Date",resizable: true ,type: 'date', cellFilter: 'date:\'dd/MM/yy\''}
			

			
			)
			
			$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
			
			get_table_data_nomusem.getData(moment(new Date()).subtract({'months':1})._d,$scope,true)
			
}				







