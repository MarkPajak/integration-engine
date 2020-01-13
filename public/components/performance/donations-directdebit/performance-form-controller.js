exports.donations_directdebit_performance_form =  function($scope, $http, $q,  
          Raw_donations_directdebit,data_table_reload,get_table_data_nomusem_notype
    ) {


$scope.extraQuery = {}

	
 $scope.Raw_donations_directdebit=Raw_donations_directdebit
	 
 $scope.onSubmit=function() {
		

		
		    var kpis = new Raw_donations_directdebit({
								  
					kpi_type: "visits",	
			
					amount: visit_form.amount.value,
					gift_aid_amount: visit_form.gift_aid_amount.value,
					
				
					date_logged:new Date(),	
					date_value:visit_form.date_value.value,
					comments:visit_form.comments.value,			
					logger_user_name: $scope.user.username
            });
			
			var query = {"date_value":visit_form.date_value.value,"exact":true,"end_value": moment(new Date()).format("YYYY-MM-DD") };
			
			Raw_donations_directdebit.query(query, function(visits) {
				  $scope.$emit('form_submit');
				console.log('Raw_visits',visits.length)
				$scope.results=visits
			if(visits.length>0) {
			
			
			if (confirm("we already have a figure of " + visits[0].value + " for that date - are you sure you wnt to overwrite it ?")) {
			
				_.each(	visits	, function(visit) {
				
					Raw_donations_directdebit.remove({
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
							  get_table_data.get_table_data_nomusem_notype(moment(new Date()).subtract({'months':1})._d,$scope)			
							$scope.message="data saved successfully";
							visit_form.museum_id.value=""
							visit_form.amount.value=""
							visit_form. gift_aid_amount=""
						
								
							 
						})
						

}
	
	$( document ).ready(function() {
     $scope.$emit('donations_other_performance_form');
	 $scope.savex=function(kpis) {
			save(kpis)
	 }
	
});
	

	
	}
 

 

	
	
