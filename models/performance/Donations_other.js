var mongoose = require('mongoose');
var moment = require('moment');
var Donations_other = new mongoose.Schema({
		  
		
			id: String,
			museum_id: { type: String, required: true},				  
			kpi_type: { type: String },	
			
			
		
			donation_box_amount: { type: Number},
			
			gift_aid_donation_box_amount: { type: Number},
			type: { type: String},
			//non_vat_sales: { type: Number},
			//net_sales: { type: Number},
			no_transactions: { type: Number},
			no_gift_aided_donations: { type: Number},
			no_envelopes: { type: Number},
			date_value: { type: Date},	
			date_logged: { type: Date, required: true},
			comments: { type: String},
			logger_user_name: { type: String}
			
			
	
});

Donations_other.virtual('date').get(function() {
 
				
			return   moment(this.date_value).format('DD/MM/YYYY');

});

Donations_other.virtual('date_recorded').get(function() {
 
				
			return   moment(this.date_logged).format('DD/MM/YYYY');

});

Donations_other.set('toJSON', {

   virtuals: true
   
});
Donations_other.set('toObject', {

   virtuals: true
   
});


module.exports = mongoose.model('Donations_other', Donations_other);
