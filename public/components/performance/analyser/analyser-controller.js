exports.analyser_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope,Weekly_donations,Weekly_welcomedesk,Monthly_products_sold_online,Weekly_visits, Monthly_products_published,Monthly_welcomedesk,Monthly_donations,Monthly_visits,Weekly_retail_sales,Monthly_turnstiles,Monthly_retail_sales,Monthly_teg, make_a_pie,make_a_line_chart,weekly_data_table_columns,monthly_data_table_columns,grid_ui_settings,data_table_reload,table_security
    ) {
		
		$scope.interval="Weekly"
		$scope.running=false

		$scope.museums=[]
		$scope.selected_museums=[]		
		
		$scope.chart_class = "col-md-12 col-lg-12 col-sm-12 pull-right"
		$scope.table_class = "col-md-12 col-lg-12 col-sm-5"		
		$scope.show_all_Button=false
		
		$scope.table_heading = $scope.range+" donations"
		$scope.pie_date = "Apr 2017"
		
		$scope.start_date=new Date("04/01/2017")
		$scope.end_date=new Date("03/31/2018")
		
				var columnDefs= []
		$scope.filter_pie=[]
		columnDefs.push(
			{ field: 'museum',		name: "Museum",width: "100", pinnedLeft:true},
			{ field: 'stat',		name: "Statistic",width: "100", pinnedLeft:true}
		
		)
	
			
		$scope.windup=function(sales,gallery_visits,welcome,products,orders,team,visits,gates){
		

		
		columnDefs=columnDefs.concat($scope.axis_range.build($scope,$scope.start_date,$scope.end_date))	
			
								
					_.each(visits,function(row){
							if(row.museum!=""){	
								$scope._rows.push(row)
								if(row.museum.indexOf('%')==-1){
									if($scope.chart_stats.indexOf(row.stat)==-1){$scope.chart_stats.push(row.stat)}	
									if($scope.museums.indexOf(row.museum)==-1){$scope.museums.push(row.museum)}
									$scope.data_rows.push(row)
								}
							}
					})
				
			
				
				
				
						_.each(gallery_visits,function(row){
					
							if(row.museum!=""){
								$scope._rows.push(row)
								if($scope.museums.indexOf(row.museum)==-1){$scope.museums.push(row.museum)}
								
								if($scope.chart_stats.indexOf(row.stat)==-1){$scope.chart_stats.push(row.stat)}
									
									$scope.data_rows.push(row)
							
								
							}	
						})
				
				
					_.each(sales,function(row){
						console.log('sales',sales)
					if(row.museum!=""){
						if($scope.museums.indexOf(row.museum)==-1){$scope.museums.push(row.museum)}
						if($scope.chart_stats.indexOf(row.stat)==-1){$scope.chart_stats.push(row.stat)}
						$scope._rows.push(row)
					    $scope.data_rows.push(row)
							
						
					}
			
				})
				
				_.each(team,function(row){
						console.log('team',team)
					if(row.museum!=""){
						$scope._rows.push(row)
						if(row.stat=="Donations"){
							if($scope.museums.indexOf(row.museum)==-1){$scope.museums.push(row.museum)}
							if($scope.chart_stats.indexOf(row.stat)==-1){$scope.chart_stats.push(row.stat)}
							console.log("Donations")
							$scope.data_rows.push(row)
							
						}
					}
			
				})
				
					_.each(gates,function(row){
						console.log('gates',gates)
					if(row.museum!=""){
						$scope._rows.push(row)
						//if(row.stat=="Donations"){
							if($scope.museums.indexOf(row.museum)==-1){$scope.museums.push(row.museum)}
							if($scope.chart_stats.indexOf(row.stat)==-1){$scope.chart_stats.push(row.stat)}
							console.log("Donations")
							$scope.data_rows.push(row)
							
						//}
					}
			
				})
				
		
				_.each(welcome,function(row){
					console.log('welcome',welcome)
					if(row.museum!=""){
						$scope._rows.push(row)
						
							if($scope.museums.indexOf(row.museum)==-1){$scope.museums.push(row.museum)}
							if($scope.chart_stats.indexOf(row.stat)==-1){$scope.chart_stats.push(row.stat)}
						
							$scope.data_rows.push(row)
							
						
					}
			
				})
				
					_.each(products,function(row){
						console.log('products',products)
					if(row.museum!=""){
						$scope._rows.push(row)
							if($scope.museums.indexOf(row.museum)==-1){$scope.museums.push(row.museum)}
							if($scope.chart_stats.indexOf(row.stat)==-1){$scope.chart_stats.push(row.stat)}
							$scope.data_rows.push(row)
							
						
					}
			
				})
				console.log('chart_stats',$scope.chart_stats)
				
					_.each(orders,function(row){
						console.log('orders',orders)
					if(row.museum!=""){
						$scope._rows.push(row)
							if($scope.museums.indexOf(row.museum)==-1){$scope.museums.push(row.museum)}
							if($scope.chart_stats.indexOf(row.stat)==-1){$scope.chart_stats.push(row.stat)}
							$scope.data_rows.push(row)
							
						
					}
			
				})
					
				
				
			
			$scope.gridOptions.data=$scope._rows;

			$scope.axis_threshhold=50
				$scope.toggleSelection_stats = function (fruitName) {
					var idx = $scope.selected_chart_stats.indexOf(fruitName);

					// Is currently selected
					if (idx > -1) {
					  $scope.selected_chart_stats.splice(idx, 1);
					}

					// Is newly selected
					else {
					  $scope.selected_chart_stats.push(fruitName);
					}
				
						make_a_line_chart.build($scope,columnDefs,"museum")
		  };
			$scope.toggleSelection = function (fruitName) {
					var idxx = $scope.selected_museums.indexOf(fruitName);

					// Is currently selected
					if (idxx > -1) {
					  $scope.selected_museums.splice(idxx, 1);
					}

					// Is newly selected
					else {
					  $scope.selected_museums.push(fruitName);
					}
				
					make_a_line_chart.build($scope,columnDefs,"museum")
		  };
			
			
			
		
				$scope.$watchGroup(['end_date','start_date'], function(newValue, oldValue) {
					columnDefs=[]
					columnDefs.push(
			{ field: 'museum',		name: "Museum",width:150, pinnedLeft:true, enableColumnMoving:false  }
					
			)
					columnDefs=columnDefs.concat($scope.axis_range.build($scope,$scope.start_date,$scope.end_date))
					
					
					$scope.gridOptions.columnDefs=columnDefs
					make_a_line_chart.build($scope,columnDefs,"museum")
					
			});
	
			$scope.running=false
		}	
		
		$scope.$watch("interval", function(newValue, oldValue) {
			
		
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		$rootScope.canEdit_table=false

		$scope.rows=[]
		$scope.data_rows=[]
		$scope._rows=[]
		$scope.chart_stats=[]
		$scope.selected_chart_stats=[]
		$('input').attr('checked',false)	
			
			$scope.running=true
			if($scope.interval=="Weekly"){
				$scope.axis_range=weekly_data_table_columns
				Weekly_visits.query({}, function(visits) {
					
					Weekly_retail_sales.query({}, function(sales) {
					
							Weekly_welcomedesk.query({}, function(welcome) {
							
							
							Weekly_donations.query({}, function(donations) {
					
								$scope.windup(sales,"",welcome,"","",donations,visits,"")	
			})
			})
			})
			})
			}
			else
			{
				
				$scope.axis_range=monthly_data_table_columns	
				$scope.windup($scope.sales,$scope.gallery_visits,$scope.welcome,$scope.products,$scope.orders,$scope.team,$scope.visits,$scope.gates)
				
					
			}
		});
			Monthly_retail_sales.query({}, function(sales) {
					$scope.sales=sales
				Monthly_teg.query({}, function(gallery_visits) {
					$scope.gallery_visits=gallery_visits
					Monthly_welcomedesk.query({}, function(welcome) {
						$scope.welcome=welcome
						Monthly_products_published.query({}, function(products) {
							$scope.products=products
							Monthly_products_sold_online.query({}, function(orders) {
								$scope.orders=orders
								Monthly_donations.query({}, function(team) {
									$scope.team=team
									Monthly_visits.query({}, function(visits) {
										$scope.visits=visits
										Monthly_turnstiles.query({}, function(gates) {
										$scope.gates=gates
											
										})
									})
								})
							})
						})
					})	
				})
			})		
	
}				







