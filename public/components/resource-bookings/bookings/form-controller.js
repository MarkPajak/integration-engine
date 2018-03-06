exports.record_bookings_controller =  function($scope, $http, $q,  
          Resources,Bookings,data_table_reload,get_table_data,timeline_functions,$routeParams
    ) {

//$scope.setDate = data_table_reload.setDate;

	if($routeParams.mode=="rooms")
	{
		var mode = "room"
		var mode_name = "ROOM BOOKING"
		$scope.name_of_form = "Select room" 
	}
	else
	{
		var mode = "equipment"
		var mode_name = "EQUIPMENT BOOKING"
		$scope.name_of_form = "Select Equipment"

	}




			$scope.extraQuery = { "museum_id":"#"}

	  $scope.rooms=[]
	  $scope.Resources=Resources
	  console.log('user', $scope.user)
		var query = {'name':"#",'type':mode,'exact':false};
				
		Resources.query(query, function(rooms) {
					
				
				  _.each(rooms, function(room){					  
				  var _room = []
				  _room.name=room.name
					$scope.rooms.push(_room)
				  })

		})	
			
			$scope.selected_room=""			
			$scope.room_change = function(room) {
				//Your logic
			  $scope.selected_room=room.name
			}
		


		
 $scope.onSubmit=function() {
		
	var files =  []
	_.each($('#upload-input').get(0).files, function(file){
	
	var _file = {}
	_file.name=	file.name
	_file.type=	file.type	
	files.push(_file)	
	console.log(_file)	
	
	})		
	
	console.log(files)	

var event_to_add=	{
													 
						id : new Date().getUTCMilliseconds(),
						name :visit_form.name.value,
						
						internal_external :visit_form.type_radios.value,														  
						showimage :"",
						image :"",
						start_date : new Date(visit_form.start_date.value),
						end_date :  new Date(visit_form.end_date.value),	
						notes  :visit_form.comments.value	
					
					}
			
var kpis = new Bookings({
					
					//DEPARTMENTAL VARIABLES	
					start_date: new Date(visit_form.start_date.value),	
					end_date: new Date(visit_form.end_date.value),	
					group:$scope.selected_room,	
					_type: mode_name,	
					className:"GREEN",	
					files:files,
					internal_external :visit_form.type_radios.value,	
					name:visit_form.name.value,	
					deposit:visit_form.deposit.value,		
					balance:visit_form.balance.value,							
					notes:visit_form.comments.value,	
					showimage :"",
					content: timeline_functions.event_html(event_to_add),	
					image :"",

					date_logged:new Date(),	
					//date_value:visit_form.date_value.value,
					comments:visit_form.comments.value,			
					logger_user_name: $scope.user.username,					
					requested_by:$scope.user.username
					
            });
			
				
													
                          
			
			var query = {
			
						'name': visit_form.name.value,	
						'_type':mode_name,
						'group':visit_form.room.value,
						'start_date':visit_form.start_date.value,
						'end_date':visit_form.end_date.value
						
						};
			
			Bookings.query(query, function(visits) {
				  $scope.$emit('form_submit');
				console.log('Raw_visits',visits.length)
				$scope.results=visits
		
						save(kpis)
			
			})	
			
            
		
	

	

    }
		function save(kpis){

	kpis.$save(function(err, user) {
		
						if(err) console.log(err)
						 var  message = "data saved successfully";
							  message+= "\n ";
							  //message+= " "+ data + " added to " + museum;
							  alert(message);
							  get_table_data.getData(moment(new Date()).subtract({'months':1})._d,$scope)			
							$scope.message="data saved successfully";
							visit_form.name.value=""
							visit_form.group.value=""
							visit_form.start_date.value=""
							visit_form.end_date.value=""
							//visit_form._type.value=""
							
							
	
							
							 
							 
						})
						

}
	
	$( document ).ready(function() {
     $scope.$emit('record_rooms_form');
	 $scope.savex=function(kpis) {
			save(kpis)
	 }
	
});
	
$('.upload-btn').on('click', function (){
    $('#upload-input').click();
    $('.progress-bar').text('0%');
    $('.progress-bar').width('0%');
});

$('#upload-input').on('change', function(){

  var files = $(this).get(0).files;

  if (files.length > 0){
    // create a FormData object which will be sent as the data payload in the
    // AJAX request
    var formData = new FormData();

    // loop through all the selected files and add them to the formData object
    for (var i = 0; i < files.length; i++) {
      var file = files[i];

      // add the files to formData object for the data payload
      formData.append('uploads[]', file, file.name);
    }

    $.ajax({
      url: '/upload',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(data){
          console.log('upload successful!\n' + data);
      },
      xhr: function() {
        // create an XMLHttpRequest
        var xhr = new XMLHttpRequest();

        // listen to the 'progress' event
        xhr.upload.addEventListener('progress', function(evt) {

          if (evt.lengthComputable) {
            // calculate the percentage of upload completed
            var percentComplete = evt.loaded / evt.total;
            percentComplete = parseInt(percentComplete * 100);

            // update the Bootstrap progress bar with the new percentage
            $('.progress-bar').text(percentComplete + '%');
            $('.progress-bar').width(percentComplete + '%');

            // once the upload reaches 100%, set the progress bar text to done
            if (percentComplete === 100) {
              $('.progress-bar').html('Done');
            }

          }

        }, false);

        return xhr;
      }
    });

  }
});
	
	}
 
