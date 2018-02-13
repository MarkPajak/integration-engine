exports.colourKey = function() {
	
  return {
			controller: 'ColourKeycontroller',
			templateUrl: './shared/templates/colour_key.html'
  }
  
}
exports.tableFilter = function() {
  return {
			controller: 'TableFilterController',
			templateUrl: './shared/templates/table_filter.html'
  }
  
}
	
	
	exports.userMenu = function() {
  return {
    controller: 'NavController',
    templateUrl: './shared/templates/user_menu.html'
  }
	}
	
	
		exports.optionSelect = function() {
  return {
   // controller: 'NavController',
    templateUrl: './shared/templates/option_select.html'
  }
	}
	exports.radioSelect = function() {
  return {
   controller: 'RadioController',
    templateUrl: './shared/templates/radio_select.html'
  }
	}
	
	
		exports.optionSelect2 = function() {
  return {
   // controller: 'NavController',
    templateUrl: './shared/templates/option_select2.html'
  }
	}



	exports.checkBox = function() {
  return {
   // controller: 'NavController',
    templateUrl: './shared/templates/checkbox.html',
	 replace: true,
        scope: {
            ngModel : '='
			
        },
  }
	}