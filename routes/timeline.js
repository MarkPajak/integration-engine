var express = require('express');
var router = express.Router();
Route_permissions= require('./functions/route_permissions.js');
route_permissions=new Route_permissions()
var Route_functions = require('./functions/route_functions.js');
route_functions=new Route_functions()
Api_calls= require('./functions/standard_api_calls.js');
var _ = require('underscore');
var request = require('request');
var moment = require('moment')
var Timeline = require('../models/Timeline.js');


/* GET /todos listing. */
router.get('/', function(req, res, next) {
  Timeline.find()
   .sort({'date': 'desc'})
     .exec(function(err, todos) {
  
     if (err) return next(err);
    res.json(todos);
  });
});


router.get('/calendar', function(req, res, next) {

Events = []
  Timeline.find()
     .exec(function(err, events) {
	 
	 
	
       

	url = 'http://museums.bristol.gov.uk/sync/data/events.JSON'
			request({
				url: url,
				json: true
			}, function (error, response, body) {

		   
		   	 _.each( response.body.events,function(event,i){
	 
				if( moment(event.endDate).isValid()){
				
				if(event.type=="Facilities") return;
				if(event.type=="Poster - Digital Signage") return;
				
				
				//console.log(event.name)
					var date = []
					date = {
								start: event.startDate,
								end: new Date(  new Date(event.endDate).getTime() + 3600000),
								timestamp: new Date(),
								summary: "["+event.type + "] " + (event.type !=event.name ? event.type + " - " : event.name)  + " - " +  event.venue,
								organizer: 'scheduling timeline <bmaga.digital@bristol.gov.uk>'
							}
							
					Events.push(date)
					
					}
					
				 })
		   
		   	 _.each(events,function(event,i){
	 
				if( event.end_date){
				
					var date = []
					date = {
								start: event.start_date,
								end: new Date( event.end_date.getTime() + 3600000),
								timestamp: new Date(),
								summary: "["+event._type + "]  " + event.name + " - "  + (event.group !="" ? event.group + " - " : "")  + event.days + "days",
								organizer: 'scheduling timeline <bmaga.digital@bristol.gov.uk>'
							}
							
					Events.push(date)
					
					}
					
				 })
				 
				 if (err) return next(err);
		res.send(route_functions.calendar_feed(Events))
  });


		   
        });
	 
	 
	 
			
				 



  
 
 
});

api_calls=new Api_calls(Timeline,router)




module.exports = router;
