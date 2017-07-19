exports.timeline_settings_controller =  function($scope, $http, $q, $routeParams, $location,
        screen_saver_loop,  $rootScope, detect_dragging, trello, get_trello_board, date_calc, Todos, Tallys,Team,Timeline,$mdEditDialog,Timeline_data
    ) {



  $scope.rows = [];
   $scope.column_headings = []

  $scope.counter = 0;
  
  $scope.addRow = function() {
   var data_row = new Timeline_data({
                name:  $scope.counter
            });
			
	 data_row.$save(function() {
		
               
            });
  
    $scope.rows.push('Row ' + $scope.counter);
    $scope.counter++;
  }
   Timeline_data.query({}, function(data) {
  _.each(data, function(data_settings,index) {

		  Timeline_data.remove({
               // id: data_settings._id
            });
		
	})	
		})	  
  
  		var data_settings = new Timeline_data({ 
					type:"text",
					data_feed_url:"https://www.gov.uk/bank-holidays.json",
					googlesheet_name:"england-and-wales",
					track:"public holidays",
					group:"public holidays",
					use_moment:false,
					value_column:"title",
					title_column:"title",
					events_sub_child:"events",
					start_column:"date",
					group_id:"public holidays"+"public holidays",
					date_column:"date"
		})
	//data_settings.$save();
		
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
	
	
	
	
	var data_settings = new Timeline_data({ 
					type:"numerical",
					data_feed_url:"http://museums.bristol.gov.uk/sync/data/stats.JSON",
					googlesheet_name:"stats",
					track:"emu stats",
					use_moment:false,
					value_column:"value",
					group_column:"module",
					group_id:"module",
					group_id_column:"module",
					date_column:"date",
					subgroup_column:"action",
					start_column:"start_date",
					end_column:"end_date",
					val_1:0,
					val_2:10,
					val_3:100,
					val_4:500,
					val_5:1000,
					val_6:2000,
					val_7:3000,
					val_8:4000,
					val_9:5000,
					val_10:10000
	})
 //data_settings.$save();
  
  	
	
		var data_settings = new Timeline_data({ 
					type:"numerical",
					use_moment:true,
					googlesheet_id:"1ENJ87VM90o15jcZ1yavlVf7F1fg4xePoluyrm2uWlgE",
					googlesheet_name:"pivot",
					track:"Shopify",
					group:"Shopify",
					group_id:"Shopify",
					value_column:"value",
					date_column:"date",
					val_1:0,
					val_2:300,
					val_3:600,
					val_4:900,
					val_5:1100,
					val_6:1200,
					val_7:1400,
					val_8:1500,
					val_9:2000,
					val_10:3000
	})
	//data_settings.$save();
	 
	 	
		var data_settings = new Timeline_data({ 
					type:"text",
					googlesheet_id:"1VsSxPQ6rGrP3FWdveX3wwdUlnB1t_Sk2NG6aE0kX92M",
					googlesheet_name:"Sheet1",
					use_moment:false,
					track:"Arts and Events",
					colour:"green",
					title_column:"Event_Title",
					start_column:"Event_Start",
					group_column:"Event_Location",
					end_column:"Event_End",
					value_column:"value",
					subgroup_column:"name",
					date_column:"date"
	})
	data_settings.$save();
  
     Timeline_data.query({}, function(team) {
		 
		   for (var key in team[0]) {
			   
			var dont_shows=[
			"__v","_id","$get","$save","$query","$remove","$delete","toJSON","$update"
		   ]
			
			   if(dont_shows.indexOf(key)==-1){
				$scope.column_headings.push(key)
			   }				
			}	
			
		  _.each(team, function(row,index) {  
			$scope.rows.push(row)
			 $scope.counter++;
		 })
	 })
	 
	 
   $scope.editComment = function (event, dessert) {
  // if auto selection is enabled you will want to stop the event
  // from propagating and selecting the row
  event.stopPropagation();

console.log(event)
  
	var myArray = []
var key = "happyCount";
var obj = {};
obj[key] = newValue;
myArray.push(obj);
 
 
  var promise = $mdEditDialog.small({

    modelValue: dessert.comment,
    placeholder: 'Add a comment',
    save: function (input) {
	event.target.innerHTML=input.$modelValue
			var query = {'id':dessert._id};
			Timeline_data.update(query, {
					myArray:input.$modelValue
					}, function(err, affected, resp) {
					console.log(resp)
					console.log(err)
			})
    },
    targetEvent: event,
    validators: {
      'md-maxlength': 30
    }
  });
  promise.then(function (ctrl) {
    var input = ctrl.getInput();

    input.$viewChangeListeners.push(function () {
      input.$setValidity('test', input.$modelValue !== 'test');
    });
  });
  }
  }

  
