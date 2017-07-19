exports.raw_visitor_numbers_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Raw_visits
    ) {
		
		
		
		
	console.log('controller go')
	console.log($route.routes)
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		var columnDefs= []
		

			


		 columnDefs.push(
			{ field: 'museum_id' ,value: "Museum",resizable: true},
			{ field: 'kpi_type' ,value: "kpi",resizable: true},
			{ field: 'value' ,resizable: true},
			{ field: 'date_value' ,value: "Date",resizable: true ,type: 'date', cellFilter: 'date:\'yyyy-MM-dd\''},
			{ field: 'logger_user_name' ,value: "Logged by",resizable: true},
			{ field: 'date_logged', value: "Date logged" ,type: 'date', cellFilter: 'date:\'yyyy-MM-dd HH:mm\''}
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

			var update = []
			var key1 = colDef.field;
			var obj1 = {};
			obj1[key1] = newValue;
			
			update.push(obj1);
			
			var key2 = "logger_user_name";
			var obj2 = {};
			obj2[key2] = $scope.user.username;
			
			update.push(obj2);
			
			var key3 = "date_logged";
			var obj3 = {};
			obj3[key3] =new Date();
			
			update.push(obj3);
			setupArray = _.extend(obj1, obj2);
			setupArray = _.extend(setupArray, obj3);
			
				var query = {'id':rowEntity._id};
						Raw_visits.update(query, 	setupArray
								
								, function(err, affected, resp) {


								
								
						})
			  });
				},
		};

		 console.log('getData')	
			Raw_visits.query({}, function(team) {
				$scope.rows=[]
				$scope._rows=[]
				_.each(team,function(row){
					console.log(row)
					$scope._rows.push(row)
			
					
							
				})
			
			$scope.gridOptions.data=$scope._rows;
		})	
}				







