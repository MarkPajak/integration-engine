
var transactions_data_to_google_sheet = function (options){
var self = this

var async = require('async');
var _ = require('underscore');
var express = require('express');
var router = express.Router();
var _ = require('underscore');
var Shopify_product = require('../../models/Shopify_product.js');
var Shopify_aggregate = require('../../models/Shopify_transaction.js');


var dbConfig = require('../../db');
//var mongoose = require('mongoose');
// Connect to DB

 var save_data_to_google_sheet = require("../services/save_data_to_google_sheet.js");


var save_data_to_google_sheetInstance = new save_data_to_google_sheet(options);  


self.get_data = function(){

	 console.log('Shopify_product.find()')
	 Shopify_product.find()
	     .sort({'count': 'desc'})
         .exec(function(err, product_list) { 
			if(err) console.log(err)	
			console.log('products found',product_list.length)	 
			 Shopify_aggregate.aggregate([
				{
					$group: {
						_id: '$product_id' ,  
						 count: {$sum: 1}
					},
					
				}, {$sort : {count: -1 } }
				
    ], function (err, product_analytics) {
        if (err) {
			console.log(err)
            next(err);
        } else {
				var result = []
				console.log(product_list.length+ ' products found')
				var matches = 0
				_.each(product_analytics, function(_product) {	
					_.each(product_list, function(product) {				
						if(product._id==_product._id){
							new_product=[]
							new_product=product.toJSON()
							new_product.count=_product.count
							new_product.name=product.title
							new_product.date_report_run=new Date()
							new_product.sales_value=_product.count*new_product.price
							
							var order_status = ""
							if(product.inventory_quantity<=_product.count){
							order_status = "re-order"
							}
							new_product.order_status=order_status
							matches++
							result.push(new_product)
						}
					})		
				})
				console.log(matches+ ' matches found')
				save_data_to_google_sheetInstance.add_data_to_sheet(result)
        }
    });
	 
	 
	 
	 
	 
	 
	 
   // res.json(todos);
  });
	
}

}

module.exports = transactions_data_to_google_sheet;