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
router.get('/year', function(req, res, next) {
	
	
			
		function get_kpis(cb){	
			
			
					Collection.aggregate([
					{ $match : { _type : "ROOM BOOKING", payment :true} },		
					{$project:{"date_logged":1,"balance":1,"deposit":1,"group":1,
							   "quarter":{$cond:[{$lte:[{$month:route_functions.mongo_aggregator2},3]},
												 "fourth",
												 {$cond:[{$lte:[{$month:route_functions.mongo_aggregator2},6]},
														 "first",
														 {$cond:[{$lte:[{$month:route_functions.mongo_aggregator2},9]},
																 "second",
										"third"]}]}]},
								"financial_yer":{$cond:[{$lte:[{$month:route_functions.mongo_aggregator2},3]},
												"last",
										"this"]
										
								},
								"year":{$cond:[{$lte:[{$month:route_functions.mongo_aggregator2},3]},
												{$year:route_functions.mongo_aggregator2},
										{$year:route_functions.mongo_aggregator2}]
										
					}}
			
					},
					{$group:{"_id":{"year":"$year" ,"financial_yer":"$financial_yer" ,group:'$group'}, balance: {$sum: '$balance' }, deposit: {$sum: '$deposit' }}},

				
							

						], function (err, visits) {
					if(err) console.log(err)	
console.log(visits)
							cb(visits)
									
							})

		}
			

		get_kpis( function ( result) {

				
						
					function wind_up_Stats(	result,returned_row,analysis_field,venue){
						
								var years = [2014,2015,2016,2017,2018,2019]
								_.each(years,function(year){
									var financial_yesr_text = ["last","this"]
									_.each(financial_yesr_text,function(financial_yer_text){
										var financial_year_display=""
										_.each(result,function(row){
											if(venue==row._id.group &&row._id.financial_yer==financial_yer_text&&row._id.year==year){
																							
														var financial_year_display=""
													if(financial_yer_text=="this"){
													financial_year_display=	year+"-"+((year+1).toString().substring(2))
													console.log('financial_year_display this',financial_year_display)
														returned_row[financial_year_display]=row['balance']+row['deposit']
													}
													else
													{
													financial_year_display=	(year-1)+"-"+(year.toString().substring(2))	
													console.log('financial_year_display',financial_year_display)
														returned_row[financial_year_display]=row['balance']+row['deposit']
												}
												
												
												
											
											
											}
										})
									})
									
								})
								//console.log(returned_rows)
							return(returned_row)
						}
						
						//load venues
		//load venues
						var venues=[]
						_.each(result,function(row){
							if(venues.indexOf(row._id.group)==-1){
							
								venues.push(row._id.group)
							}
						})
	
						var returned_data=[]

					_.each(venues,function(venue){
							
						var returned_row={}
							returned_row.space=venue
							returned_row.stat="total"
							returned_data.push(	 wind_up_Stats(	result,returned_row,"total",venue))
						

					})


				res.json(returned_data)
			
		})



});

router.get('/all', function(req, res, next) {
	
	
		function get_kpis(cb){	
			
		 
					Collection.aggregate([
					
								 { $match : { _type : "ROOM BOOKING", payment :true} },
								 { $group: {
								_id: {
									"year": { "$year": route_functions.mongo_aggregator2 }, 
								    "month": { "$month": route_functions.mongo_aggregator2 }, 
								
			  
									   name:'$group'
									 },  
							   balance: {$sum: '$balance' },
							   deposit: {$sum: '$deposit' }
							}
						 }	

						], function (err, visits) {
						

							cb(visits)
									
							})

		}
			

		get_kpis( function ( result) {

				
						
					function wind_up_Stats(	result,returned_row,analysis_field,venue){
							 years = [2018,2019]
									_.each(years,function(year){
									_.each(moment.monthsShort(),function(month){
									
									returned_row[month+" "+year]=""
										_.each(result,function(row){
										
											if(month==moment.monthsShort(row._id.month-1) &&venue==row._id.name &&row._id.year==year){
											///	if( row.payment==true){
console.log('adding row ',row)												
													returned_row[month+" "+year]=row['balance']+row['deposit']
												//}											
												
											}
										})
									})
									
									
									
								})
								return(returned_row)
							}
						
						//load venues
		//load venues
						var venues=[]
						_.each(result,function(row){
							if(venues.indexOf(row._id.name)==-1){
							
								venues.push(row._id.name)
							}
						})
	
						var returned_data=[]

					_.each(venues,function(venue){
							
						var returned_row={}
							returned_row.space=venue
							returned_row.stat="total"
							returned_data.push(	 wind_up_Stats(	result,returned_row,"total",venue))
						var returned_row={}
							returned_row.space=venue
							returned_row.stat="deposit"
							//returned_data.push(	 wind_up_Stats(	result,returned_row,"deposit",venue))

					})


					res.json(returned_data)
			
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
