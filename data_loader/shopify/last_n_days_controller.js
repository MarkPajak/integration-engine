var express = require('express');
var router = express.Router();
var shopifyAPI = require('shopify-node-api');
var fs = require('fs');
var self = this
var async = require('async');
var Process_shopify_recent_product_analytics = require("./async_last_n_days.js");
var Check_shopify = require("./shopify_checkorder.js");


var moment = require('moment');
var fs = require('fs');
var allkeys=JSON.parse(fs.readFileSync('./secret/api_keys.JSON').toString());
 var mongoose = require('mongoose');
var config = []

var data_number=60//changed by zak 13.04.2017
shops=[]
shops.push("MSHED")
shops.push("BMAG")
shops.push("ONLINE")

process_shop_data = function(shop,cb){


if(shop=="ONLINE"){
config.source_name="web"
data_number=100
}
	config.created_at_min=moment(new Date()).add(-data_number, 'days').format()
	config.generate_order_forms=false
	config.save_to_sheets=true
	config.source_name=""
	
	console.log('config.source_name',config.source_name)
	
	config.title = "last_"+data_number+"_days"
	config.update_product_types=true

	
	var keys = allkeys[shop]
	config.google_sheet_id=keys.google_sheet_id
	
var process_shopify_recent_product_analytics = new Process_shopify_recent_product_analytics(keys,config)
  
process_shopify_recent_product_analytics.go(function(data) {

	console.log('all done')
	
	  cb() 
},function done() {})

}

	function callbackhandler(err, results) {
			console.log('It came back with this ' + results);
		} 
		
		
		function process_mshed(callback) {
			console.log('>>>>>>>>>>>count_all_products')
			process_shop_data("MSHED",function() {
		
				callback()	
			})
		} 

			function process_BMAG(callback) {
			console.log('>>>>>>>>>>>count_all_products')
			process_shop_data("BMAG", function() {
					mongoose.connection.close()	
				callback()	
			})
		} 
		
			function process_ONLINE(callback) {
			console.log('>>>>>>>>>>>count_all_products')
			process_shop_data("ONLINE", function() {
					mongoose.connection.close()	
				callback()	
			})
		} 


	
		async.series([
			process_mshed,
			process_BMAG,
			process_ONLINE
		], function (err, results) {
		
			
			if(err) console.log(err)
			});	
		
		
		
router.get('/test', function(req, res, next) {
	
	
	var shop = req.query.shop 
	var keys = allkeys[shop]


	
			var valid_ticket_types = []
			valid_ticket_types.product_id = 8593353416
			valid_ticket_types.product_type = "Exhibition ticket"
			valid_ticket_types.csvTickets = []
			valid_ticket_types.scanned_tickets = []
			
			
		check_shopify= new Check_shopify(keys,valid_ticket_types)
		check_shopify.can_query_orders(function(result) {
		
			return res.json(result);
		})

})




module.exports = router;
