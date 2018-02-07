var mongoose = require('mongoose');
var moment = require('moment');
var Shopify_transaction = new mongoose.Schema({
		
		
		date: { type: Date, required: true },
		shop_id: { type: String, required: true },		
		line_id: { type: String, required: true},
		product_type: { type: String },	
		vendor:{ type: String },	
		variant_id:{ type: String},
		cost_price:{ type: Number },
		sku:{ type: String },	
		quantity:{ type: Number },
		number_bought:{ type: Number },
		barcode: { type: String},
		metafield: { type: Object},
		product_id: { type: String, required: true },	
		title: { type: String, required: true },	
		source_name: { type: String},		
		price:{ type: Number }
});




Shopify_transaction.virtual('date_day').get(function() {
 
				
				return moment(this.date).startOf('day');

});
Shopify_transaction.set('toJSON', {
   virtuals: true
});

module.exports = mongoose.model('Shopify_transaction', Shopify_transaction);
