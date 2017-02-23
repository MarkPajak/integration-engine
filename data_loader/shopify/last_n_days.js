var shopify_product_status_app = function (keys,options,cb){




var mongoose = require('mongoose');
var dbConfig = require('../../db');
//mongoose.connect(dbConfig.url);	
var load_shopify_products = require("./load_shopify_product.js");
var shopify_transaction = require("./shopify_transactions.js");
var transactions_data_to_google_sheet = require("./google_sheet.js");
var save_data_to_google_sheet = require("../services/save_data_to_google_sheet.js");

var logger = require('../../models/logging.js');


var load_shopify_productsInstance = new load_shopify_products(keys,options)
var shopify_transactionInstance = new shopify_transaction(keys,options)
var transactions_data_to_google_sheet = new transactions_data_to_google_sheet(options)
var save_data_to_google_sheetInstance = new save_data_to_google_sheet(keys,options);  

this.go = function(cb){
 

load_shopify_productsInstance.count_all_products( function(donex) {

						console.log('count_all_products')
						var log = new logger({
								username:keys.user,
								date: new Date(),
								message: 'saving'					
						});	
						log.save(function (err) {})
	shopify_transactionInstance.count_all_orders( function() {
	console.log('count_all_orders callback')
	

						console.log('saving')
						var log = new logger({								
								date: new Date(),
								username:keys.user,
								message: 'saving'					
						});	
						log.save(function (err) {})


	

		transactions_data_to_google_sheet.get_data(keys,function(analytics_data) {
		cb(analytics_data)
		
		console.log('options.save_to_sheets',options.save_to_sheets)
		if(options.save_to_sheets=='true'){
		console.log('oadd_data_to_sheet')
			save_data_to_google_sheetInstance.add_data_to_sheet(analytics_data)
		}

		})
	});
});

}

}

module.exports = shopify_product_status_app;






 
 
