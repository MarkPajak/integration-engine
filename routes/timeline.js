var express = require('express');
var router = express.Router();
Route_permissions= require('./functions/route_permissions.js');
route_permissions=new Route_permissions()
var Route_functions = require('./functions/route_functions.js');
route_functions=new Route_functions()
Api_calls= require('./functions/standard_api_calls.js');
var _ = require('underscore');


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
	 
				 _.each(events,function(event,i){
	  console.log(event)
	  if( event.end_date){
					var date = []
					date = {
								start: event.start_date,
								end: new Date( event.end_date.getTime() + 3600000),
								timestamp: new Date(),
								summary: "["+event._type + "]" + event.name + " - " + event.days,
								organizer: 'digital_timeline <bmaga.digital@bristol.gov.uk>'
							}
							
					Events.push(date)
					}
				 })
				 
if (err) return next(err);
		res.send(route_functions.calendar_feed(Events))
  });




  
 
 
});

api_calls=new Api_calls(Timeline,router)




module.exports = router;
