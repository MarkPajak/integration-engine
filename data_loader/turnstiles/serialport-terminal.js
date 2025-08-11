open_turnstile = function (valid_ticket_types){
var request = require("request");
var self=this
var mongo = require('mongodb'),
  Server = mongo.Server,
  Db = mongo.Db;
var fs = require('fs');
var keys=JSON.parse(fs.readFileSync('./secret/api_keys.JSON').toString());
var settings=JSON.parse(fs.readFileSync('./secret/pretix_settings.JSON').toString());
var server = new Server('localhost', 27017);
var Shopify_checkorder  = require('../shopify/shopify_checkorder');
var shopify_transaction=new Shopify_checkorder(keys,valid_ticket_types)

var Pretix = require('./pretix-authenticate.js');

var Save_csv = require('./save-csv.js');

save_csv=new Save_csv()


save_csv.savecsv('save cheese')

this.open_port   = function (){

var SerialPort = require('serialport');

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
  .option('autoOpen', true)
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


	port.on('open',function() {
		console.log('Port open');
	  });
	  
	return port
  }
  catch(err)
  {
  return err
  }
  
  


}
self.log_access_attempt =  function(data){
	  
		 console.log("remote_ticket_log",keys[process.env.venue].remote_ticket_log)
		 
		 
          return request({
				  uri: "https://"+keys[process.env.venue].remote_ticket_log+"/turnstiles_logging",
				  method: "POST",
				  form: data
				}, function(error, response, body) {
				  if (error){
					 console.log("ERROR" + error)
				  }
					  else{
						
						
						console.log(response.statusCode);
					  }
				});
						  

}

self.validate_Ticket=function(ticket_qr){
	console.log("allow_any_code set to" + settings.allow_any_code)
		if(settings.allow_any_code=="true"){
			console.log("we're letting 'em all through wohoo")
			
				return true; //HACK to allow any ticket through!!!!

		}
		else
		{

			if(global.valid_ticket_types.csvTickets.indexOf(ticket_qr.toString())!=-1){									
				console.log('we found the ticket in the database')
				global.buffer=""
				return true; //n.b. not finished as we need to log it as used now
			}	
			else{
				console.log('not found in csv tickets')
				global.buffer=""
			}
		}


}

  
  
  
self.listen_data = function() {
	
		
			global.buffer = '';
    global.port.on('data', function(chunk) {
		
		//console.log(chunk)
	
	if(chunk.indexOf("R2:")>=0){ 
	//	console.log('this looks like the beginning of a chunk' + chunk)
		global.buffer = ''
	}; 
		
		
        global.buffer += chunk;
      
		var answers = global.buffer.split('\n'); // Split data by new line character or smth-else
        global.buffer = answers.pop(); // Store unfinished data
		
		console.log('meep meep I see data coming')
	
        
		
	//	if (/[a-z]/i.test(chunk) && global.buffer!=chunk) { //old code pre 2021
		if (global.buffer!=chunk) {  //we need a test to see if we reachth the end of a chunk
		
			result=global.buffer.replace("R2:","").trim();
			console.log(" ----------------------incoming code------------------")	
			console.log( result)	
			if(result.length==32){  //add any string test for the type of code you want to be valid here
				console.log("we think this is a pretix ticket")
				self.simulate(result)
				global.buffer = ''
			}
			else{
				console.log('meep meep this isnt a ticket code :(')
			}
		}		 
		
    });
			
			
			/*
			
			global.port.on('data', (data) => {

				console.log('port received data' + data)
			//self.simulate(data)
			})
			return port
			
			*/
}

self.log_ticket = function (ticket,action){
	
	console.log('logging ticket to remote');
	 var doc ={ date:new Date(),
					exhibition:"CONSTABLE",
					type: ticket,
					result: action
				  }

		//var scan = new self.log_access_attempt(doc)
}

self.use_ticket = function(ticket,success) {
	
		console.log('adding ticket to database');
		var doc = {_id:ticket, date_scanned:new Date(),scan_attempts:1,status_code:success};
		 
		
		if(!server) var server = new Server('localhost', 27017);
		// retrieve a database reference
		var dbref2 = new mongo.Db('tickets', server);

		// connect to database server
		dbref2.open(function(err, dbref2) {
			// now a connection is established
		if(err) {console.log(err)}
		
		// retrieve a collection reference
		dbref2.collection('myCollectionName', function(err, collectionref) { 
		// this is an asynchroneous operation
		
			//if(settings.multiple_scans=="false"){
			// find exactly one item in a collection which has foo:"bar"
			
	  collectionref.update({_id:ticket}, {
	  $setOnInsert: doc }, {upsert: true})

			collectionref.insert(doc, function (err, result) {
			//if(err) console.log(err)
		//	console.log(result)
			console.log('---------------------------------------------------------------------------------------');
			});
	
		//	}				
	
		});
		
		// close a database connection
		dbref2.close();
		
		});

}
	
	
	
var this2=self


	
self.check_if_pretix_ticket = function(data) {

if( data.length==32){console.log('looks like a pretix ticket');
 return true}
else{console.log('not a pretix ticket');
 return false;
 }
	
}

	

  
self.simulate = function(data) {
	
	console.log('---------------------------------------------------------------------------------------');
	console.log('Received: \t', data);
	
	self.check_ticket_history(data, function(test) {

		if(!test){	
				
				if(self.validate_Ticket(data)){
					console.log('ticket is valid in saved ticket database')
					self.openPort("", function(err) {
					self.use_ticket(data,"open") //need this for when a code is first scanned - it needs adding to database for number of attempts to start logging
						})
					
				}
				else
				{
				
					//2021 pretix mod
					pretix= new Pretix()
					pretix2= new Pretix()
					pretix3= new Pretix()
					var data2 = data
			
				  if(self.check_if_pretix_ticket(data) && pretix.single_ticket_test(data, function(cb) {
					if(cb==true){
						console.log('ticket is valid in live pretix database')
						self.openPort("", function(err) {	
						self.use_ticket(data,"open")	
					})
					}
					else{
						console.log('no match...checking wpy lates')
						pretix2.single_ticket_test2(data2, function(cb2) {
						if(cb2==true){
							console.log('supplementary ticket is valid')
								this2.openPort("", function(err) {						
								this2.use_ticket(data,"open")
							})
							}
							else{			
									pretix2.single_ticket_test3(data2, function(cb2) {
									console.log('no match...checking yoga mornings')
									if(cb2==true){
										console.log('supplementary 3 ticket is valid')
										this2.openPort("", function(err) {						
										this2.use_ticket(data,"open")
										})
										}

										else{console.log('cannot match ticket to live database')


										pretix3.single_ticket_test4(data2, function(cb2) {
											console.log('no match...checking next event ')
											if(cb2==true){
												console.log('supplementary 4 ticket is valid')
												this2.openPort("", function(err) {						
												this2.use_ticket(data,"open")
												})
												}
		
												else{
												
												
													pretix3.single_ticket_test5(data2, function(cb2) {
														console.log('no match...checking next event ')
														if(cb2==true){
															console.log('supplementary 5 ticket is valid')
															this2.openPort("", function(err) {						
															this2.use_ticket(data,"open")
															})
															}
					
															else{
															
															
															console.log('cannot match ticket to live database')
															console.log("We're giving up on this one.............................FAIL")
															this2.use_ticket(data,"FAIL")
														
														
														
														
														
														
				
														}
														})


												//console.log('cannot match ticket to live database')
												//console.log("We're giving up on this one.............................FAIL")
												//this2.use_ticket(data,"FAIL")
											
											
											
											
											
											
	
											}
											})



										
										//console.log("We're giving up on this one.............................FAIL")
										//this2.use_ticket(data,"FAIL")
										}
									})
								}
						})
					}
				}))

				console.log('not looking at shopify here')
				global.buffer=""
				
				//do a live pretix ticket check if it looks like a valid pretix ticket code AND it isnt in the database already
				
				/*
				shopify_transaction.count_all_orders(data, function(cb) {
				if(cb==1){
					console.log('ticket validated against shopify')
					self.openPort("", function(err) {})
					self.use_ticket(data)
				}	
				})
				*/
			
			}
		}
		else{
			
			//ticket already validated
		}
	})

}


self.check_ticket_history = function(data,cb,dontsave) {
	
		console.log('checking ticket history');
		console.log('settings.multiple_scan set to' + settings.multiple_scans);
		
		if(settings.multiple_scans=="true"){	
		 cb() ///allow multiple scans hack n.b. we want to track the date of failed scans and how many
		}
		else{
		
		
	if(!server) var server = new Server('localhost', 27017);
		// retrieve a database reference
		var dbref = new mongo.Db('tickets', server);

		// connect to database server
		dbref.open(function(err, dbref) {
			// now a connection is established
		console.log('connected to database')
		// retrieve a collection reference
		dbref.collection('myCollectionName', function(err, collectionref) { 
			// this is an asynchroneous operation
		console.log('searching database')
		
		// find exactly one item in a collection which has foo:"bar"
		collectionref.findOne({_id:data}, function(err, doc) {
			console.log('search returned')
			
			// no cursor object is needed
			if(err) console.log(err)
			
			if(doc) {
					console.log('this ticket has already had '+doc.scan_attempts +' attpemted scans' )
					
					
					// replace the foo field on all objects where foo:"bar"
					if(doc.scan_attempts){
					var u = doc.scan_attempts+1
					var date_first_scan = doc.date_first_scan || new Date()
					}
					else{
					var u = 1	  //first scan 
					var date_first_scan = new Date()
					}
					if(!dontsave){
						
						collectionref.updateOne({_id:doc._id}, {date_first_scan: date_first_scan, scan_attempts:u, date_last_attempt: new Date()},function (err) {
							
							console.log('ticket details updated   cb')
							
							if(err) console.log(err)
								
						if(u<=settings.maximum_scans_per_ticket) {
						
							console.log("we're letting up to " + settings.maximum_scans_per_ticket + " scan attempts at the moment")
							cb() ///empty callback sends success signal
							dbref.close();
						}else{
							console.log("maximum scan limit exceeded")
							var date_of_first_scan
							date_of_first_scan = doc.date_first_scan
							console.log(doc)
							console.log("ticket first scanned on " + date_of_first_scan)
							var diff = Math.floor((Date.parse( new Date()) - Date.parse(date_of_first_scan)) / 86400000);
							console.log("days since first scan " + diff)
							console.log('				                                  FAIL');
							console.log('-----------------------------------------------------');
							cb(doc) //callback with data tells system not to open gates
							dbref.close();
						}
						});
					}
					
			
			}
			else{ //this ticket hasnt been scanned before ...could be valid or invalid
			
			 cb(doc) //return info if ticket is use once olny
			// close a database connection
			dbref.close();
			}
		
		});
		//dbref.close();		
		
		});
		
		
		});
		}
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

	  console.log(global.open_turnstile_command)
	  console.log('open serial port using command: '+global.open_turnstile_command)
	  
	  port.write(global.open_turnstile_command, function(err) {
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

