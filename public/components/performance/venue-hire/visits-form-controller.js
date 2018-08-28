exports.venue_hire_form =  function($scope, $http, $q, $routeParams, $location
          ,Raw_venue_hire,data_table_reload,get_table_data
    ) {
		 
		 $scope.visitor_groups=[] 
		 $scope.extraQuery = { "booking_type":"#", "age_group":"#"}
		 
		  $scope.deleteUser = function toggleSelection(userToEdit) {
				  visit_form.no_visits.value=0
				  
				   var idx = $scope.visitor_groups.indexOf(userToEdit);
				  if (idx > -1) {
					  $scope.visitor_groups.splice(idx, 1);
					}
					_.each($scope.visitor_groups,function(no_visits){
					visit_form.no_visits.value= parseInt(visit_form.no_visits.value)+ parseInt(no_visits.count)
						
						})
 
 }
		 
		 $scope.addCount=function() {
					visit_form.no_visits.value=0
					var visitor_groups={ name: visit_form.visitor_groups.value,
					count: visit_form.count.value
		}
		
		$scope.visitor_groups.push(visitor_groups)
		
		_.each($scope.visitor_groups,function(no_visits){
		  visit_form.no_visits.value= parseInt(visit_form.no_visits.value)+ parseInt(no_visits.count)
		
		})
		
		
		
		
	 }

 $scope.onSubmit=function() {
		

			
		
		    var kpis = new Raw_venue_hire({
					museum_id:visit_form.museum.value,				  
					kpi_type: "visits",	
					
					//DEPARTMENTAL VARIABLES	
					value: visit_form.no_visits.value,
					visitor_groups: $scope.visitor_groups,
					date_logged:new Date(),	
					date_value:visit_form.date_value.value,
					comments:visit_form.comments.value,					
					booking_type:encodeURI(visit_form.booking_type.value),
					customer:visit_form.customer.value,					
					logger_user_name: $scope.user.username
            });
			
			var query = {'museum_id':visit_form.museum.value,"booking_type":encodeURI(visit_form.booking_type.value),"date_value":visit_form.date_value.value,"exact":true,"end_value": moment(new Date()).format("YYYY-MM-DD") };
			
			Raw_venue_hire.query(query, function(visits) {
				console.log('Raw_venue_hire',visits.length)
		
	
						save(kpis)
			
			})	
			
            

	 
	function save(kpis){

	kpis.$save(function(err, user) {
		
						if(err) console.log(err)
						 var  message = "data saved successfully";
							  message+= "\n ";
							  //message+= " "+ data + " added to " + museum;
							
							   visit_form.no_visits.value=""
							 
							  	get_table_data.getData(moment(new Date()).subtract({'months':1})._d,$scope)
								  alert(message);

						})
						

}	

    }
	
	}
 

 

	
	
