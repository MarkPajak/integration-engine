var mongoose = require('mongoose');
var moment = require('moment');
var Treasure = new mongoose.Schema({
		  
/*

- Date of donation
- Issue number
- Amount with gift aid
- Amount without gift aid
-Comments
*/	
			id: String,
						  
			kpi_type: { type: String },	
			
			issue: { type: Number},
			gift_aid_amount: { type: Number},
			amount: { type: Number},
			
			
			
			date_value: { type: Date},	
			date_logged: { type: Date, required: true},
			comments: { type: String},
			logger_user_name: { type: String}
			
			
	
});

Treasure.virtual('date').get(function() {
 
				
			return   moment(this.date_value).format('DD/MM/YYYY');

});

Treasure.virtual('date_recorded').get(function() {
 
				
			return   moment(this.date_logged).format('DD/MM/YYYY');

});

Treasure.set('toJSON', {

   virtuals: true
   
});
Treasure.set('toObject', {

   virtuals: true
   
});


module.exports = mongoose.model('Treasure', Treasure);
