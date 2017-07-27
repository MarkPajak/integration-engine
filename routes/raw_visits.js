
var express = require('express');
var router = express.Router();
var json2csv =  require('json2csv');
var _ =  require('underscore');
Route_permissions= require('./functions/route_permissions.js');
route_permissions=new Route_permissions()

Api_calls= require('./functions/standard_api_calls.js');


var Team = require('../models/Kpi_log.js');

/* GET /todos listing. */

router.get('/groups', function(req, res, next) {


console.log('groups')

function get_kpis(cb){


		Team.aggregate([
								
			
					{ $unwind : "$visitor_groups" },
					{$group:{"_id":{"date_value":"$date_value" ,venue:'$museum_id',
					
					    visitor_groups:'$visitor_groups.name'}, count: {$sum: '$visitor_groups.count' }}
					},
					{$project:{ venue : "$_id.venue",
								visitor_groups : "$_id.visitor_groups",
								date_value: "$_id.date_value",
								count : 1 ,
							}}


    ], function (err, result) {

        if (err) {
            console.log(err);
        } else {
			cb(result)
			res.json(result)
        }
		
    });
	
}

get_kpis( function ( result) {
	

	
	
	

	
	//load venues
	var venues=[]
	var visitor_groups=[]
	var on_site_off_site=[]
	
	_.each(result,function(row){
		if(venues.indexOf(row._id.venue)==-1){
			console.log('adding venue ',row._id.venue)
			venues.push(row._id.venue)
		}
		
		if(visitor_groups.indexOf(row._id.visitor_groups)==-1){
			console.log('adding visitor_groups ',row._id.visitor_groups)
			visitor_groups.push(row._id.visitor_groups)
		}
		
		if(on_site_off_site.indexOf(row._id.on_site_off_site)==-1){
			console.log('adding on_site_off_site ',row._id.on_site_off_site)
			on_site_off_site.push(row._id.on_site_off_site)
		}
	})
	
	function wind_up_Stats(	result,returned_row,analysis_field,venue,on_site_off_site,visitor_group){
		
		
				var years = [2014,2015,2016,2017,2018]
								_.each(years,function(year){
									var financial_yesr_text = ["last","this"]
									_.each(financial_yesr_text,function(financial_yer_text){
									
										_.each(result,function(row){
											if(visitor_group==row._id.visitor_groups &&on_site_off_site==row._id.on_site_off_site &&venue==row._id.venue &&row._id.financial_yer==financial_yer_text&&row._id.year==year){
												
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
		_.each(visitor_groups,function(visitor_group){	
		
		var returned_row={}
			returned_row.museum=venue
			returned_row.visitor_group=visitor_group
			returned_row.on_off_site=on_off_site
			returned_row.stat="Age Group"
			//returned_data.push(	 wind_up_Stats(	result,returned_row,"age_groups",venue,visitor_group))
			
			var returned_row={}
			returned_row.museum=venue
			returned_row.visitor_group=visitor_group
			returned_row.on_off_site=on_off_site
			returned_row.stat="count"
			returned_data.push(	 wind_up_Stats(	result,returned_row,"count",venue,on_off_site,visitor_group))
		


		})
	})
})

//res.json(returned_data)
	
})



});


router.get('/', function(req, res, next) {

  Team.find()
	  
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
/* GET /todos listing. */
router.get('/csv', function(req, res, next) {

  Team.find()
	   .populate('leave_taken')
	   .exec (  function (err, todos) {
    if (err) return next(err);
	

			res.setHeader('Content-disposition', 'attachment; filename=data.csv');
			res.set('Content-Type', 'text/csv');
			var fields = ['museum_id', 'date', 'value'];
			var csv = json2csv({ data: todos, fields: fields });
			res.status(200).send(csv);


  })
});
/* GET /todos listing. */
router.get('/:museum_id/:date_value/:exact',route_permissions.isAuthenticated, function(req, res, next) {

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


