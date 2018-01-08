var express = require('express');
var Route_functions = require('./functions/route_functions.js');
route_functions=new Route_functions()
var router = express.Router();
var _ = require('underscore');
var Kpi_aggregate = require('../models/Kpi_log.js');
//var Kpi_data_loader = require('../data_loader/kpi/kpi_aggregate.js');
var moment = require('moment');


var isAuthenticated = function (req, res, next) {
	
	if (req.isAuthenticated())
	if (req.user.group=="DEFAULT") return false ;
		return next();

	return res.json();
}




router.get('/total', function(req, res, next) {
	
	
		function get_kpis(cb){	
			
		 
					Kpi_aggregate.aggregate([
					
					
					{$project:{"date":1,"value":1,"museum_id": 1,
							  
								"financial_yer":{$cond:[{$lte:[{$month:route_functions.mongo_aggregator},3]},
												"last",
										"this"]
										
								},
								"year":{$year:route_functions.mongo_aggregator}
										
					}
			
					},
					{$group:{"_id":{"year":"$year" ,"financial_yer":"$financial_yer" ,kpi_venue:'$museum_id'}, visits: {$sum: '$value' }}},

				
							

						], function (err, visits) {
						
	
							cb(visits)
									
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
						
									var years = [2014,2015,2016,2017]
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
								
							return(returned_row)
						}
						
						
						var returned_data=[]

						_.each(venues,function(venue){
							console.log('adding venue ',venue)
						var returned_row={}
							returned_row.museum=venue
							returned_row.stat="Visits"
							returned_data.push(	 wind_up_Stats(	result,returned_row,"visits",venue))
						var returned_row={}
							returned_row.museum=venue
							returned_row.stat="Income"
							//returned_data.push(	 wind_up_Stats(	result,returned_row,"pwyt_income",venue))

						})


					res.json(returned_data)
			
		})



});




router.get('/week', function(req, res, next) {
	
function get_kpis(cb){
	
	Kpi_aggregate.aggregate([
	 //HOLY CRAP ITS NOT FUN WHEN YOUR AGGREGATION PIPELINE GETS THE MONTH WRONG
	 
	 { $group: {
				_id :{ 
				// "year":{$year: "$date_value"}, //CAUSED A PROBLEM 07/07/2017
				// "month":{$month:  "$date_value"}, //CAUSED A PROBLEM 07/07/2017
						  "year":{$year:route_functions.mongo_aggregator},  //FIXED AN ISSUE 07/07/2017
						  "week":{$week:route_functions.mongo_aggregator}, //FIXED AN ISSUE 07/07/2017
					//	day: { $dayOfMonth : [{ $subtract: [ "$timestamp", 25200000 ]}] },
					 venue:'$museum_id'
					},               
				
				   visits: {$sum: '$value' }
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

			returned_data=route_functions.wind_up_Stats_weekly(result,venues)
			res.json(returned_data)
				
})
});

/* GET /todos listing. */
router.get('/kpis', function(req, res, next) {

function get_kpis(cb){

Kpi_aggregate.aggregate([
 //HOLY CRAP ITS NOT FUN WHEN YOUR AGGREGATION PIPELINE GETS THE MONTH WRONG
 //NB the app injesting this needs logic based round the position in the financial year
	{$project:{"date":1,
					"value":1,
					"museum_id":1,
			
			
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
					{$group:{"_id":{"year":"$year" ,"financial_yer":"$financial_yer"}, 
					total_sessions: {$sum: '$value' },
			
					
					}}	

    ], function (err, result) {
	var d = new Date();
d.setFullYear(d.getFullYear() - 1);

	console.log(d)
Kpi_aggregate.aggregate([
 //HOLY CRAP ITS NOT FUN WHEN YOUR AGGREGATION PIPELINE GETS THE MONTH WRONG
 
 
    { $match:  { "date_value": { '$lte':d } }   },
	{$project:{"date_value":1,
					"value":1,
					"museum_id":1,
			
			
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
					{$group:{"_id":{"ltd_year":"$year" ,"ltd_financial_yer":"$financial_yer"}, 
					total_sessions: {$sum: '$value' },
			
					
					}}	

    ], function (err, result2) {
	console.log(result2)
	
        if (err) {
            console.log(err);
        } else {

		cb(result.concat(result2))
		   	//mongoose.connection.close()	
        }
		
    });
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
	
	
//returned_data=route_functions.wind_up_Stats_monthly(result,venues)
res.json(result)
	
})



});


/* GET /todos listing. */
router.get('/all', function(req, res, next) {

function get_kpis(cb){

Kpi_aggregate.aggregate([
 //HOLY CRAP ITS NOT FUN WHEN YOUR AGGREGATION PIPELINE GETS THE MONTH WRONG
 
 { $group: {
			_id :{ 
			// "year":{$year: "$date_value"}, //CAUSED A PROBLEM 07/07/2017
			// "month":{$month:  "$date_value"}, //CAUSED A PROBLEM 07/07/2017
					  "year":{$year:route_functions.mongo_aggregator},  //FIXED AN ISSUE 07/07/2017
					  "month":{$month:route_functions.mongo_aggregator}, //FIXED AN ISSUE 07/07/2017
				//	day: { $dayOfMonth : [{ $subtract: [ "$timestamp", 25200000 ]}] },
				 venue:'$museum_id'
				},               
			
               visits: {$sum: '$value' }
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
	
	
returned_data=route_functions.wind_up_Stats_monthly(result,venues)
res.json(returned_data)
	
})



});

router.get('/year_month/:year/:month', function(req, res, next) {
	
	
Kpi_aggregate.aggregate([

         {$project:
              {
                    _id: "$museum_id",
					value: "$value",
				   month : {$month:route_functions.mongo_aggregator},
                   year : {$year:route_functions.mongo_aggregator}
              }
         },
		   { $match: { $and: [ { 'month' : parseInt(req.params.month) }, {  'year' : parseInt(req.params.year)     } ] } },
           { $group: { _id: "$_id", visits: { $sum: '$value' } } }

    ], function (err, result) {
        if (err) {
            next(err);
        } else {
            res.json(result);
        }
    });
});


router.get('/', function(req, res, next) {
Kpi_aggregate.aggregate([
        
		{
            $group: {
                _id: { 
				museum : "$museum_id" , 
				year : { $year : route_functions.mongo_aggregator },        
				month : { $month :route_functions.mongo_aggregator },        
					 
					 
					 },  
               visits: {$sum: '$value' }
            }
        }
		
    ], function (err, result) {
        if (err) {
            next(err);
        } else {
            res.json(result);
        }
    });
});
/* POST /todos */
router.post('/',isAuthenticated, function(req, res, next) {
  Kpi_aggregate.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* GET /todos/id */
router.get('/:id', isAuthenticated,function(req, res, next) {
  Kpi_aggregate.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* PUT /todos/:id */
router.put('/:id', isAuthenticated,function(req, res, next) {
  Kpi_aggregate.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});


/* DELETE /todos/:id */
router.delete('/:id',isAuthenticated, function(req, res, next) {
  Kpi_aggregate.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});



module.exports = router;
