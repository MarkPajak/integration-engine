exports.record_operations_controller =  function($scope, $http, $q, $routeParams, $location,
          $rootScope,Raw_operations,data_table_reload
    ) {

//$scope.setDate = data_table_reload.setDate;

    // function definition
 $scope.onSubmit=function() {
		

		
		    var kpis = new Raw_operations({
					museum_id:visit_form.museum.value,				  
					kpi_type: "visits",	
				//DEPARTMENTAL VARIABLES	
					
					no_complaints:visit_form.no_complaints.value,
					health_and_safety_forms: visit_form.health_and_safety_forms.value,
					
					date_logged:new Date(),	
					date_value:visit_form.date_value.value,
					comments:visit_form.comments.value,			
					logger_user_name: $scope.user.username
            });
			
			var query = {'museum_id':visit_form.museum.value,"date_value":visit_form.date_value.value};
			
			Raw_operations.query(query, function(visits) {
				console.log('Raw_visits',visits.length)
			//if(visits.length>0) {
			
			
			//if (confirm("we already have a figure of " + visits[0].value + " for that date - are you sure you wnt to overwrite it ?")) {
			
				_.each(	visits	, function(visit) {
				
				  Raw_operations.remove({
						id: visit._id
					}, function() {
					  console.log('removed old data')
					});
					})
						save(kpis)
				// Save it!
			//} else {
				// Do nothing!
			//}
			
			
		//	}
			//else
			//{			
						//save(kpis)
			//}
			})	
			
            
		
	function save(kpis){

	kpis.$save(function(err, user) {
		
						if(err) console.log(err)
						 var  message = "data saved successfully";
							  message+= "\n ";
							  //message+= " "+ data + " added to " + museum;
							  alert(message);
							  visit_form.reset()
							 
							   data_table_reload.setDate(kpis.date_value);

						})
						

}	

    }
	
	}
 

 

	
	
