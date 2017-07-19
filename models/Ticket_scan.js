var mongoose = require('mongoose');

var Ticket_scan = new mongoose.Schema({
		
		  date: { type: Date, required: true },
		  museum_id: { type: String},		
		  exhibition: { type: String, required: true },
		  type:{ type: String, required: true },
		  result: { type: String, required: true }
		 
});

Ticket_scan.virtual('date_of_scan').get(function() {
 
				
			return   moment(this.date).format('DD/MM/YYYY');

});



Ticket_scan.set('toJSON', {
   virtuals: true
});
Ticket_scan.set('toObject', {
   virtuals: true
});


module.exports = mongoose.model('Ticket_scan', Ticket_scan);
