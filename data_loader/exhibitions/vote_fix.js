//fixes databasey problems due to timezone issues and dates logged as datetimes getting aggregated to wrong day

var express = require('express');
var Route_functions = require('../../routes/functions/route_functions.js');
route_functions=new Route_functions()
var router = express.Router();
var _ = require('underscore');
var votes = require('../../models/exhibitions/bristol_muisic_top_40.js');


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

incrementDates('votes',votes, function(){
	

})


function incrementDates(_model,model,cb){
var bad_date_countyer=0

  model.find()
	   .exec (  function (err, todos) {
    if (err) console.log(err)
				async.eachSeries(todos, function updateObject (obj, done) {
				
					// Model.update(condition, doc, callback)
					if(obj.track=="Select a track or add new..."){
					bad_date_countyer++
					model.remove({ _id: obj._id }, done);
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
  
