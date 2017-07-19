exports.raw_exhibitions_pwyt_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Raw_exhibitions_pwyt,data_table_reload,get_table_data,grid_ui_settings ,	table_security
    ) {
		
		
		$scope.show_all_Button=true
		$scope.featured_collection=Raw_exhibitions_pwyt
		$rootScope.featured_collection=Raw_exhibitions_pwyt
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		var columnDefs= []
		$scope.extraQuery = { "donation_box_no":"#"}

		/*

			total_sales: { type: Number},
			non_vat_sales: { type: Number},
			net_sales: { type: Number},
			no_transactions: { type: Number},
		*/			

$rootScope.canEdit_table=true
		 columnDefs.push(
			{ field: 'museum_id' ,name: "Museum",resizable: true,width:"130"},
			{ field: 'date_value' ,name: "Date",resizable: true ,type: 'date', cellFilter: 'date:\'dd/MM/yy\''},
			{ field: 'donation_box_amount' ,resizable: true,cellFilter:'currency:"&pound;" : 2'},
			{ field: 'donation_box_no' ,resizable: true},
			{ field: 'no_envelopes' ,resizable: true},
			//{ field: 'non_vat_sales' ,resizable: true},
			//{ field: 'net_sales' ,resizable: true},
			//{ field: 'no_transactions' ,resizable: true},
			//{ field: 'average_transaction' ,resizable: true},
			{ field: 'comments' ,value: "comments",resizable: true,visible:false},
			{ field: 'logger_user_name' ,value: "Logged by",resizable: true,visible:false},
			{ field: 'date_logged', value: "Date logged" ,type: 'date', cellFilter: 'date:\'dd/MM/yy HH:mm\'',visible:false}
			)
			
			
				
		$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
			get_table_data.getData(moment(new Date()).subtract({'months':1})._d,$scope)
}				







