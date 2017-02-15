var shopify_product_status_app = function (keys,options,cb){




var mongoose = require('mongoose');
var dbConfig = require('../../db');
//mongoose.connect(dbConfig.url);	
var load_shopify_products = require("./load_shopify_product.js");
var shopify_transaction = require("./shopify_transactions.js");
var transactions_data_to_google_sheet = require("./google_sheet.js");
var save_data_to_google_sheet = require("../services/save_data_to_google_sheet.js");




var load_shopify_productsInstance = new load_shopify_products(keys)
var shopify_transactionInstance = new shopify_transaction(keys,options)
var transactions_data_to_google_sheet = new transactions_data_to_google_sheet(options)
var save_data_to_google_sheetInstance = new save_data_to_google_sheet(options);  

this.go = function(cb){


load_shopify_productsInstance.count_all_products( function(donex) {

	console.log('go')
	shopify_transactionInstance.count_all_orders( function() {
	console.log('count_all_orders callback')
		

		transactions_data_to_google_sheet.get_data(function(analytics_data) {
		cb(analytics_data)
		//save_data_to_google_sheetInstance.add_data_to_sheet(analytics_data)

		})
	});
});

}

}

module.exports = shopify_product_status_app;






 
 
