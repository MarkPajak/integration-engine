var mongoose = require('mongoose');
var moment = require('moment');
var PWYT_kpi = new mongoose.Schema({
		  
		
			id: String,
			museum_id: { type: String, required: true},				  
			kpi_type: { type: String },	
			

		
			donation_box_amount: { type: Number, required: true},
			donation_box_no: { type: String},
			no_envelopes: { type: Number},
			//non_vat_sales: { type: Number},
			//net_sales: { type: Number},
			//no_transactions: { type: Number},
			
			date_value: { type: Date},	
			date_logged: { type: Date, required: true},
			comments: { type: String},
			logger_user_name: { type: String}
			
			
	
});

PWYT_kpi.virtual('date').get(function() {
 
				
			return   moment(this.date_value).format('DD/MM/YYYY');

});

PWYT_kpi.virtual('date_recorded').get(function() {
 
				
			return   moment(this.date_logged).format('DD/MM/YYYY');

});
PWYT_kpi.set('toJSON', {
   virtuals: true
});
PWYT_kpi.set('toObject', {
   virtuals: true
});


module.exports = mongoose.model('PWYT_kpi', PWYT_kpi);
