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

//cheese	

		import_file= new Import_file('./data_loader/backups/imports/archives-visits.csv')
		mongoose.connect(dbConfig.url);
		import_file.load_import_file(function (csv_tickets){
				async.eachSeries(csv_tickets, function (row, cxcx){ 
			
				console.log(row)
				
					visitor_groupDocs=[]	
				

					var visitor_groupDoc = {
											  name:  "Searchroom visitors",
											  count:  row[1],
											}
					visitor_groupDocs.push(	visitor_groupDoc)

					var visitor_groupDoc = {
											  name:  "Other visitors",
											  count:  row[2],
											}
					visitor_groupDocs.push(	visitor_groupDoc)	

					var visitor_groupDoc = {
											  name: "BAFHS researchers",
											  count:  row[3],
											};
					visitor_groupDocs.push(	visitor_groupDoc)	


					var visitor_groupDoc = {
											  name:  "On-site events",
											  count:  row[4],
											};
					visitor_groupDocs.push(	visitor_groupDoc)						
									
											
				
					var visits = row[5]
					var visit_date =new Date(row[0])
				
					var gallery =row[3]
					var museum =row[6]
					var date =new Date()
					
					
					var kpis = new Team({
							museum_id:museum,				  
							kpi_type: "visits",	
							value: visits,
							date_logged:row[5],	
							date_value:visit_date,
							visitor_groups:	visitor_groupDocs,	
							logger_user_name:"IMPORT"
					});
					
					//console.log("IMPORT "+museum,visits)
								
					Team.find({"museum_id":museum,"date_value":visit_date}).remove().exec(function(err, data) {
				
					 if(err) console.log('err' + err);
					})
						kpis.save(function (err) {
						 if(err) console.log('err' + err);
						
									setTimeout(function(){ cxcx() }, 2);
						});

					
			},function(){
			mongoose.connection.close()
			})
	})
		

