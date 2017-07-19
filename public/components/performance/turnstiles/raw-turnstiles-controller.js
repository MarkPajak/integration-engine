exports.raw_turnstiles_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, day_turnstiles,data_table_reload,get_table_data,grid_ui_settings ,table_security
    ) {
		

		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		$scope.featured_collection=day_turnstiles
		$rootScope.featured_collection=day_turnstiles
		$scope.show_all_Button=true
		$scope.extraQuery = { "museum_id":"#"}
		
		var columnDefs= []
		

		columnDefs.push(
		    { field: 'museum_id' ,name: "Museum",resizable: true},
			{ field: 'exhibition' ,name: "Exhibition",resizable: true},
			{ field: 'date_value' ,value: "Date",resizable: true ,type: 'date', cellFilter: 'date:\'yyyy/MM/dd \''},
			{ field: 'visits' ,name: "Visits",resizable: true}

		)
			
		$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);			
		get_table_data.getData(moment(new Date()).subtract({'months':1})._d,$scope)
}				







