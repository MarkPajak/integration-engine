exports.record_welcomedesk_controller =  function($scope, $http, $q, $routeParams, $location,
          $rootScope,Raw_welcomedesk,data_table_reload,grid_ui_settings ,get_table_data
    ) {

//$scope.setDate = data_table_reload.setDate;

    // function definition
 $scope.onSubmit=function() {
		

		
		    var kpis = new Raw_welcomedesk({
            museum_id:visit_form.museum.value,				  
			kpi_type: "visits",	
			
		//DEPARTMENTAL VARIABLES	
			cash: visit_form.cash.value,
		//	card: visit_form.card.value,
			no_transactions: visit_form.no_transactions.value,
			no_giftaid_envelopes: visit_form.no_giftaid_envelopes.value,			  
			giftaid_amount: visit_form.giftaid_amount.value,			 
	
			
			date_logged:new Date(),	
			date_value:visit_form.date_value.value,
			comments:visit_form.comments.value,			
			logger_user_name: $scope.user.username
            });
			
			var query = {'museum_id':visit_form.museum.value,"date_value":visit_form.date_value.value,"exact":true};
			
			Raw_welcomedesk.query(query, function(visits) {
				console.log('Raw_visits',visits.length)
			if(visits.length>0) {
			
			
			if (confirm("we already have a figure of " + JSON.stringify(visits[0]) + " for that date - are you sure you wnt to overwrite it ?")) {
			
				_.each(	visits	, function(visit) {
				
				  Raw_welcomedesk.remove({
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
			visit_form.cash.value=""
	//	visit_form.card.value=""
			visit_form.no_transactions.value=""
		visit_form.no_giftaid_envelopes.value=""		  
			giftaid_amount: visit_form.giftaid_amount.value=""			 
							 
								get_table_data.getData(moment(new Date()).subtract({'months':1})._d,$scope)


						})
						

}	

    }
	
	}
 

 

	
	
