exports.age_learning_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Age_learning,make_a_pie
    ) {
		
		
		
		//$scope.show_all_Button=true
	console.log('controller go')
	//console.log($route.routes)
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		var columnDefs= []
		

		 columnDefs.push(
			{ field: 'museum' ,name: "Museum",width: "150"},
			{ field: 'age_group' ,name: "Age Group",width: "250"},
			//{ field: 'stat' ,name: "Statistic",width: "180"},
			
			{ field: '2017 total_sessions',name: "No. sessions [2017]",width: "150"},
			{ field: '2017 total_children',name: "No. children [2017]",width: "150"},
			{ field: '2017 total_teachers',name: "No. teachers [2017]",width: "150"},
			{ field: '2017 total_income',name: "Income [2017]",width: "150"}
			
		
			
			)
			
			$scope.gridOptions = {
			columnDefs:columnDefs,
			enableGridMenu: true,
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
			Age_learning.query({}, function(team) {
				$scope.rows=[]
				$scope._rows=[]
				_.each(team,function(row){
					//console.log(row)
					$scope._rows.push(row)
			
					
							
				})
			
			$scope.gridOptions.data=$scope._rows;
			$scope.filter_pie=[]
			$scope.filter_pie.push({value:"2017 total_children",name:"No. children"})
			$scope.filter_pie.push({value:"2017 total_sessions",name:"No. sessions"})
			$scope.filter_pie.push({value:"2017 total_teachers",name:"No. teachers"})
			$scope.filter_pieSelected = $scope.filter_pie[0].name; 
			make_a_pie.build($scope,"2017 total_children","age_group")
		
			$scope.changedValue = function(item){       
					make_a_pie.build($scope,item,"age_group")
			}
		
		})	
	

		
				 

	
$scope.chart_title="Age groups"



		
}				







