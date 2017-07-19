exports.visits_form =  function($scope, $http, $q, $routeParams, $location
          ,Raw_visits,data_table_reload,get_table_data
    ) {
		 
		 $scope.visitor_groups=[] 
		 
		 
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
		

			
		
		    var kpis = new Raw_visits({
					museum_id:visit_form.museum.value,				  
					kpi_type: "visits",	
					
					//DEPARTMENTAL VARIABLES	
					value: visit_form.no_visits.value,
					visitor_groups: $scope.visitor_groups,
					date_logged:new Date(),	
					date_value:visit_form.date_value.value,
					comments:visit_form.comments.value,			
					logger_user_name: $scope.user.username
            });
			
			var query = {'museum_id':visit_form.museum.value,"date_value":visit_form.date_value.value,"exact":true};
			
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
							
							   visit_form.no_visits.value=""
							 
							  	get_table_data.getData(moment(new Date()).subtract({'months':1})._d,$scope)
								  alert(message);

						})
						

}	

    }
	
	}
 

 

	
	
