exports.retail_performance_form =  function($scope, $http, $q, $routeParams, $location,
          $rootScope,Retail_sales,data_table_reload
    ) {



    // function definition
 $scope.onSubmit=function() {
		

		
		    var kpis = new Retail_sales({
            museum_id:museum.value,				  
			kpi_type: "visits",	
			
		//DEPARTMENTAL VARIABLES	
			total_sales: total_sales.value,
			non_vat_sales: non_vat_sales.value,
			net_sales: net_sales.value,
			no_transactions: no_transactions.value,
			
			date_logged:new Date(),	
			date_value:date_value.value,
			comments:comments.value,			
			logger_user_name: $scope.user.username
            });
			
			var query = {'museum_id':museum.value,"date_value":date_value.value};
			
			Retail_sales.query(query, function(visits) {
				console.log('Raw_visits',visits.length)
			if(visits.length>0) {
			
			
			if (confirm("we already have a figure of " + visits[0].value + " for that date - are you sure you wnt to overwrite it ?")) {
			
				_.each(	visits	, function(visit) {
				
				  Retail_sales.remove({
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
							  visit_form.reset()
							  
							   data_table_reload.setNumber(message);

						})
						

}	

    }
	
	}
 

 

	
	
