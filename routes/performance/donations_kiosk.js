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

var Team = require('../../models/performance/Donations_kiosk.js');



//aggregation
/* GET /todos listing. */


router.get('/day', function(req, res, next) {

function get_kpis(cb){

Team.aggregate([
		 { $match : {type: { $ne: "" }} },
		 { $group: {
                _id: {
						"year": { "$year": route_functions.mongo_aggregator }, 
						"month": { "$month": route_functions.mongo_aggregator }, 
						"day": { "$dayOfMonth": route_functions.mongo_aggregator }, 
						
						venue:'$museum_id',
					   type:'$type'
					 },  
               amount: {$sum: '$donation_amount' },
			   no_transactions: {$sum:1 },
            }
		 }			

    ], function (err, result) {
        if (err) {
            console.log(err);
        } else {

		cb(result)
		   	//mongoose.connection.close()	
        }
		
    });
}

get_kpis( function ( result) {
	

	var returned_data=[]

	//_.each(venues,function(venue){
		
		//if(venue=="") return;
		
		
			//var years = [2016,2017,2018,2019,2020,2021,2022,2023]
			//_.each(years,function(year){
			//_.each(moment.monthsShort(),function(month){
			//var day
			//for (day = 0; day < 32; day++) {
						
			var amount=0
			//returned_row[month+" "+year]=""
				_.each(result,function(row){
					var returned_row={}
					//if(month==moment.monthsShort(row._id.month-1) && venue==row._id.venue &&row._id.year==year && day==row._id.day){
					
						returned_row.museum_id=row._id.venue
						returned_row.date_value=new Date(row._id.year+"-"+moment.monthsShort(row._id.month-1)+"-"+row._id.day)	
						returned_row.donation_amount=row.amount
						returned_row.no_transactions=row.no_transactions
						returned_row.amount_including_gift_aid=row.amount*1.2
						returned_data.push(	returned_row)
					//}
					
				})
			
			//}
			//})
			
			
			
		//})
	
	//})


res.json(returned_data)
	
})



});

router.get('/all', function(req, res, next) {

function get_kpis(cb){

Team.aggregate([
		 { $match : {type: { $ne: "" }} },
		 { $group: {
                _id: {
				 "year": { "$year": route_functions.mongo_aggregator }, 
						"month": { "$month": route_functions.mongo_aggregator }, 
						venue:'$museum_id',
					   type:'$type'
					 },  
               amount: {$sum: '$donation_amount' }
            }
		 }			

    ], function (err, result) {
        if (err) {
            console.log(err);
        } else {

		cb(result)
		   	//mongoose.connection.close()	
        }
		
    });
}

get_kpis( function ( result) {
	

	
	
	

	
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
			var years = [2016,2017,2018,2019,2020,2021,2022,2023]
			_.each(years,function(year){
			_.each(moment.monthsShort(),function(month){
			
			returned_row[month+" "+year]=""
				_.each(result,function(row){
					if(month==moment.monthsShort(row._id.month-1) &&venue==row._id.venue &&row._id.year==year){
						returned_row[month+" "+year]=row.amount
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
var fields = ['museum_id','type', 'amount', 'no_envelopes','date','comments','logger_user_name','date_recorded'];
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
    var fields = ['museum_id','type', 'amount', 'no_envelopes','date','comments','logger_user_name','date_recorded'];
     var csv = json2csv({ data: todos, fields: fields });
  res.status(200).send(csv);

	
  })
});

router.get('/:museum_id/:date_value/:type/:exact/:end_value',isAuthenticated, function(req, res, next) {

var query = {}

console.log('type',query)
if( req.params.exact=="false"){
	 _.extend(query, {date_value: {$gte: req.params.date_value}})
	 console.log(query)
}
else
{
  _.extend(query,{date_value:req.params.date_value})
}

if(decodeURIComponent(req.params.type)!="#"){
 _.extend(query,{type: decodeURIComponent(req.params.type)})
}
if(decodeURIComponent(req.params.museum_id)!="#"){
 _.extend(query,{museum_id: decodeURIComponent(req.params.museum_id)})
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
