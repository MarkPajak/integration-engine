exports.retail_uploader =   function($scope, $http, $q,  
		Resources,Posters,data_table_reload,get_table_data,timeline_functions,$routeParams
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

var mode_name = "poster"


	$scope.extraQuery = { "museum_id":"#"}

	$scope.rooms=[]
	 var _room = []
	 _room.name="BMAG"
		 $scope.rooms.push(_room)
		var _room = []
	 _room.name="MSHED"
		 $scope.rooms.push(_room)
		var _room = []
	 _room.name="ALL VENUES"
		 $scope.rooms.push(_room)
	  
	  
	$scope.Posters=Posters
	console.log('user', $scope.user)
	  var query = {'name':"#",'type':mode,'exact':false};
	  
	
		  $scope.selected_room=""			
		  $scope.room_change = function(room) {
			  //Your logic
			$scope.selected_room=room.name
		  }
	  
		  var content = 'file content for example';
		  var blob = new Blob([ content ], { type : 'text/plain' });
		  $scope.url = (window.URL || window.webkitURL).createObjectURL( blob );

	  
$scope.onSubmit=function() {
	  
  var files =  []
  _.each($('#upload-input').get(0).files, function(file){
  
  var _file = {}
  _file.name=	file.name
  
  _file.type=	file.type	
  files.push(_file)	
  console.log(_file)	
  
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
	file.comments=visit_form.name.value
	// add the files to formData object for the data payload
	formData.append('uploads[]', file, file.name);
	console.log(file)	
  }

  $.ajax({
	url: '/upload/data',
	type: 'POST',
	data: formData,
	processData: false,
	contentType: false,
	success: function(data){
		console.log('upload successful!\n' + data);


		

			$.ajax({
				url: '/download/'+ file.name+".log",
				type: 'GET',
				success: function(response)
				{
					$('#logtext').text(response);
				},
					error: function (XMLHttpRequest, textStatus, errorThrown) 
				{
			
			}
			})
	



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

