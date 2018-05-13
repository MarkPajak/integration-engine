//fixes databasey problems due to timezone issues and dates logged as datetimes getting aggregated to wrong day

var express = require('express');
var Route_functions = require('../../routes/functions/route_functions.js');
route_functions=new Route_functions()
var router = express.Router();
var _ = require('underscore');
var visits = require('../../models/Kpi_log.js');
var Donations = require('../../models/performance/Donations.js');
var Events = require('../../models/performance/Events.js');
var Exhibitions_pwyt = require('../../models/performance/Exhibitions_pwyt.js');
var Gallery_visits = require('../../models/performance/Gallery_visits.js');
var Giftaid = require('../../models/performance/Giftaid.js');
var Learning = require('../../models/performance/Learning.js');
var Operations = require('../../models/performance/Operations.js');
var Retail_sales = require('../../models/performance/Retail_sales.js');
var Welcomedesk = require('../../models/performance/Welcomedesk.js');


//var Kpi_data_loader = require('../data_loader/kpi/kpi_aggregate.js');
var moment = require('moment');
var dbConfig = require('../../db');
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var bcrypt = require('bcrypt-nodejs');
var async = require('async');

var winston = require('winston');
	var async = require('async');

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

incrementDates('visits',visits, function(){
	
	//console.log('visits done')
	incrementDates('Donations',Donations, function(){	
	//console.log('Donations done')
		incrementDates('Events',Events, function(){	
	//console.log('Events done')
			incrementDates('Exhibitions_pwyt',Exhibitions_pwyt, function(){	
	//console.log('Exhibitions_pwyt done')
				incrementDates('Gallery_visits',Gallery_visits, function(){	
	//console.log('Gallery_visits done')
					incrementDates('Giftaid',Giftaid, function(){	
	//console.log('Giftaid done')
						incrementDates('Learning',Learning, function(){	
	//console.log('Learning done')
							incrementDates('Operations',Operations, function(){	
	//console.log('Operations done')
								incrementDates('Retail_sales',Retail_sales, function(){	
	//console.log('Retail_sales done')
									incrementDates('Welcomedesk',Welcomedesk, function(){
mongoose.connection.close()										
	//console.log('Welcomedesk done')

})
})	
})	
})	
})	
})	
})	
})	
})
})


function incrementDates(_model,model,cb){
var bad_date_countyer=0

  model.find()
	   .exec (  function (err, todos) {
    if (err) console.log(err)
				async.eachSeries(todos, function updateObject (obj, done) {
				
					// Model.update(condition, doc, callback)
					if(moment(obj.date_value).format("hh")=="12"){
					bad_date_countyer++
					model.update({ _id: obj._id }, { $set : { date_value: obj.date_value.setHours(obj.date_value.getHours()+1) }}, done);
					}
					else
					{

						setTimeout(function (){	done()}, 5); 
						
					}
				}, function allDone (err) {
					console.log(_model+ " all done..." + bad_date_countyer + " bad dates found" )
						cb()
				});
	
	
	

  })
}
  
