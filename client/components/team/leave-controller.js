exports.leave_controller =  function($scope, $http, $q, $routeParams, $location,
          $rootScope, date_calc, Tallys,Team,Timeline
		,Leave
    ) {



  $scope.override=true
  $scope.ids_to_delete=[]
		
	function dateRangeOverlaps(a_start, a_end, b_start, b_end) {
    if (a_start <= b_start && b_start <= a_end) return true; // b starts in a
    if (a_start <= b_end   && b_end   <= a_end) return true; // b ends in a
    if (b_start <  a_start && a_end   <  b_end) return true; // a in b
    return false;
}
		
		$scope.datePicker=[];
		$scope.datePicker.date = {startDate: "", endDate: ""};
		$scope.dateRange = {
            startDate: null,
            endDate: null
        };
		check_dates=function(viewValue){
		 
		 var overlap = []
						if(viewValue!=""){
							Team.query({}, function(team) {
						_.each(team, function(_team,i) {
						
						_.each(_team.leave_taken, function(leave,i) {
							
							 
								
							
							StartDate1=		new Date(leave.start_date)
							EndDate1=		new Date(leave.end_date)
							StartDate2=		new Date($scope.datePicker.date.startDate._d)
							EndDate2=		new Date($scope.datePicker.date.endDate._d)
						
							
							if(dateRangeOverlaps(StartDate1, EndDate1, StartDate2, EndDate2)==true){
										
										
											overlap.type = leave._type
											overlap.name = leave.name
											overlap.id = leave._id
											overlap.group = moment(StartDate1).format("MMM Do YYYY")  +"-"+moment(EndDate1).format("MMM Do YYYY") 
											$scope.overlapalert.push(overlap)
										
							if(viewValue==_team._id){
							console.log('will be overwritten'+leave._id)
								$scope.ids_to_delete.push(overlap.id)
							 }
							
									
							 }
							 
							  })
							 
						   })
						   })
						   }
    }
		$scope.overlapalert=[]

		$scope.dateRangeOptions = {
        locale : {
            format : 'DD/MM/YYYY'
        },
        eventHandlers : {
            'apply.daterangepicker' : function() {  
      
				console.log("checking Dates"); 
$scope.overlapalert=[]
        Timeline.query({}, function(team) {
		
		
            _.each(team, function(row,index) {

		var timeline=(row);
		if(!row.end_date){row.end_date=row.start_date}
		
		StartDate1=		new Date(timeline.start_date)
		EndDate1=		new Date(timeline.end_date)
		
		StartDate2=		new Date($scope.datePicker.date.startDate._d)
		EndDate2=		new Date($scope.datePicker.date.endDate._d)
	
		
		
		if(dateRangeOverlaps(StartDate1, EndDate1, StartDate2, EndDate2)==true){
					console.log(row)
					var overlap = []
						overlap.type = row._type
						overlap.name = row.name
						overlap.group = row.group
						
						$scope.overlapalert.push(overlap)
		}
		

	
			
            })
        })				
				
            }
        }
    };
	
	
		
		boards=[]
		leave_type=[]
		leave_type.push({"name": "Full Day","value": "Full Day"})
		leave_type.push({"name": "Half Day","value":"Half Day"})
		leave_type.push({"name": "Flexi PM","value":"Flexi PM"})
		leave_type.push({"name": "Flexi AM","value":"Flexi AM"})
		leave_type.push({"name": "Flexi Day","value":"Flexi Day"})
		
		
		 Team.query({}, function(team) {
            _.each(team, function(team,i) {
		
				 board={
				  "name": team.username,
				  "value": team._id
				  }
				 boards.push(board)
		 })
		  })
		
		  check_names = function () {
				console.log('check names')
			
 
			}
		   $scope.override_button = function () {
				console.log('override')
				$scope.override=false
 
			}
		
 $scope.form_to_trello = function (  ) {
 
    var vm = this;
    // funcation assignment
    vm.onSubmit = onSubmit;

    // variable assignment
    vm.author = { // optionally fill in your info below :-)
      name: '#',
      url: '#' // a link to your twitter/github/blog/whatever
    };
    vm.exampleTitle = 'Introduction';
    vm.env = {
      angularVersion: angular.version.full
    };

    vm.model = {
	  username: "",
	  notes:"",
	  team:"",
	  start_date:"",
	  end_date:"",
	  _type:""
    };
 
    vm.fields = [
  
  
	  {
        key: 'username',
        type: 'select',
	 expressionProperties : {
       'templateOptions.onChange': function($viewValue, $modelValue, $scope) {
	   
	   
	  check_dates($viewValue)
	   
	   
       }},
        templateOptions:{
            label: 'Name',
            options: boards,
             }
		
		},
		  {
        key: '_type',
        type: 'select',
        templateOptions:{
            label: 'Type',
            options: leave_type,
             }
		
		},
	   
 
	  {
        key: 'notes',
        type: 'textarea',
        templateOptions: {
          label: 'Notes',
          placeholder: '',
          description: ''
        },
    
      }

  
    ];

	
	
    // function definition
    function onSubmit() {

		formData=(vm.model);
			console.log(formData)
		
		formData.start_date = moment($scope.datePicker.date.startDate._d).startOf('day')
		formData.end_date = moment($scope.datePicker.date.endDate._d)
		
		var leave = new Leave(formData);
		
	
			 Team.query({}, function(team) {
				_.each(team, function(_team,i) {
					
						if(_team._id==formData.username){
							
							leave.team_member= _team._id
							
												console.log ('before',team[i].leave_taken)
												new_leave=[]
											new_ids=[]	
											_.each(team[i].leave_taken, function(leave_me,index) {
											
													if( $scope.ids_to_delete.indexOf(leave_me._id)==-1 && new_ids.indexOf(leave_me._id)==-1){
														new_leave.push(leave_me	)	
														new_ids.push(	leave_me._id)													
													 }
												
											})
							
											team[i].leave_taken=new_leave
											leave.$save(function(resp) {
													console.log('response',resp) 
													team[i].leave_taken.push(resp._id);
										
								
											console.log ('after',team[i].leave_taken)
							
											Team.update({
											id:_team._id,				
											}, team[i]);
							
							
		 vm.options.resetModel()
		// $scope.datePicker.date=[]
		 $scope.overlapalert=[]
		 
						
           
            });
						}
				})
			})
	
			

   
	

    }  
 }
 
 

	
	}
