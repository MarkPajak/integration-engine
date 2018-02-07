exports.shopify_monthly_controller = function(log_messages,$scope, AuthService,$http, $q, $routeParams, $location,$rootScope, Shopify_monthly_report
    ) {
	
		  AuthService.isLoggedIn().then(function(user){
			$scope.isloggedin=true	
			//$scope.lockstatus=true
			//$scope.unlock=true
			//timeline_functions.unlock(true)
			$scope.report_running=true
	  })
	console.log('controller go')
	  $scope.logging=true
	$scope.data_number=7
	
	$scope.generate_order_forms=false
	$scope.update_product_types=true
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		$scope.gridOptions.columnDefs = [   ]
		$scope.gridOptions = {
			columnDefs: [
		
		

		
		
			{ field: 'shop_id' ,resizable: true, enableFiltering: true},
			{ field: 'title' ,resizable: true, enableFiltering: true},
			{ field: 'vendor' ,resizable: true, enableFiltering: true},
			{ field: 'net_sales' ,resizable: true, type:"number", enableFiltering: true},
			{ field: 'quantity' ,resizable: true, type:"number", enableFiltering: true},
			{ field: 'year' ,resizable: true, type:"number", enableFiltering: true},
			{ field: 'month' ,resizable: true, enableFiltering: true},
			{ field: 'Nov' ,resizable: true, type:"number", enableFiltering: true},
			{ field: 'Dec' ,resizable: true, type:"number", enableFiltering: true},
			{ field: 'Jan' ,resizable: true, type:"number", enableFiltering: true},
			{ field: 'Feb' ,resizable: true, type:"number", enableFiltering: true},
			
			{ field: 'date_report_run' ,resizable: true, enableFiltering: true}
			],
			enableFiltering:true,
			enableCellEdit:true,
			
			enableGridMenu: true,
			enableSelectAll: true,
			enableCellSelection: false,
			enableCellEditOnFocus: false,
			exporterCsvFilename: 'myFile.csv',
			exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location"))
		};
	
var options = []
$scope.optionset = []
	options.google_sheet_id='1UlDQNS6dTvQWlQs090HRrSoR49k0Th-ElxCaxTMleA0'
	options.created_at_min =  moment(new Date()).add(-$scope.data_number, 'days').format()
	options.title = "last_"+$scope.data_number+"_days"
$scope.optionset.push(options)	

	
$scope.save_to_sheets=false

$scope.$watch('data_number', function(data_number) {
	
$scope.optionset = []
	var options = []
	options.google_sheet_id='1UlDQNS6dTvQWlQs090HRrSoR49k0Th-ElxCaxTMleA0'
	options.created_at_min =  moment(new Date()).add(-data_number, 'days').format()
	options.title = "last_"+data_number+"_days"
	console.log('options.created_at_min',options.created_at_min)
$scope.optionset.push(options)

})
$scope.runShopify = function(selected_set,shop){

$scope._rows=[]
$scope.report_running=false
$scope.selected_set=selected_set
$scope.optionset[selected_set].save_to_sheets=$scope.save_to_sheets
$scope.optionset[selected_set].update_product_types=$scope.update_product_types
$scope.optionset[selected_set].generate_order_forms=$scope.generate_order_forms


$scope.optionset[selected_set].shop=shop
console.log($scope.optionset[selected_set])


		
		 Shopify_monthly_report.query($scope.optionset[selected_set],function(team){
				
				$scope._rows=[]
				_.each(team,function(row){
					console.log(row)
					$scope._rows.push(row)
	
					
							
				})
				$scope.logging=false
			$scope.rows=$scope._rows
			$scope.gridOptions.data=$scope.rows;
			$(window).resize()
			$scope.report_running=true
		})	
}
}				



exports.shopify_monthly_buttons = function(log_messages,$scope, $http, $q, $routeParams, $location,$rootScope, Shopify_monthly_report
    ) {
$scope.report_running=true
  $scope.title1 = 'Button';
  $scope.title4 = 'Warn';
  $scope.isDisabled = true;

  $scope.googleUrl = 'http://google.com';
  $scope.messages=[]


}

