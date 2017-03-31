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
	

	
	
exports.kpiForm = function() {
  return {
   controller: 'visits_form',
    templateUrl: './components/performance/visits/kpi-form.html'
  }
}



exports.visitsFormdata = function() {
  return {

   templateUrl: './components/performance/visits/kpi-form-and-data.html'
  }
}

exports.retailFormdata = function() {
  return {
  
    templateUrl: './components/performance/retail/kpi-form-and-data.html'
  }
}


exports.retailKpiform = function() {
  return {
   controller: 'retail_performance_form',
    templateUrl: './components/performance/retail/kpi-form.html'
  }
}

	

	exports.rawRetailsales = function() {
  return {
   controller: 'raw_retail_sales_controller',
     templateUrl: './shared/templates/data_table.html'
  }
	}
	
		exports.monthlyRetailsales = function() {
  return {
   controller: 'monthly_retail_sales_controller',
   templateUrl: './shared/templates/data_table.html'
  }
	}
	

