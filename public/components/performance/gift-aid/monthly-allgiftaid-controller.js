exports.monthly_all_giftaid_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Monthly_all_giftaid,grid_ui_settings,table_security
    ) {
		
		
		
	

		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		var columnDefs= []
		$rootScope.canEdit_table=false
		$scope.table_heading = "All combined gift aid"

		 columnDefs.push(
			{ field: 'museum' ,name: "Museum",width: "150", pinnedLeft:true},
			//{ field: 'stat' ,name: "Statistic",width: "180"},
			{ field: 'Apr 2017',name: "Apr 17",width: "80"},
			{ field: 'May 2017',name: "May 17",width: "80"},
			{ field: 'Jun 2017',name: "Jun 17",width: "80"},
			{ field: 'Jul 2017' ,name: "Jul 17",width: "80"},
			{ field: 'Aug 2017',name: "Aug 17",width: "80"},
			{ field: 'Sep 2017' ,name: "Sep 17",width: "80"},
			{ field: 'Oct 2017' ,name: "Oct 17",width: "80"},
			{ field: 'Nov 2017' ,name: "Nov 17",width: "80"},
			{ field: 'Dec 2017' ,name: "Dec 17",width: "80"},
			{ field: 'Jan 2018',name: "Jan 18",width: "80"},
			{ field: 'Feb 2018' ,name: "Feb 18",width: "80"},
			{ field: 'Mar 2018' ,name: "Mar 18",width: "80"}
			
			)
			
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







