var express = require('express');
var router = express.Router();
var shopifyAPI = require('shopify-node-api');
var fs = require('fs');
var keys=JSON.parse(fs.readFileSync('./secret/api_keys.JSON').toString());
var request = require('request');
var moment = require('moment');
var _ = require('underscore');
var shop_id = keys.shopify_store
var url_base="https://"+keys.shopify_api+":"+keys.shopify_password+shop_id+"/admin/"
var Shopify_transaction = require('../../models/Shopify_transaction.js');
var dbConfig = require('../../db');
//var mongoose = require('mongoose');
Shopify_transaction.find({shop_id:shop_id}).remove().exec(function(err, data) {
 if(err) console.log('err' + err);
})


// query variables
var last_seven_days =  moment(new Date()).add(-7, 'days').format()


// Connect to DB
//mongoose.connect(dbConfig.url);
 

 //orders();
  count_all_orders()
function product_type_from_id(item,order){
	
	
	var product_id = item.product_id
	var variant_id = item.variant_id
	console.log('variant_id',variant_id)
	
	var line_item_id = item.id
			var return_product_type = []

			url = url_base+"products.json?ids="+product_id+"&fields=title,id,product_type,variants"
			
		
			
	
			request({
				url: url,
				json: true
			}, function (error, response, body) {
			 if(error)console.log(error);
				if (!error && response.statusCode === 200) {		
					_.each(body.products, function(post) {			

						
						var shopify_transaction = new Shopify_transaction({
						date: new Date(order.created_at),
						product_type: post.product_type,
						product_id: post.id,
						shop_id:shop_id,
						shop_id:shop_id,
						title: post.title,
						shop_id:shop_id,
						price:post.variants[0].price,
					
						line_id:line_item_id
						});	
						
						  shopify_transaction.save(function (err,cheese) { 
						  if(err)console.log(err);
						  console.log("saved",cheese)
						  });
						
						
						
					});
					
				}
			})		
}

function orders(total_orders){
	
	
	var page = 50
	var limit = 200
	var pages_in_total = total_orders/limit
	var current_page = 0
	console.log('pages_in_total '+pages_in_total)
	
	 function getNextset() {
	console.log('looking at page '+current_page +"of "+ pages_in_total)
			
			var return_product_type = ""
			url = url_base+"orders.json?created_at_min="+last_seven_days+"&status=any&limit="+limit+"&page="+current_page+ "&fields=created_at,id,name,total-price,line_items"
	console.log('url'+url)		
			request({
				url: url,
				json: true
			}, function (error, response, body) {
				if (!error && response.statusCode === 200) {
				console.log('orders found... '+body.orders.length)				
					_.each(body.orders, function(order) {
						_.each(order.line_items, function(item) {
							product_type_from_id(item,order)
						});
					});	
	current_page++					
					if(current_page<=pages_in_total){
					
						setTimeout(function (){
							getNextset();
						}, 2000);
						
					}
					else{
					console.log('max reachedxx')
					//exit;
					}
				}
				
			})	
		}
		
getNextset()		

}			



function count_all_orders(){

			total_order_count = 0
console.log('querying created_at_min'+last_seven_days)
			url = url_base+"orders/count.json?created_at_min="+last_seven_days+"&status=any"
			request({
				url: url,
				json: true
			}, function (error, response, body) {
				if (!error && response.statusCode === 200) {
					 orders(body.count)
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
