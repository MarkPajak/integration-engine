exports.deadCtrl = function($scope, $http, $q, $routeParams, $location,
        screen_saver_loop, $location, $rootScope, detect_dragging, trello, get_trello_board, date_calc, Todos, Tallys,Team,kiosk_activity
    ) {


	 $scope.machine_types = [];
	
	 

	 

  $scope.changedValue = function(type) {
			$scope.data=[]
			$scope.series=[]
			$scope.category=[]
			$scope.type=type
			plot_graph()			 
 }   

  $scope.machine_types = ['apple', 'orange', 'pear', 'naartjie'];

  // selected fruits
  $scope.machine_types_selection = ['apple', 'pear'];

  // toggle selection for a given fruit by name
  $scope.toggleSelection = function toggleSelection(type) {
    var idx = $scope.machine_types_selection.indexOf(type);

    // is currently selected
    if (idx > -1) {
      $scope.machine_types_selection.splice(idx, 1);
	  plot_graph()
    }

    // is newly selected
    else {
      $scope.machine_types_selection.push(type);
	  
			
			
			plot_graph()
    }
  }; 

  $scope.changedCatValue = function(category) {
						 
 }  


  $scope.categories = [];

  // selected fruits
  $scope.category_selection = [];

  // toggle selection for a given fruit by name
  $scope.toggleCatSelection = function toggleSelection(type) {
    var idx = $scope.category_selection.indexOf(type);

    // is currently selected
    if (idx > -1) {
      $scope.category_selection.splice(idx, 1);
	  plot_graph()
    }

    // is newly selected
    else {
      $scope.category_selection.push(type);
	  
			$scope.data=[]
			$scope.series=[]
			$scope._series=[]
			
			plot_graph()
    }
  }; 

    
  $scope.changedCatValue = function(category) {
						 
 }

    $scope.data = []
    $scope.team = [];
	$scope.labels= $scope.team
  $scope.chart_title="Machine activity"

    var series_a = []
	
	var plot_graph = function() {
	
			$scope.data=[]
			$scope.series=[]
			$scope._series=[]
		
		 kiosk_activity.async_all($scope.category_selection).then(function(data) { //2. so you can use .then()
		 
		 		console.log('data',data)
	$scope.listscores(data.data['off_today'])
	$scope.listslivecores(data.data['on_today'])	
				
				
			})				
	}

    plot_graph() 
		$scope.live_lists = []
	
		$scope.listslivecores = function(list) {	
		console.log('list',list)
		 
				_.each(list, function(row) {
					
					console.log(row)
								list=[]
								list.title = row.kiosk
								list.average = row.penalty
								list.age = (10-1/(row.penalty)*10 ).toFixed(0)
								list.tint = row.penalty / 100
								list.card_count = row.card_count
								list.points = row.score  //(row.card_count / (row.penalty + 1)).toFixed(1)	
							$scope.live_lists.push(list)
				})
		
		
	}
		$scope.lists=[]
	$scope.listscores = function(list) {	
		console.log('list',list)
		 
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

				
	
}