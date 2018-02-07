var shopify_transaction = function (keys,valid_ticket_types){
var self = this




var async = require('async');
var eachAsync = require('each-async');
var express = require('express');
var router = express.Router();
var shopifyAPI = require('shopify-node-api');
var request = require('request');
var moment = require('moment');
var _ = require('underscore');
var url_base="https://"+keys.shopify_api+":"+keys.shopify_password+keys.shopify_store+"/admin/"

var Shopify_transaction = require('../../../models/Shopify_transaction.js');
var Shopify_products = require('../../../models/Shopify_product.js');
var dbConfig = require('../../../db');
//var mongoose = require('mongoose');
Shopify_transaction.find({"shop_id":keys.shopify_store}).remove().exec(function(err, data) {
 if(err) console.log('err' + err);
})


// query variables


// Connect to DB

 
var shopifyorders = []



function orders(bodycount,id,cb){
	
	
	var page = 50
	var limit = 200
	var pages_in_total =bodycount/limit
	var current_page = 0
	console.log('pages_in_total '+pages_in_total)
	
	 function getNextset() {
	console.log('looking at page '+current_page +"of "+ pages_in_total)
			
			var return_product_type = ""

			url = url_base+"orders/"+id+".json?fields=id,line_items,name,total_price"
	console.log('url'+url)		
			request({
				url: url,
				timeout:2000,
				json: true
			}, function (error, response, body) {
					if (error) console.log(error)
				if (!error && response.statusCode === 200) {
					
						
						console.log('orders found... '+body.order.length)		
						

							
							_.each(body.order.line_items, function(item) {
									//n.b this needs to run via async callback
									console.log('checking item')
									item.date= new Date(body.order.created_at)
									if(item.product_id==valid_ticket_types.product_id){									
									shopifyorders.push(item)	
									}	
									
								});		
							
								
																				
	
					current_page++					
					if(current_page<pages_in_total){
					
						setTimeout(function (){
							getNextset();
						}, 250);
						
					}
					else{
					if(shopifyorders.length>0){
							console.log('open gate')
							cb(1)
							
					}
					}
				}
				
			})	
		}
		
getNextset()		

}			

self.can_query_orders = function(cb){

			total_order_count = 0

			url = url_base+"orders/count.json"
			request({
				url: url,
				json: true
			}, function (error, response, body) {
				if (!error && response.statusCode === 200) {
						return cb(body)
				}
				else{
				return(error)
				
				}
			})	

}

self.count_all_orders = function(qr_id,cb){

			total_order_count = 0
console.log('cats')
			url = url_base+"orders/count.json"
			request({
				url: url,
				json: true
			}, function (error, response, body) {
				if (!error && response.statusCode === 200) {
					 orders(body.count,qr_id,cb)
				}
				else{
				
				console.log(error)
				}
			})	

}


}

module.exports = shopify_transaction;


