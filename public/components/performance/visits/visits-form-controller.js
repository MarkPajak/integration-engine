exports.visits_form =  function($scope, $http, $q, $routeParams, $location,
          $rootScope,Raw_visits,data_table_reload
    ) {

//$scope.setDate = data_table_reload.setDate;

    // function definition
 $scope.onSubmit=function() {
		

			
		
		    var kpis = new Raw_visits({
					museum_id:museum.value,				  
					kpi_type: "visits",	
					
					//DEPARTMENTAL VARIABLES	
					value: no_visits.value,
					
					date_logged:new Date(),	
					date_value:date_value.value,
					comments:comments.value,			
					logger_user_name: $scope.user.username
            });
			
			var query = {'museum_id':museum.value,"date_value":date_value.value};
			
			Raw_visits.query(query, function(visits) {
				console.log('Raw_visits',visits.length)
			if(visits.length>0) {
			
			
			if (confirm("we already have a figure of " + visits[0].value + " for that date - are you sure you wnt to overwrite it ?")) {
			
				_.each(	visits	, function(visit) {
				
				  Raw_visits.remove({
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
 

 

	
	
