var save_data_to_database = function (keys,options){

	var self = this;
	var async = require('async');
	var moment = require('moment');
	var GoogleSpreadsheet = require('google-spreadsheet');
	var _ = require('underscore');
	var doc = new GoogleSpreadsheet( options.google_sheet_id);
	var duplicate = false
	var logger = require('../../../models/logging.js');
	var sheet_name = options.title//+"_"+moment(new Date()).format('DD_MM_YYYY')
	var Shopify_monthly= require('../../../models/shopify/Shopify_month_report.js');



	console.log('options.manual',options.manual)
	if(options.manual==true){
	
		sheet_name+="_MANUAL_"+moment(new Date()).format('DD_MM_YYYY')
		
	}

	
	self.remove_data = function(cb){
	
			console.log(" removing any previous data from the set month")
			Shopify_monthly.find({shop_id:keys.shopify_store
			,month_id:options.year+options.month
			}).remove().exec(function(err, data) {
				if(err) console.log('err' + err);				
				cb()
			})
			
	}



	self.add_data_to_database = function(google_data,done){
	var i=0	


		self.remove_data( function(){
		
		
				console.log(" add_data_to_database")
				async.forEach(google_data, function(_product, cbb) {				
							
										
								 var new_product_month=[]	
								 new_product_month.shop_id=keys.shopify_store
								 new_product_month.month_id=options.year+options.month
								 new_product_month.month_product_id=options.year+options.month+_product.variant_id+_product.name
								 new_product_month.year=options.year
								 new_product_month.month=options.month
								 new_product_month.rank=_product.rank
								 new_product_month.name=_product.name
								 new_product_month.vendor=_product.vendor
								 new_product_month.product_type=_product.product_type
								 new_product_month.count=_product.count 		        //net_quantity
								 new_product_month.gross_sales=_product.count * _product.price        //net_quantity
								 new_product_month.discounts=_product.discounts 	        //>>
								 new_product_month.returns=_product.returns		    //>>
								 new_product_month.net_sales=_product.net_sales 	        //>>
								 new_product_month.taxes=_product.taxes 			    //>>
								 new_product_month.total_sales=_product.total_sales 
								 new_product_month.variant_id=_product.variant_id
								 new_product_month.price=_product.price
								 new_product_month.cost_of_goods=_product.cost_of_goods
							//	 new_product_month.order_cost=_product.order_cost
								 new_product_month.profitability=_product.profitability
								 new_product_month.inventory_quantity=_product.inventory_quantity
								 new_product_month.order_status=_product.order_status
								 new_product_month.barcode=_product.barcode
								 new_product_month.sku=_product.sku
								 new_product_month.date_report_run=_product.date_report_run
								 new_product_month.taxable=_product.taxable

								var shopify_monthly = new Shopify_monthly(new_product_month);
								shopify_monthly.save(function(err){	
if(err) console.log(err)

								cbb()});
		
			
					});
					
		done()
		
	})

	}

}


module.exports = save_data_to_database;