	exports.rawVisits = function() {
  return {
   controller: 'raw_visitor_numbers_controller',
     templateUrl: './shared/templates/data_table.html'
  }
	}
	
		exports.monthlyVisits = function() {
  return {
   controller: 'monthly_visitor_numbers_controller',
   templateUrl: './shared/templates/data_table.html'
  }
	}
	

