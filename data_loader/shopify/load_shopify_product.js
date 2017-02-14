//gets list of all products from shopify and adds them to database

// NB variant=post.variants[0] assumption that multipekl variants not importent
var async = require('async')

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
var Shopify_products = require('../../models/Shopify_product.js');
var dbConfig = require('../../db');
var mongoose = require('mongoose');
// Connect to DB
mongoose.connect(dbConfig.url);
 

 //orders();
  count_all_products()
function product_type_from_id(item,order){
	
	
	var product_id = item.product_id
	var line_item_id = item.id
			var return_product_type = []

			url = url_base+"products.json?ids="+product_id+"&fields=product_type,variants"

			request({
				url: url,
				json: true
			}, function (error, response, body) {
			if (error) console.log(error)
				if (!error && response.statusCode === 200) {		
					_.each(body.products, function(post) {			
						var shopify_transaction = new Shopify_transaction({
						date: new Date(order.created_at),
						product_type: post.product_type,
						price:post.variants[0].price,
						line_id:line_item_id
						});				
						shopify_transaction.update(function (err) {  if (err )console.log('saving error'+err) });
	
					});
					
				}
			})		
}

function products(total_orders){
	
	
	var page = 50
	var limit = 200
	var pages_in_total = total_orders/limit
	var current_page = 0
	console.log('pages_in_total '+pages_in_total)
	
	 function getNextset() {
	console.log('looking at page '+current_page +'of '+pages_in_total)	
			
			var return_product_type = ""
			url = url_base+"products.json?&limit="+limit+"&page="+current_page+ "&fields=id,title,product_type,variants"
	console.log('url'+url)		
			request({
				url: url,
				json: true
			}, function (error, response, body) {
			if (error ) console.log(error)
				if (!error && response.statusCode === 200) {
				console.log(' \n products found... '+body.products.length+ 'of '+pages_in_total)
				async.forEach(body.products, function(post, cbb) { 
						variant=post.variants[0]
						console.log(' \n post.title.. '+ post.title)	
						if(	post.product_type=="")post.product_type="unassigned"
						
						var shopify_products = new Shopify_products({
							  _id: post.id,							 
							  product_type:  post.product_type ,	
							  title:  post.title,
							  inventory_quantity:  variant.inventory_quantity,
							  price:  variant.price
						});	
					
						  shopify_products.save(function(){	 cbb(	)});
	
					});
								
					if(body.products.length!=0){
					
						setTimeout(function (){
							getNextset();
							current_page++
						}, 2000);
						
					}
					else{
					//mongoose.connection.close()
					console.log('max reached')
				
					}
				}
				
			})	
		}
		
getNextset()		

}			



function count_all_products(){

			total_order_count = 0

			url = url_base+"products/count.json"
			request({
				url: url,
				json: true
			}, function (error, response, body) {
				if (!error && response.statusCode === 200) {
					 products(body.count)
				}
			})	

}



module.exports = router;
