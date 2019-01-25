var mongoose = require('mongoose');
var moment = require('moment');
var Site_permissions = new mongoose.Schema({
		  
		
			id: String,
			//museum_id: { type: String, required: true},				  
			kpi_type: { type: String },	
			
			
		
			no_events: { type: Number},
			no_cancelled_events: { type: Number},
			audience_figures: { type: Number},
			
			income_bcc: { type: Number},
			income_site_permissions: { type: Number},
			
			type: { type: String},
			//non_vat_sales: { type: Number},
			//net_sales: { type: Number},
			//no_transactions: { type: Number},
			
			date_value: { type: Date},	
			date_logged: { type: Date, required: true},
			comments: { type: String},
			logger_user_name: { type: String}
			
			
	
});


Site_permissions.virtual('income_remaining').get(function() {
 
				
			return   moment(this.income_bcc-this.income_site_permissions);

});

Site_permissions.virtual('date').get(function() {
 
				
			return   moment(this.date_value).format('DD/MM/YYYY');

});

Site_permissions.virtual('date_recorded').get(function() {
 
				
			return   moment(this.date_logged).format('DD/MM/YYYY');

});

Site_permissions.set('toJSON', {

   virtuals: true
   
});
Site_permissions.set('toObject', {

   virtuals: true
   
});


module.exports = mongoose.model('Site_permissions', Site_permissions);
