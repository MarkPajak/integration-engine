exports.record_timelinesettings_controller =  function($scope, $http, $q,  
          Timeline_data,data_table_reload,get_table_data
    ) {

//$scope.setDate = data_table_reload.setDate;
		$scope.extraQuery = { "googlesheet_id":"#","googlesheet_name":"#"}

    // function definition
	
	  $scope.Timeline_data=Timeline_data
	 
 $scope.onSubmit=function() {

	
		    var kpis = new Timeline_data({
			
					googlesheet_id:visit_form.googlesheet_id.value,	
					googlesheet_name:visit_form.googlesheet_name.value,
					group_column:visit_form.group_column.value,		
					type:visit_form.type.value,
					use_moment:visit_form.use_moment.value,
					track:visit_form.track.value,
					type_column:visit_form.type_column.value,
					title_column:visit_form.title_column.value,
					end_column:visit_form.end_column.value,
					start_column:visit_form.start_column.value,					
									
					comments:visit_form.comments.value,			
					logger_user_name: $scope.user.username
            });
			
			var query = {'googlesheet_id':visit_form.googlesheet_id.value,'googlesheet_name':visit_form.googlesheet_name.value};
			
			Timeline_data.query(query, function(visits) {
				  $scope.$emit('form_submit');
				console.log('Raw_visits',visits.length)
				$scope.results=visits
			if(visits.length>0) {
			
			
			if (confirm("we already have a figure of " + visits[0].value + " for that date - are you sure you wnt to overwrite it ?")) {
			
				_.each(	visits	, function(visit) {
				
				  Timeline_data.remove({
						id: visit._id
					}, function() {
					  console.log('removed old data')
					});
					})
						save(kpis)
				// Save it!
			} else {
				// Do nothing!
			}
			
			
			}
			else
			{			
						save(kpis)
			}
			})	
			
            
		
	

	

    }
		function save(kpis){

	kpis.$save(function(err, user) {
		
						if(err) console.log(err)
						 var  message = "data saved successfully";
							  message+= "\n ";
							  //message+= " "+ data + " added to " + museum;
							  alert(message);
							  get_table_data.getData(moment(new Date()).subtract({'months':1})._d,$scope)			
							$scope.message="data saved successfully";
			
							 
						})
						

}
	
	$( document ).ready(function() {
     $scope.$emit('donations_performance_form');
	 $scope.savex=function(kpis) {
			save(kpis)
	 }
	
});
	

	
	}
 

 

	
	
