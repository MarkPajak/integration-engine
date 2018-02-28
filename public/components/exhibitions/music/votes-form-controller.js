exports.record_votes_controller =  function($scope, $http, $q, $routeParams, $location,$filter
          ,Bristol_music_top_40,data_table_reload,get_table_data,CustomerService,  $timeout, $interval,Top_40_tally
    ) {
 var vm = this;
  vm.name = 'World';
  vm.tables = [{
    id: 1,
    description: 'Front'
  }, {
    id: 2,
    description: 'Back'
  }];
  vm.drinksList = [ {
    id: 1,
    description: 'Cola'
  }, {
    id: 2,
    description: 'Water'
  }];
  vm.order = {};
  
  vm.refreshResults = refreshResults;
  vm.clear = clear;

   $scope.selected=[]
  
  function refreshResults($select,artist_or_state){
    var search = $select.search,
      list = angular.copy($select.items),
    
	  FLAG = -1;
	 
		
	   //$scope.selectedcountry =list[0].description  
	   
    //remove last user input
    list = list.filter(function(item) { 
      return item.id !== FLAG; 
    });
  
    if (!search) {
      //use the predefined list
      $select.items = list;
	
    }
    else {
      //manually add user input and set selection
      var userInputItem = {
        id: FLAG, 
        description: search
      };
      $select.items = [userInputItem].concat(list);
	
		
		$scope.selected[artist_or_state]=$("#" + artist_or_state).find('span .glyphclose').text()
	
      $select.selected = userInputItem;
    }
  }
  
  function clear($event, $select){
    $event.stopPropagation(); 
    //to allow empty field, in order to force a selection remove the following line
    $select.selected = undefined;
    //reset search query
    $select.search = undefined;
    //focus and open dropdown
    $select.activate();
  }
  


$scope.visitor_groups=[] 
		
			$scope.countries=[]	
			$scope.allcountries=[]	
	Bristol_music_top_40.query( function(team) {

			countries=[]
			_.each(team,function(row){
				country={}
				country.country=row.artist
				country.state=row.track
				
				$scope.allcountries.push(country)
			if(countries.indexOf(row.artist)==-1){
				
				countries.push(country.country)			
				$scope.countries.push(country)
			}
			})
  


	
	 vm.getCountryStates = function (item, model){
        vm.counter++;
		$scope.selectedcountry= item.country
		$scope.selected['artist']= item.country
	    $scope._states = $filter('filter')($scope.allcountries, {country: item.country}); 
        tracks=[]
		$scope.states=[]
			_.each( $scope._states,function(row){
				console.log(row)
			if(tracks.indexOf(row.state)==-1){
				
				tracks.push(row.state)			
				$scope.states.push(row)
			}
			})
	
		
		$scope.cities =[];
    };

    vm.getStateCities = function (item, model){
        
		console.log(item, model)
		$scope.selectedstate= item.state
		$scope.selected['track']= item.state
		//$scope.cities = CustomerService.getStateCity($scope.customer.State);
    }
		
	
	vm.removed = function (item, model) {
    vm.lastRemoved = {
        item: item,
        model: model
    };
  };

  	})

	 

 $scope.onSubmit=function() {
		
		    var kpis = new Bristol_music_top_40({
					artist: 	$scope.selected['artist'],	
					exhibition_id:"bristolmusic",					
					track:	$scope.selected['track'],
					date_logged:new Date()//,	
					//date_value:visit_form.date_value.value
					
            });
			
			var query = {};
			
			Bristol_music_top_40.query(query, function(visits) {
				console.log('Bristol_music_top_40',visits.length)
			save(kpis)
			})	
			
            

	 
	function save(kpis){

	kpis.$save(function(err, user) {
		
						if(err) console.log(err)
						 var  message = "data saved successfully";
							  message+= "\n ";
							  //message+= " "+ data + " added to " + museum;
							
							  // visit_form.no_visits.value=""
							 
							  	Top_40_tally.query({"exhibition_id":"bristolmusic"}, function(team) {
									
												$scope.rows=[]
												$scope._rows=[]
												$scope.data_rows=[]
												_.each(team,function(row){
												//if(row.museum!=""){
													$scope._rows.push(row)
													
														
												//}
											
												})
											
											$scope.gridOptions.data=$scope._rows;
				
								})
	
							

						})
						

}}}	

    
	
	
 

 

	
	
