var mongoose = require('mongoose');
var moment = require('moment');
var Directdebit = new mongoose.Schema({
		  
/*

- Date of donation
- Amount without gift aid
- Amount with gift aid
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

Directdebit.virtual('date').get(function() {
 
				
			return   moment(this.date_value).format('DD/MM/YYYY');

});

Directdebit.virtual('date_recorded').get(function() {
 
				
			return   moment(this.date_logged).format('DD/MM/YYYY');

});

Directdebit.set('toJSON', {

   virtuals: true
   
});
Directdebit.set('toObject', {

   virtuals: true
   
});


module.exports = mongoose.model('Directdebit', Directdebit);
