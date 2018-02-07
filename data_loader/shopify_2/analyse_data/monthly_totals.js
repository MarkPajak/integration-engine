
var monthly_totals = function (keys,options) {
	var self = this
	var mongoose = require('mongoose');
	var moment = require('moment');
	var async = require('async');
	var _ = require('underscore');
	var express = require('express');
	var router = express.Router();
	var _ = require('underscore');
	var Shopify_product = require('../../../models/Shopify_product.js');
	var Shopify_order = require('../../../models/Shopify_order.js');
	var async = require('async');


	var Order_data_to_google = require("../export_data/monthly_estimate_to_google_sheet.js");
	var order_data_to_google = new Order_data_to_google(keys,options) 



	var dbConfig = require('../../../db');
	//var mongoose = require('mongoose');
	// Connect to DB


	self.get_vendor_ids= function(keys,cb){

			innercallback=function(){

			cb
			}
			 Shopify_order.aggregate([
						
						{$match:
							  {   shop_id:keys.shopify_store,order_status:'re-order'	  }
						},	
						{
							$group: {
								_id: '$vendor' ,  
								order_estimate: { $sum: { $multiply: [ "$count", "$cost_price" ] } },
								count: { $sum: 1 }
							},
										
							
						}, {$sort : {order_estimate: -1 } }
						
						
			], function (err, vendors) {

				if (err) {
					console.log(err)
					next(err);
				} else {
						var result = []
						var matches = 0
						
							 _.each(vendors,function(vendor) {	
								vendor.vendor=vendor._id,
								vendor.date_report_run=  moment(new Date()).format('DD_MM_YYYY')
							})	
					
							order_data_to_google.add_data_to_sheet(vendors ,function () {
								console.log('add_data_to_sheet callback')
								cb()
							})
				}

		})

	}
}
module.exports = monthly_totals;