exports.raw_teg_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Raw_teg,data_table_reload,get_table_data,grid_ui_settings ,$rootScope,table_security
    ) {
		
		$scope.table_class="col-md-10 col-lg-10 col-sm-10 full-height"
		$scope.show_all_Button=true
		$scope.featured_collection=Raw_teg
		$rootScope.featured_collection=Raw_teg
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		var columnDefs= []
		$rootScope.canEdit_table=true
		 columnDefs.push(
		 
			{ field: 'museum_id' ,name: "Museum",resizable: true,width:"150"},
			{ field: 'date_value' ,name: "Date",resizable: true ,type: 'date', cellFilter: 'date:\'dd/MM/yy\''},
			{ field: 'value'  ,name: "Visitors",resizable: true},
			{ field: 'comments' ,value: "comments",resizable: true,visible:false},
			{ field: 'logger_user_name' ,value: "Logged by",resizable: true,visible:false},
			{ field: 'date_logged', value: "Date logged" ,type: 'date', cellFilter: 'date:\'dd/MM/yy HH:mm\'',visible:false}
		)
			
		
			$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
			get_table_data.getData(moment(new Date()).subtract({'months':1})._d,$scope)
}			







