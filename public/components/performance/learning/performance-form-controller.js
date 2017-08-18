exports.record_learning_controller =  function($scope, $http, $q, $routeParams, $location,
          $rootScope,Raw_learning,data_table_reload,get_table_data
    ) {

//$scope.setDate = data_table_reload.setDate;
	$scope.extraQuery = { "session_type":"#", "age_group":"#"}
    // function definition
 $scope.onSubmit=function() {
		

		
		    var kpis = new Raw_learning({
            museum_id:visit_form.museum.value,				  
			kpi_type: "visits",	
			
		//DEPARTMENTAL VARIABLES	
			total_sessions: visit_form.total_sessions.value,
			total_children: visit_form.total_children.value,
			total_teachers: visit_form.total_teachers.value,
			total_income: visit_form.total_income.value,
			age_group: visit_form.age_group.value,
			session_type:encodeURI(visit_form.session_type.value),
		
			
			date_logged:new Date(),	
			date_value:visit_form.date_value.value,
			date_value_end:visit_form.date_value_end.value,
			comments:visit_form.comments.value,			
			logger_user_name: $scope.user.username
            });
			
			var query = {'museum_id':visit_form.museum.value,
				        "date_value":visit_form.date_value.value,
						  "session_type":visit_form.session_type.value,
						    "age_group":encodeURI(visit_form.age_group.value),
							"exact":true
						};
			
			Raw_learning.query(query, function(visits) {
				console.log('Raw_visits',visits.length)
			if(visits.length>0) {
			
			
			if (confirm("we already have a figure for that date - are you sure you want to overwrite it ?")) {
			
				_.each(	visits	, function(visit) {
				
				  Raw_learning.remove({
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
							 get_table_data.getData(moment(new Date()).subtract({'months':1})._d,$scope)
								visit_form.total_sessions.value=""
								visit_form.total_children.value=""
								visit_form.total_teachers.value=""
								visit_form.total_income.value=""
								visit_form.age_group.value=""
								//visit_form.session_type.value=""
								visit_form.session_type.comments.value=""
			
	

						})
						

}	

    }
	
	}
 

 

	
	
