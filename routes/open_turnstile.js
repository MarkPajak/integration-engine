/*
TODO
- pass result of serial port listening to angular app
- prelimirary tests to check shopify
- speed testing
 
*/

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	
	global.port_controller.openPort(function(result){
		res.json('backatcha')
	})

})



module.exports = router;
