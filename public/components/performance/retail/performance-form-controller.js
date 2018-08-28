exports.retail_performance_form =  function($scope, $http, $q, $routeParams, $location,
          $rootScope,Retail_sales,data_table_reload,get_table_data
    ) {

//$scope.setDate = data_table_reload.setDate;

    // function definition
 $scope.onSubmit=function() {
		

		
		    var kpis = new Retail_sales({
				museum_id:visit_form.museum.value,				  
				kpi_type: "visits",	
				
				//DEPARTMENTAL VARIABLES	
				total_sales: visit_form.total_sales.value,
				non_vat_sales: visit_form.non_vat_sales.value,
				//net_sales: visit_form.net_sales.value,
				no_transactions: visit_form.no_transactions.value,
				
				date_logged:new Date(),	
				date_value:visit_form.date_value.value,
				comments:"",			
				logger_user_name: $scope.user.username
            });
			

			var query = {'museum_id':visit_form.museum.value,"date_value":visit_form.date_value.value,"exact":true,
					    "exact":true,"end_value": moment(new Date()).format("YYYY-MM-DD") 
						};
			
			Retail_sales.query(query, function(visits) {
				console.log('Raw_visits',visits.length)
			if(visits.length>0) {
			
			
			if (confirm("we already have a figure of " + JSON.stringify(visits[0]) + " for that date - are you sure you wnt to overwrite it ?")) {
			
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
						
							get_table_data.getData(moment(new Date(visit_form.date_value.value)).subtract({'months':1})._d,$scope)
								visit_form.total_sales.value=""
							visit_form.non_vat_sales.value=""
							visit_form.no_transactions.value=""
							//data_table_reload.setDate(kpis.date_value);
							    alert(message);

						})
						

}	

    }
	
	}
 

 

	
	
