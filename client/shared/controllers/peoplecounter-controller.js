angular.module('app').controller('peoplecounter', ['$scope',
    '$http',
    '$q',
    '$routeParams',
    '$location',
    'screen_saver_loop',
    '$location',
    '$rootScope',
    'detect_dragging', 'trello', 'get_trello_board', 'date_calc', 'Todos', 'Tallys','Team','people_activity',
    function($scope, $http, $q, $routeParams, $location,
        screen_saver_loop, $location, $rootScope, detect_dragging, trello, get_trello_board, date_calc, Todos, Tallys,Team,people_activity
    ) {
console.log('controller loadx')
   	$scope.datePicker="";
	$scope.datePicker.date = {startDate: null, endDate: null};
	

$scope.machine_types = [];
$scope.type="all";
$scope.changedValue = function(type) {
			$scope.data=[]
			$scope.series=[]
			$scope.category=[]
			$scope.type=type
			plot_graph()			 
 }   


$scope.machinesx=["all"]
$scope.filterCondition = {
        machine: 'neq'
}
$scope.$watch('type', function(type) {
$scope.machinesx=["all"]
	plot_graph('type')

})	
	  
$scope.$watch('datePicker', function() {
plot_graph();
})
	  

$scope.$watch('machine', function() {

			
			plot_graph('machine')	
})
  // selected fruits
  $scope.machine_types_selection = [];



  $scope.categories = [];

  // selected fruits
  $scope.category_selection = [];

 

 
var _data=[];
    $scope.data = []
	$scope.day_data=[]
    $scope.team = [];
	$scope.labels= $scope.team
  $scope.chart_title="Machine activity"

    var series_a = []
	
	var firstTime=true
	
	
	
	
	
	var plot_graph = function(mode) {
	$scope.data=[];
	$scope.series=[];
	$scope.day_series=[];
	$scope._series=[];
	$scope.week_day_series=[];
	
	if(!mode){
	$scope.machinesx=[]	
}	


$scope.categories=[]

		 people_activity.yesterday().then(function(data) { //2. so you can use .then()
		console.log('data',data)
				_.each(yesterday, function(data) {
					//if(firstTime==true){
					 console.log(data)
					console.log(data.type==$scope.type,data.kiosk)
					console.log('$scope.type',$scope.type)
					console.log('data.type',data.type)
					if(($scope.type=="all") || ($scope.type==data.type && mode!="machine")){
						//$scope.machine_types=[]
						
						$scope.machinesx.push(data.kiosk)
					}
					//}
						
					if($scope.type=="all" ||$scope.type==data.type){
								if($scope.machine=="all" ||$scope.machine==data.kiosk){
										$scope._series[data.kiosk] = []
										$scope.week_day_series[data.kiosk] = []
										
								}
					}
						 				 
				})	
	 
			_.each(data.data['machine_types'], function(data) {
				if(firstTime==true){
					$scope.machine_types.push(data.machine_type)
					}
				
				})	
				
				firstTime=false
				 $scope.categories=[]
				
					_.each(data.data['categories'], function(data) {
					
					 $scope.categories.push(data.category)
				})	
				
				  _.each(data.data['all'], function(row) {
					  
						if($scope._series[row.kiosk]){
							$scope._series[row.kiosk].push({
								x: row.date,
								y: row.count
							})
							}
							
							
				})
				$scope.week_days=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
				
				_.each( $scope.week_days, function(day_of_week) {
				  _.each(data.data['week_day'], function(row) {
					  
						if($scope.week_day_series[row.kiosk] && (row.kiosk==$scope.machine || $scope.machine=="all")){
							
							
								if(row.date==day_of_week){								
									$scope.week_day_series[row.kiosk].push(	row.count)
								}
							
						}
							
						})	
							
				})

				  for (var member in $scope._series) {
						if ($scope._series.hasOwnProperty(member)) {
						
							$scope.series.push(member);
						}
					}

					for (var member in $scope._series) {
						if ($scope._series.hasOwnProperty(member)) {

							$scope.data.push($scope._series[member]);
						}
					}	

				
_data=[]
					for (var member in $scope.week_day_series) {
					
						if ($scope.week_day_series.hasOwnProperty(member)) {
						$scope.day_series.push(member);

							_data.push( $scope.week_day_series[member])
							
						}
					}

  					$scope.day_labels = $scope.week_days;
					$scope.day_data = _data
					
			})				
	}

		
$scope.day_onClick = function(points, evt) {
       // console.log(points, evt);
    };
    $scope.day_datasetOverride = [{
        yAxisID: 'y-axis-1'
    }];
   
	

  
  
  

    $scope.onClick = function(points, evt) {
       // console.log(points, evt);
    };
    $scope.datasetOverride = [{
        yAxisID: 'y-axis-1'
    }];
    $scope.options = {
	tension:0,
	 bezierCurve: false,
        scales: {
            xAxes: [{
                type: 'time',
                unit: 'hour',
				
                unitStepSize: 0.05,
                  time: {
        displayFormats: {
           'day': 'MMM DD'
        }
                }
            }],
            yAxes: [{
                    id: 'y-axis-1',
                    type: 'linear',
                    display: true,
                    position: 'left'
                }
            ]
        }
    };
	
	var count = 0


        //  $scope.kiosk = app_settings.kiosk || "null"
        // $scope.call_to_action = app_settings.call_to_action
        kiosk_path = $routeParams.kiosk
            //  screensaver = app_settings.screensaver //services
        screensaver = ""
        $scope.start_screen_saver = function() {
           // screen_saver_loop.start_screen_saver()

        };
        $scope.functionThatReturnsStyle = function() {
            // return app_functons.functionThatReturnsStyle($routeParams.kiosk)

        };
        $scope.changeheadingcolor = function() {
            // return app_functons.changeheadingcolor($routeParams.kiosk)

        };
        if ($rootScope.screensaver_on != true) {
           // console.log('start screensaver')
           // screen_saver_loop.start_screen_saver();
        }

     
		$scope.lists = []
		
	$scope.listscores = function(list) {	
		//console.log('list',list)
		 
				_.each(list, function(row) {
					
					//console.log(row)
								list=[]
								list.title = row.kiosk
								list.average = row.penalty
								list.age = (10-1/(row.penalty)*10 ).toFixed(0)
								list.tint = row.penalty / 100
								list.card_count = row.card_count
								list.points = row.score  //(row.card_count / (row.penalty + 1)).toFixed(1)	
							$scope.lists.push(list)
				})
		
		
	}

	 people_activity.comments_all().then(function(data) { //2. so you can use .then()
	 
	  satisfact_pie(data)
	 })
	
		
	  function satisfact_pie(comments) {
     
               
				
				
				 $scope.kiosks=[]
				var series_a=[]
				var labels=[]
			
					$scope.pie_labels=[]
				$scope.pie_data=[]
				$scope.pie_options=[]
				$scope.datax=[]
				_.each(comments.data['satisfaction_tally'] , function( row) {
				
			
			if($scope.kiosks.indexOf(row.kiosk)==-1){
				$scope.kiosks.push(row.kiosk)
					series_a[row.kiosk]=[]
				$scope[row.kiosk]=[]
				labels[row.kiosk]=[]
				
				
			}
				
			
				
		
			
				series_a[row.kiosk].push( Math.round(row.count ))
				labels[row.kiosk].push( row.satisfaction )
				
				
				
				console.log(labels)
				})
			
				_.each($scope.kiosks , function( kiosk, i) {
					
					$scope.pie_labels[i] = labels[kiosk];
					$scope.datax[i] = series_a[kiosk];
					$scope.pie_options[i] = { legend: { display: false },
										tooltips: {
													enabled: true,
													mode: 'single',
													callbacks: {
														
														label: function(tooltipItems, data) { 
														
														var label =data.labels[tooltipItems.index]
															return label+ " " + data.datasets[0].data[tooltipItems.index] + '';
															
														}	
												
													}
										}
					}
		})

				
				
				
		}		
	
}])