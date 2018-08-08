
var transactions_data_to_google_sheet = function (keys,options){
var self = this

var async = require('async');
var moment = require('moment');
var _ = require('underscore');
var express = require('express');
var router = express.Router();
var _ = require('underscore');
var Shopify_product = require('../../../models/Shopify_product.js');
var Shopify_order = require('../../../models/Shopify_order.js');

var Shopify_transaction = require('../../../models/Shopify_transaction.js');


var dbConfig = require('../../../db');
//var mongoose = require('mongoose');
// Connect to DB




self.get_data = function(cb){

	 console.log('Shopify_product.find()')
	 Shopify_product.find({shop_id:keys.shopify_store})
	     .sort({'count': 'desc'})
         .exec(function(err, product_list) { 
			if(err) console.log(err)	
			console.log('products found',product_list.length)	 
			 Shopify_transaction.aggregate([
				{
					$group: {
						_id: '$variant_id' ,  
						 count: {$sum: 1}
					},
					
				}, {$sort : {count: -1 } }
				
    ], function (err, transaction_analytics) {
        if (err) {
			console.log(err)
            next(err);
        } else {
				var result = []
				console.log(product_list.length+ ' products found')
				var matches = 0
				var report_date = new Date()
				//possible mem leak
				product_list
				
				
				_.each(transaction_analytics, function(_product) {	
					_.each(product_list, function(product) {				
						if(product._id==_product.variant_id){
							new_product=[]
							new_product=product.toJSON()
							new_product.count=_product.count
							new_product.name=product.title
							new_product.barcode=product.barcode
							new_product.cost_of_goods=product.cost_price
										
							new_product.variant_id=product.variant_id
							new_product.report_id=options.title+"_"+moment(new Date()).format('DD_MM_YYYY')
							new_product.date_report_run=report_date 
							new_product.net_income = new_product.price/1.2
							new_product.profitability=product.cost_price ? (_product.count*(product.taxable=="true" ? new_product.net_income : new_product.price)) - (_product.count*product.cost_price) : "COST PRICE NEEDED"
							new_product.taxable=product.taxable
							
							
							
							var order_status = ""
							if(product.inventory_quantity<=_product.count){
							order_status = "re-order"
							}
							new_product.order_cost=product.cost_price*_product.count		
							new_product.order_status=order_status
							matches++
						console.log(matches+ ' product-orders added')	
						//n.b. does async mean soem get lost?	
						var shopify_order = new Shopify_order(new_product);	
						shopify_order.save();
							
							
							
							result.push(new_product)
	
						}
					})		
				})
				console.log(matches+ ' matches found monthly sales')
				cb(result)
			
        }
    });
	 
	 
	 
	 
	 
	 
	 
   // res.json(todos);
  });
	
}

}

module.exports = transactions_data_to_google_sheet;