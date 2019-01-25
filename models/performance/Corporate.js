var mongoose = require('mongoose');
var moment = require('moment');
var Corporate_kpi = new mongoose.Schema({
		  
		
			id: String,
			//museum_id: { type: String, required: true},				  
			kpi_type: { type: String },	
			
			
		
			donation_box_amount: { type: Number},
			type: { type: String},
			//non_vat_sales: { type: Number},
			//net_sales: { type: Number},
			//no_transactions: { type: Number},
			
			date_value: { type: Date},	
			date_logged: { type: Date, required: true},
			comments: { type: String},
			logger_user_name: { type: String}
			
			
	
});

Corporate_kpi.virtual('date').get(function() {
 
				
			return   moment(this.date_value).format('DD/MM/YYYY');

});

Corporate_kpi.virtual('date_recorded').get(function() {
 
				
			return   moment(this.date_logged).format('DD/MM/YYYY');

});

Corporate_kpi.set('toJSON', {

   virtuals: true
   
});
Corporate_kpi.set('toObject', {

   virtuals: true
   
});


module.exports = mongoose.model('Corporate_kpi', Corporate_kpi);
