
/* eslint-disable require-path-exists/exists */
'use strict';
var open_turnstile = function (valid_ticket_types){

var SerialPort = require('serialport');


var mongo = require('mongodb'),
  Server = mongo.Server,
  Db = mongo.Db;

var server = new Server('localhost', 27017);



const args = require('commander');
function makeNumber(input) {
  return Number(input);
}



var open_turnstile_command= "OPEN THE GATES!!!"



var self=this
args
   .usage('-p <port> [options]')
  .description('A basic terminal interface for communicating over a serial port. Pressing ctrl+c exits.')
  .option('-l --list', 'List available ports then exit')
  // TODO make the port not a flag as it's always required
  .option('-p, --port <port>', 'Path or Name of serial port',"COM1")
  .option('-b, --baud <baudrate>', 'Baud rate default: 9600', makeNumber, 9600)
  .option('--databits <databits>', 'Data bits default: 8', makeNumber, 8)
  .option('--parity <parity>', 'Parity default: none', 'none')
  .option('--stopbits <bits>', 'Stop bits default: 1', makeNumber, 1)
  // TODO make this on by default
  .option('--echo --localecho', 'Print characters as you type them.')
  .parse(process.argv);
  const openOptions = {
    baudRate: args.baud,
    dataBits: args.databits,
    parity: args.parity,
    stopBits: args.stopbits
  };
  const port = new SerialPort("/dev/ttyS0", openOptions);
 // const port = new SerialPort("COM1", openOptions);
  const parsers = SerialPort.parsers;
  
  
 function validate_Ticket(ticket_qr){
	

			if(valid_ticket_types.csvTickets.indexOf(ticket_qr.toString())!=-1){									
				console.log('ticket validated against file')
return true;				
			}	
			else{
				console.log('not found in csv tickets')
				
			}


}

  
self.listen_data = function(shopify_transaction) {
	

			port.on('data', (data) => {
			self.simulate(shopify_transaction,data)
			})
}

self.use_ticket = function(ticket) {
	
	
	
		var doc = {_id:ticket, date_scanned:new Date(),scan_attempts:1};
		console.log('adding ticket to database');
		if(!server) var server = new Server('localhost', 27017);
		// retrieve a database reference
		var dbref2 = new mongo.Db('tickets', server);

		// connect to database server
		dbref2.open(function(err, dbref2) {
			// now a connection is established
		if(err) {console.log(err)}
		else{
		// retrieve a collection reference
		dbref2.collection('myCollectionName', function(err, collectionref) { 
		// this is an asynchroneous operation
		
			
			// find exactly one item in a collection which has foo:"bar"
			collectionref.insert(doc, function (err, result) {
			if(err) console.log(err)
				console.log(result)
			console.log('---------------------------------------------------------------------------------------');
			});
				
		
		});
		
		// close a database connection
		dbref2.close();
		}
		});

}
	
	
	



	


  
self.simulate = function(shopify_transaction,data) {
	
	console.log('---------------------------------------------------------------------------------------');
	console.log('Received: \t', data);
	
	self.check_ticket_history(data, function(test) {

		if(!test){	
				
				if(validate_Ticket(data)){
					console.log('ticket is valid')
					open_serialport.openPort()
					self.use_ticket(data)
				}
				else
				{
				shopify_transaction.count_all_orders(data, function(cb) {
				if(cb==1){
					console.log('ticket validated against shopify')
					open_serialport.openPort()
					self.use_ticket(data)
				}	
				})
				}
		}
		else{
			
			//ticket already validated
		}
	})

}


self.check_ticket_history = function(data,cb,dontsave) {
	

		console.log('checking ticket history');
	if(!server) var server = new Server('localhost', 27017);
		// retrieve a database reference
		var dbref = new mongo.Db('tickets', server);

		// connect to database server
		dbref.open(function(err, dbref) {
			// now a connection is established
		
		// retrieve a collection reference
		dbref.collection('myCollectionName', function(err, collectionref) { 
			// this is an asynchroneous operation
		
		
		// find exactly one item in a collection which has foo:"bar"
		collectionref.findOne({_id:data}, function(err, doc) {
			// no cursor object is needed
			if(err) console.log(err)
			
			if(doc) {
					console.log('ticket found - '+doc.scan_attempts +' attpemted scans' )
					console.log('ticket already redeemed - cancel operation')
					console.log('				                                  FAIL');
					// replace the foo field on all objects where foo:"bar"
					if(doc.scan_attempts){
					var u = doc.scan_attempts+1
					}
					else{
					var u = 1	
					}
					if(!dontsave){
					collectionref.update(doc, {scan_attempts:u,date_last_attempt: new Date()},function (err) {
						console.log('ticket details updated')
						if(err) console.log(err)
					});
					}
			
			}
			
			cb(doc)
		// close a database connection
		dbref.close();
		});
				
		
		});
		
		
		});

}




function listPorts() {
  SerialPort.list((err, ports) => {
    if (err) {
      console.error('Error listing ports', err);
    } else {
      ports.forEach((port) => {
        console.log(`${port.comName}\t${port.pnpId || ''}\t${port.manufacturer || ''}`);
      });
    }
  });
};





self.openPort = function() {
 console.log('open seriall port using command: '+open_turnstile_command)
	  port.write(open_turnstile_command, function(err) {
		if (err) {
		  return console.log('Error on write: ', err.message);
		}
		console.log('command sent                                                     SUCCESS');
		//log id to database
	  });



}
}

module.exports= open_turnstile

