
/* eslint-disable require-path-exists/exists */
'use strict';
var ticket_database = function (valid_ticket_types){



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
	

			//port.on('data', (data) => {
			//self.simulate(shopify_transaction,data)
			//})
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
		});

}
	
	
	



	


  
self.simulate = function(shopify_transaction,data) {
	
	console.log('---------------------------------------------------------------------------------------');
	console.log('Received: \t', data);
	
	self.check_ticket_history(data, function(test) {

		
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
		
	
	})

}


self.check_ticket_history = function(data,cb) {
		
	
			var result=[]
		  result.push('checking ticket history for '+data )
	
	if(!server) var server = new Server('localhost', 27017);
		// retrieve a database reference
		var dbref = new mongo.Db('tickets', server);

		// connect to database server
		dbref.open(function(err, dbref) {
			if(err) return cb(err)
			// now a connection is established
		result.push('connection is established')
		if(err)	{		result.push(err)
		}
				else
				{
		
		// retrieve a collection reference
		dbref.collection('myCollectionName', function(err, collectionref) { 
		
		collectionref.findOne({_id:data}, function(err, doc) {
			if(err) return cb(err)
			if(doc) {
				result.push(doc)
			}
			else
			{
				result.push(  data +'not found in database')
			}
			
		// close a database connection
		dbref.close();
	
		 return cb(result)
		});
				
		//cb(message)
		
		});
		
	}
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





self.openPort = function(settings) {
console.log(settings)
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

module.exports= ticket_database

