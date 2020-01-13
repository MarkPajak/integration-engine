



exports.tableFilterService = function(AuthService,$rootScope) {	

 return {
   
  }
		

}
exports.dynamicTableCellFilter_donations_other= function() {
	
					 return function(grid, row, col, rowRenderIndex, colRenderIndex	){		
								if(row.entity){
										if(row.entity.csstype){
											
												return (row.entity.csstype)
										}
											
										if(row.entity.csstype){
											if(row.entity.csstype=="bold" ){
												return ("bold")
										}
										
										
										else
											return ""
										}
								}
										
																																
					}

}

exports.dynamicTableCellFilter_donations_kiosk= function() {
	
					 return function(grid, row, col, rowRenderIndex, colRenderIndex	){		
								if(row.entity){
										if(row.entity.csstype){
											
												return (row.entity.csstype)
										}
											
										if(row.entity.csstype){
											if(row.entity.csstype=="bold" ){
												return ("bold")
										}
										
										
										else
											return ""
										}
								}
										
																																
					}

}

exports.dynamicTableCellFilter_donations= function() {
	
					 return function(grid, row, col, rowRenderIndex, colRenderIndex	){		
								if(row.entity){
										if(row.entity.csstype){
											
												return (row.entity.csstype)
										}
											
										if(row.entity.csstype){
											if(row.entity.csstype=="bold" ){
												return ("bold")
										}
										
										
										else
											return ""
										}
								}
										
																																
					}

}

exports.dynamicTableCellFilter_corporate= function() {
	
					 return function(grid, row, col, rowRenderIndex, colRenderIndex	){		
								if(row.entity){
										if(row.entity.csstype){
											
												return (row.entity.csstype)
										}
											
										else if(row.entity.stat){
											if(row.entity.typex=="retail" ){
												return ("bold")
										}
										else
											return ""
										}
										}
								}
										
																																
}

exports.dynamicTableCellFilter_retail= function() {
	
					 return function(grid, row, col, rowRenderIndex, colRenderIndex	){		
								if(row.entity){
										if(row.entity.csstype){
											
												return (row.entity.csstype)
										}
											
										else if(row.entity.stat){
											if(row.entity.typex=="retail" ){
												return ("bold")
										}
										else
											return ""
										}
										}
								}
										
																																
}



exports.dynamicTableCellFilter = function() {
	
					 return function(grid, row, col, rowRenderIndex, colRenderIndex	){		
								if(row.entity){
								
							
										if(row.entity.csstype){
										
												return (row.entity.csstype)
										}
										
										if(row.entity.stat){
										
										if(row.entity.stat=="Summary" ){
												return ("summary_row")
										}
										
											if(row.entity.stat=="Visits" ){
												return ("bold")
										}
										else
											return ""
										}
								}
										
																																
}

}

exports.getDateService = function($rootScope) {	


		 start_date=new Date("2019/04/01")
		end_date= new Date(moment(start_date).add('years', 1).format("YYYY/MM/DD"))
		 end_date.setDate(end_date.getDate()-1);
		  
		  function getDate() {
		  
		  var date=[]
		  date.push(start_date)
		  date.push(end_date)
			return date;
		  }
		  function setDate(start_date,end_date) {
			
			   var date=[]
		 

			date.push(start_date)
			date.push(end_date)
			$rootScope.$broadcast('date:updated',date);
			 
			start_date=start_date
			 end_date=end_date
			
		  }
		  return {
			getDate: getDate,
			setDate: setDate,
		  }
				

}

exports.data_table_reload = function() {	


  var date= moment().startOf( 'day')._d
  
  
  function getDate() {
    return date;
  }
  function setDate(newDate) {
    date = newDate;
  }
  return {
    getDate: getDate,
    setDate: setDate,
  }
		

}

exports.table_security = function(AuthService,$rootScope) {	

		$rootScope.pageOptions = { isView : false};
		$rootScope.canEdit = function () { return $rootScope.pageOptions.isView; };
		$rootScope.isloggedin=false	
		  AuthService.isLoggedIn().then(function(user){
			if($rootScope.canEdit_table==true){
				$rootScope.pageOptions = { isView : true};
			}
			
			$rootScope.isloggedin=true
	    })
	return this	

}
	exports.get_table_data_team = function($rootScope,data_table_reload) {	



var self = this
var array = {};
var myScope


			
			array.filter_x= function(filter_key,filter_value,$scope){
					console.log('filter_x')
			
		
			
			
			if($scope){
				myScope=$scope
			}
			
			
	
			
			
			var query = {'team_id':"#","exact":false};
			query[filter_key]=filter_value
			
			if($scope.extraQuery){
								_.extend(query, $scope.extraQuery)
								// $scope.extraQuery[filter_key]	=filter_value
							}
				
				$rootScope.featured_collection.query(query, function(team) {
							$scope.rows=[]
							$scope._rows=[]
							
							console.log('filtering ' + team.length + " results")
							
							
							_.each(team,function(row){
									
									$scope._rows.push(row)
										
							})

						 $scope.gridOptions.data.length = 0;
						  angular.forEach( $scope._rows, function( row ) {
							$scope.gridOptions.data.push( row );
						  });
						 
						  
						  	$scope.$watch(function () {
			
								return data_table_reload.getDate();


								
								
			},
			
		   function (value) {
		 
		   
		   }
		);
						
					})			 
			}
			
		
			
			
			array.getData= function(filterdate,$scope){
		
			//console.log('filterdate',filterdate)
		//	console.log('getData')
			if($scope){
			myScope=$scope
			}
					if(filterdate){
							
							console.log('all dates after',filterdate)
							console.log(filterdate)
							var filter_month = moment().month()
							console.log('filter_month',filter_month)
							filterdate=moment(filterdate)._d
							
					}
					else
					{
						
						
							var filter_month = moment().month()
							filterdate=moment(new Date()).subtract({'years': 1})
							filterdate=moment(filterdate)._d
							console.log('all dates after',filterdate)
					
					}
							var end_date = $scope.end || new Date()
							 end_date.setDate(end_date.getDate() + 1);
							var query = {'team_id':"#","date_value":moment(filterdate).format("YYYY-MM-DD"),"exact":false,"end_value":end_date};
							
							if($scope.extraQuery){
								_.extend(query, $scope.extraQuery)
							}
							 
							 console.log('query',query)
							 
							$rootScope.featured_collection.query(query, function(team) {
							$scope.rows=[]
							$scope._rows=[]
							
							console.log('filtering ' + team.length + " results")
							
							
							_.each(team,function(row){
							
							if(filterdate){
									var data_month = moment(row.date_value).month()
																		
									
								if(moment(row.date_value)._d>=moment(filterdate)._d  && row.team_id!=""){					
									console.log('pushing row',row)
									$scope._rows.push(row)
									
								}
							}
							else
							{
								console.log('displaying all data')
								$scope._rows.push(row)
							
							}
								
										
							})

						 $scope.gridOptions.data.length = 0;
						  angular.forEach( $scope._rows, function( row ) {
							$scope.gridOptions.data.push( row );
						  });
						  
						  
						  	$scope.$watch(function () {
			
			return data_table_reload.getDate();


			},
			
		   function (value) {
		 
		   
		   }
		);
						
					})	
					
			$rootScope.alldata=function (val) {
					console.log('alldata')

						if (val=="month"){
						
							console.log('show month data')
							var date = new Date(), y = date.getFullYear(), m = date.getMonth();
							var firstDay = new Date(y, m, 1);
							var lastDay = new Date(y, m + 1, 0);
							firstDay = moment(firstDay);
							array.getData(firstDay,myScope)
						}
						else if (val)
						{
								console.log('show month data')
							var date = new Date(val), y = date.getFullYear(val), m = date.getMonth(val);
							console.log('filtering on month', m)
							var firstDay = new Date(y, m, 1);
							var lastDay = new Date(y, m + 1, 0);
							firstDay = moment(firstDay)._d;
							array.getData(firstDay,myScope)	

						}
						else 
						{
							console.log('show all data')
							array.getData("",myScope)		

						}


			}
			
			
			$rootScope.dynamic_filter=function (filter_key,filter_value) {
				console.log('dynamic_filter')
			
			array.filter_x(filter_key,filter_value,myScope)
			
			}
			
		}	

		
   return array;
}

exports.get_table_data_nomusem_notype = function($rootScope,data_table_reload) {	



	var self = this
	var array = {};
	var myScope
	
	
				
				array.filter_x= function(filter_key,filter_value,$scope){
				
			
				
				
				if($scope){
					myScope=$scope
				}
				
				
		
				
				
				var query = {"exact":false};
				query[filter_key]=filter_value
				
				if($scope.extraQuery){
									_.extend(query, $scope.extraQuery)
									// $scope.extraQuery[filter_key]	=filter_value
								}
					
					$rootScope.featured_collection.query(query, function(team) {
								$scope.rows=[]
								$scope._rows=[]
								
								console.log('filtering ' + team.length + " results")
								
								
								_.each(team,function(row){
										
										$scope._rows.push(row)
											
								})
	
							 $scope.gridOptions.data.length = 0;
							  angular.forEach( $scope._rows, function( row ) {
								$scope.gridOptions.data.push( row );
							  });
							  
							  
								  $scope.$watch(function () {
				
									return data_table_reload.getDate();
	
	
				},
				
			   function (value) {
			 
			   
			   }
			);
							
						})			 
				}
				
			
				
				
				array.getData= function(filterdate,$scope){
				console.log('getData')
				console.log('filterdate',filterdate)
				if($scope){
				myScope=$scope
				}
						if(filterdate){
						console.log('all dates after',filterdate)
								console.log(filterdate)
								var filter_month = moment().month()
								console.log('filter_month',filter_month)
								filterdate=moment(filterdate)._d
								
						}
						else
						{
							
							
								var filter_month = moment().month()
								filterdate=moment(new Date()).subtract({'years': 1})
								filterdate=moment(filterdate)._d
								console.log('all dates after',filterdate)
						
						}
						
								var query = {"date_value":moment(filterdate).format("YYYY-MM-DD"),"exact":false,"end_value":moment($scope.end).format("YYYY-MM-DD")};
								
								if($scope.extraQuery){
									_.extend(query, $scope.extraQuery)
								}
								 
								 console.log('query',query)
								 
								$rootScope.featured_collection.query(query, function(team) {
								$scope.rows=[]
								$scope._rows=[]
								
								console.log('filtering ' + team.length + " results")
								
								
								_.each(team,function(row){
								
								if(filterdate){
										var data_month = moment(row.date_value).month()
																			
										
									if(moment(row.date_value)._d>=moment(filterdate)._d  && row.museum_id!=""){					
										
										$scope._rows.push(row)
										
									}
								}
								else
								{
									console.log('displaying all data')
									$scope._rows.push(row)
								
								}
									
											
								})
	
							 $scope.gridOptions.data.length = 0;
							  angular.forEach( $scope._rows, function( row ) {
								$scope.gridOptions.data.push( row );
							  });
							  
							  
								  $scope.$watch(function () {
				
				return data_table_reload.getDate();
	
	
				},
				
			   function (value) {
			 
			   
			   }
			);
							
						})	
						
				$rootScope.alldata=function (val) {
	
							if (val=="month"){
							
								console.log('show month data')
								var date = new Date(), y = date.getFullYear(), m = date.getMonth();
								var firstDay = new Date(y, m, 1);
								var lastDay = new Date(y, m + 1, 0);
								firstDay = moment(firstDay);
								array.getData(firstDay,myScope)
							}
								
							
							else if (val)
							{
									console.log('show month data',myScope.start)
								var date = new Date(val), y = date.getFullYear(val), m = date.getMonth(val);
								console.log('filtering on month', m)
								var firstDay = new Date(myScope.start);
								var lastDay = new Date(myScope.end);
								firstDay = moment(firstDay)._d;
								array.getData(firstDay,myScope)	
	
							}
							else 
							{
								console.log('show all data')
								array.getData("",myScope)		
	
							}
	
	
				}
				
				
				$rootScope.dynamic_filter=function (filter_key,filter_value) {
				
				array.filter_x(filter_key,filter_value,myScope)
				
				}
				
			}	
	
			
	   return array;
	}

exports.get_table_data_nomusem = function($rootScope,data_table_reload) {	



var self = this
var array = {};
var myScope


			
			array.filter_x= function(filter_key,filter_value,$scope){
			
		
			
			
			if($scope){
				myScope=$scope
			}
			
			
	
			
			
			var query = {'type':"#","exact":false};
			query[filter_key]=filter_value
			
			if($scope.extraQuery){
								_.extend(query, $scope.extraQuery)
								// $scope.extraQuery[filter_key]	=filter_value
							}
				
				$rootScope.featured_collection.query(query, function(team) {
							$scope.rows=[]
							$scope._rows=[]
							
							console.log('filtering ' + team.length + " results")
							
							
							_.each(team,function(row){
									
									$scope._rows.push(row)
										
							})

						 $scope.gridOptions.data.length = 0;
						  angular.forEach( $scope._rows, function( row ) {
							$scope.gridOptions.data.push( row );
						  });
						  
						  
						  	$scope.$watch(function () {
			
								return data_table_reload.getDate();


			},
			
		   function (value) {
		 
		   
		   }
		);
						
					})			 
			}
			
		
			
			
			array.getData= function(filterdate,$scope){
			console.log('getData')
			console.log('filterdate',filterdate)
			if($scope){
			myScope=$scope
			}
					if(filterdate){
					console.log('all dates after',filterdate)
							console.log(filterdate)
							var filter_month = moment().month()
							console.log('filter_month',filter_month)
							filterdate=moment(filterdate)._d
							
					}
					else
					{
						
						
							var filter_month = moment().month()
							filterdate=moment(new Date()).subtract({'years': 1})
							filterdate=moment(filterdate)._d
							console.log('all dates after',filterdate)
					
					}
					
							var query = {'type':"#","date_value":moment(filterdate).format("YYYY-MM-DD"),"exact":false,"end_value":moment($scope.end).format("YYYY-MM-DD")};
							
							if($scope.extraQuery){
								_.extend(query, $scope.extraQuery)
							}
							 
							 console.log('query',query)
							 
							$rootScope.featured_collection.query(query, function(team) {
							$scope.rows=[]
							$scope._rows=[]
							
							console.log('filtering ' + team.length + " results")
							
							
							_.each(team,function(row){
							
							if(filterdate){
									var data_month = moment(row.date_value).month()
																		
									
								if(moment(row.date_value)._d>=moment(filterdate)._d  && row.museum_id!=""){					
									
									$scope._rows.push(row)
									
								}
							}
							else
							{
								console.log('displaying all data')
								$scope._rows.push(row)
							
							}
								
										
							})

						 $scope.gridOptions.data.length = 0;
						  angular.forEach( $scope._rows, function( row ) {
							$scope.gridOptions.data.push( row );
						  });
						  
						  
						  	$scope.$watch(function () {
			
			return data_table_reload.getDate();


			},
			
		   function (value) {
		 
		   
		   }
		);
						
					})	
					
			$rootScope.alldata=function (val) {

						if (val=="month"){
						
							console.log('show month data')
							var date = new Date(), y = date.getFullYear(), m = date.getMonth();
							var firstDay = new Date(y, m, 1);
							var lastDay = new Date(y, m + 1, 0);
							firstDay = moment(firstDay);
							array.getData(firstDay,myScope)
						}
							
						
						else if (val)
						{
								console.log('show month data',myScope.start)
							var date = new Date(val), y = date.getFullYear(val), m = date.getMonth(val);
							console.log('filtering on month', m)
							var firstDay = new Date(myScope.start);
							var lastDay = new Date(myScope.end);
							firstDay = moment(firstDay)._d;
							array.getData(firstDay,myScope)	

						}
						else 
						{
							console.log('show all data')
							array.getData("",myScope)		

						}


			}
			
			
			$rootScope.dynamic_filter=function (filter_key,filter_value) {
			
			array.filter_x(filter_key,filter_value,myScope)
			
			}
			
		}	

		
   return array;
}

exports.get_table_data = function($rootScope,data_table_reload) {	



var self = this
var array = {};
var myScope


			
			array.filter_x= function(filter_key,filter_value,$scope){
			
		
			
			
			if($scope){
				myScope=$scope
			}
			
			
	
			
			
			var query = {'museum_id':"#","exact":false};
			query[filter_key]=filter_value
			
			if($scope.extraQuery){
								_.extend(query, $scope.extraQuery)
								// $scope.extraQuery[filter_key]	=filter_value
							}
				
				$rootScope.featured_collection.query(query, function(team) {
							$scope.rows=[]
							$scope._rows=[]
							
							console.log('filtering ' + team.length + " results")
							
							
							_.each(team,function(row){
									
									$scope._rows.push(row)
										
							})

						 $scope.gridOptions.data.length = 0;
						  angular.forEach( $scope._rows, function( row ) {
							$scope.gridOptions.data.push( row );
						  });
						  
						  
						  	$scope.$watch(function () {
			
								return data_table_reload.getDate();


			},
			
		   function (value) {
		 
		   
		   }
		);
						
					})			 
			}
			
		
			
			
			array.getData= function(filterdate,$scope){
			console.log('getData')
			console.log('filterdate',filterdate)
			if($scope){
			myScope=$scope
			}
					if(filterdate){
					console.log('all dates after',filterdate)
							console.log(filterdate)
							var filter_month = moment().month()
							console.log('filter_month',filter_month)
							filterdate=moment(filterdate)._d
							
					}
					else
					{
						
						
							var filter_month = moment().month()
							filterdate=moment(new Date()).subtract({'years': 1})
							filterdate=moment(filterdate)._d
							console.log('all dates after',filterdate)
					
					}
					
							var query = {'museum_id':"#","date_value":moment(filterdate).format("YYYY-MM-DD"),"exact":false,"end_value":moment($scope.end).format("YYYY-MM-DD")};
							
							if($scope.extraQuery){
								_.extend(query, $scope.extraQuery)
							}
							 
							 console.log('query',query)
							 
							$rootScope.featured_collection.query(query, function(team) {
							$scope.rows=[]
							$scope._rows=[]
							
							console.log('filtering ' + team.length + " results")
							
							
							_.each(team,function(row){
							
							if(filterdate){
									var data_month = moment(row.date_value).month()
																		
									
								if(moment(row.date_value)._d>=moment(filterdate)._d  && row.museum_id!=""){					
									
									$scope._rows.push(row)
									
								}
							}
							else
							{
								console.log('displaying all data')
								$scope._rows.push(row)
							
							}
								
										
							})

						 $scope.gridOptions.data.length = 0;
						  angular.forEach( $scope._rows, function( row ) {
							$scope.gridOptions.data.push( row );
						  });
						  
						  
						  	$scope.$watch(function () {
			
			return data_table_reload.getDate();


			},
			
		   function (value) {
		 
		   
		   }
		);
						
					})	
					
			$rootScope.alldata=function (val) {

						if (val=="month"){
						
							console.log('show month data')
							var date = new Date(), y = date.getFullYear(), m = date.getMonth();
							var firstDay = new Date(y, m, 1);
							var lastDay = new Date(y, m + 1, 0);
							firstDay = moment(firstDay);
							array.getData(firstDay,myScope)
						}
							
						
						else if (val)
						{
								console.log('show month data',myScope.start)
							var date = new Date(val), y = date.getFullYear(val), m = date.getMonth(val);
							console.log('filtering on month', m)
							var firstDay = new Date(myScope.start);
							var lastDay = new Date(myScope.end);
							firstDay = moment(firstDay)._d;
							array.getData(firstDay,myScope)	

						}
						else 
						{
							console.log('show all data')
							array.getData("",myScope)		

						}


			}
			
			
			$rootScope.dynamic_filter=function (filter_key,filter_value) {
			
			array.filter_x(filter_key,filter_value,myScope)
			
			}
			
		}	

		
   return array;
}

exports.grid_ui_settings = function(AuthService) {	

var array = {};

array.monthly= function(columns,scope) {	

	scope.isloggedin=false	
	
		  AuthService.isLoggedIn().then(function(user){
				
		scope.isloggedin=true
			
			
	  })


return {	
			columnDefs:columns,
			enableFiltering:true,
			enableCellEdit:true,
			cellEditableCondition: scope.canEdit ,			
			enableGridMenu: true,
			enableSelectAll: true,
			enableCellSelection: false,
			enableCellEditOnFocus: false,
			exporterCsvFilename: 'myFile.csv',
			exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
			onRegisterApi: function(gridApi){
			scope.gridApi = gridApi;
			
			
			//gridApi.core.addToGridMenu( gridApi.grid, [{ title: 'Dynamic item', order: 100}]);
		
		
		
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
			
			var key4 = "requested_by";
			var obj4 = {};
			obj4[key4] =rowEntity.requested_by
			
			update.push(obj3);
			setupArray = _.extend(obj1, obj2);
			setupArray = _.extend(setupArray, obj3);
			setupArray = _.extend(setupArray, obj4);
			
				var query = {'id':rowEntity._id};
						scope.featured_collection.update(query, 	setupArray
							 
								, function(err, affected, resp) {

scope.changed++	
								
								
						})
			  });
				}
}

}
		
   return array;
}

exports.weekly_data_table_columns = function() {	
		

var array = {};


array.build  = function (scope,start_date,end_date) {
  
  var columns = []
  
  start=moment(start_date).year()
  end=moment(end_date).year()
  

  
  
	for (year = start; year <= end; year++) { 
			for (week = 0; week < moment().isoWeeksInYear(); week++) { 
			
			axisDate= moment().day("Monday").year(year)
					
			if(axisDate._d>=moment(start_date) && axisDate._d<=moment(end_date)){
			console.log(moment(start_date))
				columns.push({ field: axisDate.week(week).format('DD/MM/YY'),name:axisDate.week(week).format('DD/MM/YY'),width: "80"})
			}
		}
			
			}
	   


			return columns

	};
	

    return array;

}
exports.yearly_data_table_columns = function() {	
		

var array = {};


array.build  = function (scope,start_date,end_date) {
  
  var columns = []
  
  start=moment(start_date).year()
  end=moment(end_date).year()

	for (year = start; year <= end; year++) { 


		
						
									var financial_yesr_text = ["last","this"]
									_.each(financial_yesr_text,function(financial_yer_text){
									
			
												var financial_year_display=""
												if(financial_yer_text=="this"){
												financial_year_display=	year+"-"+((year+1).toString().substring(2))
												}
												else
												{
												financial_year_display=	(year-1)+"-"+(year.toString().substring(2))	
												}

									columns.push({ field:financial_year_display,	
									name: financial_year_display,width:  "80"})
									
									scope.filter_pie.push({value:financial_year_display,
														name:financial_year_display
														})
											
										
									})
									
							
}
	return columns




		

	};
	

    return array;

}

exports.vertical_monthly_data_table_columns = function() {	
		

var array = {};


array.build  = function (scope,start_date,end_date) {
  
  var columns = []
  
  start=moment(start_date).year()
  end=moment(end_date).year()

	for (year = start; year <= end; year++) { 


			_.each(scope.data_columns,function(column_name){	
			//n.b. fields now need to be data label names so only one date column needed
			
				columns.push({ field: column_name,width: "80"})
				//scope.filter_pie.push({value:month+" "+year,name:month+" "+year})
			})

	   
}

			return columns

	};
	

    return array;

}
exports.monthly_data_table_columns_retail = function() {	
		

var array = {};


array.build  = function (scope,start_date,end_date) {
  
  var columns = []
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];



  start=moment(start_date).year()
  end=moment(end_date).year()
  start_month=moment(start_date).month()
  end_month=moment(end_date).month()
 
 
 var firstrun=true
	for (year = start; year <= end; year++) { 
month_num=0
			_.each(moment.monthsShort(),function(month){	
			month_num++
if(month_num==4){
							columns.push({ cellFilter:  'valueFilter:row.entity',field: "Total "+year ,width: "100",	  cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
																															
																														
																															if(row.entity[col.colDef.field]){
																																if(typeof row.entity[col.colDef.field].indexOf === "function"){
																																	if(row.entity[col.colDef.field].indexOf("-")!=-1){
																																	return ("red")
																																}
																															}
																															if(row.entity){
																																if(row.entity.csstype){
																																
																																	return (row.entity.csstype)
																																}
																																}
																																
																																
																															}
																															
																															
																															
																															}})
				}
			console.log('start_month',start_month)
			console.log('monthNames.indexOf(month)',monthNames.indexOf(month))
			console.log(year==end && month_num>monthNames.indexOf(month))
			if(firstrun==true && month!=monthNames[start_month] || year==end && month_num>start_month) return;
				columns.push({ cellFilter:  'valueFilter_retail:row.entity', field: month+" "+year,	name: month+" "+year.toString().substring(2),width: "100",	  cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
																															
																														
																															if(row.entity[col.colDef.field]){
																																if(typeof row.entity[col.colDef.field].indexOf === "function"){
																																	if(row.entity[col.colDef.field].indexOf("-")!=-1){
																																	return ("red")
																																}
																															}
																															}
																																
																															if(row.entity){
																																if(row.entity.csstype){
																																
																																	return (row.entity.csstype)
																																}
																															}
																															else if(row.entity.stat){
																																if(row.entity.typex=="retail"){
																																
																																	return ("bold")
																																}
																															}
																															
																															if(row.entity.xtype){
																																if(row.entity.xtype=="donations" ){
																																	return ("bold")
																																}
																															}
																																
																															
																															
																															
																															
																															}
																															
																															
																															})
				scope.filter_pie.push({value:month+" "+year,name:month+" "+year})
				firstrun=false
			
			})

	   
}

			return columns

	};
	

    return array;

}

exports.yearly_percentage_difference = function(){
	
	var array = {};
	
	array.build  = function (scope) {
		
			_.each(scope._rows,function(row,i){	

					
							var new_row = {}
								//new_row.museum="Total"
								new_row.museum="% difference"
								new_row.typex="retail"
								new_row.xtype="currency"
								new_row.cssclass="summary_row"
								new_row.csstype="summary_row"
								console.log('new_row',row)
								
								if(row.museum=="Total" || row.museum=="Income - total"){					
									for(var key in row) {
										_.each(scope._rows,function(rowX){
											for(var keyX in rowX) {
												if(rowX.museum=="Last year" && key ==keyX ){	
													if(row[key]>0 && rowX[keyX]>0){
														//need to detect if it is a full month
														percantage=((key,row[key]/rowX[keyX])*100-100).toFixed(2)+"%";
														new_row[key]=percantage
														console.log('new_row',new_row)
													}
												}
											}
										})
									}
										scope._rows.push(new_row)
								}
							
				})	
				
		
			
	}
	
	return array;




}

exports.yearly_totals = function(){
	
	var array = {};
	
	array.build  = function (scope) {
		
			_.each(scope._rows,function(row,i){	
			
			//console.log('row',row)
	
				if(row.museum=="Running total") 	return;		
				if(row.museum=="Last Year") 		return;		
				if(row.stat=="Yearly Total")	   return;
			
			//if(row.stat=="Children - Last year") return;	
					
					start=moment(scope.start_date).year()-2
					end=moment(scope.end_date).year()+1 //financial year compared to this month stuff
					
					
					start_month=moment(scope.start_date).month()
					end_month=moment(scope.end_date).month()
 
 
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
							
							
							if( !(scope._rows[i]["Total " + (parseInt(year))])){
								scope._rows[i]["Total " + (parseInt(year))]=0
							}
						
							if((row[month+" "+(parseInt(year))])){
								
								//if((row[month+" "+(parseInt(year))])>0){
															
									scope._rows[i]["Total " + (parseInt(year)-1)]+=parseInt(row[month+" "+(parseInt(year))]) 
								
								
							
								
								//}
						
							}
							
						}
						
						
							if(month_num==4){
							
							if( !(scope._rows[i]["Total " + (parseInt(year))])){
								scope._rows[i]["Total " + (parseInt(year))]=0
							}
						
							if( (row[month+" "+(parseInt(year))])){
								
								//if( (row[month+" "+(parseInt(year))])>0){
															
								scope._rows[i]["Total " + (parseInt(year))]=parseInt(row[month+" "+(parseInt(year))])
								
								//}
						
							}
							
						}
						
								if(month_num>4){
							
							if( !(scope._rows[i]["Total " + (parseInt(year))])){
								scope._rows[i]["Total " + (parseInt(year))]=0
							}
						
							if( (row[month+" "+(parseInt(year))])){
								
							//	if( (row[month+" "+(parseInt(year))])>0){
															
								scope._rows[i]["Total " + (parseInt(year))]+=parseInt(row[month+" "+(parseInt(year))])
								
								//}
						
							}
							
						}
					
	
					}
						
						
						
						
						})
						
						
						
						if(row.stat==row.museum+ " Net sales"){

							top= scope._rows[i]["Total " + (parseInt(year)-1)]
					
						}
						
						if(row.stat=="last year"){

							bottom= scope._rows[i]["Total " + (parseInt(year)-1)]
						
						}
						
						
						if(row.stat=="% last year"){

							scope._rows[i]["Total " + (parseInt(year)-1)]=((top/bottom)*100-100).toFixed(2)+"%"	
	console.log("top="+top)
	console.log("bottom="+bottom)
						}
								
								
					}
				
				
			})
			
	}
	
	return array;




}

exports.monthly_data_table_columns = function() {	
		

var array = {};


array.build  = function (scope,start_date,end_date) {
  
  var columns = []
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];



  start=moment(start_date).year()
  end=moment(end_date).year()
  start_month=moment(start_date).month()
  end_month=moment(end_date).month()
 
 
 var firstrun=true
	for (year = start; year <= end; year++) { 
month_num=0

			_.each(moment.monthsShort(),function(month){	
			month_num++
				if(month_num==4){
							columns.push({ cellFilter:  'valueFilter:row.entity',field: "Total "+year ,width: "100",	  cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
																															
																														
																															if(row.entity[col.colDef.field]){
																																if(typeof row.entity[col.colDef.field].indexOf === "function"){
																																	if(row.entity[col.colDef.field].indexOf("-")!=-1){
																																	return ("red")
																																}
																															}
																															if(row.entity){
																																if(row.entity.csstype){
																																
																																	return (row.entity.csstype)
																																}
																																}
																																
																																
																															}
																															
																															
																															
																															}})
				}
			if(firstrun==true && month!=monthNames[start_month] || year==end && month_num>start_month) return;
				columns.push({ cellFilter:  'valueFilter:row.entity', field: month+" "+year,	name: month+" "+year.toString().substring(2),width: "100",	  cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
																															
																														
																															if(row.entity[col.colDef.field]){
																																if(typeof row.entity[col.colDef.field].indexOf === "function"){
																																	if(row.entity[col.colDef.field].indexOf("-")!=-1){
																																	return ("red")
																																}
																															}
																															if(row.entity){
																																if(row.entity.csstype){
																																
																																	return (row.entity.csstype)
																																}
																																}
																																
																																
																															}
																															
																															
																															
																															}
																															
																															
																															})
				scope.filter_pie.push({value:month+" "+year,name:month+" "+year})
				firstrun=false
			
			})

	   
}

			return columns

	};
	

    return array;

}

exports.make_a_line_chart = function() {	
		

var line = {};


line.build  = function (scope,columnDefs,data_values,label_values) {
  

  var statistics_to_plot = []
  if ( typeof scope.selected_chart_stats != 'string' ) {
	  console.log('statistics_to_plot',statistics_to_plot)
	  statistics_to_plot =scope.selected_chart_stats
	  } 
  else
  {
	  statistics_to_plot.push(scope.selected_chart_stats)
	  
  }
  		scope.series_a=[]
							
							
							
							var line_data=scope._rows
							if(scope.data_rows.length>0){
								   console.log('go line_data' )
								line_data=scope.data_rows
								
							}

	scope.line_series=[]

	var axis_decider
	
  _.each(statistics_to_plot, function(label_value){
						  axis_decider = 0	
					  scope.line_labels=[]	
	
							_.each(line_data, function(row) {
								

							if(scope.selected_museums && scope.selected_museums.indexOf(row[data_values])==-1) return; //museum filter
								
								_.each(columnDefs , function(column) {						
									if(scope.line_labels.indexOf(column.name)==-1){
										scope.line_labels.push(column.name)
									}	
									line_chart_series_labels =row[data_values]+" "+ label_value
					
									if(scope.line_series.indexOf(line_chart_series_labels)==-1){
										line_data[line_chart_series_labels]=[]
										scope.line_series.push(line_chart_series_labels);
									}
									console.log('axis_decider',axis_decider)

											
									
									if(row.stat==label_value){
									if(axis_decider<=row[column.field]) {axis_decider=row[column.field]	}
										line_data[line_chart_series_labels].push(row[column.field]);
									
									
									
									}
								
								})	
											
							})
												
								
								if(axis_decider>scope.axis_threshhold){
												line_data[line_chart_series_labels].yAxisID= 'A'
												console.log('A')												
											}
											 else
											 {	
														console.log('B')										 
												line_data[line_chart_series_labels].yAxisID= 'B'
												//line_data[line_chart_series_labels].lineTension= 0												
											 }
								
 
 
   
	

 })
 
 
 scope.line_data = []
  _.each(scope.line_series , function(data_set) {
	

	
	  scope.line_data.push(line_data[data_set]) 
  })
 scope.datasetOverride = [{ yAxisID: 'A' }, { yAxisID: 'B' }];
  scope.line_options= {
         
		   scales: {
      yAxes: [{
        id: 'A',
        type: 'linear',
        position: 'left',
      }, {
        id: 'B',
        type: 'linear',
        position: 'right',
       /*
	   ticks: {
          max: 1,
          min: 0
        }
		*/
      }]
    },
		 
		 legend: {
            display: true
         },
         tooltips: {
            enabled: true
         },
		  scaleFontColor: "#8a6666",
		  fillColor: "#E7EDF0", strokeColor: "#A9C4D2"
    }

scope.colors =["#023fa5", "#7d87b9", "#bec1d4", "#d6bcc0", "#bb7784", "#8e063b", "#4a6fe3", "#8595e1", "#b5bbe3", "#e6afb9", "#e07b91", "#d33f6a", "#11c638", "#8dd593", "#c6dec7", "#ead3c6", "#f0b98d", "#ef9708", "#0fcfc0", "#9cded6", "#d5eae7", "#f3e1eb", "#f6c4e1", "#f79cd4"]

    };
	

    return line;

}

exports.make_a_pie = function($rootScope) {	
		

var pie = {};


pie.build  = function (scope,data_values,label_values) {
   console.log('go')
							scope.series_a=[]
							scope.pie_data=[]
							scope.pie_labels=[]
							var line_data=scope._rows
							if(scope.data_rows.length>0){
								   console.log('go line_data' )
								line_data=scope.data_rows
								
							}
							
							
							_.each(line_data, function(row) {
								if(row[data_values]>0){
										scope.series_a.push(row[data_values] )
										
										if(scope.pie_labels.indexOf(row[label_values])==-1){
											scope.pie_labels.push(row[label_values]);
									scope.pie_data.push(scope.series_a);
										}
										
								}
								
							})		

					
scope.labels = scope.pie_labels
scope.data = scope.series_a
  scope.options= {
         legend: {
            display: true
         },
         tooltips: {
            enabled: true
         }
    }

scope.colors =["#023fa5", "#7d87b9", "#bec1d4", "#d6bcc0", "#bb7784", "#8e063b", "#4a6fe3", "#8595e1", "#b5bbe3", "#e6afb9", "#e07b91", "#d33f6a", "#11c638", "#8dd593", "#c6dec7", "#ead3c6", "#f0b98d", "#ef9708", "#0fcfc0", "#9cded6", "#d5eae7", "#f3e1eb", "#f6c4e1", "#f79cd4"]

    };
	

    return pie;

}






exports.date_calc = function($http) {	
		

var date_calc = {};

var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
var firstDate = new Date(2008,01,12);
var secondDate = new Date();

date_calc.diffDays  = function (firstDate) {
var firstDate = new Date(firstDate);
         return secondDate.getMonth() - firstDate.getMonth()
       + (12 * (secondDate.getFullYear() - firstDate.getFullYear()));

    };
	

    return date_calc;

}


    
exports.trello = function($http) {	

	

			var trello = {};
			trello.auth = function () {
		
				var authenticationSuccess = function() { 
				console.log("sucessful authentication");
				var token = Trello.token();
				window.location.replace(decodeURIComponent(window.location.hash));
				console.log("Successful authentication");
				};
					var authenticationFailure = function() {alert("Failed authentication"); };

					 Trello.authorize({
					  type: 'redirect',
					  name: 'Bristol Culture Trello Monitor',
					  scope: {
						read: 'true',
						write: 'true' },
					  expiration: 'never',
					  success: authenticationSuccess,
					  error: authenticationFailure
					});
				

			};
			return trello;

}

exports.get_trello_board = function (Team,Tallys,date_calc,$http,$rootScope) {	

console.log('get_trello_board')
    var urlBase =  'https://trello.com/b/GHES2npy/tarantulas.json';
    var trello = []
	var trello_data=[]
    trello.get_data = function (listx) {
	
		//all lists	return  Trello.get("boards/56051e0244bb2e4efc9e6e97/lists", function(cards) {
			
		 return Trello.get("lists/"+listx.id+"/cards", function(cards) {
		 var list = []
			
					list._cards = []
                    tally = 0
                    card_count = 0
					
					
		   angular.forEach(cards, function(card, index) {
                        card_count++

                        card_to_print = {
                            name: card.name,
                            tint: 1 - date_calc.diffDays(card.dateLastActivity) / 10,
                            age: date_calc.diffDays(card.dateLastActivity).toString(),
                            dateLastActivity: card.dateLastActivity
                        }
                        tally += date_calc.diffDays(card.dateLastActivity)


                        list._cards.push(card_to_print)

                    });
				


                    list.average = (tally / card_count).toFixed(2)
                    list.tint = list.average / 100
                    list.card_count = card_count
                    list.points =  (card_count / (list.average/1 + 1)).toFixed(2)
					

					  Team.query({}, function(_team) {
							_.each(_team, function(row) {
								if(row.name==listx.title){
									
									   var tally = new Tallys({
										name: listx.title,
										date: new Date(),
										points: list.points
									});
									//$scope.tallys = Tallys.query();


									tally.$save();
					
					
										var team = Team.get({ id:row._id });
											  team.name= list.title
											  team.score=list.points
											  team.card_count=  list.card_count
											  team.bonus=""
											  teampenalty=list.average 
										$id = row._id;
										 Team.update({ id:$id }, team);
										$rootScope.message="update"	
								}
									
								});
						});
		 
		 console.log('end of service')
		 }).then(
			function (response){
				return response
				
			}
		 )
				
			

    };


		

    return trello;

}



exports.detect_dragging= function($rootScope) {


	
var detect_dragging=[]
 $rootScope.isDragging = false;
var currentPos = [];
detect_dragging.drag_handler= function(){
 $('md-content').on('mousedown', function (evt) {

   currentPos = [evt.pageX, evt.pageY]

 $('md-content').on('mousemove', function handler(evt) {

    currentPos=[evt.pageX, evt.pageY];
    $('#content-scroller').off('mousemove', handler);

  });

 $('md-content').on('mouseup', function handler(evt) {
	
    if(evt.pageX+ evt.pageY==currentPos[0]+currentPos[1]){
			console.log('clicking')
       $rootScope.isDragging = false;
	}
    else
	{
      $rootScope.isDragging = true;
		console.log('dragging')
	}
 $('md-content').off('mouseup', handler);
 
  });

});
}

/* App Module */

  return detect_dragging

}


exports.screen_saver_loop=function($rootScope,$location,$interval,Team) {

	



				//NB make sure any views called int he screensaver dont contain the screensaver service!
				 var sharedService = {};
				 

	var team_list=[]
	var support_list=[]
	var roadmap_list=[]
		var list=[]
	list.title="BMAG DIGITAL SUPPORT"
	list.id="56051e0244bb2e4efc9e6e99"	  
    support_list.push(list)
	
	var list=[]
	list.title="MSHED DIGITAL SUPPORT"
	list.id="562667caadda958dad274f22"	  
    support_list.push(list)
	
	var list=[]
	list.title="ZAHID"
	list.id="5257d4e719e0ee3b5800009c"	  
    team_list.push(list)
	
	var list=[]
	list.title="DARREN"
	list.id="55cdc7672fff3ffc946f6e94"	  
    team_list.push(list)
	
	var list=[]
	list.title="TOM"
	list.id="563234399bfcf125dc06f03b"	  
    team_list.push(list)	
		
		
	var list=[]
	list.title="LACEY"
	list.id="57f3b32311fbe4f9966de748"	  
    team_list.push(list)	

		
	var list=[]
	list.title="FAY"
	list.id="53344421ba92789d64cf8f99"	  
    team_list.push(list)
	
		var list=[]
	list.title="MARK"
	list.id="5790fb082acddb2d98c04826"	  
    team_list.push(list)
	
	var list=[]
	list.title="DAVID"
	list.id="52c3f521160978433b073a9b"	  
    team_list.push(list)
	
	
	
	
	var list=[]
	list.title="Q3"
	list.id="5763ca5d82c12dc42e874e0a"	  
   	  
    roadmap_list.push(list)
	
	var list=[]
	list.title="Q4"
	list.id="5763ca6c8981e9d4c9da0e23"	  
   


   roadmap_list.push(list)
	

	$rootScope.team=team_list
	$rootScope.support=support_list
	$rootScope.roadmap=roadmap_list
	
				 var currentView= ['/a/team','/a/support','/a/roadmap','/board']
				  $rootScope.i = 0
				 var timer
				 
				function switchview(i){
					
						 var videoElement = $('iframe').contents().find("video").get(0)
					
						if(!audioplayer ){var audioplayer=""}
						 var audioElement_not_playing = audioplayer.paused
						 

				if  ((!videoElement || videoElement.paused) && !audioplayer|| audioplayer.paused==true) {
					
			
						
						$rootScope.updateInterval 
						console.log(i)
						if(i>=screensaver.length){i=0;$rootScope.i=0}
						//app_start_log(kiosk,"SCREENSAVER")						
						$location.path( currentView[$rootScope.i])
						$rootScope.i++
					}
					else{
						
						console.log('video playing..cancel')
					}
					
						

				}

				//	$interval.cancel(timer);

				  sharedService.start_screen_saver = function() {
					
			
					  $interval.cancel($rootScope.timer );
					
					if($location.path()!="/screen_saver_images"){	
							$rootScope.screensaver_on=true
						
							$rootScope.timer = $interval(function() { switchview( $rootScope.i) }, 5   * 60*   1000)
					}
					
				  
				  };

				  sharedService.screensaverOff = function() {
						$rootScope.screensaver_on=false
					   $interval.cancel($rootScope.timer );
					   console.log('screensaver off')
					  
				
				   
				  };

				  return sharedService;
}
  
  


