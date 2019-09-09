var Sales = require('../../models/performance/Retail_sales_net.js');

var self = this
var log = ""
var eachAsync = require('each-async');
var express = require('express');
var router = express.Router();
log+=('loaded Import_file')
var mongoose = require('mongoose');
var dbConfig = require('../../db');

var async = require('async');
var Import_file=require('./load-csv.js');



		import_file= new Import_file('./data_loader/backups/imports/retail-sales.csv')
		mongoose.connect(dbConfig.url);
		import_file.load_import_file(function (csv_tickets){
				async.eachSeries(csv_tickets, function (row, cxcx){ 
			
				console.log(row)
													
                var visit_date=new Date(row[1])
					
					var kpis = new Sales({

                            kpi_type: "sales",	
                            museum_id:row[0],	
                            date_value:visit_date,			           
                            total_sales: row[2],	
                            non_vat_sales: row[3],	
                            net_sales: row[4],	
                            no_transactions:row[5],	
                            date_logged:new Date()				
							logger_user_name:"IMPORT"
					});
					
				
								
					Sales.find({"museum_id":museum,"date_value":visit_date}).remove().exec(function(err, data) {
				
					 if(err) log+=('err' + err);
                    
                    })
						kpis.save(function (err) {
						 if(err)log+=('err' + err);
						
									setTimeout(function(){ cxcx() }, 2);
						});

					
			},function(){
			mongoose.connection.close()
			})
	})
		

