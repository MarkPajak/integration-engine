exports.monthly_votes_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Top_40_tally,make_a_pie,make_a_line_chart,monthly_data_table_columns,grid_ui_settings,table_security
    ) {
		
		
		
		
		$scope.chart_class = "col-md-8 col-lg-8 col-sm-5 pull-right"
		$scope.table_class = "col-md-7 col-lg-7 col-sm-7"
	    console.log('controller go')
		$scope.start_date=new Date("01/04/2017")
		$scope.end_date=new Date("01/04/2018")
		$scope.table_heading = "Monthly retail sales"
		$scope.chart_heading = "Data  by month"
		$scope.pie_date = "Apr 2017"
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		var columnDefs= []
		$scope.filter_pie=[]
		$rootScope.canEdit_table=false
		$scope.loading=true
		 columnDefs.push(
		 
			{ field: 'artist' ,name: "Artist",width: 250},
			{ field: 'track' ,name: "Track",width: 250},
			{ field: 'tally' ,name: "Votes",width: 75,visible:true},
			{ field: 'logger_user_name' ,name: "Logged by",visible:false},
			{ field: 'date_logged', name: "Date logged" ,type: 'date', cellFilter: 'date:\'dd/MM/yy HH:mm\'',visible:false}
			)
	
			//columnDefs=columnDefs.concat(monthly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
			console.log('columnDefs',columnDefs)		
scope=$scope
		
		$scope.gridOptions ={ columnDefs:columnDefs,
			enableFiltering:false,
			enableCellEdit:false,
			cellEditableCondition: scope.canEdit ,			
			enableGridMenu: false,
			enableSelectAll: false,
			enableRowHeaderSelection :false,
			enableRowSelection :false,
			enableCellSelection: false,
			enableCellEditOnFocus: false,
			exporterCsvFilename: 'myFile.csv',
			exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
			onRegisterApi: function(gridApi){
			scope.gridApi = gridApi;

	    gridApi.edit.on.afterCellEdit(scope, function(rowEntity, colDef, newValue, oldValue) {
    //Do your REST call here via $http.get or $http.post
			if(scope.isloggedin!=true) alert('you\'ll need to log in to make these changes')
			var update = []
			var key1 = colDef.field;
			var obj1 = {};
			obj1[key1] = newValue;
			
			update.push(obj1);
			
			var key2 = "logger_user_name";
			var obj2 = {};
			obj2[key2] = scope.user.username;
			
			update.push(obj2);
			
			var key3 = "date_logged";
			var obj3 = {};
			obj3[key3] =new Date();
			
			update.push(obj3);
			setupArray = _.extend(obj1, obj2);
			setupArray = _.extend(setupArray, obj3);
			
				var query = {'id':rowEntity._id};
						scope.featured_collection.update(query, 	setupArray
								
								, function(err, affected, resp) {


								
								
						})
			  });
				}
}
		

		$scope.museums  =[]
		$scope.selected_chart_stats=["Net sales"]
			
			
			Top_40_tally.query({"exhibition_id":"bristolmusic"}, function(team) {
				$scope.rows=[]
				$scope._rows=[]
				$scope.data_rows=[]
				_.each(team,function(row){
				if(row.museum!=""){
					$scope._rows.push(row)
						if($scope.museums.indexOf(row.museum)==-1){$scope.museums.push(row.museum)}
						$scope.data_rows.push(row)
					
				}
			
				})
			
			$scope.gridOptions.data=$scope._rows;
			$scope.loading=false
			//make_a_pie.build($scope,"Apr 2017","museum")
			//make_a_line_chart.build($scope,columnDefs,"museum")
								//(scope,columnDefs,data_values,label_values)
				$scope.$watchGroup(['end_date','start_date'], function(newValue, oldValue) {
  
					
					//columnDefs=columnDefs.concat(monthly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
					$scope.gridOptions.columnDefs=columnDefs
					make_a_line_chart.build($scope,columnDefs,"museum")
			
			
			
			});
			$scope.changedValue = function(item){ 
					$scope.pie_date=item			
					make_a_pie.build($scope,item,"museum")
			}
		})	
}				







