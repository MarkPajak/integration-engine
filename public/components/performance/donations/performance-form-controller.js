exports.donations_performance_form =  function($scope, $http, $q,  
          Raw_donations,data_table_reload,get_table_data
    ) {

//$scope.setDate = data_table_reload.setDate;
		$scope.extraQuery = { "donation_box_no":"#"}

    // function definition
	
	  $scope.Raw_donations=Raw_donations
	 
 $scope.onSubmit=function() {
		

		
		    var kpis = new Raw_donations({
					museum_id:visit_form.museum.value,				  
					kpi_type: "visits",	
				//DEPARTMENTAL VARIABLES	
					donation_box_amount: visit_form.donation_box_amount.value,
					donation_box_no: visit_form.donation_box_no.value,
					//no_envelopes: visit_form.no_envelopes.value,
					
					date_logged:new Date(),	
					date_value:visit_form.date_value.value,
					comments:visit_form.comments.value,			
					logger_user_name: $scope.user.username
            });
			
			var query = {'museum_id':visit_form.museum.value,"date_value":visit_form.date_value.value,"donation_box_no":visit_form.donation_box_no,"exact":true};
			
			Raw_donations.query(query, function(visits) {
				  $scope.$emit('form_submit');
				console.log('Raw_visits',visits.length)
				$scope.results=visits
			if(visits.length>0) {
			
			
			if (confirm("we already have a figure of " + visits[0].value + " for that date - are you sure you wnt to overwrite it ?")) {
			
				_.each(	visits	, function(visit) {
				
				  Raw_donations.remove({
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
			
							visit_form.donation_box_amount.value=""
							visit_form.donation_box_no.value=""
							visit_form.no_envelopes.value=""
							 
							 
						})
						

}
	
	$( document ).ready(function() {
     $scope.$emit('donations_performance_form');
	 $scope.savex=function(kpis) {
			save(kpis)
	 }
	
});
	

	
	}
 

 

	
	
