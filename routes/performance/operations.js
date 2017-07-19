var Route_functions = require('../functions/route_functions.js');
route_functions=new Route_functions()
var express = require('express');
var router = express.Router();
var _ = require('underscore');
var json2csv =  require('json2csv');

var isAuthenticated = function (req, res, next) {
	console.log('if user is authenticated in the session, call the next() to call the next request handler ')
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
	if (req.user.group=="DEFAULT") return false ;
		return next();

	return false
}

var Team = require('../../models/performance/Operations.js');


var Kpi_aggregate = require('../../models/Kpi_log.js');




router.get('/all', function(req, res, next) {

function get_kpis(cb){

Team.aggregate([
			


		{ $group: {
                _id: { 
				
				 "kpi_year": { "$year": route_functions.mongo_aggregator }, 
						"kpi_month": { "$month": route_functions.mongo_aggregator }, 
				
				
				 
					   kpi_venue:'$museum_id',
					   
					 },  
				
               no_complaints: {$sum: '$no_complaints' },
			   health_and_safety_froms: {$sum: '$health_and_safety_froms' },
			
	
            }
		 },
		 

	 { $project : {kpi_venue:"$_id.kpi_venue", kpi_year :"$_id.kpi_year", kpi_month :"$_id.kpi_month",no_complaints:'$no_complaints',  health_and_safety_froms:"$health_and_safety_froms"  }},

		

    ], function (err, result) {
	if(err) console.log(err)
	//console.log(result)
	Kpi_aggregate.aggregate([
			


		{ $group: {
                _id: { year : { $year : route_functions.mongo_aggregator },        
					   month : { $month : route_functions.mongo_aggregator },        
					   venue:'$museum_id',
					   
					 },  
				
               visits: { $sum:  { $sum: [ "$value" ] }} ,
			
		      
            }
		 },

	 { $project : {venue:"$_id.venue", year :"$_id.year", month :"$_id.month",visits:"$visits"}  },

		
	  ], function (err, result2) {
	
        if (err) {
           // console.log(err);
        } else {
		
		
		
			_.each(result2,function(visits,ii){
				_.each(result,function(operation,i){
				
				if(operation.kpi_venue==visits.venue &&  operation.kpi_month==visits.month && operation.kpi_year==visits.year){
					
					result2[ii].no_complaints=operation.no_complaints
					result2[ii].health_and_safety_froms=operation.health_and_safety_froms
					result2[ii].kpi_venue=operation.kpi_venue
					
				}
				
				
				})
			})

	cb(result2)
		  
        }
		
    });
	    });
}

get_kpis( function ( result) {
	

	
	
	

	
	//load venues
	var venues=[]
	_.each(result,function(row){
		if(venues.indexOf(row.kpi_venue)==-1){
			//console.log('adding venue ',row.kpi_venue)
			venues.push(row.kpi_venue)
		}
	})
	
	function wind_up_Stats(	result,returned_row,analysis_field,venue){
	var years = [2014,2015,2016,2017,2018]
			_.each(years,function(year){
			_.each(moment.monthsShort(),function(month){
			
			returned_row[month+" "+year]=""
				_.each(result,function(row){
					if(month==moment.monthsShort(row.month-1) &&venue==row.venue &&row.year==year){
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
		returned_row.stat="Visits"
		returned_data.push(	 wind_up_Stats(	result,returned_row,"visits",venue))
	var returned_row={}
		returned_row.museum=venue
		returned_row.stat="No. Complaints"
		returned_data.push(	 wind_up_Stats(	result,returned_row,"no_complaints",venue))

			var returned_row={}
		returned_row.museum=venue
		returned_row.stat="No. H&S forms"
		returned_data.push(	 wind_up_Stats(	result,returned_row,"health_and_safety_forms",venue))

	
	})


res.json(returned_data)
	
})



});




router.get('/total', function(req, res, next) {
	
	
		function get_kpis(cb){	
			
	
			
					Team.aggregate([
								
					{$project:{"date":1,"non_vat_sales":1,"health_and_safety_forms":1,"no_complaints":1,"museum_id":1,
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
					{$group:{"_id":{"year":"$year" ,"financial_yer":"$financial_yer" ,kpi_venue:'$museum_id'}, health_and_safety_forms: {$sum: '$health_and_safety_forms' }, no_complaints: {$sum: '$no_complaints' }}},

				
							

						], function (err, operations) {
						
		Kpi_aggregate.aggregate([
								
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
					{$group:{"_id":{"year":"$year" ,"financial_yer":"$financial_yer" ,kpi_venue:'$museum_id'}, visits: {$sum: '$value' }}},

						], function (err, visits) {
									
							_.each(operations,function(gal,i){
								
									_.each(visits,function(pwyt,ii){
										if( pwyt._id.kpi_venue==gal._id.kpi_venue  && pwyt._id.year==gal._id.year && pwyt._id.financial_yer==gal._id.financial_yer){					
											console.log(pwyt)
											visits[ii].no_complaints=gal.no_complaints
											visits[ii].health_and_safety_forms=gal.health_and_safety_forms
										}
									})
								
							})
							
							cb(visits)
									
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
							returned_row.stat="Visits"
							returned_data.push(	 wind_up_Stats(	result,returned_row,"visits",venue))
						var returned_row={}
							returned_row.museum=venue
							returned_row.stat="No Complatins"
							returned_data.push(	 wind_up_Stats(	result,returned_row,"no_complaints",venue))
						var returned_row={}
							returned_row.museum=venue
							returned_row.stat="H & S forms"
							returned_data.push(	 wind_up_Stats(	result,returned_row,"health_and_safety_forms",venue))

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
var fields = ['museum_id', 'total_sales', 'non_vat_sales', 'no_transactions','date','comments','logger_user_name','date_recorded'];
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
router.get('/:museum_id/:date_value',isAuthenticated, function(req, res, next) {
var query = {'museum_id':req.params.museum_id,'date_value':req.params.date_value}
  Team.find(query)
	   .exec (  function (err, todos) {
    if (err) return next(err);
    res.json(todos);
  })
});

/* POST /todos */
router.post('/', isAuthenticated, function(req, res, next) {
  Team.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* GET /todos/id */
router.get('/:id', isAuthenticated, function(req, res, next) {
  Team.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* PUT /todos/:id */
router.put('/:id', isAuthenticated, function(req, res, next) {
  Team.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});


/* DELETE /todos/:id */
router.delete('/:id', isAuthenticated, function(req, res, next) {
  Team.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});



module.exports = router;

module.exports = router;
