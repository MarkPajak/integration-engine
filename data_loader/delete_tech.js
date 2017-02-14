var express = require('express');
var router = express.Router();
var shopifyAPI = require('shopify-node-api');
var fs = require('fs');
var keys=JSON.parse(fs.readFileSync('./secret/api_keys.JSON').toString());
var request = require('request');
var moment = require('moment');
var _ = require('underscore');


var Tech_support = require('../models/Tech_support_trello.js');
var dbConfig = require('../db');
var mongoose = require('mongoose');
mongoose.connect(dbConfig.url);



module.exports = router;
