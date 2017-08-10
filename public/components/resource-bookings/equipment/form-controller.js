exports.record_equipment_controller =  function($scope, $http, $q,  
          Resources,data_table_reload,get_table_data
    ) {

//$scope.setDate = data_table_reload.setDate;
			$scope.extraQuery = { "museum_id":"#",'type':"equipment"}

    // function definition
	
	  $scope.Resources=Resources
	 
 $scope.onSubmit=function() {
		

		
		    var kpis = new Resources({
					name:visit_form.room_name.value,				  
					type: "equipment",	
				//DEPARTMENTAL VARIABLES	
					//donation_box_amount: visit_form.donation_box_amount.value,
					//donation_box_no: visit_form.donation_box_no.value,
					//no_envelopes: visit_form.no_envelopes.value,
					
					date_logged:new Date(),	
					//date_value:visit_form.date_value.value,
					comments:visit_form.comments.value,			
					logger_user_name: $scope.user.username
            });
			
			var query = {'name':visit_form.room_name.value,'type':"equipment",'exact':false};
			
			Resources.query(query, function(visits) {
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
			
							visit_form.room_name.value=""
							
							 
							 
						})
						

}
	
	$( document ).ready(function() {
     $scope.$emit('record_rooms_form');
	 $scope.savex=function(kpis) {
			save(kpis)
	 }
	
});
	

	
	}
 
