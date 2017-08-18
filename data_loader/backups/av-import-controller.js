var Team = require('../../models/resource-booking/resource.js');

var self = this

var eachAsync = require('each-async');
var express = require('express');
var router = express.Router();
console.log('loaded Import_file')
var mongoose = require('mongoose');
var dbConfig = require('../../db');

var async = require('async');
var Import_file=require('./load-csv.js');

	

		import_file= new Import_file('./data_loader/backups/imports/assets.csv')
		mongoose.connect(dbConfig.url);
		import_file.load_import_file(function (csv_tickets){
				async.eachSeries(csv_tickets, function (row, cxcx){ 
				
					var date =new Date()
					console.log(row)
						name= row[0]	
						type = row[1]							
						asset_type= row[2]
						asset_name= row[3]
						asset_no= row[4]	
						label_location= row[5]	
						label_notes= row[6]	
						serial_no= row[7]
						model_no= row[8]
						location= row[9]	
						description= row[10]
						date_logged= new Date()
						comments= "IMPORTED"	
						logger_user_name= "Mark"
	
					
					var kpis = new Team({
							
													type:type,
													name:name,	
													asset_name:asset_name,
													asset_type:asset_type,
													asset_no:asset_no,
													label_location:label_location,
													label_notes:label_notes,
													serial_no:serial_no,
													model_no:model_no,
													location:location,
													description:description,
													date_logged:date_logged,
													comments:comments,
													logger_user_name:logger_user_name,
													logger_user_name:"IMPORT"
					});
					
					console.log("IMPORT "+kpis)
								
					Team.find({"name":name}).remove().exec(function(err, data) {
					
					 if(err) console.log('err' + err);
					})
						kpis.save(function (err) {
						if(err) console.log('err' + err);
									setTimeout(function(){ cxcx() }, 200);
						});

					
			},function(){
			mongoose.connection.close()
			})
	})
		

