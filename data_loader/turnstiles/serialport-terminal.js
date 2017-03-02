
'use strict';



var open_turnstile = function (valid_ticket_types){

var self=this
this.open_port   = function (){

var SerialPort = require('serialport');
var Shopify_checkorder  = require('../shopify/shopify_checkorder');
var fs = require('fs');
var keys=JSON.parse(fs.readFileSync('./secret/api_keys.JSON').toString());
var shopify_transaction=new Shopify_checkorder(keys,valid_ticket_types)
var mongo = require('mongodb'),
 Server = mongo.Server,
  Db = mongo.Db;

 global.server = new Server('localhost', 27017);



const args = require('commander');
function makeNumber(input) {
  return Number(input);
}



global.open_turnstile_command= "G2:01"



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
  
  try
  {
	//const port = new SerialPort("/dev/ttyS0", openOptions);
	const port = new SerialPort("COM1", openOptions);
    const parsers = SerialPort.parsers;
	return port
  }
  catch(err)
  {
  return err
  }
  
  
 function validate_Ticket(ticket_qr){
	

			if(valid_ticket_types.csvTickets.indexOf(ticket_qr.toString())!=-1){									
				console.log('ticket validated against file')
return true;				
			}	
			else{
				console.log('not found in csv tickets')
				
			}


}

}




  
  
  
self.listen_data = function() {
	
			
			global.port.on('data', (data) => {
			self.simulate(data)
			})
			return port
}

self.use_ticket = function(ticket) {
	
	
	
		var doc = {_id:ticket, date_scanned:new Date(),scan_attempts:1};
		console.log('adding ticket to database');
	
		// retrieve a database reference
		var dbref2 = new mongo.Db('tickets' , global.server);

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
	
	
	



	


  
self.simulate = function(data) {
	
	console.log('---------------------------------------------------------------------------------------');
	console.log('Received: \t', data);
	
	self.check_ticket_history(data, function(test) {

		if(!test){	
				
				if(validate_Ticket(data)){
					console.log('ticket is valid')
					self.openPort()
					self.use_ticket(data)
				}
				else
				{
				shopify_transaction.count_all_orders(data, function(cb) {
				if(cb==1){
					console.log('ticket validated against shopify')
					self.openPort()
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

		// retrieve a database reference
		var dbref = new mongo.Db('tickets', global.server);

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

self.test_ticket = function(settings,cb) {
//3. user sends open command with ticket data from web app	 >> test ticket and open gates
self.simulate(settings.ticket)
}



self.openPort = function(settings,cb) {

	//3 scenarios here
	//1. open command when web app load up		 >> dont open gates
	//2. user sends open command from web app	 >> open gates
	//3. visitor scanns ticket					 >> open gates

	  console.log(settings)
	  console.log('open serial port using command: '+settings.command)
	  
	  port.write(settings.command, function(err) {
		if (err) {
		   console.log('Error on write: ', err.message);
		   cb( err)
		}
		 console.log('command sent                                SUCCESS');
		cb("OPEN")
	  });

}
}

module.exports= open_turnstile

