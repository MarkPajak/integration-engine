
//n.b. use crontab to schedul updates. will only update if specific trigger files found


var Route_functions = require('../functions/route_functions.js');





route_functions=new Route_functions()
var _ = require('underscore');
var express = require('express');
var router = express.Router();

var _ = require('underscore');
var json2csv =  require('json2csv');
Route_permissions= require('../functions/route_permissions.js');
route_permissions=new Route_permissions()

var venues=[]
var types=[]

var mongoose = require('mongoose');

var moment = require('moment');
var dbConfig = require('../../db');
// Connect to DB
if(process.env.test){
var config = require('./test/Config-debug');
	console.log("TEST MODE DEBUGGING")
	mongoose.connect(dbConfig.test);
}
else
{
mongoose.connect(dbConfig.url);
}


var Team = require('../../models/performance/Donations.js');
var Gidftaid = require('../../models/performance/Giftaid.js');
var Welcomedesk = require('../../models/performance/Welcomedesk.js');
var Patron = require('../../models/performance/Patron.js');
var Corporate = require('../../models/performance/Corporate.js');
var Donations_other = require('../../models/performance/Donations_other.js');
var Cache = require('../../models/cache/cache.js');
//aggregation

const fs = require("fs"); // Or `import fs from "fs";` with ESM


var paths=[]

paths.push( './routes/trigger_files/donations_kpis.txt')
paths.push(  './routes/trigger_files/donations_others.txt')
paths.push(  './routes/trigger_files/giftaid_kpis.txt')
paths.push(  './routes/trigger_files/patron_kpis.txt')
paths.push(  './routes/trigger_files/welcomedesk_kpis.txt')
paths.push(  './routes/trigger_files/corporate_kpis.txt')

runupdate=false

_.each(paths,function(path){
	if (fs.existsSync(path)) {
		runupdate=true
	}
	
})


if (runupdate==true) {
    console.log('trigger file exists')
	

			var req={
			params:""
				}
			route_functions.get_kpis( Team,Gidftaid,Welcomedesk,Patron,Corporate,Donations_other,req,function ( result) {
				console.log("here")
				var venues=[]
				_.each(result,function(row){
					if(venues.indexOf(row.kpi_venue)==-1){
						
						venues.push(row.kpi_venue)
					}
				})
				
				var types=[]
				_.each(result,function(row){
					if(types.indexOf(row.type)==-1){
						if(row.type){
								console.log(row.type)
								types.push(row.type)
						}
					}
				})
					
					
				var returned_data=[]
				returned_data=route_functions.sort_data(result,venues,types,returned_data)
				
				route_functions.datacache(Cache,returned_data)
			//
				//console.log(returned_data)
				mongoose.connection.close()
			})
			
			_.each(paths,function(path){


	try {
  fs.unlinkSync(path)
  //file removed
} catch(err) {
  console.error(err)
}

})



}
else
{
	  console.log('trigger file not found')
	  mongoose.connection.close()
}		


module.exports = router;

//mongoose.connection.close()	

