exports.monthly_visitor_numbers_controller = function(getDateService,$route,$scope, $http, $q, $routeParams, $location,$rootScope, Monthly_visits,make_a_pie,make_a_line_chart,monthly_data_table_columns,grid_ui_settings,table_security,dynamicTableCellFilter
    ) {
		
		
		dates=getDateService.getDate()
		$scope.start_date=dates[0]
		$scope.end_date=dates[1]
		
			$scope.chart_class = "col-md-8 col-lg-8 col-sm-5 pull-right"
			$scope.table_class = "col-md-12 col-lg-12 col-sm-5"
			$scope.table_heading = "Bristol Culture Monthly Visitor Figures"
			$scope.background_colour="visits"
			$scope.chart_heading = "Data  by month"
			$scope.pie_date = "Apr 2017"
			$rootScope.canEdit_table=false
			$scope.gridOptions=[]
			$scope.gridOptions.data=[]
			$scope.selected_museums  =[]
			$scope.selected_chart_stats=["Visits"]
				


				
			var columnDefs= []
		$scope.rowFormatter = function(row) {
			console.log('row',row)
			return row.entity.gender === 'male';
		};
			$scope.filter_pie=[]
			columnDefs.push(
			{ field: 'museum',	cellFilter:'valueFilter',	name: "Museum",width:200, pinnedLeft:true, enableColumnMoving:false ,  cellClass:dynamicTableCellFilter}
					
			)
			
		

			
			columnDefs=columnDefs.concat(monthly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
			console.log('columnDefs',columnDefs)		
			$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);

		$scope.gridOptions.enableFiltering=false
		
			Monthly_visits.query({}, function(team) {
				$scope.rows=[]
				$scope._rows=[]
				$scope.data_rows=[]
				_.each(team,function(row){
				if(row.museum!=""){	
				
				if($scope.selected_museums.indexOf(row.museum)==-1){$scope.selected_museums.push(row.museum)}
					$scope._rows.push(row)
					
					if(row.museum.indexOf('%')==-1){
						
						$scope.data_rows.push(row)
						
					}
				}
		
				})
			
		
			$scope.gridOptions.data=$scope._rows;
			
			
			_.each($scope._rows,function(row,i){	
			
					
					 start=moment($scope.start_date).year()-1
					end=moment($scope.end_date).year()+1 //financial year compared to this month stuff
					
					
					start_month=moment($scope.start_date).month()
					end_month=moment($scope.end_date).month()
 
 
					  var columns = []
						  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
						  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

						for (year = start-1; year <= end; year++) { 
						month_num=0
						var total = 0
						_.each(moment.monthsShort(),function(month){
							
						month_num++
					if( row[month+" "+year]){
					if(start_month==3){
						
						
					//	console.log('row',row)
						total=  row[month+" "+year]
						if(!isNaN(total)){
						console.log('	adding total for ',row[month+" "+year])
						$scope._rows[i]["Total " + year]=total
					}
					}
					
					else
					{
						if(!isNaN(row[month+" "+year])){
							
						total+=  row[month+" "+year]
						}
					}
					}
						
						
						
						
						})
					}
				
				
			})	
			
			
 $scope.genericMap = function(hash){
        return function(input){
          if (!input){
            return '';
          } else {
            return hash[input];
          }
        };
      };
			
			make_a_pie.build($scope,"Apr 2017","museum")
			make_a_line_chart.build($scope,columnDefs,"museum")
	
			
			  $scope.$on('date:updated', function(event,data) {
					console.log(data)
					$scope.start_date=data[0]
					$scope.end_date=	data[1]	
			
				});
			
			$scope.$watchGroup(['end_date','start_date'], function(newValue, oldValue) {
 
					columnDefs=[]
					columnDefs.push(
					{ field: 'museum',	cellFilter:'valueFilter',		name: "Museum",width:200, pinnedLeft:true, enableColumnMoving:false  ,   cellClass:dynamicTableCellFilter}
					
			)
					columnDefs=columnDefs.concat(monthly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
					$scope.gridOptions.columnDefs=columnDefs
					make_a_line_chart.build($scope,columnDefs,"museum")
			
			
			
			});
	
			$scope.changedValue = function(item){ 
					$scope.pie_date=item			
					make_a_pie.build($scope,item,"museum")
			}
		})	
}				







