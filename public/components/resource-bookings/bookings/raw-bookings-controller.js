

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
		
		
		
		
		var columnDefs= []
		
console.log('$location.path',$location.path())
		$rootScope.canEdit_table=true
		
		if(	$scope.user.approve_room_bookings==true && $location.path()=="/bookings/rooms"	||  $scope.user.approve_equipment_bookings==true && $location.path()=="/bookings/equipment"
		) 
		{
			columnDefs.push(
								{ field: 'approved' ,  allowCellFocus: true, type: 'boolean',value: "Approved",resizable: true,visible:true,width:"80",cellTemplate: "<div class='ui-grid-cell-contents'>{{row.entity.approved==true ? 'approved' : 'pending'}}</div>"}
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
			
			{ field: 'logger_user_name' ,value: "Logged by",resizable: true,visible:true,width:"150"},
			{ field: 'date_logged', value: "Date logged" ,type: 'date', cellFilter: 'date:\'dd/MM/yy HH:mm\'', cellFilter: 'date:\'dd/MM/yy HH:mm\'',visible:true}
			
			)
			
			$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
			
			get_table_data.getData(moment(new Date()).subtract({'months':1})._d,$scope)
			
}				







