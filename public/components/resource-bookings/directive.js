

	exports.roomsFormdata = function() {
  return {
  // controller: 'giftaid_performance_form',
      templateUrl: './components/resource-bookings/rooms/kpi-form-and-data.html'
  }
  }
	
		exports.rawRooms = function() {
  return {
   controller: 'raw_rooms_controller',
     templateUrl: './shared/templates/data_table.html'
  }
	}
		exports.recordRooms = function() {
  return {
  controller: 'record_rooms_controller',
      templateUrl: './components/resource-bookings/rooms/kpi-form.html'
  }
	}
