exports.monthly_retail_sales_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Monthly_retail_sales
    ) {
		
		
		
		
	console.log('controller go')
	//console.log($route.routes)
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		var columnDefs= []
		

		 columnDefs.push(
			{ field: 'museum' ,name: "Museum",width: "250"},
			{ field: 'Apr 2017',name: "Apr 17",width: "100"},
			{ field: 'May 2017',name: "May 17",width: "100"},
			{ field: 'Jun 2017',name: "Jun 17",width: "100"},
			{ field: 'Jul 2017' ,name: "Jul 17",width: "100"},
			{ field: 'Aug 2017',name: "Aug 17",width: "100"},
			{ field: 'Sep 2017' ,name: "Sep 17",width: "100"},
			{ field: 'Oct 2017' ,name: "Oct 17",width: "100"},
			{ field: 'Nov 2017' ,name: "Nov 17",width: "100"},
			{ field: 'Dec 2017' ,name: "Dec 17",width: "100"},
			{ field: 'Jan 2018',name: "Jan 18",width: "100"},
			{ field: 'Feb 2018' ,name: "Feb 18",width: "100"},
			{ field: 'Mar 2018' ,name: "Mar 18",width: "100"}
			
			)
			
			$scope.gridOptions = {
			columnDefs:columnDefs,
			enableGridMenu: false,
			enableSelectAll: true,
			enableCellSelection: false,
			enableCellEditOnFocus: false,
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
				},
		};

		 console.log('getData')	
			Monthly_retail_sales.query({}, function(team) {
				$scope.rows=[]
				$scope._rows=[]
				_.each(team,function(row){
					console.log(row)
					$scope._rows.push(row)
			
					
							
				})
			
			$scope.gridOptions.data=$scope._rows;
		})	
}				







