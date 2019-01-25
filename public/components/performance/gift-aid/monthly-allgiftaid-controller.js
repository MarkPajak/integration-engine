exports.monthly_all_giftaid_controller = function(getDateService,$route,$scope, $http, $q, $routeParams,monthly_data_table_columns_retail, dynamicTableCellFilter_donations,$location,$rootScope, Monthly_all_giftaid,grid_ui_settings,table_security) {
		

	console.log('controller go')
	//console.log($route.routes)
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
					dates=getDateService.getDate()
		$scope.start_date=dates[0]
		$scope.end_date=dates[1]
		var columnDefs= []
			$scope.table_heading = "Welcome desk and donations gift aid"
		$rootScope.canEdit_table=false
			var columnDefs= []
			$scope.filter_pie=[]
			columnDefs.push(
			{ field: 'museum',	cellFilter:'valueFilter',	name: "Museum",width: "100", pinnedLeft:true,cellClass:dynamicTableCellFilter_donations}///,
		//	{ field: 'stat',	cellFilter:'valueFilter',	name: "Statistic",width: "300", pinnedLeft:true,cellClass:dynamicTableCellFilter_donations}
					
			)

		 	columnDefs=columnDefs.concat(monthly_data_table_columns_retail.build($scope,$scope.start_date,$scope.end_date))
			console.log('columnDefs',columnDefs)		

			
	$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);

		 console.log('getData')	
			Monthly_all_giftaid.query({}, function(team) {
				$scope.rows=[]
				$scope._rows=[]
				_.each(team,function(row){
					console.log(row)
					$scope._rows.push(row)
			
					
							
				})
			
			$scope.gridOptions.data=$scope._rows;
		})	
}				







