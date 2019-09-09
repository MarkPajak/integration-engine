

exports.raw_donations_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Raw_donations,data_table_reload,get_table_data,grid_ui_settings,make_a_pie,make_a_line_chart,monthly_data_table_columns,table_security
    ) {
		
		
		$scope.show_all_Button=true
		$scope.featured_collection=Raw_donations
		$rootScope.featured_collection=Raw_donations
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		$scope.extraQuery = { "museum_id":"#","donation_box_no":"#"}
		
		var columnDefs= []
		

		$rootScope.canEdit_table=true
		 columnDefs.push(
			{ field: 'museum_id' ,name: "Museum",resizable: true,width:"150"},
			{ field: 'date_value' ,name: "Date",resizable: true ,type: 'date', cellFilter: 'date:\'dd/MM/yy\''},
			{ field: 'donation_box_amount' ,name: "Amount (without gift aid)",resizable: true ,cellFilter:'currency:"&pound;" : 2'},
			{ field: 'gift_aid_donation_box_amount' ,name: "Gift aid amount", resizable: true ,cellFilter:'currency:"&pound;" : 2'},
			{ field: 'donation_box_no' ,resizable: true},
			{ field: 'no_envelopes' ,resizable: true},
			{ field: 'comments' ,value: "comments",resizable: true,visible:false},
			{ field: 'logger_user_name' ,value: "Logged by",resizable: true,visible:false},
			{ field: 'date_logged', value: "Date logged" ,type: 'date', cellFilter: 'date:\'dd/MM/yy HH:mm\'',visible:false}
			)
			
			$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
			
			get_table_data.getData(moment(new Date()).subtract({'months':1})._d,$scope)
			
}				







