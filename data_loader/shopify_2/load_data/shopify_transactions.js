var shopify_transaction = function (keys,options){
var self = this



var created_at_max = options.created_at_max || ""
var created_at_min = options.created_at_min


 
var async = require('async');
var eachAsync = require('each-async');
var express = require('express');
var router = express.Router();
var shopifyAPI = require('shopify-node-api');
var shop_id = keys.shopify_store
var request = require('request');
var moment = require('moment');
var _ = require('underscore');
var url_base="https://"+keys.shopify_api+":"+keys.shopify_password+shop_id+"/admin/"
var logger = require('../../../models/logging.js');
var mongoose = require('mongoose');
var dbConfig = require('../../../db');
if(mongoose.connection.readyState==0){
	mongoose.connect(dbConfig.url, function(err) {
		if (err) throw err;
	});
}

var Shopify_transaction = require('../../../models/Shopify_transaction.js');
var Shopify_products = require('../../../models/Shopify_product.js');
var dbConfig = require('../../../db');
//var mongoose = require('mongoose');

self.remove_data = function(cb){



Shopify_transaction.find({shop_id:shop_id}).remove().exec(function(err, data) {
 if(err) console.log('err' + err);
 cb()
})
}

// query variables


// Connect to DB

 
var shopifyorders = []


	created_at_max_bit=""
			if (created_at_max!=""){
			
				created_at_max_bit="&created_at_max="+created_at_max
			
			}



function products(total_orders,cb){

innerCallback = function(){

cb()
}



	//console.log('loading orders and product info')

	var orders_in_total = total_orders.length
	var added_order_items=[]
	var product_count = 0
	console.log('orders_in_total '+orders_in_total)

	 function getNextitemset(item) {
	
				var product_id = item.product_id
			
				var return_product_type = []
			//	console.log(' item.key ', item)
					
					Shopify_products.findById(product_id,function(err, post) {
							
							 if(err) console.log(err)
								 
							 if(!err && post && added_order_items.indexOf(item.line_item_id)==-1 ){
									//n.b. line item quantity
									
								//	console.log('post.quantity ', post.quantity)
									//console.log(' item.quantity ', item.quantity)
										//console.log(' item.quantity * item.price', item.quantity * item.price)
										
										
									var shopify_transaction = new Shopify_transaction({
										//transaction_id:item.id+shop_id,
										date:			 		item.date,
										shop_id:				shop_id,
										source_name:			item.source_name,
										quantity:				item.quantity,
										discounts:				item.total_discount,
										gross_sales:			Math.round(item.quantity * item.price),
										net_sales: 				Math.round(item.price/1.2)	,								
										product_type: 			post.product_type,
										number_bought:		    item.quantity,										
										product_id: 			post.id,
										cost_of_goods: 			post.cost_of_goods,
										variant_id: 			item.variant_id,
										sku: 					post.sku,
										metafield:				post.metafield,
										barcode: 				post.barcode,
										vendor:					post.vendor,
										title: 					post.title,
										price:					item.price,
										line_id:				item.line_item_id
									});	
								
								
								added_order_items.push(item.line_item_id)
								
									shopify_transaction.save(function (err) {
									
										if(err) console.log(err)
										product_count++	
										if( total_orders[product_count]&&product_count<= orders_in_total){
											
											getNextitemset(total_orders[product_count])
										}
										else
										{
											console.log('max reached ' + shopifyorders.length + ' orders found - end of function chain')
											innerCallback()	
										}
								 });
							}
							else  //no error
							{
								product_count++	
										if(total_orders[product_count]&&product_count<= orders_in_total){
											getNextitemset(total_orders[product_count])
										}
										else
										{
											console.log('max reached ' + shopifyorders.length + ' orders found - end of function chain')
											innerCallback()	
										}	
							}
				
					})	//end of async
		}


if(		orders_in_total>0){
getNextitemset(total_orders[0])	
}
else
{
console.log('didnt find any orders!')
cb()
}	

}

function orders(total_orders,cb){
	
	
	var page = 50
	var limit = 200
	var pages_in_total = total_orders/limit
	var current_page = 0
	//console.log('pages_in_total '+pages_in_total)
	console.log('options.source_name',options.source_name)

	 function getNextset() {
//console.log('looking at page '+current_page +"of "+ pages_in_total)
			
			
		
			
			
			var return_product_type = ""
			url = url_base+"orders.json?created_at_min="+created_at_min+created_at_max_bit+"&status=any&limit="+limit+"&page="+current_page+ "&fields=created_at,id,name,total-price,line_items,source_name"
		
			request({
				url: url,
				json: true
			}, function (error, response, body) {
			if (error) console.log(error)
				if (!error && response.statusCode === 200) {
						
						_.each(body.orders, function(order) {
						//if(options.source_name=="web" && order.source_name!="web") return; ??include web sales??
							
							_.each(order.line_items, function(item) {
							
							item.source_name=order.source_name
							item.order_id=order.id
							//console.log('order.id',order.id)
							
							for(count = 0; count <= item.quantity; count++){ 
							 
									item.line_item_id = item.id+"_"+item.order_id+"_"+count
							 
									item.date= new Date(order.created_at)
									
									if(item.product_id){									
										shopifyorders.push(item)	
									}	
}									
								});		
							});
																				
	
					current_page++					
					if(current_page<pages_in_total){
					
						setTimeout(function (){
							getNextset();
						}, 250);
						
					}
					else{
				
					products(shopifyorders,cb)

					}
				}
				
			})	
		}
		
getNextset()		

}			



self.count_all_orders = function(cb){

	self.remove_data( function(){
		
	console.log('data removed')	
		if(options.update_product_types==false){
		//console.log('not apdating products')
		cb()
		}
		else
		{
		//console.log('updating products')

					total_order_count = 0
					//console.log('querying created_at_min'+created_at_min)
					url = url_base+"orders/count.json?created_at_min="+created_at_min+created_at_max_bit+"&status=any"+ (options.source_name=="web" ?  "&source_name=web" : "" )
					console.log(url)
					request({
						url: url,
						json: true
					}, function (error, response, body) {
						if (error) console.log(error)
						
						if (!error && response.statusCode === 200) {
							 orders(body.count,cb)
						}
					})	
		}
	})
}


}

module.exports = shopify_transaction;