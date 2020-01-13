var mongoose = require('mongoose');
var moment = require('moment');
var Onlineshop = new mongoose.Schema({
		  
/*

-Date of donation
- Amount
- Comments
*/	
			id: String,
						  
			kpi_type: { type: String },	

			amount: { type: Number},
			
			
			
			date_value: { type: Date},	
			date_logged: { type: Date, required: true},
			comments: { type: String},
			logger_user_name: { type: String}
			
			
	
});

Onlineshop.virtual('date').get(function() {
 
				
			return   moment(this.date_value).format('DD/MM/YYYY');

});

Onlineshop.virtual('date_recorded').get(function() {
 
				
			return   moment(this.date_logged).format('DD/MM/YYYY');

});

Onlineshop.set('toJSON', {

   virtuals: true
   
});
Onlineshop.set('toObject', {

   virtuals: true
   
});


module.exports = mongoose.model('Onlineshop', Onlineshop);
