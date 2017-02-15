exports.shopify_controller = function($scope, $http, $q, $routeParams, $location,$rootScope, shopify_app
    ) {
	console.log('controller go')
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

		 console.log('getData')	
		 shopify_app.getData(function(team){
				$scope.rows=[]
				$scope._rows=[]
				_.each(team,function(row){
					console.log(row)
					$scope._rows.push(row)
					/*
					for (var key in teamx[0]) {
						var dont_shows=[
						"_id","__v","_id","$get","$save","$query","$remove","$delete","toJSON","$update"
						]
						if(dont_shows.indexOf(key)==-1){
							$scope.column_headings.push(key)
						}				
					}
					*/
					
							
				})
			
			$scope.gridOptions.data=$scope._rows;
		})	
}				







