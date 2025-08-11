turnstiles_web_controller = function(){
	
//setup instructions
/*
register a new private app for the store
add the api key and password to secret/api_keys.json
check names match in shopify_checkorder
install git
install node
install mongodb
*/

//usage
/*
WORKING
QR code   = order id
when an order id is scanned, the app will check the order in pretix ans see if there is a validticket type against the order
once validated, a command is sent to the COM port


TODO
log each scanned QR code with datestamp to a csv

*/

var self = this

//


var valid_tickets_from_file=require('./csv-ticket-codes.js');
var shopify_checkorder=require('../shopify/shopify_checkorder.js');
var database = require('./database.js');
var Pretix = require('./pretix-authenticate.js');



self.connect = function(port,cb) {

	
		database= new database()
		pretix= new Pretix()
		
	pretix.connect(function(online_tickets){ //N.B. need a workaround for new ticket purchases

		database.connect(function(scanned_tickets){

		valid_tickets_from_file= new valid_tickets_from_file()

		valid_tickets_from_file.load_tickets(function (csv_tickets){
			
				
			console.log('    |/   \|')
			console.log('     \\()//')
			console.log('    //(  )\\')
			console.log('    |\ "" /|')

			online_tickets=csv_tickets.concat(online_tickets)
			console.log('adding online tickets to preprinted tickets.')
			//console.log( online_tickets.filter(i => i === 2).length + " tickets now in database")
			var valid_ticket_types = []
			valid_ticket_types.product_id = 8593353416
			valid_ticket_types.product_type = "Exhibition ticket"
			valid_ticket_types.csvTickets = online_tickets
			valid_ticket_types.ticketfile = csv_tickets
			//valid_ticket_types.scanned_tickets = scanned_tickets

			global.valid_ticket_types=valid_ticket_types
				
		
		})
	})
		
		
		})

}
self.test_ticket = function(data) {
	
	open_serialport.simulate(data.ticket)
}


self.simulate = function() {

setTimeout(function (){
	
	var i=0
	
	var shopify=4548779848 
	var csv_file="ticket1"
	var csv_file2="QWERTY18"
	
	
	var test_tickets = []
	test_tickets[0]=shopify
	test_tickets[1]=csv_file
	test_tickets[2]=csv_file2
	
	setInterval(function(){
		if(i>=test_tickets.length) i=0
		open_serialport.simulate(test_tickets[i])
		i++ 
		}, 5000);
	
}, 5000);


}

}

module.exports = turnstiles_web_controller;