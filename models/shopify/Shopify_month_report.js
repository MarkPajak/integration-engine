var mongoose = require('mongoose');
var moment = require('moment');
var Shopify_month_report = new mongoose.Schema({
		
				shop_id: { type: String},	
				month_id: { type: String},	
				month_product_id: { type: String, unique: true },
				year:{ type: Number },	
				month:{ type: String },	
				rank:{ type: Number },	
				name:{ type: String },
				product_type:{ type: String },
				gross_sales:{ type: Number },					  			
				discounts:{ type: Number },			 
				returns:{ type: Number },
				net_sales:{ type: Number },	
				taxes:{ type: Number },	
				total_sales:{ type: Number },	
				variant_id:{ type: String },
				price:{ type: Number },		
				cost_of_goods:{ type: String },	
				order_cost:{ type: Number },	
				profitability:{ type: String },
				inventory_quantity:{ type: String },
				order_status:{ type: String },
				barcode:{ type: String },
				sku:{ type: String },
				date_report_run:{ type: Date },	
				taxable:{ type: String },								


				vendor:{ type: String },	
				count:{ type: Number },
				name: { type: String, required: true },	
				net_sales:{ type: Number },
				Jan:{ type: Number },
				Nov:{ type: Number },
				Dec:{ type: Number }
});





Shopify_month_report.set('toJSON', {
   virtuals: true
});

module.exports = mongoose.model('Shopify_month_report', Shopify_month_report);
