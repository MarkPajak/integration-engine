exports.raw_venue_hire_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Raw_venue_hire,data_table_reload,make_a_pie,make_a_line_chart,monthly_data_table_columns,grid_ui_settings,get_table_data,table_security
    ) {
		
		
		$scope.table_class="col-md-6 col-lg-6 col-sm-1 full-height"
		$scope.featured_collection=Raw_venue_hire
		$rootScope.featured_collection=Raw_venue_hire
		$scope.show_all_Button=true
		$scope.gridOptions=[]
		$scope.gridOptions.data='__data'
		var columnDefs= []
		$rootScope.canEdit_table=true
$scope.start=new Date("04/01/2018")
			$scope.end_date= moment($scope.start_date).add('years', 1).format("DD/MM/YYYY")
			
		columnDefs.push(
		
			{ field: 'museum_id' ,name: "Museum",resizable: true,enableFiltering: true,},
			{ field: 'booking_type' ,name: "Booking type",resizable: true,visible:true},
			{ field: 'income_source' ,name: "Source",resizable: true,visible:true},
			{ field: 'value' ,resizable: true,cellFilter: 'currency:"&pound;" : 2'},
			{ field: 'date_value' ,name: "Date",resizable: true ,type: 'date', cellFilter: 'date:\'dd/MM/yyyy\''},
			{ field: 'comments' ,name: "comments",resizable: true,visible:false},
			{ field: 'logger_user_name' ,name: "Logged by",resizable: true,visible:true},
			{ field: 'date_logged', name: "Date logged" ,type: 'date', cellFilter: 'date:\'dd/MM/yyyy HH:mm\'',visible:false}
		)
			
		$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
		
		get_table_data.getData(moment(new Date()).subtract({'months':1})._d,$scope)


	



}				







