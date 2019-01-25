var mongoose = require('mongoose');
var moment = require('moment');
var Patron_kpi = new mongoose.Schema({
		  
		
			id: String,
			//museum_id: { type: String, required: true},				  
			kpi_type: { type: String },	
			
			
		
			donation_box_amount: { type: Number},
			//type: { type: String},
			//non_vat_sales: { type: Number},
			//net_sales: { type: Number},
			//no_transactions: { type: Number},
			
			date_value: { type: Date},	
			date_logged: { type: Date, required: true},
			comments: { type: String},
			logger_user_name: { type: String}
			
			
	
});

Patron_kpi.virtual('date').get(function() {
 
				
			return   moment(this.date_value).format('DD/MM/YYYY');

});

Patron_kpi.virtual('date_recorded').get(function() {
 
				
			return   moment(this.date_logged).format('DD/MM/YYYY');

});

Patron_kpi.set('toJSON', {

   virtuals: true
   
});
Patron_kpi.set('toObject', {

   virtuals: true
   
});


module.exports = mongoose.model('Patron_kpi', Patron_kpi);
