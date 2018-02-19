
	exports.timelinesettingsFormdata = function() {
  return {
  // controller: 'giftaid_performance_form',
      templateUrl: './components/timeline-settings/form-and-data.html'
  }
  }
	
		exports.rawTimelinesettings = function() {
  return {
   controller: 'raw_timelinesettings_controller',
     templateUrl: './shared/templates/data_table.html'
  }
	}

		exports.recordTimelinesettings = function() {
  return {
   controller: 'record_timelinesettings_controller',
      templateUrl: './components/timeline-settings/kpi-form.html'
  }
	}
	
	