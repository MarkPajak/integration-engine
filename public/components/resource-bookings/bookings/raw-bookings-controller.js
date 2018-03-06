

exports.raw_bookings_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Bookings,data_table_reload,get_table_data,grid_ui_settings,make_a_pie,make_a_line_chart,monthly_data_table_columns,table_security
    ) {
		

if($routeParams.mode=="rooms"){
var mode = "room"
var mode_name = "ROOM BOOKING"
}
else
{
var mode = "equipment"
var mode_name = "EQUIPMENT BOOKING"


}
		  
		$scope.show_all_Button=true
		$scope.table_class = "col-md-12 col-lg-12 col-sm-5"
		$scope.featured_collection=Bookings
		$rootScope.featured_collection=Bookings
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		
		$scope.extraQuery = { "museum_id":"#","_type":mode_name}
		$scope.rooms=[]
	
		$scope.filter_x_button=true
		$scope.filter_y_button=true
		$scope.filter_z_button=true
		$scope.filter_x="show pending bookings"
		$scope.filter_y="show unpaid bookings"
		$scope.filter_z="show confirmed bookings"
		
		   $scope._filter_x=[
		  { false:"pending ",
		   true:"approved",
		   result:false}
		   ]
		   $scope._filter_y=[
		  { false:"unpaid",
		   true:"paid ",
		   result:false}
		   ]
		   $scope._filter_z=[
		   {false:"upconfirmed",
		   true:"confirmed",
		   result:false}
		   ]
		
   $scope.onCompleteTodo = function(todo) {
    console.log("onCompleteTodo -done: " + todo.done + " : " + todo.text);
    $scope.doneAfterClick=todo.done;
    $scope.todoText = todo.text;

   };
	
	
		var columnDefs= []
		

		$rootScope.canEdit_table=true
		
		if(	$scope.user.approve_room_bookings==true && $location.path()=="/bookingslist/rooms"	||  $scope.user.approve_equipment_bookings==true && $location.path()=="/bookings/equipment"
		) 
		{
			columnDefs.push(
								{ name: "edit",resizable: true,width:"40", cellTemplate: "<a target='_blank' href=" + window.location.origin +"{{\"#/edit-booking/rooms/\"+row.entity._id}} >edit</a>"}, 
								{ field: 'approved' ,  allowCellFocus: true, type: 'boolean',value: "Approved",resizable: true,visible:true,width:"80",cellTemplate: "<div class='ui-grid-cell-contents'>{{row.entity.approved==true ? 'approved' : 'pending'}}</div>"},
							    { field: 'confirmed' ,  allowCellFocus: true, type: 'boolean',value: "Confirmed",resizable: true,visible:true,width:"80",cellTemplate: "<div class='ui-grid-cell-contents'>{{row.entity.confirmed==true ? 'confirmed' : 'no'}}</div>"},
								{ field: 'deposit' ,  allowCellFocus: true, type: 'number',value: "Deposit amount",resizable: true,visible:true,width:"80"},
								{ field: 'balance' ,  allowCellFocus: true, type: 'number',value: "Balance amount",resizable: true,visible:true,width:"80"},
								{ field: 'total' ,  allowCellFocus: false, type: 'number',value: "Total amount",resizable: true,visible:true,width:"80"},
								{ field: 'payment' ,  allowCellFocus: true, type: 'boolean',value: "Paid",resizable: true,visible:true,width:"80",cellTemplate: "<div class='ui-grid-cell-contents'>{{row.entity.payment==true ? 'paid' : 'no'}}</div>"}
							)
							
		}

		columnDefs.push(
		
			
			{ field: 'group' ,name: mode,resizable: true,width:"150"},
			{ field: 'name' ,name: "Name",resizable: true,width:"150"},
			{ field: 'internal_external' ,name: "Type",resizable: true,width:"150"},
			{ field: 'start_date' ,name: "From",type: 'date', cellFilter: 'date:\'dd/MM/yy HH:mm\'',resizable: true,width:"150"},	
			{ field: 'end_date' ,name: "Until",resizable: true,type: 'date', cellFilter: 'date:\'dd/MM/yy HH:mm\'',width:"150"},
			{ field: 'comments' ,value: "comments",resizable: true,visible:true,width:"150"},
			{ field: 'calendarlink' ,name: "Outlook link",resizable: true,width:"150", cellTemplate: "<a href=" + window.location.origin +"{{\"/bookings/calendar/\"+row.entity.calendarlink}} >click for icalendar link</a>"}, 
			{ field: 'files' ,name: "Files",resizable: true,width:"150",  cellTemplate: "<a   ng-if='row.entity.files[0].name' href=" + window.location.origin +"{{\"/download/\"+row.entity.files[0].name}} target='_blank'>{{row.entity.files[0].name}}</a><br><a   ng-if='row.entity.files[1].name' href=" + window.location.origin +"{{\"/download/\"+row.entity.files[1].name}} target='_blank'>{{row.entity.files[1].name}}</a><br><a  ng-if='row.entity.files[2].name' href=" + window.location.origin +"{{\"/download/\"+row.entity.files[2].name}} target='_blank'>{{row.entity.files[2].name}}</a>"},
			{ field: 'logger_user_name' ,value: "Logged by",resizable: true,visible:true,width:"150"},
			{ field: 'date_logged', value: "Date logged" ,type: 'date', cellFilter: 'date:\'dd/MM/yy HH:mm\'', cellFilter: 'date:\'dd/MM/yy HH:mm\'',visible:true}
			
			)
			
			$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
			
			get_table_data.getData(moment(new Date()).subtract({'months':1})._d,$scope)
			
			//TO DO
			//send confirmation email when booking changes to approved
			
}				







