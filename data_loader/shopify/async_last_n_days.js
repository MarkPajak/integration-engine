var shopify_product_status_app = function (keys,options,cb){




var mongoose = require('mongoose');
var dbConfig = require('../../db');
//mongoose.connect(dbConfig.url);	
var load_shopify_products = require("./load_shopify_product.js");
var shopify_transaction = require("./shopify_transactions.js");
var transactions_data_to_google_sheet = require("./google_sheet.js");
var save_data_to_google_sheet = require("../services/save_data_to_google_sheet.js");
var Order_form_to_google_sheet = require("../shopify/order_form_controller.js");

var logger = require('../../models/logging.js');


var load_shopify_productsInstance = new load_shopify_products(keys,options)
var shopify_transactionInstance = new shopify_transaction(keys,options)
var transactions_data_to_google_sheet = new transactions_data_to_google_sheet(keys,options)
var save_data_to_google_sheetInstance = new save_data_to_google_sheet(keys,options);  
var order_form_sheet = new Order_form_to_google_sheet(keys,options);  


var async = require('async');

 



this.go = function(cb){
	
	var shopifydata
	
		function callbackhandler(err, results) {
			console.log('It came back with this ' + results);
		}   

		function count_all_products(callback) {
			console.log('>>>>>>>>>>>count_all_products')
			load_shopify_productsInstance.count_all_products( function(donex) {
				console.log('count_all_products callback')
				callback(null,donex)	
			})
		}  

		function count_all_orders(callback) {
			console.log('>>>>>>>>>>>count_all_orders')
			shopify_transactionInstance.count_all_orders( function(donex) {
				console.log('count_all_orders callback')
				callback(null,donex)	
			})
		}   
		 
		function get_data(callback) {
			console.log('>>>>>>>>>>>get_data ')
			transactions_data_to_google_sheet.get_data(function(analytics_data) {
				console.log('get_data callback')
				shopifydata=analytics_data
				callback(null,analytics_data)
				cb(analytics_data)				
			})
		}  

		function add_data_to_sheet(callback) {
			console.log('>>>>>>>>>>>add_data_to_sheet')
			save_data_to_google_sheetInstance.add_data_to_sheet(shopifydata,function(analytics_data) {
				console.log('add_data_to_sheet callback')
				callback(null,analytics_data)	
			})
		}  

		function order_form_to_google_sheet(callback) {
			console.log('>>>>>>>>>>>order_form_to_google_sheet')
			
			order_form_sheet.go(function(analytics_data) {
				console.log('order_form_to_google_sheet callback')
				callback(null,analytics_data)	
			})
		}  

		async.series([
			count_all_products,
			count_all_orders,
			get_data,
			add_data_to_sheet,
			order_form_to_google_sheet
		], function (err, results) {
			
			if(err) console.log(err)
			// Here, results is an array of the value from each function
			
		console.log('cheese')
		});



}




}


module.exports = shopify_product_status_app;






 
 
