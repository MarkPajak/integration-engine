var mongoose = require('mongoose');
var moment = require('moment');
var Learning_kpi = new mongoose.Schema({
		  
		
			id: String,
			museum_id: { type: String, required: true},				  
			kpi_type: { type: String },	
			
			
			age_group: { type: String },	
			session_type: { type: String },	
			total_sessions: { type: Number},
			total_children: { type: Number},
			total_teachers: { type: Number},
			total_income: { type: Number},
			//net_sales: { type: Number},
			//no_transactions: { type: Number},
			
			date_value: { type: Date},	
			date_value_end: { type: Date},
			date_logged: { type: Date, required: true},
			comments: { type: String},
			logger_user_name: { type: String}
			
			
	
});

Learning_kpi.virtual('date').get(function() {
 
				
			return   moment(this.date_value).format('DD/MM/YYYY');

});

Learning_kpi.virtual('date_recorded').get(function() {
 
				
			return   moment(this.date_logged).format('DD/MM/YYYY');

});
Learning_kpi.set('toJSON', {
   virtuals: true
});
Learning_kpi.set('toObject', {
   virtuals: true
});


module.exports = mongoose.model('Learning_kpi', Learning_kpi);
