var express = require('express');
var router = express.Router();
var shopifyAPI = require('shopify-node-api');
var fs = require('fs');
var keys=JSON.parse(fs.readFileSync('./secret/api_keys.JSON').toString());
var request = require('request');
var moment = require('moment');
var _ = require('underscore');
var url_base="https://"+keys.shopify_api+":"+keys.shopify_password+"@bristol-museums-shop.myshopify.com/admin/"
call_date = moment(new Date()).add(-10, 'days').format("YYYY-MM-DD")
 
 
function product_type_from_id(res,product_id,order_date){
	
			var return_product_type = []

			url = url_base+"products.json?ids="+product_id+"&fields=product_type,variants"
			request({
				url: url,
				json: true
			}, function (error, response, body) {
				if (!error && response.statusCode === 200) {		
					_.each(body.products, function(post) {			
					
						order_analysis = []
						order_analysis.date=order_date
						order_analysis.type=post.product_type
						order_analysis.price=post.variants[0].price						
						//load order_analysis into mondo database 
						
						console.log(order_analysis)
						
					});
					
				}
			})		
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
	
		//get 50 orders 
		 //url = "https://"+keys.shopify_api+":"+keys.shopify_password+"@bristol-museums-shop.myshopify.com/admin/orders.json?fields=created_at,id,name,total-price,line_items"
		//get product_type category for order id 3880596805
		//var product_id=3880596805
		//product_type_from_id(res,product_id)
		orders(res)



})




module.exports = router;
