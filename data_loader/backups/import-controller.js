var Team = require('../../models/Kpi_log.js');

var self = this

var eachAsync = require('each-async');
var express = require('express');
var router = express.Router();
console.log('loaded Import_file')
var mongoose = require('mongoose');
var dbConfig = require('../../db');

var async = require('async');
var Import_file=require('./load-csv.js');

	

		import_file= new Import_file('./data_loader/backups/imports/fix.csv')
		mongoose.connect(dbConfig.test);
		import_file.load_import_file(function (csv_tickets){
				async.eachSeries(csv_tickets, function (row, cxcx){ 
					var visits = row[1]
					var visit_date =new Date(row[0])
					console.log('visit_date',visit_date)
					//var gallery =row[3]
					var museum =row[2]
					var date =new Date()
					
					
					var kpis = new Team({
							museum_id:museum,				  
							kpi_type: "visits",	
							value: visits,
							date_logged:date,	
							date_value:visit_date,
							//gallery:gallery,			
							logger_user_name:"IMPORT2"
					});
					
					//console.log("IMPORT "+museum,visits)
								
					Team.find({"museum_id":museum,"date_value":visit_date}).remove().exec(function(err, data) {
					//console.log(data)
					 if(err) console.log('err' + err);
					})
						kpis.save(function (err) {
						console.log("saved ")
									setTimeout(function(){ cxcx() }, 2);
						});

					
			},function(){
			mongoose.connection.close()
			})
	})
		

