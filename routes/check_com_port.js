var express = require('express');
var router = express.Router();
var fs = require('fs');
var Port_checker=require('../data_loader/turnstiles/serialport-terminal.js');




router.get('/test', function(req, res, next) {
		
		data="ticket1"
		results=[]
		results.start=('checking database connection')	
		port_checker= new Port_checker("COM1")
		port_checker.open_port(function (result){
		console.log('open_port',result)	
			return res.json(result);
		})
})




module.exports = router;
