var mongoose = require('mongoose');
var moment = require('moment');


var age_groupDoc = new mongoose.Schema({
  name: String,
  count: Number,
});

var target_groupDoc = new mongoose.Schema({
  name: String
});


var Kpi_events = new mongoose.Schema({
		  
		
			id: String,
			team_id: { type: String, required: true},						
			kpi_type: { type: String },	
			no_sessions: { type: Number, default:1}, //kp value
			no_visits: { type: Number},
			no_enquiries: { type: Number},
			income: { type: Number},
			
			//on_site_off_site: { type: String, required: true},
			event_lead: { type: String},				
			age_groups:  [age_groupDoc],
			target_groups:  [target_groupDoc],
			community_group:  { type: String},
			event_name: { type: String, required: true},

			date_value: { type: Date, required: true},	
			date_value_end: { type: Date, required: true},	
			date_logged: { type: Date, required: true},
			comments: { type: String},
			logger_user_name: { type: String}
			
			
	
});

Kpi_events.virtual('date').get(function() {
 
				
			return   moment(this.date_value_end).format('DD/MM/YYYY');

});

Kpi_events.virtual('date_recorded').get(function() {
 
				
			return   moment(this.date_logged).format('DD/MM/YYYY');

});
Kpi_events.set('toJSON', {
   virtuals: true
});
Kpi_events.set('toObject', {
   virtuals: true
});


module.exports = mongoose.model('Kpi_events', Kpi_events);
