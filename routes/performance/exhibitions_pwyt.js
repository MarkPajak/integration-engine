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

var Team = require('../../models/performance/Exhibitions_pwyt.js');


var Gidftaid = require('../../models/performance/Giftaid.js');
//aggregation
/* GET /todos listing. */
router.get('/all', function(req, res, next) {

function get_kpis(cb){

Team.aggregate([
			


		{ $group: {
                _id: { 

						"kpi_year": { "$year": route_functions.mongo_aggregator }, 
						"kpi_month": { "$month": route_functions.mongo_aggregator }, 					   
					   kpi_venue:'$museum_id',
					   
					 },  
				
                donations: {$sum: '$donation_box_amount' },
				no_envelopes: {$sum: '$no_envelopes' }
			 
		      
            }
		 },

	 { $project : {kpi_venue:"$_id.kpi_venue", kpi_year :"$_id.kpi_year", kpi_month :"$_id.kpi_month", donations:"$donations", no_envelopes:"$no_envelopes"}  },

		

    ], function (err, result) {
	
	Gidftaid.aggregate([
			


		{ $group: {
                _id: { 
				 "year": { "$year": route_functions.mongo_aggregator }, 
						"month": { "$month": route_functions.mongo_aggregator },      
					   venue:'$museum_id',
					   
					 },  
				
               amount: {$sum: '$amount' },
			// no_envelopes: {$sum: '$no_envelopes' }
		      
            }
		 },

	 { $project : {venue:"$_id.venue", year :"$_id.year", month :"$_id.month",donations:'$donations', gift_aid_amount:"$amount", no_envelopes:"$no_envelopes"}  },

		
	  ], function (err, result2) {
	
        if (err) {
            console.log(err);
        } else {
		
		
		_.each(result,function(kpi,i){
			_.each(result2,function(visits,ii){
			
			if(kpi.kpi_venue==visits.venue &&  kpi.kpi_month==visits.month && kpi.kpi_year==visits.year){
			result[i].gift_aid_amount=visits.gift_aid_amount
						
			//result[i].no_envelopes=visits.no_envelopes
			result[i].conversion=(kpi.number_transactions/visits.visits*100).toFixed(2);    
			}
			
			
			})
		})
		
		
//res.json(result)

if(req.params.csv){


 res.setHeader('Content-disposition', 'attachment; filename=donations.csv');
  res.set('Content-Type', 'text/csv');
  res.status(200).send(result);


}
else
{
	cb(result)
	
}
		   	//mongoose.connection.close()	
        }
		
    });
	    });
}

get_kpis( function ( result) {
	

	
	
	

	
	//load venues
	var venues=[]
	_.each(result,function(row){
		if(venues.indexOf(row.kpi_venue)==-1){
			console.log('adding venue ',row.kpi_venue)
			venues.push(row.kpi_venue)
		}
	})
	
	function wind_up_Stats(	result,returned_row,analysis_field,venue){
		var years = [2014,2015,2016,2017,2018,2019]
			_.each(years,function(year){
			_.each(moment.monthsShort(),function(month){
			
			returned_row[month+" "+year]=""
				_.each(result,function(row){
					if(month==moment.monthsShort(row.kpi_month-1) &&venue==row.kpi_venue &&row.kpi_year==year){
						returned_row[month+" "+year]=row[analysis_field]
						
					}
				})
			})
			
			
			
		})
		return(returned_row)
	}
	
	
	
	var returned_data=[]

	_.each(venues,function(venue){

	var returned_row={}
		returned_row.museum=venue
		returned_row.stat="Total money"
		returned_data.push(	 wind_up_Stats(	result,returned_row,"donations",venue))
	var returned_row={}
		returned_row.museum=venue
		returned_row.stat="Gift aid amount"
		//returned_data.push(	 wind_up_Stats(	result,returned_row,"gift_aid_amount",venue))
	var returned_row={}
		returned_row.museum=venue
		returned_row.stat="No. envelopes"
		returned_data.push(	 wind_up_Stats(	result,returned_row,"no_envelopes",venue))

	var returned_row={}
		returned_row.museum=venue
		returned_row.stat="visits"
		returned_data.push(	 wind_up_Stats(	result,returned_row,"visits",venue))
	
	var returned_row={}
		returned_row.museum=venue
		returned_row.stat="Visits conversion"
		returned_data.push(	 wind_up_Stats(	result,returned_row,"conversion",venue))

	})


res.json(returned_data)
	
})



});

/* GET /todos listing. */
router.get('/', function(req, res, next) {

  Team.find()
	   .sort({date_value: 'desc'})
	   .exec (  function (err, todos) {
    if (err) return next(err);
    
	if(req.params.csv){


 res.setHeader('Content-disposition', 'attachment; filename=donations.csv');
  res.set('Content-Type', 'text/csv');
    var fields = ['museum_id', 'donation_box_amount', 'donation_box_no','date','no_envelopes','comments','logger_user_name','date_recorded'];
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
	     .sort({date_value: 'desc'})
	   .exec (  function (err, todos) {
    if (err) return next(err);
    



 res.setHeader('Content-disposition', 'attachment; filename=donations.csv');
  res.set('Content-Type', 'text/csv');
    var fields = ['museum_id', 'donation_box_amount', 'donation_box_no','date','no_envelopes','comments','logger_user_name','date_recorded'];
     var csv = json2csv({ data: todos, fields: fields });
  res.status(200).send(csv);

	
  })
});
/* GET /todos listing. */
router.get('/:museum_id/:date_value/:donation_box_no/:exact/:end_value',isAuthenticated, function(req, res, next) {

var query = {}


if( req.params.exact=="false"){
	 _.extend(query, {date_value: {$gte: req.params.date_value}})
	 _.extend(query, {date_value: {$lte: req.params.end_value}})
	 console.log(query)
}
else
{
  _.extend(query,{date_value:req.params.date_value})
}

if(decodeURIComponent(req.params.museum_id)!="#"){
 _.extend(query,{museum_id: decodeURIComponent(req.params.museum_id)})
}

if(decodeURIComponent(req.params.donation_box_no)!="#"){
 _.extend(query,{donation_box_no: req.params.donation_box_no})
}

console.log(query)
  Team.find(query)
		.sort({date_value: 'desc'})
	   .exec (  function (err, todos) {
    if (err) return next(err);
    res.json(todos);
  })
});


api_calls=new Api_calls(Team,router)


module.exports = router;
