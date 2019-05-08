var Route_functions = require('../functions/route_functions.js');

route_functions=new Route_functions()

var express = require('express');
var router = express.Router();

var _ = require('underscore');
var json2csv =  require('json2csv');
Route_permissions= require('../functions/route_permissions.js');
route_permissions=new Route_permissions()
Api_calls= require('../functions/standard_api_calls.js');

	var venues=[]
	var types=[]
var isAuthenticated = function (req, res, next) {
	console.log('if user is authenticated in the session, call the next() to call the next request handler ')
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
	if (req.user.group=="DEFAULT") return false ;
		return next();

	return false
}

var Team = require('../../models/performance/Donations.js');
var Gidftaid = require('../../models/performance/Giftaid.js');
var Welcomedesk = require('../../models/performance/Welcomedesk.js');
var Patron = require('../../models/performance/Patron.js');
var Corporate = require('../../models/performance/Corporate.js');
var Donations_other = require('../../models/performance/Donations_other.js');
var Cache = require('../../models/cache/cache.js');
//aggregation




router.get('/total', function(req, res, next) {
	
	
		function get_kpis(cb){	
			
			
					Team.aggregate([
								
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
					{$group:{"_id":{"year":"$year" ,"financial_yer":"$financial_yer" ,kpi_venue:'$museum_id'}, donations: {$sum: '$donation_box_amount' }}},

				
							

						], function (err, donations) {
						
		Gidftaid.aggregate([
								
					{$project:{"date":1,"amount":1,"museum_id":1,
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
					{$group:{"_id":{"year":"$year" ,"financial_yer":"$financial_yer" ,pwyt_venue:'$museum_id'}, giftaid_income: {$sum: '$amount' }}},

						], function (err, giftaid_incomes) {

									
							_.each(donations,function(gal,i){
								if(gal.donations>0){
									_.each(giftaid_incomes,function(pwyt,ii){
										if( pwyt._id.pwyt_venue==gal._id.kpi_venue  && pwyt._id.year==gal._id.year && pwyt._id.financial_yer==gal._id.financial_yer){					
											donations[i].giftaid_income=pwyt.giftaid_income
										}
									})
								}
							})
							
							cb(donations)
									
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
						
								var years = [2014,2015,2016,2017,2018,2019]
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
							returned_row.stat="Donations"
							returned_data.push(	 wind_up_Stats(	result,returned_row,"donations",venue))
						var returned_row={}
							returned_row.museum=venue
							returned_row.stat="Gift Aid"
							returned_data.push(	 wind_up_Stats(	result,returned_row,"giftaid_income",venue))

						})

					route_functions.ad_percentage_last_year(returned_data)
		
					
					res.json(returned_data)
			
		})



});

router.get('/weekly', function(req, res, next) {

function get_kpis(cb){

Team.aggregate([
			


		{ $group: {
                _id: { 

						"kpi_year": { "$year":  route_functions.mongo_aggregator }, 
						"kpi_week": { "$week":route_functions.mongo_aggregator }, 					   
					   kpi_venue:'$museum_id',
					   
					 },  
				
                donations: {$sum: '$donation_box_amount' }
			 
		      
            }
		 },

	 { $project : {kpi_venue:"$_id.kpi_venue", kpi_year :"$_id.kpi_year", kpi_week :"$_id.kpi_week", donations:"$donations"}  },

		

    ], function (err, result) {
	
	Gidftaid.aggregate([
			


		{ $group: {
                _id: { 
				 "year": { "$year": route_functions.mongo_aggregator }, 
						"month":  { "$month":route_functions.mongo_aggregator }, 	    
					   venue:'$museum_id',
					   
					 },  
				
               amount: {$sum: '$amount' },
			 no_envelopes: {$sum: '$no_envelopes' }
		      
            }
		 },

	 { $project : {venue:"$_id.venue", year :"$_id.year", month :"$_id.month",donations:'$donations', gift_aid_amount:"$amount", no_envelopes:"$no_envelopes"}  },

		
	  ], function (err, result2) {
	
        if (err) {
            console.log(err);
        } else {
		
		
		_.each(result,function(kpi,i){
			_.each(result2,function(visits,ii){
			//console.log(visits.year)
			if(kpi.kpi_venue==visits.venue &&  kpi.kpi_week==visits.month && kpi.kpi_year==visits.year){
			result[i].gift_aid_amount=visits.gift_aid_amount
						
			result[i].no_envelopes=visits.no_envelopes
			result[i].conversion=(kpi.number_transactions/visits.visits*100).toFixed(2)+"%";    
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
		//	console.log('adding venue ',row.kpi_venue)
			venues.push(row.kpi_venue)
		}
	})
	
	function wind_up_Stats(	result,returned_row,analysis_field,venue){
		var years = [2014,2015,2016,2017,2018,2019]
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
		
	var returned_row={}
		returned_row.museum=venue
		returned_row.stat="total"
		returned_data.push(	 wind_up_Stats(	result,returned_row,"total",venue))
	var returned_row={}
		returned_row.museum=venue
		returned_row.stat="Donations"
		returned_data.push(	 wind_up_Stats(	result,returned_row,"donations",venue))
	var returned_row={}
		returned_row.museum=venue
		returned_row.stat="Gift aid"
		returned_data.push(	 wind_up_Stats(	result,returned_row,"gift_aid_amount",venue))
			var returned_row={}
		returned_row.museum=venue
		returned_row.stat="No envelopes"
		returned_data.push(	 wind_up_Stats(	result,returned_row,"no_envelopes",venue))
	/*
	var returned_row={}
		returned_row.museum=venue
		returned_row.stat="visits"
		returned_data.push(	 wind_up_Stats(	result,returned_row,"visits",venue))
	
	var returned_row={}
		returned_row.museum=venue
		returned_row.stat="conversion"
		returned_data.push(	 wind_up_Stats(	result,returned_row,"conversion",venue))
*/	
	})


res.json(returned_data)
	
})



});
/* GET /todos listing. */


router.get('/all', function(req, res, next) {
	

if(req.query.cache){
	
	var query={ type: 'monthly_development', row_name: "cheese" }
 
    Cache.findOne(query, {}, { sort: { 'date_cached' : -1 } })    
  
  
	   .populate('leave_taken')
	     .sort({date_value: 'desc'})
	   .exec (  function (err, todos) {
    if (err) return next(err);
	
	var data_to_return = []
	
	data_to_return=todos.cache

	if(req.params.csv){
			res.setHeader('Content-disposition', 'attachment; filename=data.csv');
			res.set('Content-Type', 'text/csv');
			var fields = ['museum_id', 'date_value', 'value'];
			var csv = json2csv({ data: todos, fields: fields });
			res.status(200).send(csv);

	}
	else
	{
		res.json(data_to_return);
	}
  })

}

else
	
{

			var months=moment.monthsShort()

			route_functions.get_kpis( Team,Gidftaid,Welcomedesk,Patron,Corporate,Donations_other,req,function ( result) {
				
				var venues=[]
				_.each(result,function(row){
					if(venues.indexOf(row.kpi_venue)==-1){
						
						venues.push(row.kpi_venue)
					}
				})
					
				var returned_data=[]
				
				returned_data=route_functions.sort_data(result,venues,returned_data)
				
route_functions.datacache(Cache,returned_data)
			
				res.json(returned_data)
				
			})

}

});

/* GET /todos listing. */
router.get('/', function(req, res, next) {

  Team.find()
	   .populate('leave_taken')
	    .sort({date_value: 'desc'})
	   .exec (  function (err, todos) {
    if (err) return next(err);
    
	if(req.params.csv){

	

 res.setHeader('Content-disposition', 'attachment; filename=donations.csv');
  res.set('Content-Type', 'text/csv');
    var fields = ['museum_id', 'donation_box_amount', 'donation_box_no','date','comments','logger_user_name','date_recorded'];
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
    var fields = ['museum_id', 'donation_box_amount', 'donation_box_no','date','comments','logger_user_name','date_recorded'];
     var csv = json2csv({ data: todos, fields: fields });
  res.status(200).send(csv);

	
  })
});


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



