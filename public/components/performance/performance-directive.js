exports.kpiForm = function() {
  return {
   controller: 'performance_form',
    templateUrl: './components/performance/kpi-form.html'
  }
}

exports.retailFormdata = function() {
  return {
  // controller: 'retail_performance_form_and_data',
    templateUrl: './components/performance/retail/kpi-form-and-data.html'
  }
}

exports.retailFormdata = function() {
  return {
//   controller: 'retail_performance_form_and_data',
    templateUrl: './components/performance/retail/kpi-form-and-data.html'
  }
}

exports.retailKpiform = function() {
  return {
   controller: 'retail_performance_form',
    templateUrl: './components/performance/retail/kpi-form.html'
  }
}


	exports.performancePanel = function() {
  return {
   controller: 'performance_controller',
    templateUrl: './components/performance/performance-page.html'
  }
	}
	
	
		exports.performanceButtons = function() {
  return {
   controller: 'shopify_buttons',
    templateUrl: './components/performance/performance-buttons.html'
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
	

