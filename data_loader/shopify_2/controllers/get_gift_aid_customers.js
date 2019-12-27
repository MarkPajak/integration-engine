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
var Customers = require("../procedures/get_customers.js");
var Check_shopify = require("../tests/shopify_checkorder.js");



function file_write(message){
console.log(message)
//fs.appendFile('./data_loader/shopify_2/log/test', '\n '+message, (err) => {      if (err) throw err; });
}



var moment = require('moment');
var fs = require('fs');
var allkeys=JSON.parse(fs.readFileSync('./secret/api_keys.JSON').toString());
 var mongoose = require('mongoose');
var config = []

var data_number=60//changed by zak 13.04.2017
shops=[]
shops.push("BMAG_MONTHLY_PRODUCTS")
shops.push("MSHED")
shops.push("ONLINE")

		process_shop_data = function(shop,cb){


										if(shop=="ONLINE"){
											config.source_name="web"
											data_number=100
										}
										// print process.argv - use command line argument to specify the month to process
											process.argv.forEach(function (val, index, array) {
											  file_write("processing for " + index + ': ' + val);
											});
											
												const monthNames = ["January", "February", "March", "April", "May", "June",
										  "July", "August", "September", "October", "November", "December"
										];
										
										
											var monthName
											if (!process.argv[2]){											
												console.log('no month name!')
												var x = new Date();
												x.setDate(1);
												x.setMonth(x.getMonth()-1);
												monthName=x.getMonth()											
												monthName=monthNames[monthName]
												console.log('monthName',monthName)
											}
											else
											{
												monthName=process.argv[2]
											
											}
											
											
											
										
										var yeardate = new Date()
										var year = yeardate.getFullYear()
										config.created_at_min=year+"-"+monthName+"-01"
										var start_date = new Date(config.created_at_min);
										config.created_at_max = new Date(year, start_date.getMonth()+1, 0);
										
										 config.created_at_max .setDate(config.created_at_max .getDate() + 1);
										
										config.month=monthName
										config.year=start_date.getFullYear()
										config.generate_order_forms=false
										config.save_to_sheets=true
										//config.source_name=""										
										file_write('config.source_name',config.source_name)										
										config.title = "last_"+data_number+"_days"
										config.update_product_types=true
										var keys = allkeys[shop]
										config.google_sheet_id=keys.google_sheet_id											
										console.log('keys',keys)
										
										
										var process_shopify_recent_product_analytics = new Process_shopify_recent_product_analytics(keys,config)									  
										
                                        var customers  = new Customers(keys,config)

                                        customers.go(function(data) {
											  
											// file_write('config.source_name',config.source_name)											
											  cb()
											  
										},function done() {})

		}

		function callbackhandler(err, results) {
		
			file_write('It came back with this ' + results);
		
		} 
		
		
		function process_customers(callback) {
		
			file_write('>>>>>>>>>>>count_all_products')			
			google_sheets_key_name = "BMAG_MONTHLY_PRODUCTS"
			//file_write(google_sheets_key_name)	
			process_shop_data(google_sheets_key_name,function() { //name of 		
			//mongoose.connection.close()	
			callback()
			})
		
		} 

		function process_MSHED(callback) {
		
			file_write('>>>>>>>>>>>count_all_products')			
			google_sheets_key_name = "MSHED"
			file_write(google_sheets_key_name)		
			process_shop_data(google_sheets_key_name,function() { //name of 		
			mongoose.connection.close()	
			callback()
			})
		} 

	
		function process_ONLINE(callback) {
			
			file_write('>>>>>>>>>>>count_all_products')			
			google_sheets_key_name = "BMAG"
			file_write(google_sheets_key_name)	
			process_shop_data("ONLINE",function() { //name of 		
			//mongoose.connection.close()	
			mongoose.connection.close()	
			callback()	
			})
		} 

	
		async.series([
			process_customers,
			//process_MSHED//,
		   // process_ONLINE
		], function (err, results) {
		
			
			if(err) console.log(err)
			});	
			
			
			
			
		

		


module.exports = router;
