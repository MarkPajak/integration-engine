exports.customers_giftaid_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Customers_giftaid,data_table_reload,get_table_data,grid_ui_settings ,table_security
    ) {
		
		$scope.show_all_Button=true
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		$scope.gridOptions=[]
		$scope.gridOptions.data='__data'
		$scope.table_class = "col-md-12 col-lg-12 col-sm-5"	

		$scope.featured_collection=Customers_giftaid
		$rootScope.featured_collection=Customers_giftaid
		var columnDefs= []
		$rootScope.canEdit_table=true

		 columnDefs.push(
			{ field: 'first_name' ,name: "first_name",resizable: true,width:"150"},
			{ field: 'last_name' ,name: "last_name",resizable: true,width:"150"},
			{ field: 'email' ,resizable: true,width:"250"},
			{ field: 'house' ,resizable: true,width:"250"},
			{ field: 'post_code' ,resizable: true,width:"150"},
			{ field: 'note' ,resizable: true,width:"250"},
			{ field: 'order' ,resizable: true,width:"150"},
		//	{ field: 'quantity' ,resizable: true,width:"250"},
			{ field: 'donation_amount' ,resizable: true,width:"250"},
			{ field: 'last_order_url' ,resizable: true,width:"250"},
			{ field: 'last_order_id' ,resizable: true,width:"250"},
	

			{ field: 'date' ,resizable: true,type: 'date', cellFilter: 'date:\'dd/MM/yy\'',width:"150"}
		
			)
			
				$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
				
				
			
					console.log('getData')
				
					if($scope){
					myScope=$scope
					}
						
								
								
									var filter_month = moment().month()
									filterdate=moment(new Date()).subtract({'years': 1})
									filterdate=moment(filterdate)._d
									console.log('all dates after',filterdate)
							
							
							
									var query = {};
									
									if($scope.extraQuery){
										_.extend(query, $scope.extraQuery)
									}
									 
									 console.log('query',query)
									 
									$rootScope.featured_collection.query({}, function(team) {
									$scope.rows=[]
									$scope._rows=[]
									
									console.log('filtering ' + team.length + " results")
									
									
									_.each(team,function(row){
									
								
										console.log('displaying all data')
										$scope._rows.push(row)
									
								
										
												
									})
		
								 $scope.gridOptions.data.length = 0;
								  angular.forEach( $scope._rows, function( row ) {
									$scope.gridOptions.data.push( row );
								  });
								  
								  
									  $scope.$watch(function () {
					
					return data_table_reload.getDate();
		
		
					},
					
				   function (value) {
				 
				   
				   }
				);
								
							})	
							
					$rootScope.alldata=function (val) {
		
								if (val=="month"){
								
									console.log('show month data')
									var date = new Date(), y = date.getFullYear(), m = date.getMonth();
									var firstDay = new Date(y, m, 1);
									var lastDay = new Date(y, m + 1, 0);
									firstDay = moment(firstDay);
									array.getData(firstDay,myScope)
								}
									
								
								else if (val)
								{
										console.log('show month data',myScope.start)
									var date = new Date(val), y = date.getFullYear(val), m = date.getMonth(val);
									console.log('filtering on month', m)
									var firstDay = new Date(myScope.start);
									var lastDay = new Date(myScope.end);
									firstDay = moment(firstDay)._d;
									array.getData(firstDay,myScope)	
		
								}
								else 
								{
									console.log('show all data')
									array.getData("",myScope)		
		
								}
		
		
					}
					
					
					$rootScope.dynamic_filter=function (filter_key,filter_value) {
					
					array.filter_x(filter_key,filter_value,myScope)
					
					}
					
			
					
}				







