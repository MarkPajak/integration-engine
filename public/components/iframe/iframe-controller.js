exports.iframe_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Team
    ) {
		
		
		
		
	console.log('controller go')
	console.log($route.routes)
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		var columnDefs= []
		

	


		 columnDefs.push(
			{ field: 'username' ,resizable: true},
			{ field: 'password' ,resizable: true},
			{ field: 'email' ,resizable: true},
			{ field: 'firstName' ,resizable: true},
			{ field: 'lastName' ,resizable: true},
			{ field: 'team' ,resizable: true},
			{ field: 'group' ,resizable: true},
			{ field: 'trello_doing_id' ,resizable: true},
			{ field: 'score' ,resizable: true},
			{ field: 'bonus' ,resizable: true},
			{ field: 'leave_start' ,resizable: true},
			{ field: 'leave_taken' ,resizable: true},
			{ field: 'number_days_leave' ,resizable: true}
			)
			
			$scope.gridOptions = {
			columnDefs:columnDefs,
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
    //Do your REST call here via $http.get or $http.post

			var myArray = []
			var key = colDef.field;
			var obj = {};
			obj[key] = newValue;
			myArray.push(obj);
				var query = {'id':rowEntity._id};
						Team.update(query, 	obj
								
								, function(err, affected, resp) {


								
								
						})
			  });
				},
		};

		 console.log('getData')	
			Team.query({}, function(team) {
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







