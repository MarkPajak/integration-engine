exports.performance_form =  function($scope, $http, $q, $routeParams, $location,
          $rootScope,Raw_visits
    ) {



    // function definition
 $scope.onSubmit=function() {
		

		
		    var kpis = new Raw_visits({
            museum_id:museum.value,				  
			kpi_type: "visits",	
			value: no_visits.value,
			date_logged:new Date(),	
			date_value:date_value.value,
			comments:comments.value,			
			logger_user_name: $scope.user.username
            });

            kpis.$save(function(err, user) {
		if(err) console.log(err)
			 console.log(user)
                     alert('data saved successfully');
					visit_form.reset()
            })
		

    }
	
	}
 

 

	
	
