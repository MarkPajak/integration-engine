/*
TODO
- pass result of serial port listening to angular app
- prelimirary tests to check shopify
- speed testing
 
*/

var express = require('express');
var router = express.Router();
var shopifyAPI = require('shopify-node-api');
var fs = require('fs');
var Turnstiles_web_controller= require('../data_loader/turnstiles/turnstile-controller.js');

var moment = require('moment');

var allkeys=JSON.parse(fs.readFileSync('./secret/api_keys.JSON').toString());


/* GET home page. */
router.get('/', function(req, res, next) {
	
	console.log(req.query)
	var Turnstiles = new Turnstiles_web_controller()
	Turnstiles.connect()	
	Turnstiles.test_ticket(req.query).then(function(result){
		res.json('backatcha')
	})

})



module.exports = router;
