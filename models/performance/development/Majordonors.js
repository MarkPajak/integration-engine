var mongoose = require('mongoose');
var moment = require('moment');
var Majordonor = new mongoose.Schema({
		  
/*

- date of donation
- Amount with gift aid
- Amount without gift aid
-Comments 
*/	
			id: String,
						  
			kpi_type: { type: String },	
			
		//	issue: { type: Number},
			gift_aid_amount: { type: Number},
			amount: { type: Number},
			
			
			
			date_value: { type: Date},	
			date_logged: { type: Date, required: true},
			comments: { type: String},
			logger_user_name: { type: String}
			
			
	
});

Majordonor.virtual('date').get(function() {
 
				
			return   moment(this.date_value).format('DD/MM/YYYY');

});

Majordonor.virtual('date_recorded').get(function() {
 
				
			return   moment(this.date_logged).format('DD/MM/YYYY');

});

Majordonor.set('toJSON', {

   virtuals: true
   
});
Majordonor.set('toObject', {

   virtuals: true
   
});


module.exports = mongoose.model('Majordonor', Majordonor);
