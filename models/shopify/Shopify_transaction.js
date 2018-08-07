var mongoose = require('mongoose');
var moment = require('moment');
var Shopify_transaction = new mongoose.Schema({
		
		
	    year:{ type: String },	
		month:{ type: String },	
		vendor:{ type: String },	
		quantity:{ type: Number },
		title: { type: String, required: true },	
		net_sales:{ type: Number },
		discounts:{ type: Number }
});

Shopify_transaction.set('toJSON', {
   virtuals: true
});

module.exports = mongoose.model('Shopify_transaction', Shopify_transaction);
