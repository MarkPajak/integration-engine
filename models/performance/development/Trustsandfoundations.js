var mongoose = require('mongoose');
var moment = require('moment');
var Trusts = new mongoose.Schema({
	/*	  
	- Name of Trust
	- Date
	- Amount
	- Installment Number
	- Comments	
	*/

			id: String,
			trust_name: { type: String, required: true},				  
			kpi_type: { type: String },	
			
			
		
			amount: { type: Number},
			installment_number: { type: Number},

			type: { type: String},
			//non_vat_sales: { type: Number},
			//net_sales: { type: Number},
			//no_transactions: { type: Number},
			
			date_value: { type: Date},	
			date_logged: { type: Date, required: true},
			comments: { type: String},
			logger_user_name: { type: String}
			
			
	
});

Trusts.virtual('date').get(function() {
 
				
			return   moment(this.date_value).format('DD/MM/YYYY');

});

Trusts.virtual('date_recorded').get(function() {
 
				
			return   moment(this.date_logged).format('DD/MM/YYYY');

});

Trusts.set('toJSON', {

   virtuals: true
   
});
Trusts.set('toObject', {

   virtuals: true
   
});


module.exports = mongoose.model('Trusts', Trusts);
