var mongoose = require('mongoose');
var moment = require('moment');
var Retail_kpi_import = new mongoose.Schema({
		  
		
			id: String,
			museum_id: { type: String, required: true},				  
			kpi_type: { type: String },	
			
			
		
			total_sales: { type: Number},
			non_vat_sales: { type: Number},
			net_sales: { type: Number},
			no_transactions: { type: Number},
			
			taxes: { type: Number}, //added by Darren
			//Non VAT sales  =”total_sales”-((“total_sales”-“net_sales”)*5)-taxes

			date_value: { type: Date},	
			date_logged: { type: Date, required: true},
			comments: { type: String},
			logger_user_name: { type: String}
			
			
	
});

Retail_kpi_import.virtual('date').get(function() {
 
				
			return   moment(this.date_value).format('DD/MM/YYYY');

});


Retail_kpi_import.virtual('average_transaction').get(function() {
 
				
			return Math.round((   this.net_sales   /this.no_transactions) * 100) / 100

});
/*
Retail_kpi_import.virtual('net_sales').get(function() { 
				
			return ((this.total_sales - this.non_vat_sales)/1.2+this.non_vat_sales).toFixed(2)

});
*/
Retail_kpi_import.virtual('vat_sales').get(function() { 
				
			return this.total_sales - this.non_vat_sales

});

Retail_kpi_import.set('toJSON', {
   virtuals: true
});
Retail_kpi_import.set('toObject', {
   virtuals: true
});


module.exports = mongoose.model('Retail_kpi_import', Retail_kpi_import);
