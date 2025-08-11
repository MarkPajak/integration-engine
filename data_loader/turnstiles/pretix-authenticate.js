pretix_authenticate = function(){
	
//setup instructions
/*
you need the Id of the checkin list in pretix
you also need the name of the event
api key is configured in the secrets folder and this is per team
*/


var fs = require('fs');
var keys=JSON.parse(fs.readFileSync('./secret/pretix_settings.JSON').toString());
var self = this
self.valid_tickets=[]
var request = require('request');
var async = require('async');
var eachAsync = require('each-async');
const querystring = require('querystring');
var _ = require('underscore');

var pretix_token=keys.api_token


var checkinlist = keys.checkinlist_id
var event_name = keys.event_name

//mod for WPY lates using secondary event and checkinlist MP 02.01.2025
var checkinlist2 = keys.checkinlist_id2
var event_name2 = keys.event_name2

//mod for WPY lates using secondary event and checkinlist MP 02.01.2025
var checkinlist3 = keys.checkinlist_id3
var event_name3 = keys.event_name3


var items =[]

var items_to_add= keys.limit_to_items.join(",")


self.connect = function(cb) {

const https = require('https')

const parameters = {
				item__in:items_to_add
			   
}










const get_request_args = querystring.stringify(parameters);
const options = {
 
 hostname: 'pretix.eu',
  path: '/api/v1/organizers/bristolmuseums/events/'+event_name+'/checkinlists/'+checkinlist+'/positions/?'+get_request_args,
  method: 'GET',
  //qs:"item__in=123456,1234",
  headers: {
     'Authorization': 'Token '+pretix_token
    } 
}
console.log(options)
const req = https.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`)
 let body=""
  res.on('data', chunk => {
   body += chunk;	
  })
  
  
   res.on("end", () => {
        try {
            let checklist_data = JSON.parse(body);
           
	        console.log('next',checklist_data.next)
	        console.log('adding first 50 tickets then starting pagination for the rest')
	  
		  _.each(checklist_data.results, function (line,i) {
					// add ticket codes to an array
					if(items_to_add.length>0 && items_to_add.indexOf(line.item)!=-1){
						console.log('limiting ticket database to pretix product with product ID'+line.item)
						self.valid_tickets.push(line.secret)	
					}
					else if( items_to_add.length==0){	
						self.valid_tickets.push(line.secret)
					}   				
			})

		if(checklist_data.next){
			console.log("..entering a freaky loop for a bit")
			 orders(checklist_data.next, function(){
			 console.log('finished')
			 })			 
		}
		
		
        } catch (error) {
            console.error(error.message);
        };
    
})

})

req.on('error', error => {
  console.error(error)
})

req.end()
console.log('finished eveything')
 cb( self.valid_tickets)
 //dev only delete this bi
		
		
}


//check pretix_settings.JSON for event ids and corresponding checkin lists - the app can validate against three different events using the below functions


self.single_ticket_test = function(ticketQR,cb){
	
	self._single_ticket_test(event_name,checkinlist,ticketQR,cb)	

}

self.single_ticket_test2 = function(ticketQR,cb){
	
	self._single_ticket_test(event_name2,checkinlist2,ticketQR,cb)
	
}

self.single_ticket_test3 = function(ticketQR,cb){
		
	self._single_ticket_test(event_name3,checkinlist3,ticketQR,cb)	

}



self._single_ticket_test = function(_event_name,_checkinlist,ticketQR,cb) {

const https = require('https')
const options2 = {
  hostname: 'pretix.eu',
  path: '/api/v1/organizers/bristolmuseums/events/'+_event_name+'/checkinlists/'+_checkinlist+'/positions/'+'?secret='+ticketQR,
   // path: '/api/v1/organizers/bristolmuseums/events/'+event_name+'/checkinlists/'+checkinlist+'/positions/'
 method: 'GET',
  headers: {
     'Authorization': 'Token '+pretix_token
  }
}		
console.log(options2.path)




const req = https.request(options2, res => {
 console.log(`statusCode: ${res.statusCode}`)

  let body=""
  res.on('data', chunk => {
   body += chunk;	
  })
  
  
   res.on("end", () => {
        try {
            let checklist_data = JSON.parse(body);
            //return count of matching tickets	
			console.log('found ' + checklist_data.count + ' matching tickets')			
			if(checklist_data.count==1){
					console.log('event item ' + checklist_data.results[0].item)		
if (items_to_add.length>0 && items_to_add.indexOf(checklist_data.results[0].item)!=-1) {
	
 cb(true)	
			}
			
		else if(items_to_add.length==0){
		 cb(true)		
		}
			else{
			 cb(false)	
			}
		
			} else{
				cb(false)
			}
        } catch (error) {
            console.error(error.message);
        };
    });
})

req.on('error', error => {
  console.error(error)
})

req.end()
// cb()
}














self.test_ticket = function(data) {
	
	open_serialport.simulate(data.ticket)
}

function orders(next_url,cb){
	
	
	
	var current_page = 0
	
	 function getNextset(next_url) {
			
			var return_product_type = ""

			request({
				url: next_url,
				timeout:5000,
				  headers: {
					'Authorization': 'Token '+pretix_token
				},
				
				//json: true
			}, function (error, response, body) {
					
				if (error) console.log(error)
				//if(response) console.log(response.statusCode)
				if (!error && response.statusCode === 200) {
	
						let checklist_data = JSON.parse(body);
						
						 _.each(checklist_data.results, function (line,i) {
								// add ticket codes to an arra
								if(items_to_add.length>0 && items_to_add.indexOf(line.item)!=-1){
									console.log('limiting ticket database to pretix product with product ID'+line.item)
									//console.log(line.secret)
									console.log(line.checkins)
									self.valid_tickets.push(line.secret)	
								}
								else if( items_to_add.length==0){
									self.valid_tickets.push(line.secret)		
								}   	
											
						})																		
	
			
						setTimeout(function (){
							if(checklist_data.next){
							getNextset(checklist_data.next)	
							}
							else
							{
							console.log('finished looping...',self.valid_tickets.length + " tickets found with priduct_ids "+items_to_add )
							cb( self.valid_tickets)
							}	
		
						}, 100);
						
					
					
				}
				
			})	
		}
		
getNextset(next_url)	
console.log(" we're going to download all tickets from the event for faster scanning - this could take a while")
}


}

module.exports = pretix_authenticate;