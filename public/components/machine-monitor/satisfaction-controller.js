exports.satisfaction =    function($scope, $http, $q, $routeParams, $location,
        screen_saver_loop, $location, $rootScope, detect_dragging, trello, get_trello_board, date_calc, Todos, Tallys,Team,feedback
    ) {


		 feedback.feedback($scope.categories,$scope.datePicker.date).then(function(data) { //2. so you 
		 		

				_.each(data.data['satisfaction_tally'], function(data) {
				
				console.log(data)
				
				}) 
	
	
})

}