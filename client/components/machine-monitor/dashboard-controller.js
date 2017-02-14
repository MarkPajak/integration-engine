exports.boardCtrl = function($scope, $http, $q, $routeParams, $location,
        screen_saver_loop, $location, $rootScope, detect_dragging, trello, get_trello_board, date_calc, Todos, Tallys,Team
    ) {

	
	
	
	
	

    $scope.team = ["Zahid", "Tom", "Fay", "Mark", "Darren", "Lacey", "David"];
	  $scope.chart_title="Leader Board"
	$scope.labels= $scope.team
    
		$scope.removeTally = function(id) {
			Tallys.remove({id:id})
		}
		  Tallys.query({}, function(team) {
			_.each(team, function(row) {
				//$scope.removeTally(row._id)
				})	
			})	
			
			
 trello.auth()
 
 
 
 
 
    var series_a = []
	_series = [];
	__series = [];
	
	$scope.series = [];

		_.each($scope.team, function(member) {
       _series[member] = []
    })
	
	
	var plot_graph = function() {

    var _data = []
	 var _series = []
		_.each($scope.team, function(member) {
        _series[member] = []
    })
	

	
   
	
    Tallys.query({}, function(tallys) {
		
		tallys.sort(function(a, b){
		return a.date + b.date;
		});

		
        _.each(tallys, function(row) {			
			
            for (var member in _series) {
                if (_series.hasOwnProperty(member)) {
				if(row.name){
                    if (row.name.toLowerCase() == member.toLowerCase()) {
                        _series[member].push({
                            x: row.date,
                            y: row.points
                        })
                    }
					}
                }
			
            }


        })
		

    })
	
	
	

    for (var member in _series) {
        if (_series.hasOwnProperty(member)) {
            _data.push(_series[member]);
        }
    }
	
	$scope.data=_data
	
	}
  
  for (var member in _series) {
        if (_series.hasOwnProperty(member)) {
            __series.push(member);
        }
    }
	
	$scope.series= __series
  

 
    $scope.datasetOverride = [{
        yAxisID: 'y-axis-1'
    }];
    $scope.options = {
		
        scales: {
            xAxes: [{
                type: 'time',
                unit: 'day',
                unitStepSize: 1,
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
	$scope.loadMoreShots = function(count,display_data) {

		angular.forEach(display_data, function(list, index) {
						
		get_trello_board.get_data(list)

				   .then(function() {
					  count++
				if(display_data.length==count+1){
	
				   $scope.listscores()
					 plot_graph()
				}

				   });
				   
	})

};

	
	
        //trello.auth()
$scope.loadMoreShots(0,$rootScope['team'])

setInterval(function(){$scope.loadMoreShots(0,$rootScope['team']); }, 1 *250 * 1000);


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
            console.log('start screensaver')
           // screen_saver_loop.start_screen_saver();
        }

     
		
			$scope.lists = []
			
				
	$scope.listscores = function() {	
		$scope._lists = []
		   Team.query({}, function(team) {
				_.each(team, function(row) {
								list=[]
								list.title = row.name
								list.average = row.penalty
								list.age = (10-1/(row.penalty)*10 ).toFixed(0)
								list.tint = row.penalty / 100
								list.card_count = row.card_count
								list.points = row.score  //(row.card_count / (row.penalty + 1)).toFixed(1)	
							$scope._lists.push(list)
				})
				$scope.lists=$scope._lists
				
		})
		
	}

		
			
	
}