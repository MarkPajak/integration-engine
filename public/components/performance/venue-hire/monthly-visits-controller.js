exports.monthly_venue_hire_controller = function(getDateService,$route,$scope, $http, $q, $routeParams, $location,$rootScope, Monthly_venue_hire,make_a_pie,make_a_line_chart,monthly_data_table_columns,grid_ui_settings,table_security,dynamicTableCellFilter
    ) {
		
		
		 $scope.init = function(booking_type)
    {

		
			$scope.chart_class = "col-md-8 col-lg-8 col-sm-5 pull-right"
			$scope.table_class = "col-md-12 col-lg-12 col-sm-5"
			$scope.table_heading = booking_type+ " Venue Hire"
			$scope.background_colour="venue"
			$scope.chart_heading = "Data  by month"
			$scope.pie_date = "Apr 2017"
			$rootScope.canEdit_table=false
			$scope.gridOptions=[]
			$scope.gridOptions.data=[]
			$scope.selected_museums  =[]
			$scope.selected_chart_stats=["Visits"]
				
		
		dates=getDateService.getDate()
		$scope.start_date=dates[0]
		$scope.end_date=dates[1]

				
			var columnDefs= []
		$scope.rowFormatter = function(row) {
			console.log('row',row)
			return row.entity.gender === 'male';
		};
			$scope.filter_pie=[]
			columnDefs.push(
			{ field: 'museum',	cellFilter:'valueFilter',	name: "Museum",width:200, pinnedLeft:true, enableColumnMoving:false ,  cellClass:dynamicTableCellFilter}
					
			)
			
			$scope.start_date=new Date("04/01/2019")
			$scope.end_date= moment($scope.start_date).add('years', 1).format("DD/MM/YYYY")

			
			columnDefs=columnDefs.concat(monthly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
			console.log('columnDefs',columnDefs)		
			$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);

		$scope.gridOptions.enableFiltering=false
		
			Monthly_venue_hire.query({"booking_type":booking_type}, function(team) {
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
			//console.log('row',row)
			if(row.museum=="Running total") return;		
				if(row.museum=="Last Year") return;		
					
					start=moment($scope.start_date).year()-2
					end=moment($scope.end_date).year()+1 //financial year compared to this month stuff
					
					
					start_month=moment($scope.start_date).month()
					end_month=moment($scope.end_date).month()
 
 
					  var columns = []
						  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
						  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

						for (year = start; year <= end; year++) { 
						month_num=0
						var total = 0
						_.each(moment.monthsShort(),function(month){
							
						month_num++
					if( row[month+" "+year]){
						
						if(month_num<4){
							
							if( !($scope._rows[i]["Total " + (parseInt(year)-1)])){
								$scope._rows[i]["Total " + (parseInt(year)-1)]=0
							}
						
							if( (row[month+" "+(parseInt(year))])){
								
								if( (row[month+" "+(parseInt(year))])>0){
															
								$scope._rows[i]["Total " + (parseInt(year)-1)]+=parseInt(row[month+" "+(parseInt(year))])
								
								}
						
							}
							
						}
						
						
							if(month_num==4){
							
							if( !($scope._rows[i]["Total " + (parseInt(year))])){
								$scope._rows[i]["Total " + (parseInt(year))]=0
							}
						
							if( (row[month+" "+(parseInt(year))])){
								
								if( (row[month+" "+(parseInt(year))])>0){
															
								$scope._rows[i]["Total " + (parseInt(year))]=parseInt(row[month+" "+(parseInt(year))])
								
								}
						
							}
							
						}
						
								if(month_num>4){
							
							if( !($scope._rows[i]["Total " + (parseInt(year))])){
								$scope._rows[i]["Total " + (parseInt(year))]=0
							}
						
							if( (row[month+" "+(parseInt(year))])){
								
								if( (row[month+" "+(parseInt(year))])>0){
															
								$scope._rows[i]["Total " + (parseInt(year))]+=parseInt(row[month+" "+(parseInt(year))])
								
								}
						
							}
							
						}
					
					/*
					else if(month_num==4){
		if( !isNaN(row[month+" "+year])){
						total=  row[month+" "+year]
						if(!isNaN(total)){
							console.log('	adding total for ',row[month+" "+year])
							$scope._rows[i]["Total " + year]=total
						}
		}
					}
					
					else if(month_num>=4){
		if( !isNaN(row[month+" "+year])){
						total+=  row[month+" "+year]
						if(!isNaN(total)){
							console.log('	adding total for ',row[month+" "+year])
							$scope._rows[i]["Total " + year]+=total
						}
		}
					}
					/*
					else if(month_num>4){
		
						total+=  row[month+" "+year]
						if(!isNaN(total)){
						console.log('	adding total for ',row[month+" "+year])
						$scope._rows[i]["Total " + year]+=total
					}
					}
					
					
					else
					{
						if(!isNaN(row[month+" "+year])){
							
						total+=  row[month+" "+year]
						$scope._rows[i]["Total " + year]=total
						}
					}
					*/
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
	
			$scope.$watchGroup(['end_date','start_date'], function(newValue, oldValue) {
  
					columnDefs=[]
					columnDefs.push(
			{ field: 'museum',	cellFilter:'valueFilter',		name: "Museum",width:200, pinnedLeft:true, enableColumnMoving:false  ,   cellClass:dynamicTableCellFilter}
					
			)
					columnDefs=columnDefs.concat(monthly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
					$scope.gridOptions.columnDefs=columnDefs
					make_a_line_chart.build($scope,columnDefs,"museum")
			
			
			
			});
			
			
	 $scope.$on('date:updated', function(event,data) {
					//console.log(data)
					$scope.start_date=data[0]
					$scope.end_date=	data[1]	
			
				});
				
				
			$scope.changedValue = function(item){ 
					$scope.pie_date=item			
					make_a_pie.build($scope,item,"museum")
			}
		})	
		
		
		}
}				







