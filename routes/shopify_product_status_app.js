var express = require('express');
var router = express.Router();
var shopifyAPI = require('shopify-node-api');
var fs = require('fs');

var Process_shopify_recent_product_analytics = require("../data_loader/shopify/last_n_days.js");
var moment = require('moment');
var fs = require('fs');
var keys=JSON.parse(fs.readFileSync('./secret/api_keys.JSON').toString());

var selected_set = 3

var optionset = []
	var options = []
	options.google_sheet_id='1UlDQNS6dTvQWlQs090HRrSoR49k0Th-ElxCaxTMleA0'
	options.created_at_min =  moment(new Date()).add(-7, 'days').format()
	options.title = "last_7_days"
	console.log('options.created_at_min',options.created_at_min)
optionset.push(options)
	var options = []
	options.google_sheet_id='1UlDQNS6dTvQWlQs090HRrSoR49k0Th-ElxCaxTMleA0'
	options.created_at_min =  moment(new Date()).add(-14, 'days').format()
	options.title = "last_14_days"
optionset.push(options)
	var options = []
	options.google_sheet_id='1UlDQNS6dTvQWlQs090HRrSoR49k0Th-ElxCaxTMleA0'
	options.created_at_min =  moment(new Date()).add(-1, 'month').format()
	options.title = "last_month"
optionset.push(options)
	var options = []
	options.google_sheet_id='1UlDQNS6dTvQWlQs090HRrSoR49k0Th-ElxCaxTMleA0'
	options.created_at_min =  moment(new Date()).add(-1, 'year').format()
	options.title = "last_year"
optionset.push(options)



 
 
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
						_.each(order.line_items, function(item) {
							product_type_from_id(res,item.product_id,order_date)
						});
					});
					return return_product_type
				}
			})		
}


/* GET home page. */
router.get('/', function(req, res, next) {
	
	
 var process_shopify_recent_product_analytics = new Process_shopify_recent_product_analytics(keys,optionset[selected_set])
   
process_shopify_recent_product_analytics.go(function(data) {

   res.json(data);
   
   })
 
	


})



module.exports = router;
