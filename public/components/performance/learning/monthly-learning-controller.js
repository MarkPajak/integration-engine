exports.monthly_learning_controller = function(getDateService,$route,$scope, $http, $q, $routeParams, $location,$rootScope, Monthly_learning,make_a_pie,make_a_line_chart,monthly_data_table_columns,grid_ui_settings,table_security,dynamicTableCellFilter_retail
    ) {
		
		
	 $scope.init = function(session_type)
    {

			$scope.chart_class = "col-md-8 col-lg-8 col-sm-5 pull-right"
			$scope.table_class = "col-md-12 col-lg-12 col-sm-5"
			//var session_type = $scope.session_type
			$scope.background_colour="learning"
			$scope.table_heading =session_type+ " monthly  stats" 
			$scope.chart_heading = "Data  by month"
			$scope.pie_date = "Apr 2017"
			$rootScope.canEdit_table=false
			$scope.gridOptions=[]
			$scope.gridOptions.data=[]
			var columnDefs= []
			$scope.filter_pie=[]
			
			columns=	
					{ field: 'stat',cellFilter:'valueFilter',name: "Statistic",width:300, pinnedLeft:true, enableColumnMoving:false  ,cellClass:dynamicTableCellFilter_retail}		
			
			columnDefs.push(columns	)
		dates=getDateService.getDate()
		$scope.start_date=dates[0]
		$scope.end_date=dates[1]
			
			columnDefs=columnDefs.concat(monthly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
			console.log('columnDefs',columnDefs)		
			$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
			
			$scope.options_list=[]
			//$scope.session_type="INDEPENDENT"
			option=[]
			option.name="INDEPENDENT"
			option.value="INDEPENDENT"
			$scope.options_list.push(option)
			option=[]
			option.name="FACILITATED"
			option.value="FACILITATED"
			$scope.options_list.push(option)
				
		
		get_data=function(session_type){
			console.log('get_data')
			Monthly_learning.query({"session_type":session_type,cache:true}, function(team) {
				$scope.rows=[]
				$scope._rows=[]
				$scope.data_rows=[]
				_.each(team,function(row){
				if(row.museum!=""){	
					$scope._rows.push(row)
					if(row.stat=="age_group"){	
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
			$scope.gridOptions.enableFiltering=false
		
			make_a_line_chart.build($scope,columnDefs,"age_group")
	
			$scope.$watchGroup(['end_date','start_date'], function(newValue, oldValue) {
  
			columnDefs=[]
			columnDefs.push(columns
					
			)
			columnDefs=columnDefs.concat(monthly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
					$scope.gridOptions.columnDefs=columnDefs
					make_a_line_chart.build($scope,columnDefs,"age_group")
									
			
			
			});
			
			  $scope.$on('date:updated', function(event,data) {
					console.log(data)
					$scope.start_date=data[0]
					$scope.end_date=	data[1]	
			
				});
			
		})	
		
		}
		
			get_data(session_type)

			
			$scope.changedValue = function(item){ 
					console.log('filter')		
					$scope.get_data(item)
			}
			
		
			
	}
		
}		
			







