exports.feedbackCtrl =    function($scope, $http, $q, $routeParams, $location,
        screen_saver_loop, $location, $rootScope, detect_dragging, trello, get_trello_board, date_calc, Todos, Tallys,Team,feedback
    ) {


var REFERENCE = moment(); // fixed just for testing, use moment();
$scope.TODAY = REFERENCE.clone().startOf('day');
$scope.YESTERDAY = REFERENCE.clone().subtract(1, 'days').startOf('day');
$scope.A_WEEK_OLD = REFERENCE.clone().subtract(2, 'days').startOf('day');
$scope.datePicker=[];
$scope.datePicker.date = {startDate: $scope.A_WEEK_OLD._d, endDate: $scope.TODAY._d};
$scope.machine_types = [];
$scope.type="INTERPRETATION-KIOSK";
$scope.feedback=[];
$scope.changedValue = function(type) {
			$scope.data=[]
			$scope.series=[]
			$scope.category=[]
			$scope.type=type
			plot_graph()			 
 }   

$scope.selected="all";
$scope.changeMachine = function(machine) {
			
			$scope.feedback=[];
			$scope.data=[];
			$scope.series=[];
			$scope.category=[];
			$scope.selected=machine;
			
			plot_graph(machine)	;		 
 }   




$scope.machinesx=["all"]
$scope.filterCondition = {
        machine: 'neq'
}
$scope.$watch('type', function(type) {
$scope.machinesx=["all"]
	//plot_graph('type')

})	
	  
$scope.$watch('datePicker', function() {
plot_graph();
})
	  


  // selected fruits
  $scope.machine_types_selection = [];



  $scope.categories = [];
  $scope.category_selection = [];

 

 
	var _data=[];
    $scope.data = []
	$scope.day_data=[]
    $scope.team = [];
	$scope.labels= $scope.team
  $scope.chart_title="KIOSK FEEDBACK"

    var series_a = []
	
	var firstTime=true
	
	$scope.satisfaction_count=0
				satisfied=[]
				satisfied.push("satisfied")
				satisfied.push("very satisfied")
	
	
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

		 feedback.feedback($scope.categories,$scope.datePicker.date).then(function(data) { //2. so you 
		 		
				  		$scope.machinesx.push("OVERALL SATISFACTION")
				_.each(data.data['kiosk_list'], function(data) {
					if($scope.type=="INTERPRETATION-KIOSK" && firstTime==true){
					mode="OVERALL SATISFACTION"
						$scope.machinesx.push(data.kiosk)
					}
												 
				})	
				firstTime=false
			
				
				_.each(data.data['all'], function(data) {
					if(data.description !="" && data.kiosk==$scope.selected){
					$scope.feedback.push(data)
					console.log(data.description)
					}
								 
				})
				
			satisfact_pie(data) 
			if(mode=="OVERALL SATISFACTION"){
			overall_satisfact_pie(data) 
			}

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
          
        }

     
		$scope.lists = []
		
	$scope.listscores = function(list) {	
	
		 
				_.each(list, function(row) {
					
					
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
	
		  function overall_satisfact_pie(comments) {
     
               $scope.kiosks=[]
			   $scope.kiosks.push("OVERALL SATISFACTION")
				$scope.machine = "OVERALL SATISFACTION"
				$scope.series_a=[]
				$scope.labels=[]
				$scope.series_a["OVERALL SATISFACTION"]=[]
				$scope.labels["OVERALL SATISFACTION"]=[]
				$scope.satisfaction_tally=0
				$scope.satisfaction_count=0
			_.each(comments.data['overall_satisfaction'] , function( row) {
$scope.satisfaction_tally+=Math.round(row.count )

				$scope.series_a["OVERALL SATISFACTION"].push( Math.round(row.count ))
				$scope.labels["OVERALL SATISFACTION"].push( row.satisfaction )
				
				
				
				if(satisfied.indexOf(row.satisfaction)!=-1)
				{
					$scope.satisfaction_count+=Math.round(row.count )
				}

					$scope.pie_labels.push( $scope.labels["OVERALL SATISFACTION"]);
					$scope.pie_data.push($scope.series_a["OVERALL SATISFACTION"]);

				
		})		
						
			$scope.percentage=Math.round(($scope.satisfaction_count/$scope.satisfaction_tally)*100)
			}


		
	  function satisfact_pie(comments) {
     
               
				
				
				 $scope.kiosks=[]
				$scope.series_a=[]
			$scope.labels=[]
			
				$scope.pie_labels=[]
				$scope.pie_data=[]
				$scope.pie_options=[]
				$scope.datax=[]
				$scope.satisfaction_count=0
				$scope.satisfaction_tally=0
				
			_.each(comments.data['satisfaction_tally'] , function( row) {
		
				if($scope.kiosks.indexOf(row.kiosk)==-1){
					if($scope.selected.indexOf(row.kiosk)!=-1){
						
						
						
						$scope.kiosks.push(row.kiosk)
						console.log('cats')
						$scope.series_a[row.kiosk]=[]
						$scope[row.kiosk]=[]
						$scope.labels[row.kiosk]=[]
					}
				}
				
				if($scope.selected.indexOf(row.kiosk)!=-1){
				$scope.series_a[row.kiosk].push( Math.round(row.count ))
				$scope.labels[row.kiosk].push( row.satisfaction )
				if(satisfied.indexOf(row.satisfaction)!=-1)
						{
						
							$scope.satisfaction_count+=Math.round(row.count )
						}
				$scope.satisfaction_tally+=Math.round(row.count )
				$scope.percentage=Math.round(($scope.satisfaction_count/$scope.satisfaction_tally)*100)
						
				}
				
			

				})
			
			
				
				
				
				_.each($scope.kiosks , function( kiosk, i) {
				
		
					$scope.machine = kiosk
					$scope.pie_labels[i] = $scope.labels[kiosk];
					$scope.pie_data[i] = $scope.series_a[kiosk];
					$scope.pie_options[i] = { legend: { display: true },
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
	
}