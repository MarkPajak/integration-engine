

exports.votesFormdata = function() {

  return {
  // controller: 'giftaid_performance_form',
      templateUrl: './components/exhibitions/music/votes-form-and-data.html'
  }
  }
	
exports.rawVotes = function() {

  return {
		controller: 'raw_votes_controller',
     templateUrl: './shared/templates/data_table.html'
  }
	}
	
		
exports.monthlyVotes = function() {

  return {
   
		controller: 'monthly_votes_controller',
     templateUrl: './shared/templates/data_table_simple.html'
  }
	}
exports.votesForm = function() {

  return {
  
		controller: 'record_votes_controller',
		templateUrl: './components/exhibitions/music/music-form.html'
  }
	}