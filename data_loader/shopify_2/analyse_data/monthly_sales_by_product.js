
var transactions_data_to_google_sheet = function (keys,options){
var self = this


var async = require('async');
var moment = require('moment');
var _ = require('underscore');
var express = require('express');
var router = express.Router();
var _ = require('underscore');
var Shopify_product = require('../../../models/Shopify_product.js');
var Shopify_order = require('../../../models/Shopify_order.js');
var Shopify_month_report = require('../../../models/shopify/Shopify_month_report.js');
var shop_id = keys.shopify_store

var Shopify_transaction = require('../../../models/Shopify_transaction.js');


var dbConfig = require('../../../db');
//var mongoose = require('mongoose');
// Connect to DB

					
	self.remove_data = function(cb){



Shopify_month_report.find({shop_id:shop_id}).remove().exec(function(err, data) {
 if(err) console.log('err' + err);
 cb()
})
}


self.get_data = function(cb){
	
		self.remove_data(function() {
		
		self.get_data2(cb)		
			
		})
}


self.get_data2 = function(cb){
	
	
	
	
	

	 console.log('Shopify_product.find()')
	 Shopify_product.find({shop_id:keys.shopify_store})
	     .sort({'count': 'desc'})
         .exec(function(err, product_list) { 
			if(err) console.log(err)	
			console.log('products found',product_list.length)	 
			 Shopify_transaction.aggregate([
				{
					$group: {
						_id: {id:'$product_id' ,
						shop: '$shop_id',
						//year:{"$year":  '$date' }	,					
						month:{"$month":  '$date' }
						
						}, 					
						 count: {$sum:'$number_bought'}
					},
					
				}, {$sort : {count: -1 } }
				
    ], function (err, transaction_analytics) {
	//	console.log(transaction_analytics)
        if (err) {
			console.log(err)
            next(err);
        } else {
				var result = []
				
				var matches = 0
				var report_date = new Date()
				//possible mem leak
				
				
				
				_.each(transaction_analytics, function(_product) {	
					_.each(product_list, function(product) {				
						if(product._id==_product._id.id){
							new_product=[]
							new_product=product.toJSON()
							new_product.count=_product.count
							// for monthky report
							new_product.net_sales=_product.count * ( product.price/1.2)
							
							
							if(new_product.count>0){
								console.log('count',new_product.count)
								console.log('net_sales',new_product.net_sales)
								console.log('price',new_product.price)
							}
							new_product.vendor=product.vendor
							//console.log('year__', _product._id.year)
						//	new_product.year= _product._id.year
							new_product.shop= _product._id.shop
							//console.log(new_product.shop)
							
							new_product.month=moment.monthsShort( _product._id.month-1) 
							new_product.name=product.title
							new_product.barcode=product.barcode
							new_product.cost_of_goods=product.cost_price
										
							new_product.variant_id=product.variant_id
							new_product.report_id=options.title+"_"+moment(new Date()).format('DD_MM_YYYY')
							new_product.date_report_run=report_date 
							new_product.net_income = product.price/1.2
							new_product.profitability=product.cost_price ? (_product.count*(product.taxable=="true" ? new_product.net_income : product.price)) - (_product.count*product.cost_price) : "COST PRICE NEEDED"
							new_product.taxable=product.taxable
							
							
							
							var order_status = ""
							if(product.inventory_quantity<=_product.count){
								order_status = "re-order"
							}
							new_product.order_cost=product.cost_price*_product.count		
							new_product.order_status=order_status
							matches++
						//console.log(matches+ ' product-orders added')	
						//n.b. does async mean soem get lost?	
					//	var shopify_order = new Shopify_order(new_product);	
						//shopify_order.save();
							
							
							
							result.push(new_product)
	
						}
					})		
				})
				new_data=[]
				
				
				
				_.each(result,function(row){
					
			//	_.each([2016,2017,2018],function(year){		
					
						
					
					_.each(moment.monthsShort(),function(month){
					returned_row=[]
						var pushed=false	
						returned_row[month]=""
						//something is wrong here	
						//if(month==row.month) {
							
							//returned_row.year				=   row.year
							//returned_row.month				=   month //possibly meaningless
							returned_row.shop_id			=   row.shop							
							returned_row.net_sales			=   row.net_sales							
							returned_row[month]				=	row.net_sales
							returned_row['quantity']		=	row.count
							returned_row['product_name']	=	row.name
							returned_row['variant_id']		=	row.variant_id
							returned_row['vendor']			=	row.vendor
							
							//console.log(returned_row)
							
							_.each(new_data,function(product_row,i ){
								
								if(new_data[i].product_name==row.name && new_data[i].month==month){
									
									new_data[i][month]=row.net_sales
									pushed=true	
								}	
							})
							
						   if(pushed==false)	new_data.push(returned_row)
					//	}
					})
				 
				//})
			
				})			
				//sort by each month and assign a rank
				
				_.each(moment.monthsShort(),function(sort_month){				
					// First create the array of keys/net_total so that we can sort it:
					var sort_array = [];
					for (var key in new_data) {	
					
						sort_array.push({product_name:new_data[key].product_name, key:key,value:new_data[key][sort_month],month:new_data[key].month});					
					
					}
					// Now sort it:
					sort_array2=sort_array.sort(function(x,y){return y.month - x.month});

					sort_array2=sort_array2.sort(function(x,y){return y.value - x.value});


					// Now process that object with it:
					for (var i=0;i<sort_array2.length;i++) {								
						//i is the rank
						var item = sort_array2[i]
						
						// now do stuff with each item like a pro
						new_data[item.key][sort_month]=i
						
					}
				})
				
				
			async.each(new_data, function(data, callback) {


			
			row=    
			
			{		month_id:data.year+"_"+data.month	+"_" + data.variant_id,
					shop_id:data.shop_id	,	
					//year:data.year	,	
					month:data.month	,	
					vendor:data.vendor		,	
					quantity:parseInt(data.quantity)	,
					title:data.product_name ,	
					net_sales:parseInt(data.net_sales),
					Jan:data.Jan ,
					Feb:data.Feb ,
					Mar:data.Mar ,
					Apr:data.Apr ,
					May:data.May ,
					Jun:data.Jun ,
					Jul:data.Jul ,
					Aug:data.Aug ,
					Sep:data.Sep ,
					Oct:data.Oct ,
					Nov:data.Nov ,
					Dec:data.Dec 
					
			}
			
		
			
			var shopify_month_report = new Shopify_month_report(row);	
						
			shopify_month_report.save( function(err, doc) {
			
				if(err) console.log(err)	
					callback();
	  
			})
    
}, function(err) {
    // if any of the file processing produced an error, err would equal that error
    if( err ) {
      // One of the iterations produced an error.
      // All processing will now stop.
      console.log('A file failed to process');
    } else {
      console.log('All files have been processed successfully');
	  	cb(new_data)
    }
});


			
				
			
			
        }
    });
	 
	 
	 
	 
	 
	 
	 
   // res.json(todos);
  });
	
}

}

module.exports = transactions_data_to_google_sheet;