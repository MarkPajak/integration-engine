

exports.raw_donations_kiosk_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Raw_donations_kiosk,data_table_reload,get_table_data,grid_ui_settings,make_a_pie,make_a_line_chart,monthly_data_table_columns,table_security
    ) {
		
		
		$scope.show_all_Button=true
		$scope.featured_collection=Raw_donations_kiosk
		$rootScope.featured_collection=Raw_donations_kiosk
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		$scope.extraQuery = { "museum_id":"#","type":"#"}
		
		var columnDefs= []
		

		$rootScope.canEdit_table=true
		 columnDefs.push(
			{ field: 'museum_id' ,name: "Museum",resizable: true,width:"150"},
			{ field: 'kiosk_alias' ,resizable: true,width:"150"},
			
			{ field: 'date_value' ,name: "Date",resizable: true ,type: 'date', cellFilter: 'date:\'dd/MM/yy\''},
			{ field: 'donation_amount' ,resizable: true ,cellFilter:'currency:"&pound;" : 2'},
			{ field: 'gift_aided' ,resizable: true,type: 'boolean', },
			{ field: 'amount_including_gift_aid' ,resizable: true ,cellFilter:'currency:"&pound;" : 2'},
			
			
			{ field: 'comments' ,value: "comments",resizable: true,visible:false},
			{ field: 'logger_user_name' ,value: "Logged by",resizable: true,visible:false},
			{ field: 'date_logged', value: "Date logged" ,type: 'date', cellFilter: 'date:\'dd/MM/yy HH:mm\'',visible:false}
			)
			
			$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
			
			get_table_data.getData(moment(new Date()).subtract({'months':1})._d,$scope)
			
}				







