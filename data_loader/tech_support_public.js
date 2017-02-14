var express = require('express');
var router = express.Router();
var json2csv = require('json2csv');
var fields = ['id', 'date_created'];
var googe_keys=JSON.parse(fs.readFileSync('./secret/google_drive.JSON').toString());


var options={
	CLIENT_ID:googe_keys.CLIENT_ID
	CLIENT_SECRET:googe_keys.CLIENT_SECRET,
	REFRESH_TOKEN:googe_keys.REFRESH_TOKEN,
	access_token:googe_keys.access_token
}


 var winston = require('winston');
  require('winston-google-spreadsheet').GoogleSpreadsheet;
    winston.add(winston.transports.GoogleSpreadsheet, options);
  
var Tech_support = require('../models/Tech_support_trello.js');
var dbConfig = require('../db');
var mongoose = require('mongoose');
// Connect to DB
mongoose.connect(dbConfig.url);

const REFRESH_TOKEN = options.REFRESH_TOKEN;
const CLIENT_ID = options.CLIENT_ID;
const CLIENT_SECRET = options.CLIENT_SECRET;
const FILE_ID = '1m94GoebegyDk08nQ6XBDXHqfszVVouSzER4LVN3gKNQ';




var async = require('async'),
    events = require('events'),
    GoogleTokenProvider = require('refresh-token').GoogleTokenProvider;
    

async.waterfall([
  function(callback) {
    var tokenProvider = new GoogleTokenProvider({
      'refresh_token': REFRESH_TOKEN,
      'client_id': CLIENT_ID,
      'client_secret': CLIENT_SECRET
    });
    tokenProvider.getToken(callback);
  },
  
  function(accessToken, callback) {
    var ssLogger = new (winston.transports.GoogleSpreadsheet)({
      'fileId' : FILE_ID,
      'level' : 'info',
      'accessToken': accessToken,
      'refreshToken': REFRESH_TOKEN,
      'clientId': CLIENT_ID,
      'clientSecret': CLIENT_SECRET
    });
    
    var consoleLogger = new (winston.transports.Console)({
      'timestamp': true,
      'level' : 'info',
      'json' : true,
      'prettyPrint' : true,
      'colorize' : true
    });
    callback(null, [ssLogger, consoleLogger])
  }
], function(err, loggers) {

   Tech_support.find().select('id date_created')
   .sort({'date_created': 'desc'})
     .exec(function(err, todos) {
	if (err) return next(err);


for (var name in todos) {
    var logger = new (winston.Logger)({
    'transports': loggers,
    'exceptionHandlers': loggers,
    'exitOnError': false
  });
     logger.log('info', todos[name].duration, todos[name]);
	
	 
}
	})
 
	
	
  

})


module.exports = router;
