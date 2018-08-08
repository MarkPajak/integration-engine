var shopify_product_status_app = function (keys,options){


var fs = require('fs');

var mongoose = require('mongoose');
var dbConfig = require('../../../db');
//mongoose.connect(dbConfig.url);	
var load_shopify_products = require("../load_data/load_shopify_product.js");
var shopify_transaction = require("../load_data/shopify_transactions.js");
var transactions_data_to_google_sheet = require("../analyse_data/google_sheet.js");
var Sales_by_vendor = require("../analyse_data/sales_by_vendor.js");
var save_data_to_google_sheet = require("../export_data/save_product_report_to_google_sheet.js");
var save_data_to_database = require("../export_data/save_data_to_database.js");
var save_vendors_to_database = require("../export_data/save_vendors_to_database.js");
//var Order_form_to_google_sheet = require("../shopify/order_form_controller.js");
var Load_cost_of_goods = require("../load_data/load_cost_of_goods.js");
var Monthlytotals = require("../analyse_data/monthly_totals.js");

var logger = require('../../../models/logging.js');

function file_write(message){
	console.log(message)
	fs.appendFile('./data_loader/shopify_2/log/test', '\n '+message, (err) => {      if (err) throw err; });
}



var load_shopify_productsInstance = new load_shopify_products(keys,options)
var shopify_transactionInstance = new shopify_transaction(keys,options)
var transactions_data_to_google_sheet = new transactions_data_to_google_sheet(keys,options)
var sales_by_vendor = new Sales_by_vendor(keys,options)

var save_data_to_google_sheetInstance = new save_data_to_google_sheet(keys,options); 
var save_data_to_databaseInstance = new save_data_to_database(keys,options);   
var save_vendors_to_databaseInstance = new save_vendors_to_database(keys,options); 
//var order_form_sheet = new Order_form_to_google_sheet(keys,options);  
var load_cost_of_goods = new Load_cost_of_goods(keys,options);  
var monthlytotals = new Monthlytotals(keys,options); 

var async = require('async');





this.go = function(done,cb){



		var shopifydata
	
		function callbackhandler(err, results) {
			file_write('It came back with this ' + results);
		}   

		function count_all_products(callback) {
			file_write('>>>>>>>>>>>count_all_products')
			load_shopify_productsInstance.count_all_products( function(donex) {
				console.log('count_all_products callback')
				callback(null,donex)	
			})
		} 

		function cost_of_goods(callback) {
			file_write('>>>>>>>>>>>cost_of_goods')
			load_cost_of_goods.add_price_to_products( function(donex) {
				
				console.log('cost_of_goods callback')
				callback(null,donex)	
			})
		} 		

		function count_all_orders(callback) {
			file_write('>>>>>>>>>>>count_all_orders')
			shopify_transactionInstance.count_all_orders( function(donex) {
				
				file_write('count_all_orders callback')
				callback(null,donex)	
			})
		}   
		
		function get_data(callback) {
			file_write('>>>>>>>>>>>get_data ')
			transactions_data_to_google_sheet.get_data(function(analytics_data) {
				
				file_write('get_data callback')
				shopifydata=analytics_data
				callback(null,analytics_data)
							
			})
		} 
		
			function save_to_database(callback) {
		
			file_write('>>>>>>>>>>>save_to_database')			
			save_data_to_databaseInstance.add_data_to_database(shopifydata,function(analytics_data) {
				
				file_write('add_data_to_database callback')
				callback(null,analytics_data)
cb(shopifydata)					
			})
		}  


			function get_data_vendors(callback) {
			file_write('>>>>>>>>>>>get_data ')
			sales_by_vendor.get_data(function(analytics_data) {
				
				file_write('get_data callback')
				shopifydata=analytics_data
				callback(null,analytics_data)
				cb(shopifydata)				
			})
		} 		
		
		
		
		function save_to_vendor_database(callback) {
		
			file_write('>>>>>>>>>>>save_to_database')			
			save_vendors_to_databaseInstance.add_data_to_database(shopifydata,function(analytics_data) {
				
				file_write('add_data_to_database callback')
				callback(null,analytics_data)	
			})
		}  

		function add_data_to_sheet(callback) {
		
			file_write('>>>>>>>>>>>add_data_to_sheet')			
			save_data_to_google_sheetInstance.add_data_to_sheet(shopifydata,function(analytics_data) {
				
				file_write('add_data_to_sheet callback')
				callback(null,analytics_data)	
			})
		}  
/*
		function order_form_to_google_sheet(callback) {
		
			
			if(options.generate_order_forms==true){
			console.log('>>>>>>>>>>>order_form_to_google_sheet')
				order_form_sheet.go(function(analytics_data) {
					console.log('order_form_to_google_sheet callback')
					callback(null,analytics_data)	
				})
			}
			else
			{
			callback(null,null)	
			}
		}
*/
		function monthly_totals(callback) {
					
		console.log('>>>>>>>>>>>monthly_totals')
		monthlytotals.get_vendor_ids(keys,function(){
			file_write('ssmonthly_totals callback')
					callback(null)	

					})
		}  
		

		async.series([
			count_all_products,
			//cost_of_goods, //NB hangs for unknown reason
			count_all_orders,
			
			get_data,
			//get_data_vendors,
			save_to_database//,
			//add_data_to_sheet,
			//monthly_totals
			//order_form_to_google_sheet
			
		], function (err, results) {
		
			done(shopifydata)
			if(err) console.log(err)
			});

}




}


module.exports = shopify_product_status_app;






 
 
