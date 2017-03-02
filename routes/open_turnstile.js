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



if(req.query.ticket!=""){
	global.port_controller.test_ticket(req.query,function(result){
	var returned = []
	returned.date = new Date()
		returned.result=result 		
		return res.json(returned)
	})

}
else
{
	
	global.port_controller.openPort(req.query,function(result){
	var returned = []
	returned.date = new Date()
		returned.result=result 		
		return res.json(returned)
	})
	
	}

})





module.exports = router;
