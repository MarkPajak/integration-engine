exports.raw_operations_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Raw_operations,data_table_reload,get_table_data,grid_ui_settings ,$rootScope,table_security
    ) {
		
		$scope.table_class="col-md-6 col-lg-6 col-sm-6 full-height"
		$scope.show_all_Button=true
		$scope.featured_collection=Raw_operations
		$rootScope.featured_collection=Raw_operations
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		var columnDefs= []
		$rootScope.canEdit_table=true
		 columnDefs.push(
		 
			{ field: 'museum_id' ,name: "Museum",resizable: true,width:"150"},
			{ field: 'no_complaints' ,name: "no_complaints",resizable: true,width:"150"},
			{ field: 'health_and_safety_forms' ,name: "health_and_safety_forms",resizable: true,width:"150"},
			{ field: 'date_value' ,name: "Date",resizable: true ,type: 'date', cellFilter: 'date:\'dd/MM/yy\''},
			{ field: 'value'  ,name: "Visitors",resizable: true,cellFilter: 'currency:"£" : 5' },
			{ field: 'comments' ,value: "comments",resizable: true,visible:false},
			{ field: 'logger_user_name' ,value: "Logged by",resizable: true,visible:false},
			{ field: 'date_logged', value: "Date logged" ,type: 'date', cellFilter: 'date:\'dd/MM/yy HH:mm\'',visible:false}
		)
			
		
			$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
			get_table_data.getData(moment(new Date()).subtract({'months':1})._d,$scope)
}			







