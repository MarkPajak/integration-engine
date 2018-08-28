exports.monthly_retail_sales_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Monthly_retail_sales,make_a_pie,make_a_line_chart,monthly_data_table_columns_retail,grid_ui_settings,table_security,dynamicTableCellFilter_retail
    ) {
		
		
		
		
			$scope.chart_class = "col-md-8 col-lg-8 col-sm-5 pull-right"
			$scope.table_class = "col-md-12 col-lg-12 col-sm-5"
	
	 $scope.background_colour="retail"
			$scope.start_date=new Date("04/01/2018")
			$scope.end_date= moment($scope.start_date).add('years', 1).format("DD/MM/YYYY")
		$scope.table_heading = "Monthly retail sales"
		$scope.chart_heading = "Data  by month"
		$scope.pie_date = "Apr 2017"
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		var columnDefs= []
		$scope.filter_pie=[]
		$rootScope.canEdit_table=false
		
		 columnDefs.push(
		 
			//{ field: 'museum' ,cellFilter:'valueFilter',name: "Museum",width: "40", pinnedLeft:true,cellClass:dynamicTableCellFilter_retail},
			{ field: 'stat' ,cellFilter:'valueFilter',name: "Statistic",width: "60", pinnedLeft:true,cellClass:dynamicTableCellFilter_retail},
			{ field: 'comments' ,name: "comments",resizable: true,visible:false},
			{ field: 'logger_user_name' ,name: "Logged by",resizable: true,visible:false},
			{ field: 'date_logged', name: "Date logged" ,type: 'date', cellFilter: 'date:\'dd/MM/yy HH:mm\'',visible:false}
			)
	
			columnDefs=columnDefs.concat(monthly_data_table_columns_retail.build($scope,$scope.start_date,$scope.end_date))
			console.log('columnDefs',columnDefs)		

		
		$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);	
		

		$scope.museums  =[]
		$scope.selected_chart_stats=["Net sales"]
			
			
			Monthly_retail_sales.query({}, function(team) {
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
			$scope.gridOptions.enableFiltering=false
			make_a_pie.build($scope,"Apr 2017","museum")
			make_a_line_chart.build($scope,columnDefs,"museum")
								//(scope,columnDefs,data_values,label_values)
				$scope.$watchGroup(['end_date','start_date'], function(newValue, oldValue) {
  
					columnDefs=[]
					columnDefs.push(
						//{ field: 'museum',cellFilter:'valueFilter' ,name: "Museum",width: "150", pinnedLeft:true,cellClass:dynamicTableCellFilter_retail},
						{ field: 'stat' ,cellFilter:'valueFilter',name: "Statistic",width: "180", pinnedLeft:true,cellClass:dynamicTableCellFilter_retail}		
						)
					columnDefs=columnDefs.concat(monthly_data_table_columns_retail.build($scope,$scope.start_date,$scope.end_date))
					$scope.gridOptions.columnDefs=columnDefs
					make_a_line_chart.build($scope,columnDefs,"museum")
			
			
			
			});
			$scope.changedValue = function(item){ 
					$scope.pie_date=item			
					make_a_pie.build($scope,item,"museum")
			}
		})	
}				







