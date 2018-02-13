var express = require('express');
var router = express.Router();
var Collection = require('../../models/resource-booking/bookings.js');
Route_permissions= require('../functions/route_permissions.js');
route_permissions=new Route_permissions()
Api_calls= require('../functions/standard_api_calls.js');
var request = require('request');
var moment = require('moment')
var _ =  require('underscore');
//    return $resource('/bookings/:id/:type/:start_date/:end_date', null,

/* GET /todos listing. */
router.get('/',route_permissions.isAuthenticated, function(req, res, next) {

  Collection.find()
	   .populate('leave_taken')
	   .exec (  function (err, todos) {
    if (err) return next(err);
    res.json(todos);
  })
});


router.get('/:type',route_permissions.isAuthenticated, function(req, res, next) {


 type =decodeURI(req.params.type)
 var query={"_type":type}

 if(req.query.approved){
 
	_.extend(query, {approved:  req.query.approved})
 
 }
  if(req.query.payment){
 
	_.extend(query, {payment:  req.query.payment})
 
 }
  if(req.query.confirmed){
 
	_.extend(query, {confirmed:  req.query.confirmed})
 
 }
 
 console.log('query',query)
  Collection.find(query)
	   .populate('leave_taken')
	   .exec (  function (err, todos) {
    if (err) return next(err);
    res.json(todos);
  })
});

router.get('/calendar/:room', function(req, res, next) {

Events = []

room = decodeURI(req.params.room)

console.log(room)

  Collection.find({"group":room,"approved":true})
     .exec(function(err, events) {
	 
	 
	


				 
			/*
				
		  start_date: { type: Date, required: true },
		  end_date: { type: Date},
		  group: { type: String, required: true },
		  _type: { type: String, required: true },
		  className:{ type: String, required: true },
		  content: { type: String, required: true },
		  name: { type: String, required: true },
		  notes:{ type: String},
		  days:{ type: Number },
		  */
		   
		   	 _.each(events,function(event,i){
	 
				if( event.end_date){
				
					var date = []
					date = {
								start: event.start_date,
								end: new Date( event.end_date.getTime() + 3600000),
								timestamp: new Date(),
								summary:  event.name  ,
								organizer: 'digital room bookings timeline <bmaga.digital@bristol.gov.uk>',
								text:"description about this" 
							}
							
					Events.push(date)
					
					}
					
				 })
				 
				 if (err) return next(err);
		res.send(route_functions.calendar_feed(Events))
  });


		   
    
	 
	 
	 
			
				 



  
 
 
});


router.get('/:group/:start_date/:end_date/:_type',route_permissions.isAuthenticated, function(req, res, next) {

var query = {}

/*
if( req.params.exact=="false"){
	 _.extend(query, {date_value: {$gte: req.params.date_value}})
	 console.log(query)
}
else
{
  _.extend(query,{date_value:req.params.date_value})
}

if(decodeURIComponent(req.params.museum_id)!="#"){
 _.extend(query,{museum_id: decodeURIComponent(req.params.museum_id)})
}

*/


  Collection.find(query)
		.sort({date_value: 'desc'})
	   .exec (  function (err, todos) {
    if (err) return next(err);
    res.json(todos);
  })
});

api_calls=new Api_calls(Collection,router)


module.exports = router;
