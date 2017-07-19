exports.raw_retail_sales_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Retail_sales,data_table_reload,AuthService,get_table_data,grid_ui_settings ,table_security
    ) {
		
		$scope.table_class="col-md-6 col-lg-6 col-sm-6 full-height"
		$scope.featured_collection=Retail_sales
		$rootScope.featured_collection=Retail_sales
		$scope.show_all_Button=true
		$scope.gridOptions=[]
		$scope.gridOptions.data='__data'
		var columnDefs= []
		$rootScope.canEdit_table=true

		
		
		
		 columnDefs.push(
			{ field: 'museum_id' ,name: "Museum",resizable: true,width:"70"},
			{ field: 'date_value' ,name: "Date",resizable: true ,type: 'date', cellFilter: 'date:\'dd/MM/yyyy\''},
			{ field: 'total_sales' ,resizable: true,cellFilter: 'currency:"&pound;" : 2'},
			{ field: 'non_vat_sales' ,resizable: true,cellFilter: 'currency:"&pound;" : 2'},
			{ field: 'net_sales' ,resizable: true,cellFilter: 'currency:"&pound;" : 2'},
			{ field: 'no_transactions' ,resizable: true},
			{ field: 'average_transaction' ,resizable: true,cellFilter: 'currency:"&pound;" : 2'},
			{ field: 'comments' ,name: "comments",resizable: true,visible:false},
			{ field: 'logger_user_name' ,name: "Logged by",resizable: true,visible:false},
			{ field: 'date_logged', name: "Date logged" ,type: 'date', cellFilter: 'date:\'dd/MM/yy HH:mm\'',visible:false}
			)
		
			$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
			get_table_data.getData(moment(new Date()).subtract({'months':1})._d,$scope)



}










