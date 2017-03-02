
exports.turnstiles_controller = function(log_messages,$scope, AuthService,$http, $q, $routeParams, $location,$rootScope, turnstile_app
    ) {
	

$scope.operation_in_progress=false
$scope.settings=[]
$scope.test_ticket=""
 $scope.venue =$routeParams.venue
$scope.settings.venue=$routeParams.venue
$scope.command="G2:01"

$scope.open_turnstile = function(){
$scope.settings.ticket=$scope.test_ticket
$scope.settings.venue=$scope.venue
$scope.settings.command=$scope.command

			$scope.operation_in_progress=true
			turnstile_app.openGates($scope.settings,function(team){
			$scope.operation_in_progress=false
		})
}


				
	}


exports.turnstiles_buttons = function(log_messages,$scope, $http, $q, $routeParams, $location,$rootScope, shopify_app
    ) {
$scope.report_running=true
  $scope.title1 = 'Button';
  $scope.title4 = 'Warn';
  $scope.isDisabled = true;

  $scope.googleUrl = 'http://google.com';
  $scope.messages=[]
  
  


	log_messages.query({}, function(messages) {

})

}


exports.turnstiles_test = function(turnstile_app,check_com_port,check_ticket_database,check_ticket_file,shopify_app_test,log_messages,$scope, $http, $q, $routeParams, $location,$rootScope, shopify_app
    ) {
	
$scope.test_results = []





	
		$scope.gridOptions=[]
		
		$scope.gridOptions.columnDefs = [   ]
		$scope.gridOptions = {
			columnDefs: [
			{ field: 'test' },
			{ field: 'result',type:'text' },
			{ field: 'notes',type:'text'}
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
			data:$scope.test_results,
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
		
			//TEST SHOPIFY CONNECTION
			var options = []
			options[0]=[]
			options[0].shop="MSHED"
			options[1]=[]
			options[1].shop="BMAG"
		
			_.each(options, function(option) {
			test_result = {test:'connect to '+option.shop+' shopify',result:'FAIL'}
			shopify_app_test.query(option, function(result) {
				test_result={test:'connect to '+option.shop+' shopify',result:'OK',notes:result.count +" orders found"}	
				if(result.count>0){
					$scope.test_results.push(test_result	)
				}
			}, function( error ){
					test_result = {test:'connect to '+option.shop+' shopify',result:'FAIL',notes:error}
					$scope.test_results.push(test_result)
					})
			})
			
			test_result = {test:'connect to ticket file',result:'FAIL'}
			check_ticket_file.query({}, function(result) {
			
				//if(result.count>0){
				test_result={test:'connect to ticket file',result:'OK',notes:result.count +" tickets found"}
					$scope.test_results.push(test_result)
				//}
			}, function( error ){
					test_result = {test:'connect to ticket file',result:'FAIL',notes:error}
					$scope.test_results.push(test_result)
					})
			
			test_result = {test:'connect to ticket database',result:'FAIL'}
			check_ticket_database.query({},function(result) {
			
				
				test_result={test:'connect to ticket database',result:'OK',notes:result}
				$scope.test_results.push(test_result)
				
			},
				  //error
				  function( error ){
					test_result = {test:'connect to ticket database',result:'FAIL',notes:error}
					$scope.test_results.push(test_result)
					})
			
			
			check_com_port.query({},
				  function( value ){	
					test_result = {test:'can open COM port',result:'OK'}
					$scope.test_results.push(test_result)
					},
				  //error
				  function( error ){
					test_result = {test:'can open COM port',result:'FAIL',notes:error}
					$scope.test_results.push(test_result)
					}
				  
			   )
			  $scope.settings.command="test"
			  turnstile_app.openGates($scope.settings,
				  function( value ){	
					test_result = {test:'can send OPEN command',result:'OK',notes:value}
					$scope.settings.command="G2:01"
					$scope.test_results.push(test_result)
					},
				  //error
				  function( error ){
					test_result = {test:'can send OPEN command',result:'FAIL',notes:error}
					$scope.test_results.push(test_result)
					}
				  
			   )
					
	

}
