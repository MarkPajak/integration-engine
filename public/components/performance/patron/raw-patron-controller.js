

exports.raw_patron_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Raw_patron,data_table_reload,get_table_data,grid_ui_settings,make_a_pie,make_a_line_chart,monthly_data_table_columns,table_security
    ) {
		
		
		$scope.show_all_Button=true
		$scope.featured_collection=Raw_patron
		$rootScope.featured_collection=Raw_patron
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		$scope.extraQuery = { "type":"#","donation_box_no":"#"}
		
		var columnDefs= []
		

		$rootScope.canEdit_table=true
		 columnDefs.push(
			//{ field: 'type' ,name: "Museum",resizable: true,width:"150"},
			{ field: 'date_value' ,name: "Date",resizable: true ,type: 'date', cellFilter: 'date:\'dd/MM/yy\''},
			{ field: 'donation_box_amount' ,name:"Amount",resizable: true ,cellFilter:'currency:"&pound;" : 2'},
			//{ field: 'donation_box_no' ,resizable: true},
			
			{ field: 'comments' ,value: "comments",resizable: true,visible:true},
			{ field: 'logger_user_name' ,value: "Logged by",resizable: true,visible:false},
			{ field: 'date_logged', value: "Date logged" ,type: 'date', cellFilter: 'date:\'dd/MM/yy HH:mm\'',visible:false}
			)
			
			$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
			
			get_table_data.getData(moment(new Date()).subtract({'months':1})._d,$scope)
			
}				







