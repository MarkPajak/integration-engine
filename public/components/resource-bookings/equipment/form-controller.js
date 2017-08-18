exports.record_equipment_controller =  function($scope, $http, $q,  
          Resources,data_table_reload,get_table_data,AuthService
    ) {

//$scope.setDate = data_table_reload.setDate;
			$scope.extraQuery = { "museum_id":"#",'type':"equipment"}
$scope.haspermissions=false
   			 AuthService.isLoggedIn().then(function(user){
		
			
						$scope.user=user
						$scope.isloggedin=true			
						if(	user.data.group=="ADMIN"){$scope.haspermissions=true}
						if(	user.data.group=="AV"){$scope.haspermissions=true}
						if(	user.data.group=="EXHIBITIONS"){$scope.haspermissions=true}
						if(	user.data.group=="DIGITAL"){$scope.haspermissions=true}

						main_function(timeline_mode)
			
	  })
	
	  $scope.Resources=Resources
	 
 $scope.onSubmit=function() {
		


		
		    var kpis = new Resources({
					name:visit_form.asset_name.value+ " ("+ visit_form.asset_type.value+") " + visit_form.asset_no.value,
					asset_name:visit_form.asset_name.value,	
					asset_type:visit_form.asset_type.value,
					asset_no:visit_form.asset_no.value,
					label_location:visit_form.label_location.value,	
					label_notes:visit_form.label_notes.value,
					serial_no:visit_form.serial_no.value,
					model_no:visit_form.model_no.value,	
					location:visit_form.location.value,	
					description:visit_form.description.value,						

					
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
									visit_form.asset_no.value=""
									visit_form.label_location.value=""	
									visit_form.label_notes.value=""
									visit_form.serial_no.value=""
									visit_form.model_no.value=""	
									visit_form.location.value=""
									visit_form.description.value=""		
							
							 
							 
						})
						

}
	
	$( document ).ready(function() {
     $scope.$emit('record_rooms_form');
	 $scope.savex=function(kpis) {
			save(kpis)
	 }
	
});
	

	
	}
 
