var mongoose = require('mongoose');
var moment = require('moment');
var Donations_kiosk = new mongoose.Schema({
		  
		
			id: String,
			museum_id: { type: String, required: true},				  
			kpi_type: { type: String },	
			
            kiosk_id: { type: String, required: true},
            kiosk_alias: { type: String, required: true},
            transaction_id: { type: String, required: true},
		
			donation_amount: { type: Number},
			
			gift_aided: { type: Boolean, Default: false},
            type: { type: String},
            
			//non_vat_sales: { type: Number},
			//net_sales: { type: Number},
			//no_transactions: { type: Number},
			//no_gift_aided_donations: { type: Number},
            //no_envelopes: { type: Number},
            
			date_value: { type: Date},	
			date_logged: { type: Date, required: true},
			comments: { type: String},
			logger_user_name: { type: String}
			
	//Report Entry ID	Transaction ID	Kiosk ID	Kiosk Alias	Date/Time	Amount	Card Number	Status
		
	
});

Donations_kiosk.virtual('date').get(function() {
 
				
			return   moment(this.date_value).format('DD/MM/YYYY');

});
Donations_kiosk.virtual('amount_including_gift_aid').get(function() {
 
 var valuetoreturn= this.donation_amount
 
 
 
 if(this.gift_aided==true){valuetoreturn=valuetoreturn*1.2}
 
 
				
			return   valuetoreturn

});


Donations_kiosk.virtual('date_recorded').get(function() {
 
				
			return   moment(this.date_logged).format('DD/MM/YYYY');

});

Donations_kiosk.set('toJSON', {

   virtuals: true
   
});
Donations_kiosk.set('toObject', {

   virtuals: true
   
});


module.exports = mongoose.model('Donations_kiosk', Donations_kiosk);
