var mongoose = require('mongoose');
var moment = require('moment');
var Shopify_product = new mongoose.Schema({
		  
			_id: { type: String, required: true ,unique:true},	
			shop_id: { type: String, required: true},				  
			product_type: { type: String },	
			sku: { type: String},
			barcode: { type: String},
			cost_price: { type: Number},
			published_at: {type : Date},
			taxable:{ type: String},	
			metafield:{ type: Object},
			variant_id:{ type: String},
			vendor: { type: String, required: true},
			title: { type: String, required: true },	
			inventory_quantity: { type: Number},
			revenue_to_date: { type: Number},	
			number_sold: { type: Number},
			price:{ type: Number }
});




Shopify_product.virtual('date_published').get(function() {
 
				
				return moment(this.published_at).startOf('day');

});

Shopify_product.set('toJSON', {
   virtuals: true
});

module.exports = mongoose.model('Shopify_product', Shopify_product);
