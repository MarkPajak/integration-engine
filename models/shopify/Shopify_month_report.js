var mongoose = require('mongoose');
var moment = require('moment');
var Shopify_month_report = new mongoose.Schema({
		
		shop_id: { type: String},	
	    month_id: { type: String, unique: true },	
		year:{ type: Number },	
		month:{ type: String },	
		vendor:{ type: String },	
		quantity:{ type: Number },
		title: { type: String, required: true },	
		net_sales:{ type: Number },
		Jan:{ type: Number },
		Nov:{ type: Number },
		Dec:{ type: Number }
});





Shopify_month_report.set('toJSON', {
   virtuals: true
});

module.exports = mongoose.model('Shopify_month_report', Shopify_month_report);
