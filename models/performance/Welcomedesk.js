var mongoose = require('mongoose');
var moment = require('moment');
var Welcomedesk_kpi = new mongoose.Schema({
		  
		
			id: String,
			museum_id: { type: String, required: true},				  
			kpi_type: { type: String },	
			
			
		
			cash: { type: Number},
			card: { type: Number},
			//non_vat_sales: { type: Number},
			//net_sales: { type: Number},
			no_transactions: { type: Number},
			no_giftaid_envelopes: { type: Number},
			giftaid_amount: { type: Number},
			
			date_value: { type: Date},	
			date_logged: { type: Date, required: true},
			comments: { type: String},
			logger_user_name: { type: String}
			
			
	
});

Welcomedesk_kpi.virtual('date').get(function() {
 
				
			return   moment(this.date_value).format('DD/MM/YYYY');

});


Welcomedesk_kpi.virtual('total').get(function() {
 
				
			return (this.cash+this.card) 

});
Welcomedesk_kpi.virtual('total_inc_giftaid').get(function() {
 
				
			return (this.cash+this.card+this.giftaid_amount) 

});

Welcomedesk_kpi.set('toJSON', {
   virtuals: true
});
Welcomedesk_kpi.set('toObject', {
   virtuals: true
});


module.exports = mongoose.model('Welcomedesk_kpi', Welcomedesk_kpi);
