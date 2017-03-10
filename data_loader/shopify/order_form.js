
var order_form_data = function (options){
var self = this
var mongoose = require('mongoose');
var async = require('async');
var _ = require('underscore');
var express = require('express');
var router = express.Router();
var _ = require('underscore');
var Shopify_product = require('../../models/Shopify_product.js');
var Shopify_order = require('../../models/Shopify_order.js');
var async = require('async');


var Order_data_to_google = require("../services/order_forms_to_google_sheet.js");
var order_data_to_google = new Order_data_to_google(options); 



var dbConfig = require('../../db');
//var mongoose = require('mongoose');
// Connect to DB


self.get_vendor_ids= function(keys,cb){

console.log(keys.shopify_store)
	 Shopify_order.aggregate([
				
				{$match:
					  {   shop_id:keys.shopify_store,order_status:'re-order'	  }
				},
				
				
				{
					$group: {
						_id: '$vendor' ,  
						 "products" : { "$addToSet" : { "order_status" : "$order_status","name" : "$title","sku" : "$sku", "barcode" : "$barcode",  "count" : "$count" } },
						 count: {$sum: 1}
					},
					
				}, {$sort : {count: -1 } }, 
				{ $project : { "products" : 1}}
				
    ], function (err, vendors) {
        if (err) {
			console.log(err)
            next(err);
        } else {
				var result = []
				var matches = 0
				
							
			
				order_data_to_google.add_data_to_sheet(keys,vendors ,function () {
				console.log('all done')
				})
}

})

}
}
module.exports = order_form_data;