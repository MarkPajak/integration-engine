exports.timeline_controller=     function($compile,  $scope, $http, $q, $routeParams, $location,
         $location, $rootScope, trello,timeline_bookings_functions, get_trello_board, date_calc, Todos, Timeline, Bookings,Team, kiosk_activity,timeline_functions,timeline_leave_functions,timeline_learning_functions,timeline_loans_functions,timeline_googlesheets_functions,Timeline_data,AuthService,timeline_shopify_functions,Shopify_aggregate,Raw_visits,timeline_visitor_figures_functions,timeline_install_functions, $timeout,timeline_exhibitions_functions
    ) {
		
		$scope.locked=[]
		$scope.locked.add_item = false
		$scope.locked['true']={status:" locked",value:false}
		$scope.locked['false']={status:" unlocked",value:true}
		$scope.average_install_length = 0
		$scope.password=false
		$scope.lockstatus=false
		$scope.average_derig_length = 0
		$rootScope.addednames=[]
		$rootScope.track_groups=[]
		$rootScope.added_track_groups=[]
		$rootScope.datePicker=[];
		$scope.isloggedin=false	
		$scope.isloggedin=false	
	    $scope.timeline_track = Timeline 
		
		
		$rootScope.installmodels=[]				
		$rootScope.installmodels.push({"name":"painting","selected":false,"icon":"picture"})
		$rootScope.installmodels.push({"name":"graphics","selected":false,"icon":"tint"})
		$rootScope.installmodels.push({"name":"av","selected":false,"icon":"volume-up"})
		$rootScope.installmodels.push({"name":"build","selected":false,"icon":"wrench"})
		$rootScope.installmodels.push({"name":"objects","selected":false,"icon":"tower"})
		$scope.haspermissions=false
	
	 $scope.init = function(timeline_mode)
  {
	 setTimeout(function() {
	 
			(timeline_mode=="room-hire")	? $scope.timeline_track = Bookings :  $scope.timeline_track = Timeline 
			
			
			 AuthService.isLoggedIn().then(function(user){
		
			
						$scope.user=user
						$scope.isloggedin=true			
						if(	user.data.group=="ADMIN"){$scope.haspermissions=true}
						if(	user.data.group=="EXHIBITIONS"){$scope.haspermissions=true}
						if(	user.data.group=="DIGITAL"){$scope.haspermissions=true}

			main_function(timeline_mode)
			
	  })
	   
	  	setTimeout(function() {
		
			if($scope.isloggedin==false){
				main_function(timeline_mode)
			} 
		
        }, 2000);

  })
}

	  

main_function = function(timeline_mode){



	if(timeline_mode=="room-hire" ){ timeline_track = Bookings } else{  timeline_track = Timeline }

			$scope.filter_pie=[]
			$scope.filter_pie.push({value:"2017 total_children",name:"No. children"})
			$scope.filter_pie.push({value:"2017 total_sessions",name:"No. sessions"})
			$scope.filter_pie.push({value:"2017 total_teachers",name:"No. teachers"})
			$scope.filter_pieSelected = $scope.filter_pie[0].name; 
			$scope.plot_graph =null;
			$rootScope.datePicker.date = {startDate:null, endDate: null};
			
			$scope.dateRangeOptions = {
				
				
					locale : {
						format : 'DD/MM/YYYY'
					},
					//TIMELINE EVENT HANDLERS					
					eventHandlers : {
						
										'apply.daterangepicker' : function() {  
										   date=$rootScope.datePicker.date
											days=timeline_functions.days(moment(date.startDate),moment(date.endDate))
											
											
										 
										   	if(moment(date.startDate).isValid()){ //true
										
										var event_to_add=	{id :  $scope.selected_id,
																				  name :$scope.selected_item,
																				  showimage :"",
																				  image :"",
																				  start_date :moment(date.startDate).format("MMM Do"),
																				  end_date : moment(date.endDate).format("MMM Do")|| "",
																				  notes  :$rootScope.selected_notes + "(" +days+" days)" ,			
																				 
																				 install_features:$rootScope.installmodels,
																				 days :days}
										
										
										html=timeline_functions.event_html(event_to_add)
												
										var options={id:$scope.selected_timeline_id,content:html,install_features:$rootScope.installmodels, start:moment(date.startDate)._d,end:moment(date.endDate)._d,start_date:moment(date.startDate)._d,end_date:moment(date.endDate)._d}
												
										timeline_track.update({
												id: $scope.selected_id,				
												}, options);				
												console.log('updatedItem',options)
												timeline_functions.updateItem(options)
												
								
									
										}}				
						}
        }

				$scope.$watch('selected_notes', function(selected_note) {
				console.log('selected_notes edited',selected_note)
						timeline_functions.event_edited($scope,selected_note)
				
				})
				$scope.$watch('selected_approved', function(selected_approved) {
				console.log('selected_approved edited',selected_approved)
						timeline_functions.event_edited($scope,selected_approved)
				
				})
		
				

			
			$scope.$watch('selected_item', function(selected_item) {

			if(timeline.options.editable==true){	
			
			date=$rootScope.datePicker.date
			days=timeline_functions.days(moment(date.startDate),moment(date.endDate))
			$scope.selected_start = moment(date.startDate ).format("MMM Do")
			$scope.selected_end = moment(date.endDate).format("MMM Do")
					
			if(moment(date.startDate).isValid()){ //true
											
			var event_to_add=	{id :  $scope.selected_id,
													  name :$scope.selected_item,
													  showimage :"",
													  image :"",
													  start_date :moment(date.startDate).format("MMM Do"),
													  end_date : moment(date.endDate).format("MMM Do")|| "",
													  notes  :$rootScope.selected_notes ,
													  
													 days :days}
			
					html=timeline_functions.event_html(event_to_add)
					
					var options={id:$scope.selected_timeline_id,content:html,name:selected_item,start:moment(date.startDate)._d,end:moment(date.endDate)._d,}
					timeline_track.update({
					id: $scope.selected_id,				
					}, options);	
					
					console.log('called by selected_item') 
					
					timeline_functions.updateItem(options)
			}
			
			}
		//	else
			//{
			//	console.log('not logged in')
			//}
			
			})
	 
			$scope.$watch('stack', function(stack) {
		
		console.log('stack')
					 if(typeof(stack)!="undefined"){
						 
						   options={stack:stack}
							timeline_functions.updateOptions(options)
					  }
		  
		
		  
			})

		
		
			//END EVENT HANDLERS

		
			$scope.editing = [];
			$scope.timeline = Timeline.query();


			
			
			$scope.removeTimeline = function(id) {
				timeline_track .remove({
					id: id
				})
			}
	
		
				
				
		   timeline_track.query({}, function(team) {
				_.each(team, function(row,index) {
			
			 
			 var timeline = $scope.timeline[index];
			 if(timeline.group=="Bristol Archives"){
				 timeline_track .remove({
					id: timeline._id
				}, function() {
				   // $scope.timeline.splice(index, 1);
				});
				}
				
				})
			})
		
	
        $scope.save = function() {
		
            if (!$scope.newTimeline || $scope.newTimeline.length < 1) return;
            var timeline = new timeline_track({
                name: $scope.newTimeline,
                completed: false
            });

            timeline.$save(function() {
		
                $scope.timeline.push(timeline);
                $scope.newTimeline = ''; // clear textbox
            });
        }

        $scope.update = function(index) {
            var timeline = $scope.timeline[index];
            timeline_track.update({
                id: timeline._id
            }, timeline);
            $scope.editing[index] = false;
        }

        $scope.edit = function(index) {
            $scope.editing[index] = angular.copy($scope.timeline[index]);
        }

        $scope.cancel = function(index) {
            $scope.timeline[index] = angular.copy($scope.editing[index]);
            $scope.editing[index] = false;
        }

        $scope.remove = function(index) {
            var timeline = $scope.timeline[index];
            timeline_track.remove({
                id: timeline._id
            }, function() {
                $scope.timeline.splice(index, 1);
            });
        }

        $scope.datePicker = "";
        $scope.datePicker.date = {
            startDate: null,
            endDate: null
        };
        $scope.machine_types = [];
        $scope.type = "all";


		$scope.changedValue = function(place) {
        
		 $rootScope.filter_pieSelected=place
       
	   }

        $scope.machinesx = ["all"]
        $scope.filterCondition = {
            machine: 'neq'
        }
        $scope.$watch('type', function(type) {
            $scope.machinesx = ["all"]


        })

  

            // selected fruits
        $scope.machine_types_selection = [];



        $scope.categories = [];

        // selected fruits
        $scope.category_selection = [];



/*
        var _data = [];
        $scope.data = []
        $scope.day_data = []
        $scope.team = [];
        $scope.labels = $scope.team
        $scope.chart_title = "Machine activity"
*/

            var groups = new vis.DataSet();
            var dates = new vis.DataSet();
			var second_dates = new vis.DataSet();
            var all_groups = []
            var i = 0

      

			install_days_tally = 0
			install_instance_tally=0 
			derig_tally = 0
			derig_days_tally=0
			$scope.total_install_derig=install_days_tally+derig_days_tally
			$scope.average_install_length=Math.round(install_days_tally/install_instance_tally)
			$scope.average_derig_length=Math.round(derig_days_tally/derig_tally)
			
			var container = document.getElementById('example-timeline');
            timeline = new vis.Timeline(container);
			 $rootScope.timeline=	timeline
			
			date={content:"STARTER"  ,
					group:"STARTER",
					group_id:"STARTER",
					id:"STARTER",
					name:"STARTER"  ,
					event_type:"STARTER",
					track:"STARTER",
					order: "STARTER",
					subgroup: "STARTER",
					start:new Date(),
					end:new Date(),
					//className 	:	"orange"
					}
	
			//VIS ERRORS IF INITIALISED WITH AN EMPTY START DATE
			timeline_functions.setup( $scope.timeline_track ,$rootScope.groups, new vis.DataSet(date))
			
			
			
			$scope.add_exhibitions= function(){						
					timeline_functions.populate_timeline_track_method_b($rootScope,timeline_exhibitions_functions,timeline_track)
			}
			
			$scope.add_installs_derigs= function(){				
					timeline_functions.populate_timeline_track($rootScope,Timeline,timeline_install_functions,timeline_track)	
			}
			
			$scope.team_leave= function(){
					timeline_functions.populate_timeline_track_method_b($rootScope,timeline_leave_functions,timeline_track)				
			}
			
			$scope.visitor_figures= function(){							
					timeline_functions.populate_timeline_track($rootScope,Raw_visits,timeline_visitor_figures_functions,timeline_track)
			}
			
			
			$scope.bookings= function(){							
					timeline_functions.populate_timeline_track($rootScope,Bookings,timeline_bookings_functions,timeline_track)
			}
			
			$scope.shopify= function(){							
					timeline_functions.populate_timeline_track($rootScope,Shopify_aggregate,timeline_shopify_functions,timeline_track)
			}
				
			$scope.loans= function(){							
					timeline_functions.populate_timeline_track_method_b($rootScope,timeline_loans_functions,timeline_track)
			}
			
			$scope.learning_bookings= function(){							
					timeline_functions.populate_timeline_track_method_b($rootScope,timeline_learning_functions,timeline_track)
			}
			
			
			$scope.timeline_googlesheets_functions= function(data_settings){
			
					var groups =$rootScope.groups
					$rootScope.timeline.setGroups(groups);
					timeline_googlesheets_functions.get_events(data_settings)
				  		  
			}
	//dev		
			data_settings=[]
			data_settings.googlesheet_id="1XDUXfrYH8RtyDDaWfKSlosQ3EjatsmC2E8F22O1gkEg"
			data_settings.googlesheet_name="retail"
			data_settings.group_column="group"
			data_settings.type="text"
			data_settings.use_moment=false
			data_settings.track="Retail"
			data_settings.colour="red"
			data_settings.title_column="name"
			data_settings.start_column="start_date"
			data_settings.end_column="end_date"
			
			data_settings_pliosaurus=[]
			data_settings_pliosaurus.googlesheet_id="1rISxf_ExC1_NyKbMGfB1KibTBttyyHLBkcv5RLNsvLw"
			data_settings_pliosaurus.googlesheet_name="pliosaurus"
			data_settings_pliosaurus.group_column="group"
			data_settings_pliosaurus.type="text"
			data_settings_pliosaurus.use_moment=false
			data_settings_pliosaurus.track="Digital"
			//data_settings_pliosaurus.colour="red"
			data_settings_pliosaurus.type_column="type"
			data_settings_pliosaurus.title_column="name"
			data_settings_pliosaurus.start_column="start_date"
			data_settings_pliosaurus.end_column="end_date"
			
			data_settings_donations=[]
			data_settings_donations.googlesheet_id="1rISxf_ExC1_NyKbMGfB1KibTBttyyHLBkcv5RLNsvLw"
			data_settings_donations.googlesheet_name="donations"
			data_settings_donations.group_column="group"
			data_settings_donations.type="text"
			data_settings_donations.use_moment=false
			data_settings_donations.track="Digital"
			//data_settings_donations.colour="red"
			data_settings_donations.type_column="type"
			data_settings_donations.title_column="name"
			data_settings_donations.start_column="start_date"
			data_settings_donations.end_column="end_date"
		//	$scope.shopify() //NB for some reason need this to appear for unlogged in users otherwise text wont load in directives
			
			
			//WE'll do some routing here - might need to put it in a better place one day
			
			
			if(timeline_mode=="room-hire"){
				
		
			
					timeline_track = Bookings
					$scope.bookings()
			
			}
			else
			{
			timeline_track = Timeline
			if( $scope.isloggedin){	
			
					timeline_googlesheets_functions.get_events(data_settings)
					timeline_googlesheets_functions.get_events(data_settings_donations)
					timeline_googlesheets_functions.get_events(data_settings_pliosaurus)
					$scope.add_installs_derigs()
					//$scope.team_leave()
					$scope.visitor_figures()
					//$scope.learning_bookings()
					//$scope.loans()
					

			}			
			
			$scope.add_exhibitions()
			}
		
	
	var checked_event_types=[]
											checked_event_types.push('Tour')
											checked_event_types.push('Walk')
											checked_event_types.push('Rides')
											checked_event_types.push('Tours')
											checked_event_types.push('Talk')
											checked_event_types.push('Lecture')
											checked_event_types.push('Special Event')
											checked_event_types.push('Event')
											checked_event_types.push('Family')

	   Timeline_data.query({}, function(data) {
				
				_.each(data, function(data_settings) {
					console.log('data_settings',data_settings)
					$scope.timeline_googlesheets_functions(data_settings)
				})
		
		timeline_functions.update_andCompile()	
		
		})

	

    // check if there is query in url
    // and fire search in case its value is not empty
		 $scope.$watch('installmodels|filter:{selected:true}', function (nv) {
						timeline_functions.event_edited($scope)

		}, true);
	
	
	
	$scope.$watch('track_groups|filter:{selected:true}', function (nv) {
		
					var selection = nv.map(function (track_groups) {
					
					  return track_groups.track;
					});
					$scope.selected_tracks=selection
					timeline_functions.changeTracks(selection)
					//$( ".draggable,.iconbar" ).css({ 'top':'0px' });
  }, true);
  
	
$scope.$watch('groups|filter:{selected:true}', function (nv) {
	
					var selection = nv.map(function (group) {
					  return group.content;
					});
					timeline_functions.changeGroups(selection)
					$( ".draggable,.iconbar" ).css({ 'top':'0px' });
	
}, true);

	


			
	
      
			
		$scope.exportCSV= function(){
			
				data_to_export=$rootScope.timeline.itemsData.getDataSet()
				
				visibles=$rootScope.timeline.getVisibleItems()
				events=[]
				
				  _.each(data_to_export._data, function(event,index) {
				
				  if(visibles.indexOf(event.id)!=-1){
				  console.log("in")
				  var _event ={  
								 id			:event.id,
								 name		:event.name,
								 start_date	:moment(event.start).format("DD/MM/YYYY"),
								 end_date	:moment(event.end).format("DD/MM/YYYY"),
								 event_type	:event.track
							   
								}
					 events.push(_event)
						}
				  
				   
				  
				  })
						
				timeline_functions.export_JSON_to_CSV(events, "Timeline dates", true)
	}
	

				
			
			
			
		
		
			
		

		       
            $scope.list1 = {
                title: 'PROVISIONAL DATE'
            };
            $scope.list2 = {
                title: 'INSTALL'
            };
            $scope.list3 = {
                title: 'DERIG'
            };

            $scope.onDropComplete = function(data, evt) {
                // console.log("drop success, data:", data);
            }
			
		


       // })

    };
	
	
	} 
 
exports.BasicDemoCtrl=   function (timeline_functions,$mdDialog,$scope, $http, $q, $routeParams, $location

    ) {
	

	 
			$scope.$watch('track.stack', function(stack) {
		
		console.log('stack')
					 if(typeof(stack)!="undefined"){
						 
						   options={stack:stack}
							timeline_functions.updateOptions(options)
					  }
		  
		
		  
			})

 var originatorEv;

    this.openMenu = function($mdMenu, ev) {
      originatorEv = ev;
      $mdMenu.open(ev);
    };

    this.notificationsEnabled = false;
    this.toggleNotifications = function() {
      this.notificationsEnabled = !this.notificationsEnabled;
    };

    this.redial = function() {
    };

    this.checkVoicemail = function() {
      // This never happens.
    };
  }
  
  

exports.add_timeline_items_controller=    function($scope, $http, $q, $routeParams, $location,
         $location, $rootScope, trello, get_trello_board, date_calc, Todos, Timeline, Team, kiosk_activity,timeline_functions,timeline_leave_functions,timeline_learning_functions,timeline_loans_functions,timeline_googlesheets_functions,Timeline_data,AuthService,timeline_shopify_functions,Shopify_aggregate
    ) {
	
	$scope.unlocked=false
	$scope.$watch('locked', function (locked) {
		
		$scope.locked=locked
  })
  }
  
  exports.add_timeline_info_box=    function($scope, $http, $q, $routeParams, $location,
         $location, $rootScope, trello, get_trello_board, date_calc, Todos, Timeline, Team, kiosk_activity,timeline_functions,timeline_leave_functions,timeline_learning_functions,timeline_loans_functions,timeline_googlesheets_functions,Timeline_data,AuthService,timeline_shopify_functions,Shopify_aggregate
    ) {
		

 



 }
  

  
