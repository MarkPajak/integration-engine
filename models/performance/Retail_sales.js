var mongoose = require('mongoose');
var moment = require('moment');
var Retail_kpi = new mongoose.Schema({
		  
		
			id: String,
			museum_id: { type: String, required: true},				  
			kpi_type: { type: String },	
			
			
		
			total_sales: { type: Number},
			non_vat_sales: { type: Number},
			net_sales: { type: Number},
			no_transactions: { type: Number},
			
			date_value: { type: Date},	
			date_logged: { type: Date, required: true},
			comments: { type: String},
			logger_user_name: { type: String}
			
			
	
});

Retail_kpi.virtual('average_transaction').get(function() {
 
				
			return Math.round((this.total_sales/this.no_transactions) * 100) / 100

});


Retail_kpi.set('toJSON', {
   virtuals: true
});
Retail_kpi.set('toObject', {
   virtuals: true
});


module.exports = mongoose.model('Retail_kpi', Retail_kpi);
