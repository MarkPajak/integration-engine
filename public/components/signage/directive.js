
exports.rawPosters = function() {

  return {
   controller: 'raw_posters_controller',
     templateUrl: './shared/templates/data_table.html'
  }
	}
	
	
exports.postersForm = function() {

  return {
  controller: 'record_posters_controller',
      templateUrl: './components/signage/posters/poster-form.html'
  }
	}
	
	
	
exports.postersFormdata = function() {

  return {
  // controller: 'giftaid_performance_form',
      templateUrl: './components/signage/posters/poster-form-and-data.html'
  }
  }
	
