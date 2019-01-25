exports.site_permissions_performance_form =  function($scope, $http, $q,  
          Raw_site_permissions,data_table_reload,get_table_data_nomusem
    ) {

//$scope.setDate = data_table_reload.setDate;
		$scope.extraQuery = { "donation_box_no":"#"}

    // function definition
	
	  $scope.Raw_site_permissions=Raw_site_permissions
	 
 $scope.onSubmit=function() {
		

		
		    var kpis = new Raw_site_permissions({
					//type:visit_form.museum.value,				  
					kpi_type: "visits",	
				//DEPARTMENTAL VARIABLES	
					//donation_box_amount: visit_form.donation_box_amount.value,
					donation_box_no: 0,
					//no_envelopes: visit_form.no_envelopes.value,
					
						no_events: visit_form.no_events.value,
						no_cancelled_events: visit_form.no_cancelled_events.value,
						audience_figures: visit_form.audience_figures.value,
			
						income_bcc: visit_form.income_bcc.value,
						income_site_permissions: visit_form.income_site_permissions.value,
					
					
					
					date_logged:new Date(),	
					date_value:visit_form.date_value.value,
					comments:visit_form.comments.value,			
					logger_user_name: $scope.user.username
            });
			
			var query = {'type':"0","date_value":visit_form.date_value.value,"donation_box_no":0,"exact":true,"end_value": moment(new Date()).format("YYYY-MM-DD") };
			
			Raw_site_permissions.query(query, function(visits) {
				  $scope.$emit('form_submit');
				console.log('Raw_visits',visits.length)
				$scope.results=visits
			if(visits.length>0) {
			
			
			if (confirm("we already have a figure of " + visits[0].value + " for that date - are you sure you wnt to overwrite it ?")) {
			
				_.each(	visits	, function(visit) {
				
				  Raw_site_permissions.remove({
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
							  get_table_data_nomusem.getData(moment(new Date()).subtract({'months':1})._d,$scope)			
							$scope.message="data saved successfully";
			
							visit_form.no_events.value=""
								visit_form.no_cancelled_events.value=""
									visit_form.audience_figures.value=""
										visit_form.income_bcc.value=""
											visit_form.income_site_permissions.value=""
											
					
							 
							 
						})
						

}
	
	$( document ).ready(function() {
     $scope.$emit('site_permissions_performance_form');
	 $scope.savex=function(kpis) {
			save(kpis)
	 }
	
});
	

	
	}
 

 

	
	
