var mongoose = require('mongoose');
var moment = require('moment');
var Shopify_order = new mongoose.Schema({
		
		  
			_id: { type: String, required: true ,unique:true},	
			shop_id: { type: String, required: true},				  
			product_type: { type: String },	
			sku: { type: String},
			barcode: { type: String},
			metafield:{ type: Object},
			variant_id:{ type: String},
			vendor: { type: String, required: true},
			title: { type: String, required: true },	
			inventory_quantity: { type: Number},
			revenue_to_date: { type: Number},	
			number_sold: { type: Number},
			sales_value: { type: Number},
			count: { type: Number},
			order_status: { type: String},
			cost_price: { type: Number},	
			vendor: { type: String},
			name: { type: String},
			report_id: { type: String},
			source_name: { type: String},
			price:{ type: Number },
			date_report_run:{ type: Date }
			
	
});

Shopify_order.virtual('vendor_id').get(function() {
 
				
				return encodeURIComponent(this.vendor.toLowerCase().replace(/ /g, ''))

});

Shopify_order.virtual('order_cost').get(function() {
 
				
				return this.cost_price*this.number_sold

});

Shopify_order.virtual('date_day').get(function() {
 
				
				return moment(this.date).startOf('day');

});
Shopify_order.set('toJSON', {
   virtuals: true
});
Shopify_order.set('toObject', {
   virtuals: true
});


module.exports = mongoose.model('Shopify_order', Shopify_order);
