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
when an order id is scanned, the app will check the order in shopify ans see if there is a validticket type against the order
once validated, a command is sent to the COM port

TODO
list of validated orders need to be logged to allow one time entry (logged aftter x minutes)
upload qr code data from pre printed tickets to also validate against
investigate event espresso api for ticket QR codes also
user interface to view valdation data
load listener on pc reboot
log errors to google docs for remote monitoring

*/

var self = this

//


var valid_tickets_from_file=require('./csv-ticket-codes.js');
var shopify_checkorder=require('../shopify/shopify_checkorder.js');
var database = require('./database.js');


self.connect = function(port) {

	
		database= new database()


		database.connect(function(scanned_tickets){

				valid_tickets_from_file= new valid_tickets_from_file()

				valid_tickets_from_file.load_tickets(function (csv_tickets){
					
					
				console.log('    ||   ||')
				console.log('     \\()//')
				console.log('    //(__)\\')
				console.log('   ||     ||')


					var valid_ticket_types = []
					valid_ticket_types.product_id = 8593353416
					valid_ticket_types.product_type = "Exhibition ticket"
					valid_ticket_types.csvTickets = csv_tickets
					valid_ticket_types.scanned_tickets = scanned_tickets

					//open_serialport=new Open_serialport(valid_ticket_types)
					//shopify_transaction=new shopify_checkorder(valid_ticket_types)

					//vopen_serialport.listen_data(shopify_transaction)
					
	//from web app
	var check_com_port = require('../../routes/check_com_port')
	var open_turnstile = require('../../routes/open_turnstile')
	
	// open errors will be emitted as an error event
	global.port=port
	global.port_controller = port_control
	port_control.listen_data(valid_ticket_types)
	
	
	app.use('/check_com_port', check_com_port)
	app.use('/open_turnstile', open_turnstile);
	port.on('open', function() {
    port.write('main screen turn on', function(err) {
    
	if (err) {
      return console.log('Error on write: ', err.message);
    }
    console.log('message written');
  });
});



// open errors will be emitted as an error event
port.on('error', function(err) {
  console.log('Error: ', err.message);
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
	
	i++ }, 5000);
	
}, 5000);


}

}

module.exports = turnstiles_web_controller;