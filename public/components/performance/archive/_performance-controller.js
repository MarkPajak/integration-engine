exports.performance_controller = function(log_messages,$scope, AuthService,$http, $q, $routeParams, $location,$rootScope, shopify_app
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
			{ field: 'product_type' ,resizable: true},
			{ field: 'price' ,resizable: true},
			{ field: 'sales_value' ,resizable: true},
			{ field: 'name' ,resizable: true},
			{ field: 'count' ,resizable: true},
			{ field: 'inventory_quantity' ,resizable: true},
			{ field: 'order_status' ,resizable: true},
			{ field: 'sku' ,resizable: true},
			{ field: 'barcode' ,resizable: true},
			{ field: 'vendor' ,resizable: true},
			{ field: 'date_report_run' ,resizable: true}
			],
			enableGridMenu: true,
			enableSelectAll: true,
			enableCellSelection: true,
			enableCellEditOnFocus: true,
			exporterCsvFilename: 'myFile.csv',
			exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
			onRegisterApi: function(gridApi){
			vm.gridApi = gridApi;
			},
			pagingOptions: { // no more in v3.0.+, use paginationPageSizes, paginationPageSize
			// pageSizes: list of available page sizes.
			pageSizes: [250, 500, 1000], 
			//pageSize: currently selected page size. 
			pageSize: 250,
			//totalServerItems: Total items are on the server. 
			totalServerItems: 0,
			//currentPage: the uhm... current page.
			currentPage: 1
			},
			exporterPdfDefaultStyle: {fontSize: 9},
			exporterPdfTableStyle: {margin: [30, 30, 30, 30]},
			exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
			exporterPdfHeader: { text: "My Header", style: 'headerStyle' },
			exporterPdfFooter: function ( currentPage, pageCount ) {
			return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
			},
			exporterPdfCustomFormatter: function ( docDefinition ) {
			docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
			docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
			return docDefinition;
			},exporterPdfOrientation: 'portrait',
			exporterPdfPageSize: 'LETTER',
			exporterPdfMaxGridWidth: 500,
			exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
			onRegisterApi: function(gridApi){
			$scope.gridApi = gridApi;
			gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {

			});
			}
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


		
		 shopify_app.getData($scope.optionset[selected_set],function(team){
				
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



exports.shopify_buttons = function(log_messages,$scope, $http, $q, $routeParams, $location,$rootScope, shopify_app
    ) {
$scope.report_running=true
  $scope.title1 = 'Button';
  $scope.title4 = 'Warn';
  $scope.isDisabled = true;

  $scope.googleUrl = 'http://google.com';
  $scope.messages=[]
  
  

/*
	log_messages.query({}, function(messages) {
	
			log_messages.query({}, function(team) {
				_.each(team, function(row,index) {
						$scope.messages[0]=	row.username+" "+row.date+" "+row.message
		
				})
			})	
			
	})
	*/

}


/**
Copyright 2016 Google Inc. All Rights Reserved. 
Use of this source code is governed by an MIT-style license that can be foundin the LICENSE file at http://material.angularjs.org/HEAD/license.
**/


