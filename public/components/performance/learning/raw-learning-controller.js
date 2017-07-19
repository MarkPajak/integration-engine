exports.raw_learning_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Raw_learning,data_table_reload,AuthService,grid_ui_settings,get_table_data,table_security
    ) {
		
	
		$scope.show_all_Button=true
		$scope.featured_collection=Raw_learning
		$scope.table_class = "col-md-12 col-lg-12 col-sm-5"
		$rootScope.featured_collection=Raw_learning
		$rootScope.canEdit_table=true
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		var columnDefs= []
		
		$scope.extraQuery = { "session_type":"#", "age_group":"#"}
		
	

		 columnDefs.push(
			{ field: 'museum_id' ,name: "Museum",resizable: true,width:90},
			{ field: 'session_type' ,name: "Type",resizable: true,width:90},
			
			{ field: 'date_value' ,name: "Week beginning",resizable: true ,type: 'date', cellFilter: 'date:\'dd/MM/yy\'',width:90},
			{ field: 'age_group',name: "Age" ,resizable: true,width:200},
			{ field: 'total_sessions',name: "No. sessions" ,resizable: true,width:100},
			{ field: 'total_children',name: "No. children" ,resizable: true,width:100},
			{ field: 'total_teachers' ,name: "No. teachers",resizable: true,width:100},
			{ field: 'total_income' ,name: "Total income",resizable: true,width:100,cellFilter:'currency:"&pound;" : 2'},
		
			{ field: 'comments' ,value: "comments",resizable: true,visible:true},
			{ field: 'logger_user_name' ,value: "Logged by",resizable: true,visible:true},
			{ field: 'date_logged', value: "Date logged" ,type: 'date', cellFilter: 'date:\'dd/MM/yy HH:mm\'',visible:true}
			)
			
				$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
			get_table_data.getData(moment(new Date()).subtract({'months':1})._d,$scope)
}			







