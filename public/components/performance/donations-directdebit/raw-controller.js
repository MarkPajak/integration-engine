

exports.raw_directdebit_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Raw_donations_directdebit,data_table_reload,get_table_data_nomusem_notype,grid_ui_settings,make_a_pie,make_a_line_chart,monthly_data_table_columns,table_security
    ) {
		
		
		$scope.show_all_Button=true
		$scope.featured_collection=Raw_donations_directdebit
		$rootScope.featured_collection=Raw_donations_directdebit
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		$scope.extraQuery = {}
		
		var columnDefs= []
		

		$rootScope.canEdit_table=true
		 columnDefs.push(
	
			{ field: 'date_value' ,name: "Date",resizable: true ,type: 'date', cellFilter: 'date:\'dd/MM/yy\''},
			{ field: 'amount' ,resizable: true ,cellFilter:'currency:"&pound;" : 2'},
			{ field: 'gift_aid_amount' ,resizable: true ,cellFilter:'currency:"&pound;" : 2'},
			
			
			{ field: 'comments' ,value: "comments",resizable: true,visible:false},
			{ field: 'logger_user_name' ,value: "Logged by",resizable: true,visible:false},
			{ field: 'date_logged', value: "Date logged" ,type: 'date', cellFilter: 'date:\'dd/MM/yy HH:mm\'',visible:false}
			)
			
			$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);

			console.log('get_table_data_nomusem_notype')
			get_table_data_nomusem_notype.getData(moment(new Date()).subtract({'months':1})._d,$scope,true)
			
}				







