
var express = require('express');
var router = express.Router();
var shopifyAPI = require('shopify-node-api');
var fs = require('fs');

var Process_shopify_recent_product_analytics = require("./async_last_n_days.js");
var Check_shopify = require("./shopify_checkorder.js");


var moment = require('moment');
var fs = require('fs');
var allkeys=JSON.parse(fs.readFileSync('./secret/api_keys.JSON').toString());

var config = []

var data_number=30
config.created_at_min=moment(new Date()).add(-data_number, 'days').format()
config.generate_order_forms=false
config.save_to_sheets=true
config.shop="BMAG"
config.title = "last_"+data_number+"_days"
config.update_product_types=true

/* GET home page. */

var mongoose = require('mongoose');
var dbConfig = require('../../db');
mongoose.connect(dbConfig.url);	

	console.log('process_shopify_recent_product_analytics')
	var shop =config.shop
	var keys = allkeys[shop]
	config.google_sheet_id=keys.google_sheet_id

var Monthly_totals = require("./monthly_totals.js");
var monthly_totals = new Monthly_totals(keys,config) 

monthly_totals.get_vendor_ids(keys,function(vendor_ids){

console.log(vendor_ids)

})