var mongoose = require('mongoose');
var moment = require('moment');
var Shopify_month_report = new mongoose.Schema({
		
		
	    year:{ type: String },	
		month:{ type: String },	
		vendor:{ type: String },	
		quantity:{ type: Number },
		title: { type: String, required: true },	
		net_sales:{ type: Number }
});

Shopify_month_report.set('toJSON', {
   virtuals: true
});

module.exports = mongoose.model('Shopify_month_report', Shopify_month_report);
