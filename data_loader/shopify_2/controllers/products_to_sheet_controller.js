//changelog
//need to troubleshoot why it is bringing back less orders than the shopify report
//fixed 17/07 it was not counting the number bought, just counting the number of orders :)
//n.b. shopify changed the default data to return as last 60 days??



var express = require('express');
var router = express.Router();
var shopifyAPI = require('shopify-node-api');
var fs = require('fs');
var self = this
var async = require('async');
var Process_shopify_recent_product_analytics = require("../procedures/monthly_product_sales.js");
var Check_shopify = require("../tests/shopify_checkorder.js");



function file_write(message){
console.log(message)
fs.appendFile('./data_loader/shopify_2/log/test', '\n '+message, (err) => {      if (err) throw err; });
}



var moment = require('moment');
var fs = require('fs');
var allkeys=JSON.parse(fs.readFileSync('./secret/api_keys.JSON').toString());
 var mongoose = require('mongoose');
var config = []

var data_number=60//changed by zak 13.04.2017
shops=[]
shops.push("BMAG_MONTHLY_PRODUCTS")
//shops.push("BMAG")
//shops.push("ONLINE")

		process_shop_data = function(shop,cb){


										if(shop=="ONLINE"){
											config.source_name="web"
											data_number=100
										}
										
										const monthNames = ["January", "February", "March", "April", "May", "June",
										  "July", "August", "September", "October", "November", "December"
										];
										//config.created_at_min=moment(new Date()).add(-data_number, 'days').format()
										config.created_at_min="2018-06-01"
										var start_date = new Date(config.created_at_min);
										config.created_at_max = new Date(start_date.getFullYear(), start_date.getMonth()+1, 0);
										config.month=monthNames[start_date.getMonth()]
										config.year=start_date.getFullYear()
							
										
										
										
										config.generate_order_forms=false
										config.save_to_sheets=true
										config.source_name=""										
										file_write('config.source_name',config.source_name)										
										config.title = "last_"+data_number+"_days"
										config.update_product_types=true
										var keys = allkeys[shop]
										config.google_sheet_id=keys.google_sheet_id											
										
										
										
										var process_shopify_recent_product_analytics = new Process_shopify_recent_product_analytics(keys,config)									  
										
										process_shopify_recent_product_analytics.go(function(data) {
											  
											 file_write('config.source_name',config.source_name)											
											  cb()
											  
										},function done() {})

		}

		function callbackhandler(err, results) {
		
			file_write('It came back with this ' + results);
		
		} 
		
		
		function process_BMAG_MONTHLY_PRODUCTS(callback) {
		
			file_write('>>>>>>>>>>>count_all_products')			
			google_sheets_key_name = "BMAG_MONTHLY_PRODUCTS"
			
			process_shop_data(google_sheets_key_name,function() { //name of 		
				callback()	
			})
		} 

		function process_BMAG(callback) {
		
			file_write('>>>>>>>>>>>count_all_products')
			process_shop_data("BMAG_MONTHLY_PRODUCTS", function() {
					mongoose.connection.close()	
				callback()	
			})
		} 
		
		function process_ONLINE(callback) {
		
			file_write('>>>>>>>>>>>count_all_products')
			process_shop_data("ONLINE", function() {
					mongoose.connection.close()	
				callback()	
			})
		} 


	
		async.series([
			process_BMAG_MONTHLY_PRODUCTS,
			//process_BMAG,
			//process_ONLINE
		], function (err, results) {
		
			
			if(err) console.log(err)
			});	
			
			
			
			
		

		


module.exports = router;
