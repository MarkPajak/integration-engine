exports.raw_welcomedesk_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Raw_welcomedesk,data_table_reload,get_table_data,grid_ui_settings ,table_security
    ) {
		
		$scope.show_all_Button=true
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		$scope.featured_collection=Raw_welcomedesk
		$rootScope.featured_collection=Raw_welcomedesk
		var columnDefs= []
		$rootScope.canEdit_table=true
		$scope.show_all_Button=true
	  

		 columnDefs.push(
			{ field: 'museum_id' ,name: "Museum",resizable: true,width:"150"},
			{ field: 'date_value' ,name: "Date",resizable: true ,type: 'date', cellFilter: 'date:\'dd/MM/yy\''},
			{ field: 'cash' ,name: "Cash",resizable: true,cellFilter:'currency:"&pound;" : 2'},
			{ field: 'card' ,name: "Card",resizable: true,cellFilter:'currency:"&pound;" : 2'},
			{ field: 'no_transactions' ,name: "No. of transactions",resizable: true},
			{ field: 'no_giftaid_envelopes' ,name: "No. of gift aid envelopes",resizable: true},
			{ field: 'giftaid_amount' ,name: "Gift aid amount",resizable: true,cellFilter:'currency:"&pound;" : 2'},
			{ field: 'total' ,name: "Total",resizable: true},
			{ field: 'total_inc_giftaid' ,name: "Total inc. gift aid",resizable: true},
			{ field: 'comments' ,name: "Comments",value: "comments",resizable: true,visible:false},
			{ field: 'logger_user_name' ,value: "Logged by",resizable: true,visible:false},
			{ field: 'date_logged', value: "Date logged" ,type: 'date', cellFilter: 'date:\'dd/MM/yy HH:mm\'',visible:false}
			)
			
			$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
			get_table_data.getData(moment(new Date()).subtract({'months':1})._d,$scope)


			
}				







