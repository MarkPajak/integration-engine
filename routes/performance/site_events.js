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

var Team = require('../../models/performance/Events.js');



router.get('/total', function(req, res, next) {

function get_kpis(cb){


		Team.aggregate([
								
					{$project:{ museum_id : 1 ,
								on_site_off_site : 1 ,
								age_groups : 1,
								event_name:1,
								session_type:1,
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
					{ $unwind : "$age_groups" },
					{$group:{"_id":{"year":"$year" ,"financial_yer":"$financial_yer" , venue:'$museum_id',
						on_site_off_site:'$on_site_off_site',
					    age_groups:'$age_groups.name'}, count: {$sum: '$age_groups.count' }}
					}


    ], function (err, result) {

        if (err) {
            console.log(err);
        } else {
			cb(result)
			console.log(result)
        }
		
    });
	
}

get_kpis( function ( result) {
	

	
	
	

	
	//load venues
	var venues=[]
	var age_groups=[]
	var on_site_off_site=[]
	
	_.each(result,function(row){
		if(venues.indexOf(row._id.venue)==-1){
			console.log('adding venue ',row._id.venue)
			venues.push(row._id.venue)
		}
		
		if(age_groups.indexOf(row._id.age_groups)==-1){
			console.log('adding age_groups ',row._id.age_groups)
			age_groups.push(row._id.age_groups)
		}
		
		if(on_site_off_site.indexOf(row._id.on_site_off_site)==-1){
			console.log('adding on_site_off_site ',row._id.on_site_off_site)
			on_site_off_site.push(row._id.on_site_off_site)
		}
	})
	
	function wind_up_Stats(	result,returned_row,analysis_field,venue,on_site_off_site,age_group){
		
		
				var years = [2014,2015,2016,2017,2018]
								_.each(years,function(year){
									var financial_yesr_text = ["last","this"]
									_.each(financial_yesr_text,function(financial_yer_text){
									
										_.each(result,function(row){
											if(age_group==row._id.age_groups &&on_site_off_site==row._id.on_site_off_site &&venue==row._id.venue &&row._id.financial_yer==financial_yer_text&&row._id.year==year){
												
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
	_.each(on_site_off_site,function(on_off_site){			
		_.each(age_groups,function(age_group){	
		
		var returned_row={}
			returned_row.museum=venue
			returned_row.age_group=age_group
			returned_row.on_off_site=on_off_site
			returned_row.stat="Age Group"
			//returned_data.push(	 wind_up_Stats(	result,returned_row,"age_groups",venue,age_group))
			
			var returned_row={}
			returned_row.museum=venue
			returned_row.age_group=age_group
			returned_row.on_off_site=on_off_site
			returned_row.stat="count"
			returned_data.push(	 wind_up_Stats(	result,returned_row,"count",venue,on_off_site,age_group))
		


		})
	})
})

res.json(returned_data)
	
})



});
router.get('/all/:event_type', function(req, res, next) {

function get_kpis(cb){

Team.aggregate([
	{ $match: { on_site_off_site:req.params.event_type } },
    { $project : {
        museum_id : 1 ,
        on_site_off_site : 1 ,
        date_value : 1,
		age_groups : 1,
		event_name:1,
		session_type:1,

		
    }},
    { $unwind : "$age_groups" },

		{ $group: {
                       _id: {
						"year": { "$year": route_functions.mongo_aggregator }, 
						"month": { "$month": route_functions.mongo_aggregator }, 

					      
					    venue:'$museum_id',
						on_site_off_site:'$on_site_off_site',
					    age_groups:'$age_groups.name',
						
					   
					 },  
				
					count: {$sum: '$age_groups.count' },
				
			 
		      
            }
		 },

	// { $project : {venue:"$_id.venue",age_groups:"$_id.age_groups", session_type:"$_id.session_type", kpi_year :"$_id.year", kpi_month :"$_id.month"}  },
	{ $sort : { age_groups : 1 } }
		

    ], function (err, result) {

        if (err) {
            console.log(err);
        } else {
		


	cb(result)
	//console.log(result)

		   	//mongoose.connection.close()	
        }
		
    });
	   // });
}

get_kpis( function ( result) {
	

	
	
	

	
	//load venues
	var venues=[]
	var age_groups=[]
	var on_site_off_site=[]
	
	_.each(result,function(row){
		if(venues.indexOf(row._id.venue)==-1){
			console.log('adding venue ',row._id.venue)
			venues.push(row._id.venue)
		}
		
		if(age_groups.indexOf(row._id.age_groups)==-1){
			console.log('adding age_groups ',row._id.age_groups)
			age_groups.push(row._id.age_groups)
		}
		
		if(on_site_off_site.indexOf(row._id.on_site_off_site)==-1){
			console.log('adding on_site_off_site ',row._id.on_site_off_site)
			on_site_off_site.push(row._id.on_site_off_site)
		}
	})
	
	function wind_up_Stats(	result,returned_row,analysis_field,venue,on_site_off_site,age_group){
		
		
		var years = [2016,2017,2018]
			_.each(years,function(year){
			_.each(moment.monthsShort(),function(month){
				returned_row[month+" "+year]=""
				_.each(result,function(row){
					if(month==moment.monthsShort(row._id.month-1)&&on_site_off_site==row._id.on_site_off_site  &&age_group==row._id.age_groups&&venue==row._id.venue &&row._id.year==year){
console.log(row)					
					if(row[analysis_field]>0){
						
							returned_row[month+" "+year]=row[analysis_field]
							
						}
					}
				})
			})	
		})
		return(returned_row)
	}
	
	
	
	var returned_data=[]

	_.each(venues,function(venue){
	_.each(on_site_off_site,function(on_off_site){			
		_.each(age_groups,function(age_group){	
		
		var returned_row={}
			returned_row.museum=venue
			returned_row.age_group=age_group
			returned_row.on_off_site=on_off_site
			returned_row.stat="Age Group"
			//returned_data.push(	 wind_up_Stats(	result,returned_row,"age_groups",venue,age_group))
			
			var returned_row={}
			returned_row.museum=venue
			returned_row.age_group=age_group
			returned_row.on_off_site=on_off_site
			returned_row.stat="count"
			returned_data.push(	 wind_up_Stats(	result,returned_row,"count",venue,on_off_site,age_group))
		


		})
	})
})

res.json(returned_data)
	
})



});
//aggregation
/* GET /todos listing. */
router.get('/all/:csv*?', function(req, res, next) {

function get_kpis(cb){

Team.aggregate([
			


		{ $group: {
                       _id: {
 "year": { "$year": route_functions.mongo_aggregator }, 
						"month": { "$month": route_functions.mongo_aggregator }, 

					      
					    venue:'$museum_id',
						session_type:'$session_type',
					    age_group:'$age_group',
						
					   
					 },  
				
					total_sessions: {$sum: '$total_sessions' },
					total_children: {$sum: '$total_children' },
					total_teachers: {$sum: '$total_teachers' },
					total_income: {$sum: '$total_income' }
			 
		      
            }
		 },

	 { $project : {venue:"$_id.venue",age_group:"$_id.age_group", session_type:"$_id.session_type", total_income:"$total_income",total_sessions:"$total_sessions", total_teachers:"$total_teachers",total_children:"$total_children",kpi_year :"$_id.year", kpi_month :"$_id.month"}  },
	{ $sort : { age_group : 1 } }
		

    ], function (err, result) {

        if (err) {
            console.log(err);
        } else {
		
		
		_.each(result,function(visits,i){
			//_.each(result2,function(visits,ii){
			//console.log(visits.year)
			//if(kpi.kpi_venue==visits.venue &&  kpi.kpi_month==visits.month && kpi.kpi_year==visits.year){
			result[i].kpi_venue=visits.venue
			result[i].age_group=visits.age_group
			result[i].session_type=visits.session_type
			result[i].total_sessions=visits.total_sessions
			result[i].total_children=visits.total_children
			result[i].total_teachers=visits.total_teachers
			result[i].total_income=visits.total_income
			//result[i].conversion=(kpi.number_transactions/visits.visits*100).toFixed(2)+"%";    
			//}
			
			
			//})
		})
		
		
//res.json(result)

if(req.params.csv){


 res.setHeader('Content-disposition', 'attachment; filename=data.csv');
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
	   // });
}

get_kpis( function ( result) {
	

	
	
	

	
	//load venues
	var venues=[]
	var age_groups=[]
	var session_types=[]
	
	_.each(result,function(row){
		if(venues.indexOf(row.kpi_venue)==-1){
			console.log('adding venue ',row.kpi_venue)
			venues.push(row.kpi_venue)
		}
		
		if(age_groups.indexOf(row.age_group)==-1){
			console.log('adding age_group ',row.age_group)
			age_groups.push(row.age_group)
		}
		
		if(session_types.indexOf(row.session_type)==-1){
			console.log('adding session_type ',row.session_type)
			session_types.push(row.session_type)
		}
	})
	
	function wind_up_Stats(	result,returned_row,analysis_field,venue,session_type,age_group){
		
		
		var years = [2016,2017,2018]
			_.each(years,function(year){
			_.each(moment.monthsShort(),function(month){
				returned_row[month+" "+year]=""
				_.each(result,function(row){
					if(month==moment.monthsShort(row.kpi_month-1)&&session_type==row.session_type  &&age_group==row.age_group&&venue==row.kpi_venue &&row.kpi_year==year){
						if(row[analysis_field]>0){
							returned_row[month+" "+year]=row[analysis_field]
						}
					}
				})
			})	
		})
		return(returned_row)
	}
	
	
	
	var returned_data=[]

	_.each(venues,function(venue){
	_.each(session_types,function(session_type){			
		_.each(age_groups,function(age_group){	
		
		var returned_row={}
			returned_row.museum=venue
			returned_row.age_group=age_group
			returned_row.session_type=session_type
			returned_row.stat="Age Group"
		//	returned_data.push(	 wind_up_Stats(	result,returned_row,"age_group",venue,age_group))
		

		var returned_row={}
			returned_row.museum=venue
			returned_row.age_group=age_group
			returned_row.session_type=session_type
			returned_row.stat="Sessions"
			returned_data.push(	 wind_up_Stats(	result,returned_row,"total_sessions",venue,session_type,age_group))

		var returned_row={}
			returned_row.museum=venue
			returned_row.age_group=age_group
			returned_row.session_type=session_type
			returned_row.stat="Children"
			returned_data.push(	 wind_up_Stats(	result,returned_row,"total_children",venue,session_type,age_group))
		
		var returned_row={}
			returned_row.museum=venue
				returned_row.age_group=age_group
				returned_row.session_type=session_type
			returned_row.stat="Teachers"
			returned_data.push(	 wind_up_Stats(	result,returned_row,"total_teachers",venue,session_type,age_group))
		var returned_row={}
			returned_row.museum=venue
				//returned_row.age_group=age_group
			returned_row.stat="Income"
			returned_data.push(	 wind_up_Stats(	result,returned_row,"total_income",venue,session_type,age_group))

		})
	})
})

res.json(returned_data)
	
})



});

/* GET /todos listing. */
router.get('/age', function(req, res, next) {

function get_kpis(cb){

Team.aggregate([
			


		{ $group: {
                       _id: {
 "year": { "$year": route_functions.mongo_aggregator }, 
						//"month": { "$month": route_functions.mongo_aggregator }, 

					      
					   venue:'$museum_id',
					    age_group:'$age_group',
					   
					 },  
				
					total_sessions: {$sum: '$total_sessions' },
					total_children: {$sum: '$total_children' },
					total_teachers: {$sum: '$total_teachers' },
					total_income: {$sum: '$total_income' },
					
			 
		      
            }
		 },
 
	 { $project : {venue:"$_id.venue",age_group:"$_id.age_group",  total_income:"$total_income",total_sessions:"$total_sessions", total_teachers:"$total_teachers",total_children:"$total_children",kpi_year :"$_id.year", kpi_month :"$_id.month"}  },

	{ $sort : { age_group : 1 } }

    ], function (err, result) {

        if (err) {
            console.log(err);
        } else {
		
		
		_.each(result,function(visits,i){
			//_.each(result2,function(visits,ii){
			//console.log(visits.year)
			//if(kpi.kpi_venue==visits.venue &&  kpi.kpi_month==visits.month && kpi.kpi_year==visits.year){
			result[i].kpi_venue=visits.venue
			result[i].age_group=visits.age_group
			result[i].total_sessions=visits.total_sessions
			result[i].total_children=visits.total_children
			result[i].total_teachers=visits.total_teachers
			result[i].total_income=visits.total_income
			//result[i].conversion=(kpi.number_transactions/visits.visits*100).toFixed(2)+"%";    
			//}
			
			
			//})
		})
		
		
//res.json(result)

if(req.params.csv){


 res.setHeader('Content-disposition', 'attachment; filename=data.csv');
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
	   // });
}

get_kpis( function ( result) {
	

	
	
	

	
	//load venues
	var venues=[]
	var age_groups=[]
	_.each(result,function(row){
		if(venues.indexOf(row.kpi_venue)==-1){
			console.log('adding venue ',row.kpi_venue)
			venues.push(row.kpi_venue)
		}
		
		if(age_groups.indexOf(row.age_group)==-1){
			console.log('adding age_group ',row.age_group)
			age_groups.push(row.age_group)
		}
	})
	
	function wind_up_Stats(	result,returned_row,analysis_fields,venue,age_group){
		
		
		var years = [2016,2017,2018]
			_.each(years,function(year){
			//_.each(moment.monthsShort(),function(month){
				returned_row[year]=""
				_.each(analysis_fields,function(analysis_field){
					_.each(result,function(row){
						
						
					if(age_group==row.age_group&&venue==row.kpi_venue &&row.kpi_year==year){
						//if(row[analysis_field]>0){
							field = year+" "+analysis_field
							returned_row[field]=row[analysis_field]
						//}
					}
				//})
				})	
			})	
		})
		return(returned_row)
	}
	
	
	
	var returned_data=[]

	_.each(venues,function(venue){
	_.each(age_groups,function(age_group){	
	
	var returned_row={}
		returned_row.museum=venue
		returned_row.age_group=age_group
		returned_row.stat="2016 sessions"
		var column_headings=[]
		column_headings.push("total_sessions")
		column_headings.push("total_children")
		column_headings.push("total_teachers")
		column_headings.push("total_income")
		returned_data.push(	 wind_up_Stats(	result,returned_row,column_headings,venue,age_group))
	
})
})
res.json(returned_data)
	
})


});

/* GET /todos listing. */
router.get('/', function(req, res, next) {

  Team.find()
	   .populate('leave_taken')
	     .sort({date_value: 'desc'})
	   .exec (  function (err, todos) {
    if (err) return next(err);
	
	if(req.params.csv){
			res.setHeader('Content-disposition', 'attachment; filename=data.csv');
			res.set('Content-Type', 'text/csv');
			var fields = ['museum_id', 'date_value', 'value'];
			var csv = json2csv({ data: todos, fields: fields });
			res.status(200).send(csv);

	}
	else
	{
		res.json(todos);
	}
  })
});


router.get('/target/:csv', function(req, res, next) {

  Team.aggregate( [	{$project:{ museum_id : 1 ,
								on_site_off_site : 1 ,
								target_groups : 1,
								event_name:1,
								date: { $dateToString: { format: "%d/%m/%Y", date: route_functions.mongo_aggregator } }							  
										
					}}
					, { $unwind :'$target_groups' },
					
					{
					$project:{museum_id : 1 ,date : 1 ,on_site_off_site : 1 ,event_name:1,name :'$target_groups.name'}
					}])
	   .exec (  function (err, todos) {
    if (err) return next(err);
	
	if(req.params.csv){
			res.setHeader('Content-disposition', 'attachment; filename=data.csv');
			res.set('Content-Type', 'text/csv');
			var fields = ['museum_id','date', 'on_site_off_site', 'event_name','name'];
			var csv = json2csv({ data: todos, fields: fields });
			res.status(200).send(csv);

	}
	else
	{
		res.json(todos);
	}
  })
});
router.get('/:csv', function(req, res, next) {

  Team.aggregate( [	{$project:{ museum_id : 1 ,
								on_site_off_site : 1 ,
								age_groups : 1,
								event_name:1,
								date: { $dateToString: { format: "%d/%m/%Y", date: route_functions.mongo_aggregator } }							  
										
					}}
					, { $unwind :'$age_groups' },
					
					{
					$project:{museum_id : 1 ,date : 1 ,on_site_off_site : 1 ,event_name:1,name :'$age_groups.name' ,count :'$age_groups.count' }
					}])
	   .exec (  function (err, todos) {
    if (err) return next(err);
	
	if(req.params.csv){
			res.setHeader('Content-disposition', 'attachment; filename=data.csv');
			res.set('Content-Type', 'text/csv');
			var fields = ['museum_id','date', 'on_site_off_site', 'event_name','name','count'];
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
router.get('/:museum_id/:date_value/:on_site_off_site/:exact',isAuthenticated, function(req, res, next) {

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

if(decodeURIComponent(req.params.on_site_off_site)!="#"){
 _.extend(query,{on_site_off_site: req.params.on_site_off_site})
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
