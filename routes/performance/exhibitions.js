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

var Team = require('../../models/performance/Gallery_visits.js');
var Kpi_aggregate = require('../../models/Kpi_log.js');
var PWYT = require('../../models/performance/Exhibitions_pwyt.js');


//aggregation
/* GET /todos listing. */
router.get('/week/:start?/:end?', function(req, res, next) {

var start = 2014
var end = 	2016


function get_kpis(cb){

				Team.aggregate([
						{ $match: { 

						}},
						{ $group: {
								_id: { 
								
								 "kpi_year": { "$year": route_functions.mongo_aggregator }, 
								 "kpi_week": { "$week": route_functions.mongo_aggregator }, 
					 
									   kpi_venue:'$museum_id',
									   
									 },  
								
								gallery_visits: {$sum: '$value' },

							  
							}
						 },
						 

					 { $project : {kpi_venue:"$_id.kpi_venue", kpi_year :"$_id.kpi_year", kpi_week :"$_id.kpi_week",gallery_visits:'$gallery_visits'}  },

						

					], function (err, gallery_visits) {
					if(err) console.log(err)



					Kpi_aggregate.aggregate([
							


						{ $group: {
								_id: { year : { $year : route_functions.mongo_aggregator },        
									   week : { $week : route_functions.mongo_aggregator },        
									   venue:'$museum_id',
									   
									 },  
								
							   visits: { $sum:  "$value"  } ,
							
							  
							}
						 },

					 { $project : {venue:"$_id.venue", year :"$_id.year", week :"$_id.week",ATV:'$ATV',number_transactions:'$number_transactions', net_sales:'$net_sales',visits:"$visits"}  },

						
					  ], function (err, museum_visits) {
						  
						  
						  
						  
					PWYT.aggregate([
							


						{ $group: {
								_id: { 

										"pwyt_year": { "$year": route_functions.mongo_aggregator }, 
										"pwyt_week": { "$week": route_functions.mongo_aggregator }, 					   
									   pwyt_venue:'$museum_id',
									   
									 },  
								
								pwyt_income: {$sum: '$donation_box_amount' },
								no_envelopes: {$sum: '$no_envelopes' }
							 
							  
							}
						 },

					 { $project : {pwyt_venue:"$_id.pwyt_venue", pwyt_year :"$_id.pwyt_year", pwyt_week :"$_id.pwyt_week", pwyt_income:"$pwyt_income", no_envelopes:"$no_envelopes"}  },	  

					 ], function (err, result_pwyt) {
						if (err) {
							console.log(err);
						} else {
						
					
						_.each(gallery_visits,function(kpi,i){
						
							_.each(museum_visits,function(visits,ii){
					
							if(kpi.kpi_venue==visits.venue &&  kpi.kpi_week==visits.week && kpi.kpi_year==visits.year){
							gallery_visits[i].visits=visits.visits
							gallery_visits[i].gallery_visits=kpi.gallery_visits
							gallery_visits[i].conversion=((kpi.gallery_visits/visits.visits)*100).toFixed(2)+"%";
							console.log('conversion')
							console.log(gallery_visits[i].gallery_visits)
							console.log(gallery_visits[i].conversion)
								
											for (compare_previous_years = 1; compare_previous_years < 2; compare_previous_years++) { 
				  

											_.each(gallery_visits,function(previous_data){
												compare_previous_year = visits.year-compare_previous_years
												//console.log('compare_previous_year',compare_previous_year)
												if(previous_data.kpi_venue==visits.venue &&  previous_data.kpi_week==visits.week && previous_data.kpi_year==compare_previous_year){
													//console.log("adding % last year")
															gallery_visits[i]["% net_sales last year"] =((kpi.net_sales/previous_data.net_sales)*100-100).toFixed(2)+"%";
					
												}
											})
											
											}
							}
							
								_.each(result_pwyt,function(pwyt,ii){

							if(pwyt.pwyt_venue==kpi._id.kpi_venue &&  pwyt.pwyt_week== kpi._id.kpi_week && pwyt.pwyt_year==kpi._id.kpi_year){
							
									gallery_visits[i].pwyt_income=pwyt.pwyt_income
									


							}
							

							})
							
							
							
							
							})
						})
						
						

					cb(gallery_visits)
						   
						}
						
					});
						});
					});
}

get_kpis( function ( result) {
	

	
	
	

	
	//load venues
	var venues=[]
	_.each(result,function(row){
		if(venues.indexOf(row.kpi_venue)==-1){
			//console.log('adding venue ',row.kpi_venue)
			
			if(row.kpi_venue!=""){
			venues.push(row.kpi_venue)
			}
		}
	})
	
	function wind_up_Stats(	result,returned_row,analysis_field,venue){
		var years = [2014,2015,2016,2017,2018]
		_.each(years,function(year){
			for (week = 0; week <= moment().isoWeeksInYear(); week++) { 
			
			returned_row[week+" "+year]=""
				_.each(result,function(row){
					if(week==row.kpi_week &&venue==row.kpi_venue &&row.kpi_year==year){
						returned_row[week+" "+year]=row[analysis_field]
					}
				})
			}				
		})
		return(returned_row)
	}
	
	
	var returned_data=[]

	_.each(venues,function(venue){
		
	var returned_row={}
		returned_row.museum=venue
		returned_row.stat="TEG visits"
		returned_data.push(	 wind_up_Stats(	result,returned_row,"gallery_visits",venue))
	var returned_row={}
		returned_row.museum=venue
		returned_row.stat="Income"
		returned_data.push(	 wind_up_Stats(	result,returned_row,"pwyt_income",venue))

	var returned_row={}
		returned_row.museum=venue
		returned_row.stat="Visits"
		returned_data.push(	 wind_up_Stats(	result,returned_row,"visits",venue))
	var returned_row={}
		returned_row.museum=venue
		returned_row.stat="Conversion"
		returned_data.push(	 wind_up_Stats(	result,returned_row,"conversion",venue))
	
	})


res.json(returned_data)
	
})



});

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
				
                gallery_visits: {$sum: '$value' },
			 
		      
            }
		 },
		 

	 { $project : {kpi_venue:"$_id.kpi_venue", kpi_year :"$_id.kpi_year", kpi_month :"$_id.kpi_month",gallery_visits:'$gallery_visits'}  },

		

    ], function (err, gallery_visits) {
	if(err) console.log(err)
	//console.log(result)


	Kpi_aggregate.aggregate([
			


		{ $group: {
                _id: { year :  { "$year": route_functions.mongo_aggregator },        
					   month : { "$month": route_functions.mongo_aggregator },        
					   venue:'$museum_id',
					   //gallery:'$gallery',
					 },  
				
               visits: { $sum:  { $sum: [ "$value" ] }} ,
			
		      
            }
		 },

	 { $project : { venue:"$_id.venue", year :"$_id.year", month :"$_id.month",ATV:'$ATV',number_transactions:'$number_transactions', net_sales:'$net_sales',visits:"$visits"}  },

		
	  ], function (err, museum_visits) {
		  
 
	PWYT.aggregate([

		{ $group: {
                _id: { 

						"pwyt_year": { "$year": route_functions.mongo_aggregator }, 
						"pwyt_month": { "$month": route_functions.mongo_aggregator }, 					   
					    pwyt_venue:'$museum_id',
					   
					 },  
				
                pwyt_income: {$sum: '$donation_box_amount' },
				no_envelopes: {$sum: '$no_envelopes' }
			 
		      
            }
		 },

	 { $project : {pwyt_venue:"$_id.pwyt_venue", pwyt_year :"$_id.pwyt_year", pwyt_month :"$_id.pwyt_month", pwyt_income:"$pwyt_income", no_envelopes:"$no_envelopes"}  },	  

	 ], function (err, result_pwyt) {
        if (err) {
            console.log(err);
        } else {
		
		
		_.each(gallery_visits,function(kpi,i){
			_.each(museum_visits,function(visits,ii){

			
			
			console.log('conversion')
			console.log(gallery_visits[i].gallery_visits)
			console.log(gallery_visits[i].conversion)
			
			
			
			if(kpi.kpi_venue==visits.venue &&  kpi.kpi_month==visits.month && kpi.kpi_year==visits.year){
			gallery_visits[i].visits=visits.visits
			gallery_visits[i].conversion=((kpi.gallery_visits/visits.visits)*100).toFixed(2)+"%";
			
			
			
				
							for (compare_previous_years = 1; compare_previous_years < 2; compare_previous_years++) { 
  

							_.each(gallery_visits,function(previous_data){
								compare_previous_year = visits.year-compare_previous_years
								if(previous_data.kpi_venue==visits.venue &&  previous_data.kpi_month==visits.month && previous_data.kpi_year==compare_previous_year){
									console.log("adding % last year")
									gallery_visits[i]["% net_sales last year"] =((kpi.net_sales/previous_data.net_sales)*100-100).toFixed(2)+"%";
		
								}
							})
							
							}
			}
			
			
			
			
			
			
			})
			
				_.each(result_pwyt,function(pwyt,iii){
				console.log(pwyt.pwyt_venue,kpi.kpi_venue, pwyt.pwyt_month,kpi.kpi_month,pwyt.pwyt_year,kpi.kpi_year)
					if(pwyt.pwyt_venue==kpi.kpi_venue &&  pwyt.pwyt_month== kpi.kpi_month && pwyt.pwyt_year==kpi.kpi_year){
						gallery_visits[i].pwyt_income=pwyt.pwyt_income
					}
				})
		})
		
		
//res.json(result)
	cb(gallery_visits)
		   	//mongoose.connection.close()	
        }
		
    });
	    });
    });
}

get_kpis( function ( result) {
	

	
	
	

	
	//load venues
	var venues=[]
	_.each(result,function(row){
		if(venues.indexOf(row.kpi_venue)==-1){
			console.log('adding venue ',row.kpi_venue)
			if(row.kpi_venue!=""){
			venues.push(row.kpi_venue)
			}
		}
	})
	
	function wind_up_Stats(	result,returned_row,analysis_field,venue){
			
			var years = [2014,2015,2016,2017,2018]
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
		returned_row.stat="TEG visits"
		returned_data.push(	 wind_up_Stats(	result,returned_row,"gallery_visits",venue))
	var returned_row={}
		returned_row.museum=venue
		returned_row.stat="Income"
		returned_data.push(	 wind_up_Stats(	result,returned_row,"pwyt_income",venue))
	
	
	var returned_row={}
		returned_row.museum=venue
		returned_row.stat="No. of transactions"
		//returned_data.push(	 wind_up_Stats(	result,returned_row,"number_transactions",venue))
	var returned_row={}
		returned_row.museum=venue
		returned_row.stat="Average transaction"
		//returned_data.push(	 wind_up_Stats(	result,returned_row,"ATV",venue))
	var returned_row={}
		returned_row.museum=venue
		returned_row.stat="Visits"
		returned_data.push(	 wind_up_Stats(	result,returned_row,"visits",venue))
	var returned_row={}
		returned_row.museum=venue
		returned_row.stat="Conversion"
		returned_data.push(	 wind_up_Stats(	result,returned_row,"conversion",venue))
	
	})


res.json(returned_data)
	
})



});





router.get('/total', function(req, res, next) {
	
	
		function get_kpis(cb){	
			
			
					Team.aggregate([
								
					{$project:{"date":1,"value":1,"museum_id":1,
							   "quarter":{$cond:[{$lte:[{$month:route_functions.mongo_aggregator},3]},
												 "fourth",
												 {$cond:[{$lte:[{$month:route_functions.mongo_aggregator},6]},
														 "first",
														 {$cond:[{$lte:[{$month:route_functions.mongo_aggregator},9]},
																 "second",
										"third"]}]}]},
								"financial_yer":{$cond:[{$lte:[{$month:route_functions.mongo_aggregator},3]},
												"last",
										"this"]
										
								},
								"year":{$cond:[{$lte:[{$month:route_functions.mongo_aggregator},3]},
												{$year:route_functions.mongo_aggregator},
										{$year:route_functions.mongo_aggregator}]
										
					}}
			
					},
					{$group:{"_id":{"year":"$year" ,"financial_yer":"$financial_yer" ,kpi_venue:'$museum_id'}, gallery_visits: {$sum: '$value' }}},

				
							

						], function (err, gallery_visits) {
						
		PWYT.aggregate([
								
					{$project:{"date":1,"donation_box_amount":1,"museum_id":1,
							   "quarter":{$cond:[{$lte:[{$month:route_functions.mongo_aggregator},3]},
												 "fourth",
												 {$cond:[{$lte:[{$month:route_functions.mongo_aggregator},6]},
														 "first",
														 {$cond:[{$lte:[{$month:route_functions.mongo_aggregator},9]},
																 "second",
										"third"]}]}]},
								"financial_yer":{$cond:[{$lte:[{$month:route_functions.mongo_aggregator},3]},
												"last",
										"this"]
										
								},
								"year":{$cond:[{$lte:[{$month:route_functions.mongo_aggregator},3]},
												{$year:route_functions.mongo_aggregator},
										{$year:route_functions.mongo_aggregator}]
										
					}}
			
					},
					{$group:{"_id":{"year":"$year" ,"financial_yer":"$financial_yer" ,pwyt_venue:'$museum_id'}, pwyt_income: {$sum: '$donation_box_amount' }}},

						], function (err, pwyt_income) {
									
							_.each(gallery_visits,function(gal,i){
								if(gal.gallery_visits>0){
									_.each(pwyt_income,function(pwyt,ii){
										if( pwyt._id.pwyt_venue==gal._id.kpi_venue  && pwyt._id.year==gal._id.year && pwyt._id.financial_yer==gal._id.financial_yer){					
											gallery_visits[i].pwyt_income=pwyt.pwyt_income
										}
									})
								}
							})
							
							cb(gallery_visits)
									
							})
})


		}
			

		get_kpis( function ( result) {

						//load venues
						var venues=[]
						_.each(result,function(row){
							if(venues.indexOf(row._id.kpi_venue)==-1){
							
								venues.push(row._id.kpi_venue)
							}
						})
						
						function wind_up_Stats(	result,returned_row,analysis_field,venue){
						
									var years = [2014,2015,2016,2017,2018]
								_.each(years,function(year){
									var financial_yesr_text = ["last","this"]
									_.each(financial_yesr_text,function(financial_yer_text){
									
										_.each(result,function(row){
											if(venue==row._id.kpi_venue &&row._id.financial_yer==financial_yer_text&&row._id.year==year){
												
												var financial_year_display=""
												if(financial_yer_text=="this"){
													financial_year_display=	year+"-"+((year+1).toString().substring(2))
													console.log('financial_year_display this',financial_year_display)
													returned_row[financial_year_display]=row[analysis_field]
													}
													else
													{
													financial_year_display=	(year-1)+"-"+(year.toString().substring(2))	
													console.log('financial_year_display',financial_year_display)
													returned_row[financial_year_display]+=row[analysis_field]
												}
												
											}
										})
									})
									
								})
								//console.log(returned_rows)
							return(returned_row)
						}
						
						
						var returned_data=[]

						_.each(venues,function(venue){
							
						var returned_row={}
							returned_row.museum=venue
							returned_row.stat="TEG visits"
							returned_data.push(	 wind_up_Stats(	result,returned_row,"gallery_visits",venue))
						var returned_row={}
							returned_row.museum=venue
							returned_row.stat="Income"
							returned_data.push(	 wind_up_Stats(	result,returned_row,"pwyt_income",venue))

						})


					res.json(returned_data)
			
		})



});












/* GET /todos listing. */
router.get('/', function(req, res, next) {
/*
total_sales: { type: Number},
			non_vat_sales: { type: Number},
			net_sales: { type: Number},
			no_transactions: { type: Number},
			*/
			
  Team.find()
	   .populate('leave_taken')
	     .sort({date_value: 'desc'})
	   .exec (  function (err, todos) {
    if (err) return next(err);
if(req.params.csv){
     res.setHeader('Content-disposition', 'attachment; filename=donations.csv');
res.set('Content-Type', 'text/csv');
var fields = ['museum_id', 'value','date','comments','logger_user_name','date_recorded'];
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
router.get('/:csv', function(req, res, next) {
/*
total_sales: { type: Number},
			non_vat_sales: { type: Number},
			net_sales: { type: Number},
			no_transactions: { type: Number},
			*/
			
  Team.find()
	   .populate('leave_taken')
	   .exec (  function (err, todos) {
    if (err) return next(err);
	if(req.params.csv){
     res.setHeader('Content-disposition', 'attachment; filename=donations.csv');
res.set('Content-Type', 'text/csv');
var fields = ['museum_id', 'value','date','comments','logger_user_name','date_recorded'];
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
router.get('/:exhibition/:date/:exact',isAuthenticated, function(req, res, next) {

var query = {}


if( req.params.exact=="false"){
	 _.extend(query, {date_value: {$gte: req.params.date_value}})
	 console.log(query)
}
else
{
  _.extend(query,{date_value:req.params.date_value})
}

if(decodeURIComponent(req.params.exhibition)!="#"){
 _.extend(query,{exhibition: decodeURIComponent(req.params.exhibition)})
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
