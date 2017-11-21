var mongoose = require('mongoose');
var moment = require('moment');


var age_groupDoc = new mongoose.Schema({
  name: String,
  count: Number,
});

var target_groupDoc = new mongoose.Schema({
  name: String
});


var Events_kpi = new mongoose.Schema({
		  
		
			id: String,
			museum_id: { type: String, required: true},						
			kpi_type: { type: String },	
			
			on_site_off_site: { type: String, required: true},
			event_lead: { type: String},				
			age_groups:  [age_groupDoc],
			target_groups:  [target_groupDoc],
			community_group:  { type: String},
			event_name: { type: String, required: true},

			date_value: { type: Date},	
			date_value_end: { type: Date},
			date_logged: { type: Date, required: true},
			comments: { type: String},
			logger_user_name: { type: String}
			
			
	
});

Events_kpi.virtual('date').get(function() {
 
				
			return   moment(this.date_value).format('DD/MM/YYYY');

});

Events_kpi.virtual('date_recorded').get(function() {
 
				
			return   moment(this.date_logged).format('DD/MM/YYYY');

});
Events_kpi.set('toJSON', {
   virtuals: true
});
Events_kpi.set('toObject', {
   virtuals: true
});


module.exports = mongoose.model('Events_kpi', Events_kpi);
