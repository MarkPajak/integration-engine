exports.record_events_controller =  function($scope, $http, $q, $routeParams, $location,
          $rootScope,Raw_events,data_table_reload,Emu_events,get_table_data,Community_groups
    ) {

$scope.scope = $scope;
$scope.events = [];
$scope.selected_event=[]
$scope.museums=[]
	$scope.extraQuery = { "on_site_off_site":"#"}

			
			
 
$scope.$watch('event', function (newValue) {

		
		if(newValue){
		
					visit_form.date_value.value= moment(newValue.startDate).format('YYYY-MM-DD');
					visit_form.date_value_end.value=moment(newValue.endDate).format('YYYY-MM-DD');
					
					if(newValue.venue){
					
						newValue.venue=newValue.venue.replace("M Shed","M-SHED")
						newValue.venue=newValue.venue.replace("Bristol Museum & Art Gallery","BMAG")
						newValue.venue=newValue.venue.replace("Georgian House","GEORGIAN-HOUSE")
						newValue.venue=newValue.venue.replace("The Red Lodge Museum","RED-LODGE")
						newValue.venue=newValue.venue.replace("Bristol Archives","BRISTOL-ARCHIVES")
						newValue.venue=newValue.venue.replace("Kings Weston Roman Villa","ROMAN-VILLA")
						newValue.venue=newValue.venue.replace("Blaise Castle House Museum","BLAISE")
						$scope.selected_museum=newValue.venue
					}
					
			}
})


$scope.museums.push({value:"BMAG",name:'Bristol Museum & Art Gallery'});
$scope.museums.push({value:"M-SHED",name:'M Shed'});		
$scope.museums.push({value:"GEORGIAN-HOUSE",name:'The Georgian House Museum'});	
$scope.museums.push({value:"RED-LODGE",name:'The Red Lodge'});				
$scope.museums.push({value:"BLAISE",name:'Blaise Museum'});
$scope.museums.push({value:"BRISTOL-ARCHIVES",name:'Bristol Archives'});
$scope.museums.push({value:"ROMAN-VILLA",name:'Kings Weston Roman Villas'});	
		

	 Community_groups.query({}, function(groups) {
 
		past_community=[]
		_.each(	groups	, function(group) {
			
			_group=[]
			_group.name=group
			_group.value=group
			past_community.push(_group)
			
		})
		
		$scope.community_groups =past_community
		$scope.community_groups.push({name:'add new group'})
	
	});

 
	 Emu_events.getData().then(function(response){
	 
			past_events=[]
			_.each(response,function(event){

					if(new Date(event.startDate)<=new Date() && event.type!="Facilities"  && event.type!="Poster - Digital Signage" ){
						past_events.push(event)
						console.log('past event',event)
					}
			})
			$scope.events =past_events
			$scope.events.push({name:'add new event'})
		
	 });

 
    $scope.add = function (newValue) {
		
        var obj = {};
        obj.name = newValue;
        obj.value = newValue.name;
        $scope.events.push(obj);
        $scope.event = obj;
        $scope.newValue = '';
		
    }
	 $scope.add_community = function (newValue) {
		  
      
         var obj = {};
        obj.name = newValue;
        obj.value = newValue.name;
        $scope.community_groups.push(obj);
        $scope.community_group = obj;
        $scope.newValue = '';
     
		
    }
	
	
	
 
    // function definition
	 $scope.form_name="Bristol Culture activities"
	 $scope.age_groups=[]
	 $scope.target_groups=[]
	  $scope.selection = [];
	  $scope.on_site_off_site="";
	 // Fruits
	$scope.target_groups.push({name:'Black, Asian, and minority ethnic (BAME)'});
	$scope.target_groups.push({name:'Disability'});
	$scope.target_groups.push({name:'Lesbian, Gay, Bisexual, and Transgrender (LGBT)'});
	$scope.target_groups.push({name:'Children and Young People (CYP)'});
	$scope.target_groups.push({name:'Older People'});
	$scope.target_groups.push({name:'Socio-economically disadvantaged group'}); 
	$scope.target_groups.push({name:'Faith/Religion'});
	$scope.target_groups.push({name:' Health/Wellbeing'});

 

 $scope.deleteUser = function toggleSelection(userToEdit) {
 
   var idx = $scope.age_groups.indexOf(userToEdit);
  if (idx > -1) {
      $scope.age_groups.splice(idx, 1);
    }
 
 }
 
 
 
 $scope.toggleSelection = function(target_group) {
    var idx = $scope.selection.indexOf(target_group);

    // Is currently selected
    if (idx > -1) {
      $scope.selection.splice(idx, 1);
    }

    // Is newly selected
    else {
      $scope.selection.push(target_group);
    }
  };
  
  
	 $scope.addCount=function() {
	 
		 var age_group={ name: visit_form.age_group.value,
					count: visit_form.count.value
		}
		console.log("clear age group")
		visit_form.age_group.value=""
		visit_form.count.value=""
		$scope.age_groups.push(age_group)
	 }
	 
	 	 $scope.addtarget_groups=function() {
	 
		 var target_groups={ name: visit_form.target_group.value
					
		}
	
		$scope.target_groups.push(target_groups)
		visit_form.age_group.value=""
		visit_form.count.value=""
		 $scope.$apply()
	 }
	
	
	
	
 $scope.onSubmit=function() {
		

		
		    var kpis = new Raw_events({
            museum_id:visit_form.museum.value,				  
			kpi_type: "visits",	
			
		//DEPARTMENTAL VARIABLES	
			
			age_groups: $scope.age_groups,
			on_site_off_site: visit_form.on_site_off_site.value,
			target_groups:$scope.selection,
			event_name: $('#event_name').find("option:selected").text(),
			age_group: visit_form.age_group.value,
			event_lead: visit_form.event_lead.value,
			community_group: $('#community_group').find("option:selected").text(),
		

			date_logged:new Date(),	
			date_value:visit_form.date_value.value,
			date_value_end:visit_form.date_value_end.value,
			comments:visit_form.comments.value,			
			logger_user_name: $scope.user.username
            });
			
			
			
			var query = {'museum_id':visit_form.museum.value,
				         "date_value":visit_form.date_value.value,
						 "on_site_off_site": visit_form.on_site_off_site.value,
						  "exact":true
						};
			
			Raw_events.query(query, function(visits) {
				console.log('Raw_visits',visits.length)
			if(visits.length>0) {
			
			
			if (confirm("we already have a figure for that date - are you sure you want to overwrite it ?")) {
			
				_.each(	visits	, function(visit) {
				
				  Raw_events.remove({
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
							  get_table_data.getData(moment(new Date()).subtract({'months':1})._d,$scope)		
							visit_form.on_site_off_site.value=""
							$scope.age_groups=[]
							$scope.selection=[]
							visit_form.event_name.value=""
							visit_form.community_group=""
							visit_form.count.value=""
							visit_form.age_group.value=""
							visit_form.comments.value=""
							visit_form.date_value.value=""
							visit_form.event_lead.value=""
							
							
							visit_form.date_value_end.value=""
						

						})
						

}	

    }
	
	}
 

 

	
	
