var mongoose = require('mongoose');

var Ticket_scan = new mongoose.Schema({
		
		  date: { type: Date, required: true },
		  exhibition: { type: String, required: true },
		  type:{ type: String, required: true },
		  result: { type: String, required: true }
		 
});


module.exports = mongoose.model('Ticket_scan', Ticket_scan);
