var Route_functions = require('../functions/route_functions.js');
route_functions=new Route_functions()
var express = require('express');
var router = express.Router();
var _ = require('underscore');
var json2csv =  require('json2csv');
Route_permissions= require('../functions/route_permissions.js');
route_permissions=new Route_permissions()
Api_calls= require('../functions/standard_api_calls.js');

var isAuthenticated = function (req, res, next) {
	console.log('if user is authenticated in the session, call the next() to call the next request handler ')
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
	if (req.user.group=="DEFAULT") return false ;
		return next();

	return false
}

var Team = require('../../models/performance/Giftaid.js');
var Welcome_desk_gift_aid = require('../../models/performance/Welcomedesk.js');


//aggregation
/* GET /todos listing. */
router.get('/all', function(req, res, next) {

function get_kpis(cb){

Team.aggregate([
 
		 { $group: {
                _id: {
						"year": { "$year": route_functions.mongo_aggregator }, 
						"month": { "$month": route_functions.mongo_aggregator }, 
							      
					   venue:'$museum_id'
					 },  
               amount: {$sum: '$amount' },
			   no_envelopes: {$sum: '$no_envelopes' }
   
            }
		 }			

    ], function (err, result) {
	
	
	Welcome_desk_gift_aid.aggregate([
 
		 { $group: {
                _id: {
				
					"year": { "$year": route_functions.mongo_aggregator }, 
					"month": { "$month": route_functions.mongo_aggregator }, 
	      
					   venue:'$museum_id'
					 },  
               amount: {$sum: '$giftaid_amount' },
			   no_envelopes: {$sum: '$no_giftaid_envelopes' }
			   
			 
            }
		 }			

    ], function (err, result2) {
	

        if (err) {
            console.log(err);
        } else {

		cb(result,result2)
		   	//mongoose.connection.close()	
        }
		
    });
	
	 });
}

get_kpis( function ( result,result2) {
	

	//load venues
	var venues=[]
	_.each(result,function(row){
		if(venues.indexOf(row._id.venue)==-1){
			console.log('adding venue ',row._id.venue)
			venues.push(row._id.venue)
		}
	})
	
	
	var returned_data=[]

	_.each(venues,function(venue){
	
	if(venue=="") return;
		var returned_row={}
		returned_row.museum=venue
				var years = [2016,2017,2018]
			_.each(years,function(year){
			_.each(moment.monthsShort(),function(month){
			
			returned_row[month+" "+year]=""
					_.each(result,function(row){
				
						if(month==moment.monthsShort(row._id.month-1) &&venue==row._id.venue &&row._id.year==year){
							returned_row[month+" "+year]+=row.amount 
						}
				
					})
					_.each(result2,function(welcomedesk_gift_aid){
				
						if(month==moment.monthsShort(welcomedesk_gift_aid._id.month-1) &&venue==welcomedesk_gift_aid._id.venue &&welcomedesk_gift_aid._id.year==year){
							returned_row[month+" "+year]=welcomedesk_gift_aid.giftaid_amount
						}

				})
			})
			
			
			
		})
	returned_data.push(	returned_row)
	})


res.json(returned_data)
	
})



});
router.get('/', function(req, res, next) {

  Team.find()
	   .populate('leave_taken')
	     .sort({date_value: 'desc'})
	   .exec (  function (err, todos) {
    if (err) return next(err);
if(req.params.csv){  
  res.setHeader('Content-disposition', 'attachment; filename=donations.csv');
res.set('Content-Type', 'text/csv');
var fields = ['museum_id', 'amount', 'no_envelopes','date','comments','logger_user_name','date_recorded'];
var csv = json2csv({ data: todos, fields: fields });
res.status(200).send(csv);


}
else
{
	res.json(todos);
	
}
  })
});
/* GET /todos listing. */
router.get('/csv', function(req, res, next) {

  Team.find()
	   .populate('leave_taken')
	   .exec (  function (err, todos) {
    if (err) return next(err);
    



 res.setHeader('Content-disposition', 'attachment; filename=donations.csv');
  res.set('Content-Type', 'text/csv');
    var fields = ['museum_id', 'amount', 'no_envelopes','date','comments','logger_user_name','date_recorded'];
     var csv = json2csv({ data: todos, fields: fields });
  res.status(200).send(csv);

	
  })
});

router.get('/:museum_id/:date_value/:exact',isAuthenticated, function(req, res, next) {

var query = {}


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

if(decodeURIComponent(req.params.museum_id)!="#"){
 _.extend(query,{donation_box_no: req.params.donation_box_no})
}
  Team.find(query)
		.sort({date_value: 'desc'})
	   .exec (  function (err, todos) {
    if (err) return next(err);
    res.json(todos);
  })
});


api_calls=new Api_calls(Team,router)


module.exports = router;
