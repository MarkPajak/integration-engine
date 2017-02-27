var express = require('express');
var router = express.Router();
var shopifyAPI = require('shopify-node-api');
var fs = require('fs');

var Process_shopify_recent_product_analytics = require("../data_loader/shopify/last_n_days.js");
var Check_shopify = require("../data_loader/shopify/shopify_checkorder.js");




var moment = require('moment');
var fs = require('fs');
var allkeys=JSON.parse(fs.readFileSync('./secret/api_keys.JSON').toString());

 
function product_type_from_id(res,product_id,order_date){
	
		
}

function orders(res){
	
			var return_product_type = ""
			url = url_base+"orders.json?&fields=created_at,id,name,total-price,line_items"
			request({
				url: url,
				json: true
			}, function (error, response, body) {
				if (!error && response.statusCode === 200) {		
					_.each(body.orders, function(order) {
						var order_date = order.created_at
						/*
						_.each(order.line_items, function(item) {
							product_type_from_id(res,item.product_id,order_date)
						});
						*/
					});
					return return_product_type
				}
			})		
}


/* GET home page. */
router.get('/', function(req, res, next) {
	
	console.log(req.query)
	var shop = req.query.shop
	var keys = allkeys[shop]
	keys.user=req.user.username
	console.log('keys',keys)
	req.query.google_sheet_id=keys.google_sheet_id
	
 var process_shopify_recent_product_analytics = new Process_shopify_recent_product_analytics(keys,req.query)
  
process_shopify_recent_product_analytics.go(function(data) {

   res.json(data);
   
   })

})


router.get('/test', function(req, res, next) {
	
	console.log(req.query)
	var shop = req.query.shop 
	var keys = allkeys[shop]
	console.log('keys',keys)

	
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
