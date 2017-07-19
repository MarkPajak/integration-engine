var express = require('express');
var router = express.Router();
var json2csv = require('json2csv');
var fields = ['id', 'date_created'];



var options={
CLIENT_ID:"836155874661-uirsem5rdlco3u3rus9cv296kpj2k869.apps.googleusercontent.com",
CLIENT_SECRET:"sqnR3TG34kGBpVZ1oPWM3TIk",
REFRESH_TOKEN:"1/oVBeOV9938VFbfelgdQqgT983aKhLx7MlxTWq7b-BLDebS2XvN0jaihq_qIBgDIh",
access_token:"ya29.GlvbA_zrbquBJ-RkKNiFE0ILO5fIdsdrF0nBZIcedxW0rOz2c0BTMDbuv_rA1DOvF2Ldxs21CrGkVrZVbV79aH0ZOLBh7HAYXZG5pa5Cz0HVxFUBIThBC7vKf_53"}
 var winston = require('winston');
  require('winston-google-spreadsheet').GoogleSpreadsheet;
    winston.add(winston.transports.GoogleSpreadsheet, options);
  
var Tech_support = require('../models/Tech_support_trello.js');


const REFRESH_TOKEN = options.REFRESH_TOKEN;
const CLIENT_ID = options.CLIENT_ID;
const CLIENT_SECRET = options.CLIENT_SECRET;
const FILE_ID = '1m94GoebegyDk08nQ6XBDXHqfszVVouSzER4LVN3gKNQ';

var winston = require('winston');
require('winston-google-spreadsheet').GoogleSpreadSheet;

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
  var logger = new (winston.Logger)({
    'transports': loggers,
    'exceptionHandlers': loggers,
    'exitOnError': false
  });
  
   Tech_support.find().select('id date_created')
   .sort({'date_created': 'desc'})
     .exec(function(err, todos) {
  
     if (err) return (err);
  //  res.json(todos);
	// res.send(json2csv({ data: todos, fields: fields }))
  });

  logger.log('info', 'Test Log Message', { 'anything': 'This is metadata' });
})


module.exports = router;
