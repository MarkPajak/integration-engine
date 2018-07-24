//gets list of all products from shopify and adds them to database
var load_shopify_product = function (keys,options){
// NB variant=post.variants[0] assumption that multipekl variants not importent
var async = require('async')
var express = require('express');
var router = express.Router();
var shopifyAPI = require('shopify-node-api');
var request = require('request');
var moment = require('moment');
var _ = require('underscore');
var shop_id = keys.shopify_store
var url_base="https://"+keys.shopify_api+":"+keys.shopify_password+shop_id+"/admin/"
call_date = moment(new Date()).add(-10, 'days').format("YYYY-MM-DD")
var Shopify_products = require('../../../models/Shopify_product.js');
var dbConfig = require('../../../db');
//var mongoose = require('mongoose');
// Connect to DB
//mongoose.connect(dbConfig.url);
 var self=this
var logger = require('../../../models/logging.js');
function product_type_from_id(item,order){
	

}

function products(total_orders,cb){
	
	
	var page = 50
	var limit = 200
	var pages_in_total = total_orders/limit
	var current_page = 0
	console.log('pages_in_total '+pages_in_total)
	
	 function getNextset() {
	//console.log('looking at page '+current_page +'of '+pages_in_total)	
			
			var return_product_type = ""
			url = url_base+"products.json?&limit="+limit+"&page="+current_page+ "&fields=id,title,product_type,published_at,variants,vendor"
			//console.log('url'+url)		
			
			request({
				url: url,
				json: true
			}, function (error, response, body) {
			if (error ) console.log(error)
				if (!error && response.statusCode === 200) {
				//console.log(' \n products found... '+body.products.length+ 'of '+pages_in_total)
				 		var log = new logger({								
								date:  moment(new Date()).format(),
								username:keys.user,
								message: 'looking at page '+current_page +' of '+pages_in_total
						});	
						log.save(function (err) {})
				async.forEach(body.products, function(post, cbb) { 
				
	async.forEach(post.variants, function(variant, cbb) {				
						
						
					
						//n.b. was getting less than expected sales in results - have now incluyded all variants in analysis>>>>hopefully fixed
						//console.log(' \n post.title.. '+ post.title)	
						if(	post.product_type=="")post.product_type="unassigned"
						
						var shopify_products = new Shopify_products({
							  _id: post.id,							 
							  product_type:  post.product_type ,	
							  title:  post.title,
							  published_at: new Date(post.published_at),
							  sku: variant.sku,
							  variant_id: variant.id,
							  barcode: variant.barcode,
							  metafield:post.metafield,
							  taxable:variant.taxable,
							  discounts:post.discounts,
							  taxable:post.taxable,
							  vendor:post.vendor,
							  fulfillment_status:post.fulfillment_status,
							  shop_id:shop_id,
							  inventory_quantity:  variant.inventory_quantity,
							  price:  variant.price
						});	
					
						  shopify_products.save(function(){	 cbb()});
	
					});
});
								
					if(body.products.length!=0){
					
						setTimeout(function (){
							getNextset();
							current_page++
						}, 2000);
						
					}
					else{
					//console.log('max reachedx')
					cb()
					}
				}
				
			})	
		}
		
getNextset()		

}			


self.count_all_products = function(cb2){

if(options.update_product_types=='false'){
//console.log('count_all_products',options.update_product_types)
cb2()
}
else
{

			total_order_count = 0

			url = url_base+"products/count.json"
			request({
				url: url,
				json: true
			}, function (error, response, body) {
				if(error) {console.log(error)}
				if (!error && response.statusCode === 200) {
					 products(body.count,cb2)
				}
			})	

}

}

}

module.exports = load_shopify_product;
