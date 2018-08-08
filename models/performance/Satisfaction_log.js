var mongoose = require('mongoose');
var moment = require('moment');



var Satisfaction_log = new mongoose.Schema({
	
			museum_id: { type: String, required: true},				  
			kpi_type: { type: String },	
			value: { type: Number, required: true},
			date_logged: { type: Date, required: true},
			date_value: { type: Date},
			comments: { type: String},	
			logger_user_name: { type: String}
	
});


Satisfaction_log.virtual('date').get(function() {
 			
			return   moment(this.date_value).format('DD/MM/YYYY');

});



Satisfaction_log.set('toJSON', {
   virtuals: true
});
Satisfaction_log.set('toObject', {
   virtuals: true
});


module.exports = mongoose.model('Satisfaction_log', Satisfaction_log);
