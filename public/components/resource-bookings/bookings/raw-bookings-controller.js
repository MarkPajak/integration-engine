

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
		$scope.featured_collection=Bookings
		$rootScope.featured_collection=Bookings
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		$scope.extraQuery = { "museum_id":"#","_type":mode_name}
		$scope.rooms=[]
		
		
		
		
		var columnDefs= []
		

		$rootScope.canEdit_table=true
		 columnDefs.push(
			{ field: 'group' ,name: mode,resizable: true,width:"150"},
			{ field: 'start_date' ,name: "From",type: 'date', cellFilter: 'date:\'dd/MM/yy HH:mm\'',resizable: true,width:"150"},	
			{ field: 'end_date' ,name: "Until",resizable: true,type: 'date', cellFilter: 'date:\'dd/MM/yy HH:mm\'',width:"150"},
			{ field: 'comments' ,value: "comments",resizable: true,visible:true},
			{ field: 'booked by' ,value: "Logged by",resizable: true,visible:true},
			{ field: 'date_booked', value: "Date logged" ,type: 'date', cellFilter: 'date:\'dd/MM/yy HH:mm\'', cellFilter: 'date:\'dd/MM/yy HH:mm\'',visible:true}
			)
			
			$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
			
			get_table_data.getData(moment(new Date()).subtract({'months':1})._d,$scope)
			
}				







