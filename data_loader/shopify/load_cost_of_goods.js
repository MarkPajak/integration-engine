var cost_of_goods = function (keys,options){

var self = this

var Csv_to_collection = require("../services/csv_to_collection.js");
var Shopify_products = require('../../models/Shopify_product.js');
var _ = require('underscore');
var mongoose = require('mongoose');
var dbConfig = require('../../db');

csv_to_collection = new Csv_to_collection

var inputFile='./data_loader/shopify/imports/'+keys.cost_of_goods;


		self.add_price_to_products = function(cb){


				cost_of_goods_data = csv_to_collection.load_tickets(inputFile, function ( data) {
						_.each(data, function (line) {
								var cost_price=line[7]
								var variant_id=line[0]

								if(variant_id){
									Shopify_products.find({'variant_id':variant_id})
													.exec(function (err, products) {
													_.each(products, function (product) {
															if(err) console.log(err)
															if(product)console.log(product._id)
															if(cost_price>0&& product.variant_id){
																 product.cost_price=cost_price
																 console.log(product)
																product.save()
															}	
													});	
																			
												
												});	
								}				
								
						})	
cb()							
				})
		}

}


module.exports = cost_of_goods;
