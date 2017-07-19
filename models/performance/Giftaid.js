var mongoose = require('mongoose');
var moment = require('moment');
var Giftaid_kpi = new mongoose.Schema({
		  
		
			id: String,
			museum_id: { type: String, required: true},				  
			kpi_type: { type: String },	
			
			
		
			amount: { type: Number},
			no_envelopes: { type: Number},
			
			date_value: { type: Date},	
			date_logged: { type: Date, required: true},
			comments: { type: String},
			logger_user_name: { type: String}
			
			
	
});

Giftaid_kpi.virtual('date').get(function() {
 
				
			return   moment(this.date_value).format('DD/MM/YYYY');

});


Giftaid_kpi.virtual('average_transaction').get(function() {
 
				
			//return Math.round((this.total_sales/this.no_transactions) * 100) / 100

});


Giftaid_kpi.set('toJSON', {
   virtuals: true
});
Giftaid_kpi.set('toObject', {
   virtuals: true
});


module.exports = mongoose.model('Giftaid_kpi', Giftaid_kpi);
