var express = require('express');
var router = express.Router();
var shopifyAPI = require('shopify-node-api');
var fs = require('fs');
var Open_serialport = require('.data_loader/turnstiles/serialport-terminal.js');

var moment = require('moment');

var allkeys=JSON.parse(fs.readFileSync('./secret/api_keys.JSON').toString());

 
function product_type_from_id(res,product_id,order_date){
	
		
}

function orders(res){
	
	
}


/* GET home page. */
router.get('/', function(req, res, next) {
	
	


})



module.exports = router;
