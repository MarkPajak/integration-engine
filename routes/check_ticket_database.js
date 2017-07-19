var express = require('express');
var router = express.Router();
var fs = require('fs');
var Ticket_checker=require('../data_loader/turnstiles/ticket-database.js');




router.get('/test', function(req, res, next) {
	

		
		data="ticket1"
		results=[]
		results.start=('checking database connection')	
		ticket_checker= new Ticket_checker()
		
		ticket_checker.check_ticket_history(data, function(result) {
		
			return res.json(result);
		})

})




module.exports = router;
