exports.timeline_settings_controller =  function($scope, $http, $q, $routeParams, $location,
        screen_saver_loop,  $rootScope, detect_dragging, trello, get_trello_board, date_calc, Todos, Tallys,Team,Timeline,$mdEditDialog
    ) {



  $scope.rows = [];
  
  $scope.counter = 0;
  
  $scope.addRow = function() {
   var team = new Team({
                name:  $scope.counter
            });
			
	 team.$save(function() {
		
               
            });
  
    $scope.rows.push('Row ' + $scope.counter);
    $scope.counter++;
  }
  
  
     Team.query({}, function(team) {
	  _.each(team, function(row,index) {
		  
		
		  
		number_days_leave_taken = 0
		 _.each(row.leave_taken, function(leave) {
	
			 if(leave.start_date>=row.leave_start && leave.end_date<=row.leave_year_end){
				number_days_leave_taken+=leave.weekday_duration
			 }
			 else
			{
	
					 
			}
		 })
		row.number_days_leave_remaining=row.number_days_leave-number_days_leave_taken
		  
		$scope.rows.push(row)
		 $scope.counter++;
	 })
	 })
	 
	 
   $scope.editComment = function (event, dessert) {
  // if auto selection is enabled you will want to stop the event
  // from propagating and selecting the row
  event.stopPropagation();

  /* 
   * messages is commented out because there is a bug currently
   * with ngRepeat and ngMessages were the messages are always
   * displayed even if the error property on the ngModelController
   * is not set, I've included it anyway so you get the idea
   */
	var myArray = []
var key = "happyCount";
var obj = {};
obj[key] = event.target.attributes[0].nodeValue;
myArray.push(obj);
   
  var promise = $mdEditDialog.small({

    modelValue: dessert.comment,
    placeholder: 'Add a comment',
    save: function (input) {
	event.target.innerHTML=input.$modelValue
			var query = {'id':dessert._id};
			Team.update(query, {
					myArray:input.$modelValue
					}, function(err, affected, resp) {
					console.log(resp)
			})
    },
    targetEvent: event,
    validators: {
      'md-maxlength': 30
    }
  });
  promise.then(function (ctrl) {
    var input = ctrl.getInput();

    input.$viewChangeListeners.push(function () {
      input.$setValidity('test', input.$modelValue !== 'test');
    });
  });
  }
  }

  
