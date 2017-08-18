

exports.raw_equipment_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Resources,data_table_reload,get_table_data,grid_ui_settings,make_a_pie,make_a_line_chart,monthly_data_table_columns,table_security
    ) {
		
		
		$scope.show_all_Button=true
		$scope.featured_collection=Resources
		$rootScope.featured_collection=Resources
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		$scope.extraQuery = { "museum_id":"#","type":"equipment"}
		
		var columnDefs= []
		

		$rootScope.canEdit_table=true
		 columnDefs.push(
		 
		 	{ field: 'asset_no' ,name: "asset_no",resizable: true,width:"150"},	
			{ field: 'asset_type' ,name: "Type",resizable: true,width:"150"},	
			{ field: 'asset_name' ,name: "Device",resizable: true,width:"150"},			
			{ field: 'description' ,name: "description",resizable: true,width:"150"},	
			{ field: 'location' ,name: "location",resizable: true,width:"150"},
			
			{ field: 'model_no' ,name: "model_no",resizable: true,width:"150"},
			{ field: 'serial_no' ,name: "serial_no",resizable: true,width:"150"},
			{ field: 'label_location' ,name: "label_location",resizable: true,width:"150"},
			{ field: 'label_notes' ,name: "label_notes",resizable: true,width:"150"},

			{ field: 'comments' ,value: "comments",resizable: true,visible:false},
			{ field: 'logger_user_name' ,value: "Logged by",resizable: true,visible:false},
			{ field: 'date_logged', value: "Date logged" ,type: 'date', cellFilter: 'date:\'dd/MM/yy HH:mm\'',visible:false}
			
			
			
			
			)
			
			$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
			
			get_table_data.getData(moment(new Date()).subtract({'months':1})._d,$scope)
			
}				







