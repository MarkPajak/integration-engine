exports.member_controller =  function($scope, $http, $q, $routeParams, $location,
          $rootScope, date_calc, Tallys,Team,Timeline,$mdEditDialog
		,Leave,delete_leave_by_id
    ) {

$scope.me=$routeParams.member

$me_Data=[]

      Leave.query({}, function(team) {
            _.each(team, function(row,index) {
          
			
			
            })
        })


Team.query({}, function(team) {
            _.each(team, function(team,i) {
			
			if(team.username.toLowerCase()==$scope.me.toLowerCase()){
			console.log(team)
			
			
			number_days_leave_taken = 0
			
			function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

team.leave_taken = sortByKey(team.leave_taken, 'leave_start');

			
		 _.each(team.leave_taken, function(leave,w) {
	var leave_count=0
	if(leave._type=="Full Day"){
	leave_count=1
	}
	if(leave._type=="Half Day"){
	leave_count=0.5
	}
			 if(leave.start_date>=team.leave_start && leave.end_date<=team.leave_year_end){
				number_days_leave_taken+=(leave.weekday_duration)*leave_count
				team.leave_taken[w].tally=(team.number_days_leave-number_days_leave_taken)*leave_count
			 }
			 else
			{
			
				console.log(leave.start_date>=team.leave_start )
				console.log('leave.start_date'+leave.start_date )
				console.log('row.leave_start'+team.leave_start )
				
				console.log(leave.end_date<=team.leave_year_end)
				console.log('leave.end_date'+leave.end_date )
				console.log('row.leave_year_end'+team.leave_year_end )
					 
			}
	
		 })
		team.number_days_leave_remaining=team.number_days_leave-number_days_leave_taken
			
			
			$scope.me_Data=team
			}
			
})
 })


   $scope.removeLeave = function (event, dessert) {
  // if auto selection is enabled you will want to stop the event
  // from propagating and selecting the row
  event.stopPropagation();

  /* 
   * messages is commented out because there is a bug currently
   * with ngRepeat and ngMessages were the messages are always
   * displayed even if the error property on the ngModelController
   * is not set, I've included it anyway so you get the idea
   */

 // var promise = $mdEditDialog.small({

    //modelValue: dessert.comment,
    //placeholder: 'Add a comment',
   // save: function (input) {
//	event.target.innerHTML=input.$modelValue
	
	
	console.log(dessert)
	delete_leave_by_id._delete(dessert._id)
	/*
			var query = {'id':dessert._id};
			Team.update(query, {
					[event.target.attributes[0].nodeValue]:new Date(input.$modelValue)
					}, function(err, affected, resp) {
					console.log(resp)
			})
			*/
  /*
  promise.then(function (ctrl) {
    var input = ctrl.getInput();

    input.$viewChangeListeners.push(function () {
      input.$setValidity('test', input.$modelValue !== 'test');
    });
  });
  */
  }
  
  

	
	}
