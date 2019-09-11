
var load_data_from_file = function (file){


var Kiosk = require('../../models/performance/Donations_kiosk.js');
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
var donation_amount=0 
//var non_vat_sales=0 


self.load_data= function (importfile,form,cb){

console.log(form)
		import_file= new Import_file('./uploads/donation-kiosk/'+importfile)
		log+=('loaded Import_file ;'+importfile+"\n");
		import_file.load_import_file(function (csv_tickets){



			 
			var date_column	
			var kiosk_id_column	
			var kiosk_alias_column	
			var donation_amount_column		
			var transaction_id_column	
			var total_sales_column
			var	orders_column	
			
			
			//Report Entry ID	Kiosk ID	Alias	Transaction ID	Title	First Name	Last Name	House Number	Postcode	Donation Date	Amount
		//	museum_id:		  
			//kpi_type: 
     
     
           // transaction_id:
			//donation_amount: 
			//gift_aided:,
           //type:


			_.each(csv_tickets[0], function (line, x) {
				
				//match on column name
				console.log('line',line,x)
				if(line=="Donation Date" ) date_column=x
				if(line=="Kiosk ID") kiosk_id_column=x
				if(line=="Alias") kiosk_alias_column=x
				if(line=="Amount") donation_amount_column=x
				if(line=="Transaction ID") transaction_id_column=x

			})
			  






				async.eachSeries(csv_tickets, function (row, cxcx){ 
			
													
				
				var dateParts = row[date_column].split("/");
				//var visit_date=new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]); 
	var visit_date=new Date(row[date_column])
	
					var  museum =row[kiosk_alias_column] 

					switch(museum) {
						case "Donation Station 01":
						  // code block
						  museum="M-SHED"
						  break;
						  case "M Shed":
						  // code block
						  museum="M-SHED"
						  break;
						default:
						  // code block
					  }



					var kpis = new Kiosk({

                            kpi_type: "kiosk",	
                            museum_id:museum,	
                            date_value:visit_date,			           
                            kiosk_id:row[kiosk_id_column],	
							kiosk_alias:row[kiosk_alias_column],	
							donation_amount: row[donation_amount_column],	
							transaction_id: row[transaction_id_column],
                           
                            date_logged:new Date(),		
							logger_user_name:"IMPORT",
							comments:form.comments
					});
					
                
					     
                    
								
					Kiosk.find({"museum_id":museum,"date_value":visit_date}).remove().exec(function(err, data) {
				
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
						 donation_amount+=data2.donation_amount
						// non_vat_sales+=data2.non_vat_sales		 
						 rows_written++
						 }

						
									setTimeout(function(){ cxcx() }, 2);
						});

					
			},function(){


			log+=("\n");
			log+=('imported date:    ' 				+ new Date() +"\n");
			log+=('data rows_written:    ' 				+ rows_written +"\n");
			log+=('data donation_amount:    '  				+ donation_amount +"\n");
		//	log+=('data total_non_vat_sales:    ' 	    + non_vat_sales +"\n");


			console.log(log)

			const fs = require('fs');

			fs.writeFile("./uploads/donation-kiosk/"+importfile+".log", log, function(err) {
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
		

