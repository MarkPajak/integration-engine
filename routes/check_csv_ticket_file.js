var express = require('express');
var router = express.Router();
var fs = require('fs');
var valid_tickets_from_file=require('../data_loader/turnstiles/csv-ticket-codes.js');
valid_tickets_from_file= new valid_tickets_from_file()



router.get('/test', function(req, res, next) {
	



	
		
		valid_tickets_from_file.load_tickets(function (csv_tickets){
			
		var result = {count:0}
		result.count=csv_tickets.length
			return res.json(result);
		})

})




module.exports = router;
