
var load_data_from_file = function (file){


var Sales = require('../../models/performance/Retail_sales_net.js');
var _ = require('underscore');
var self = this
var log = ""
var eachAsync = require('each-async');
var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var dbConfig = require('../../db');
var async = require('async');
var Import_file=require('./load-csv.js');
var rows_written=0     
var total_sales=0 
var non_vat_sales=0 


self.load_data= function (importfile,form,cb){

console.log(form)
		import_file= new Import_file('./uploads/data/'+importfile)
		log+=('loaded Import_file ;'+importfile+"\n");
		import_file.load_import_file(function (csv_tickets){



			 
			var date_column	
			var pos_location_name_column	
			var net_sales_column		
			var total_sales_column
			var	orders_column	


			

			_.each(csv_tickets[0], function (line, x) {
				
				//match on column name
				console.log('line',line,x)
				if(line=="day" ) date_column=x
				if(line=="pos_location_name") pos_location_name_column=x
				if(line=="net_sales") net_sales_column=x
				if(line=="total_sales") total_sales_column=x
				if(line=="orders") orders_column=x
				if(line=="taxes") taxes_column=x
			})
			  






				async.eachSeries(csv_tickets, function (row, cxcx){ 
			
													
				
				var dateParts = row[date_column].split("/");
				var visit_date=new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]); 
	
	
					var  museum =row[pos_location_name_column] 

					switch(museum) {
						case "Bristol Museum & Art Gallery":
						  // code block
						  museum="BMAG"
						  break;
						  case "M Shed":
						  // code block
						  museum="M-SHED"
						  break;
						default:
						  // code block
					  }



					var kpis = new Sales({

                            kpi_type: "sales",	
                            museum_id:museum,	
                            date_value:visit_date,			           
                            total_sales: row[total_sales_column],	
                           // non_vat_sales:   row[total_sales_column]-((row[total_sales_column]- row[net_sales_column])*5),
							non_vat_sales:   row[total_sales_column]-((row[total_sales_column]- row[net_sales_column])*5)- row[taxes_column],						
							taxes: row[taxes_column],	
						    net_sales: row[net_sales_column],	
                            no_transactions:row[orders_column],	
                            date_logged:new Date(),		
							logger_user_name:"IMPORT",
							comments:form.comments
					});
					
                
					     
                    
								
					Sales.find({"museum_id":museum,"date_value":visit_date}).remove().exec(function(err, data) {
				
					 if(err) log+=('err' + err+"\n");
                    
                    })
						kpis.save(function (err, data2) {
						
						 if(err){
							log+=("\n");
							log+=('err' + err +"\n");
						 }
						 else
						 {
						// log+=('data written:    '  + data2 +"\n");
						 total_sales+=data2.total_sales
						 non_vat_sales+=data2.non_vat_sales		 
						 rows_written++
						 }

						
									setTimeout(function(){ cxcx() }, 2);
						});

					
			},function(){


			log+=("\n");
			log+=('imported date:    ' 				+ new Date() +"\n");
			log+=('data rows_written:    ' 				+ rows_written +"\n");
			log+=('data total_sales:    '  				+ total_sales +"\n");
			log+=('data total_non_vat_sales:    ' 	    + non_vat_sales +"\n");


			console.log(log)

			const fs = require('fs');

			fs.writeFile("./uploads/data/"+importfile+".log", log, function(err) {
				cb()
			if(err) {

				return //console.log(err);

			}
  
}); 
			})
	})

}
}



module.exports = load_data_from_file
		

