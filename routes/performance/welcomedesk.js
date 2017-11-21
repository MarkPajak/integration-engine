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

var Team = require('../../models/performance/Welcomedesk.js');


var Kpi_aggregate = require('../../models/Kpi_log.js');
//aggregation
/* GET /todos listing. */

router.get('/csv', function(req, res, next) {

  Team.find()
	   .populate('leave_taken')
	   .exec (  function (err, todos) {
    if (err) return next(err);
    

/*

			cash: { type: Number},
			card: { type: Number},
			//non_vat_sales: { type: Number},
			//net_sales: { type: Number},
			no_transactions: { type: Number},
			no_giftaid_envelopes: { type: Number},
			giftaid_amount: { type: Number},
			*/

 res.setHeader('Content-disposition', 'attachment; filename=donations.csv');
  res.set('Content-Type', 'text/csv');
    var fields = ['museum_id', 'total', 'total_inc_giftaid','cash','giftaid_amount','no_giftaid_envelopes','no_transactions','card','date','comments','logger_user_name','date_recorded'];
     var csv = json2csv({ data: todos, fields: fields });
  res.status(200).send(csv);

	
  })
});

router.get('/total', function(req, res, next) {
	
	
		function get_kpis(cb){	
			
			
					Team.aggregate([
								
									{$project:{"date":1,"cash":1,"card":1,"no_transactions":1,"no_giftaid_envelopes":1,"giftaid_amount":1,
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
					{$group:{"_id":{"year":"$year" ,"financial_yer":"$financial_yer" ,kpi_venue:'$museum_id'},  total: { $sum:  { $sum: [ "$cash", "$card" ] }} , no_transactions: {$sum: '$no_transactions' }, no_giftaid_envelopes: {$sum: '$no_giftaid_envelopes' }, giftaid_amount: {$sum: '$giftaid_amount' }}},

				
							

						], function (err, donations) {
						
		console.log(err)
							
							cb(donations)
									
							
})


		}
			

		get_kpis( function ( result) {

						
						var venues=[]
						_.each(result,function(row){
						console.log(row)
							if(venues.indexOf(row._id.kpi_venue)==-1){
							
								venues.push(row._id.kpi_venue)
							}
						})
						
						function wind_up_Stats(	result,returned_row,analysis_field,venue){
						
								var years = [2014,2015,2016,2017,2018]
								_.each(years,function(year){
									var financial_yesr_text = ["last","this"]
									_.each(financial_yesr_text,function(financial_yer_text){
									console.log('cheese')
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
												if(returned_row['donations']){
												returned_row['donations']=returned_row['donations'].substring(2)
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
		returned_row.stat="Welcome desk total"
		returned_data.push(	 wind_up_Stats(	result,returned_row,"total",venue))
	var returned_row={}
		returned_row.museum=venue
		returned_row.stat="Welcome desk no. of transactions"
		returned_data.push(	 wind_up_Stats(	result,returned_row,"number_transactions",venue))
	var returned_row={}
		returned_row.museum=venue
		returned_row.stat="Welcome desk  average transaction"
		returned_data.push(	 wind_up_Stats(	result,returned_row,"ATV",venue))
	var returned_row={}
		returned_row.museum=venue
		returned_row.stat="Welcome desk visits"
		returned_data.push(	 wind_up_Stats(	result,returned_row,"visits",venue))
	var returned_row={}
		returned_row.museum=venue
		returned_row.stat="Welcome desk  conversion"
		returned_data.push(	 wind_up_Stats(	result,returned_row,"conversion",venue))

						})


					res.json(returned_data)
			
		})



});

router.get('/weekly', function(req, res, next) {


function get_kpis(cb){


Team.aggregate([
			


		{ $group: {
                _id: {
						"kpi_year": { "$year":  route_functions.mongo_aggregator }, 
						"kpi_week": { "$week": route_functions.mongo_aggregator}, 

					   kpi_venue:'$museum_id',
					   
					 },  
				
               total: { $sum:  { $sum: [ "$cash", "$card" ] }} ,
			   number_transactions: { $sum:    "$no_transactions" } ,
			  // ATV: {$sum:  { $divide: [ { $sum:  { $sum: [ "$cash", "$card" ] }}   ,{ $sum:    "$no_transactions" } ]}},
		      
            }
		 },

	 { $project : {kpi_venue:"$_id.kpi_venue", kpi_year :"$_id.kpi_year", kpi_week :"$_id.kpi_week",ATV:'$ATV',number_transactions:'$number_transactions', total:"$total"}  },

		

    ], function (err, result) {
	
	
	console.log(err)
	
	
	Kpi_aggregate.aggregate([
			


		{ $group: {
                _id: {

						"year": { "$year":  route_functions.mongo_aggregator }, 
						"month":{ "$month":  route_functions.mongo_aggregator }, 
    
					   venue:'$museum_id',
					   
					 },  
				  visits: { $sum:  "$value" } , 
              // visits: { $sum:  { $sum: [ "$value" ] }} ,//not sure why this broke whyen moved to ubuntu
			
		      
            }
		 },

	 { $project : {venue:"$_id.venue", year :"$_id.year", month :"$_id.month",ATV:'$ATV',number_transactions:'$number_transactions', visits:"$visits"}  },

		
	  ], function (err, result2) {
	
        if (err) {
            console.log(err);
        } else {
		
		
		_.each(result,function(kpi,i){
			_.each(result2,function(visits,ii){
			//console.log(visits.year)
			if(kpi.kpi_venue==visits.venue &&  kpi.kpi_week==visits.month && kpi.kpi_year==visits.year){
			result[i].visits=visits.visits
			result[i].conversion=((kpi.number_transactions/visits.visits)*100).toFixed(2)+"%"; 
			result[i].ATV=((kpi.total/kpi.number_transactions).toFixed(2))

			}
			
			
			})
		})
		
		
//res.json(result)
	cb(result)
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
	var years = [2015,2016,2017,2018]
			_.each(years,function(year){
			for (week = 0; week < moment().isoWeeksInYear(); week++) { 
				week_value = moment().day("Monday").year(year).week(week).format('DD/MM/YY')
		
				returned_row[week_value]=""
			
				_.each(result,function(row){
					if(week==row.kpi_week &&venue==row.kpi_venue &&row.kpi_year==year){
						returned_row[week_value]=row[analysis_field]
					}
				})
			}
			
			
			
		})
		return(returned_row)
	}
	
	
	var returned_data=[]

	_.each(venues,function(venue){
		console.log(venue)
	var returned_row={}
		returned_row.museum=venue
		returned_row.stat="Welcome desk total"
		returned_data.push(	 wind_up_Stats(	result,returned_row,"total",venue))
	var returned_row={}
		returned_row.museum=venue
		returned_row.stat="Welcome desk no. of transactions"
		returned_data.push(	 wind_up_Stats(	result,returned_row,"number_transactions",venue))
	var returned_row={}
		returned_row.museum=venue
		returned_row.stat="Welcome desk  average transaction"
		returned_data.push(	 wind_up_Stats(	result,returned_row,"ATV",venue))
	var returned_row={}
		returned_row.museum=venue
		returned_row.stat="Welcome desk visits"
		returned_data.push(	 wind_up_Stats(	result,returned_row,"visits",venue))
	var returned_row={}
		returned_row.museum=venue
		returned_row.stat="Welcome desk  conversion"
		returned_data.push(	 wind_up_Stats(	result,returned_row,"conversion",venue))
	
	})


res.json(returned_data)
	
})



});
router.get('/all', function(req, res, next) {


function get_kpis(cb){


Team.aggregate([
			


		{ $group: {
                _id: {
						"kpi_year": { "$year":  route_functions.mongo_aggregator }, 
						"kpi_month": { "$month": route_functions.mongo_aggregator}, 

					   kpi_venue:'$museum_id',
					   
					 },  
				
               total: { $sum:  { $sum: [ "$cash", "$card" ] }} ,
			   number_transactions: { $sum:    "$no_transactions" } ,
			  // ATV: {$sum:  { $divide: [ { $sum:  { $sum: [ "$cash", "$card" ] }}   ,{ $sum:    "$no_transactions" } ]}},
		      
            }
		 },

	 { $project : {kpi_venue:"$_id.kpi_venue", kpi_year :"$_id.kpi_year", kpi_month :"$_id.kpi_month",ATV:'$ATV',number_transactions:'$number_transactions', total:"$total"}  },

		

    ], function (err, result) {
	
	
	console.log(err)
	
	
	Kpi_aggregate.aggregate([
			


		{ $group: {
                _id: {

						"year": { "$year":  route_functions.mongo_aggregator }, 
						"month":{ "$month":  route_functions.mongo_aggregator }, 
    
					   venue:'$museum_id',
					   
					 },  
				
                 visits: { $sum:  "$value" } , 
			
		      
            }
		 },

	 { $project : {venue:"$_id.venue", year :"$_id.year", month :"$_id.month",ATV:'$ATV',number_transactions:'$number_transactions', visits:"$visits"}  },

		
	  ], function (err, result2) {
	
        if (err) {
            console.log(err);
        } else {
		
		
		_.each(result,function(kpi,i){
			_.each(result2,function(visits,ii){
			//console.log(visits.year)
			if(kpi.kpi_venue==visits.venue &&  kpi.kpi_month==visits.month && kpi.kpi_year==visits.year){
			result[i].visits=visits.visits
			result[i].conversion=((kpi.number_transactions/visits.visits)*100).toFixed(2)+"%"; 
			result[i].ATV=((kpi.total/kpi.number_transactions).toFixed(2))

			}
			
			
			})
		})
		
		
//res.json(result)
	cb(result)
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
	var years = [2015,2016,2017,2018]
			_.each(years,function(year){
			_.each(moment.monthsShort(),function(month){
			console.log(month)
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
		console.log(venue)
	var returned_row={}
		returned_row.museum=venue
		returned_row.stat="Welcome desk total"
		returned_data.push(	 wind_up_Stats(	result,returned_row,"total",venue))
	var returned_row={}
		returned_row.museum=venue
		returned_row.stat="Welcome desk no. of transactions"
		returned_data.push(	 wind_up_Stats(	result,returned_row,"number_transactions",venue))
	var returned_row={}
		returned_row.museum=venue
		returned_row.stat="Welcome desk  average transaction"
		returned_data.push(	 wind_up_Stats(	result,returned_row,"ATV",venue))
	var returned_row={}
		returned_row.museum=venue
		returned_row.stat="Welcome desk visits"
		returned_data.push(	 wind_up_Stats(	result,returned_row,"visits",venue))
	var returned_row={}
		returned_row.museum=venue
		returned_row.stat="Welcome desk  conversion"
		returned_data.push(	 wind_up_Stats(	result,returned_row,"conversion",venue))
	
	})


res.json(returned_data)
	
})



});

/* GET /todos listing. */
router.get('/',isAuthenticated, function(req, res, next) {

  Team.find()
	   .populate('leave_taken')
	     .sort({date_value: 'desc'})
	   .exec (  function (err, todos) {
    if (err) return next(err);
    res.json(todos);
  })
});
/* GET /todos listing. */
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


  Team.find(query)
		.sort({date_value: 'desc'})
	   .exec (  function (err, todos) {
    if (err) return next(err);
    res.json(todos);
  })
});


api_calls=new Api_calls(Team,router)


module.exports = router;

