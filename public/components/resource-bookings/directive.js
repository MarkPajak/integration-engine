



exports.recurringEvent = function() {
  return {
  	    restrict: "E",
    scope: {},
   controller: 'recurring_events_controller',
   templateUrl: './components/resource-bookings/bookings/recurrance-form.html'
  }
  }
  

exports.yearlyBookings = function() {
  return {
  	    restrict: "E",
    scope: {},
   controller: 'yearly_bookings_controller',
   templateUrl: './shared/templates/data_table.html'
  }
  }
  
exports.bookingsDashboard = function() {
  return {
     templateUrl: './components/resource-bookings/bookings/dashboard.html'
  }
  }
  
exports.bookingsReport = function() {
  return {
   
   	    restrict: "E",
    scope: {},controller: 'monthly_bookings_controller',
   templateUrl: './shared/templates/data_table.html'
  }
  }

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
	
	
	
		exports.equipmentFormdata = function() {
  return {
  // controller: 'giftaid_performance_form',
      templateUrl: './components/resource-bookings/equipment/kpi-form-and-data.html'
  }
  }
	
		exports.rawEquipment = function() {
  return {
   controller: 'raw_equipment_controller',
     templateUrl: './shared/templates/data_table.html'
  }
	}
		exports.recordEquipment = function() {
  return {
  controller: 'record_equipment_controller',
      templateUrl: './components/resource-bookings/equipment/kpi-form.html'
  }
	}
	
	
			exports.bookingsData = function() {
  return {
  // controller: 'raw_bookings_controller',
      templateUrl: './components/resource-bookings/bookings/data.html'
  }
  }
  
  			exports.bookingsForm = function() {
  return {
	  controller: 'record_bookings_controller',
      templateUrl: './components/resource-bookings/bookings/kpi-form.html'
  }
  }
	
		exports.rawBookings = function() {
  return {
   controller: 'raw_bookings_controller',
     templateUrl: './shared/templates/data_table.html'
  }
	}
		exports.recordBookings = function() {
  return {
  controller: 'record_bookings_controller',
      templateUrl: './components/resource-bookings/bookings/kpi-form.html'
  }
	}

		exports.editBooking = function() {
  return {
  controller: 'edit_booking_controller',
      templateUrl: './components/resource-bookings/bookings/kpi-form-edit.html'
  }
	}

