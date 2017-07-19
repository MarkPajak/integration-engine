var mongoose = require('mongoose');
var moment = require('moment');


var Operations_kpi = new mongoose.Schema({
		  
		
			id: String,
			museum_id: { type: String, required: true},				  
			kpi_type: { type: String },	
			
			no_complaints: { type: Number },	
			health_and_safety_forms: { type: Number },	
			
			/*
			Visitor Figures
			Customer Satisfaction info from surveys
			Trip advisor ratings (monthly average?)- manual input?
			Complaints received (in person/and online)-Manual input
			Health and Safety Incident forms (No. of)-Manual input
			Welcome donations
			Donations received
			Ticket sales

			*/

			
			date_value: { type: Date},	
			date_logged: { type: Date, required: true},
			comments: { type: String},
			logger_user_name: { type: String}
			
			
	
});
Operations_kpi.virtual('date').get(function() {
 
				
			return   moment(this.date_value).format('DD/MM/YYYY');

});

Operations_kpi.set('toJSON', {
   virtuals: true
});
Operations_kpi.set('toObject', {
   virtuals: true
});


module.exports = mongoose.model('Operations_kpi', Operations_kpi);
