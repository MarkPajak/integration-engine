var mongoose = require('mongoose');
var moment = require('moment');
var Generaldonations = new mongoose.Schema({
		  
/*

- Date of donation
- Amount with gift aid
- Amount without gift aid
- Comments
*/	
			id: String,
						  
			kpi_type: { type: String },	

					
			gift_aid_amount: { type: Number},
			amount: { type: Number},
			
			
			
			date_value: { type: Date},	
			date_logged: { type: Date, required: true},
			comments: { type: String},
			logger_user_name: { type: String}
			
			
	
});

Generaldonations.virtual('date').get(function() {
 
				
			return   moment(this.date_value).format('DD/MM/YYYY');

});

Generaldonations.virtual('date_recorded').get(function() {
 
				
			return   moment(this.date_logged).format('DD/MM/YYYY');

});

Generaldonations.set('toJSON', {

   virtuals: true
   
});
Generaldonations.set('toObject', {

   virtuals: true
   
});


module.exports = mongoose.model('Generaldonations', Generaldonations);
