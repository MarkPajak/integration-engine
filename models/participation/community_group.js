var mongoose = require('mongoose');
var moment = require('moment');
var Community_groups = new mongoose.Schema({
		  
		
			id: String,
			community_group: { type: String, required: true},				  
		
			
			
		
			date_value: { type: Date},	
			date_logged: { type: Date, required: true},
			comments: { type: String},
			logger_user_name: { type: String}
			
			
	
});



Community_groups.set('toJSON', {
   virtuals: true
});
Community_groups.set('toObject', {
   virtuals: true
});


module.exports = mongoose.model('Community_groups', Community_groups);
