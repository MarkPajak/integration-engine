exports.record_bookings_controller =  function($scope, $http, $q,  
          Resources,Bookings,data_table_reload,get_table_data
    ) {

//$scope.setDate = data_table_reload.setDate;
			$scope.extraQuery = { "museum_id":"#"}

    // function definition
	
	  $scope.Resources=Resources
	 
 $scope.onSubmit=function() {
		
		/*
		  start_date: { type: Date, required: true },
		  end_date: { type: Date},
		  group: { type: String, required: true },
		  _type: { type: String, required: true },
		  className:{ type: String, required: true },
		  content: { type: String, required: true },
		  name: { type: String, required: true },
		  notes:{ type: String},
		  days:{ type: Number }
*/
		var type = "ROOM"
		    var kpis = new Bookings({
					
				//DEPARTMENTAL VARIABLES	
				start_date: new Date(visit_form.start_date.value),	
				end_date: new Date(visit_form.end_date.value),	
				group: visit_form.group.value,	
				_type: type,	
				//className:visit_form.className.value,	
				 // content: visit_form.comments.value,	
				name: visit_form.group.value,	
				notes:visit_form.comments.value,	
				
					
					
					
					
					date_logged:new Date(),	
					//date_value:visit_form.date_value.value,
					comments:visit_form.comments.value,			
					logger_user_name: $scope.user.username
            });
			
			var query = {'_type':type,'group':visit_form.group.value,'start_date':visit_form.start_date.value,'end_date':visit_form.end_date.value};
			
			Bookings.query(query, function(visits) {
				  $scope.$emit('form_submit');
				console.log('Raw_visits',visits.length)
				$scope.results=visits
		
						save(kpis)
			
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
			
							visit_form.group.value=""
							visit_form.start_date.value=""
							visit_form.end_date.value=""
							//visit_form._type.value=""
							
							
	
							
							 
							 
						})
						

}
	
	$( document ).ready(function() {
     $scope.$emit('record_rooms_form');
	 $scope.savex=function(kpis) {
			save(kpis)
	 }
	
});
	

	
	}
 
