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
	if (req.isAuthenticated() )
	if (req.user.group=="DEFAULT") return false ;
		console.log( 'username',req.user.group)
		return next();

	return false
}

var Team = require('../../models/performance/Retail_sales.js');


var Kpi_aggregate = require('../../models/Kpi_log.js');
//aggregation
/* GET /todos listing. */


router.get('/total', function(req, res, next) {
	
	
		function get_kpis(cb){	
			
	
			
					Team.aggregate([
					
					{$project:{"date":1,"non_vat_sales":1,"total_sales":1,"no_transactions":1,"museum_id":1,
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
					{$group:{"_id":{"year":"$year" ,"financial_yer":"$financial_yer" ,kpi_venue:'$museum_id'}, number_transactions: {$sum: '$no_transactions' }, non_vat_sales: {$sum: '$non_vat_sales' }, total_sales: {$sum: '$total_sales' }}},

				
							

						], function (err, retail_sales) {
						
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
					{$group:{"_id":{"year":"$year" ,"financial_yer":"$financial_yer" ,pwyt_venue:'$museum_id'}, visits: {$sum: '$value' }}},

						], function (err, visits) {
									
							_.each(retail_sales,function(gal,i){
								
									_.each(visits,function(pwyt,ii){
										if( pwyt._id.pwyt_venue==gal._id.kpi_venue  && pwyt._id.year==gal._id.year && pwyt._id.financial_yer==gal._id.financial_yer){					
										
											retail_sales[i].visits=pwyt.visits
										}
									})
								
							})
							
							cb(retail_sales)
									
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
						
									var years = [2014,2015,2016,2017,2018,201,2020]
								_.each(years,function(year){
									var financial_yesr_text = ["last","this"]
									_.each(financial_yesr_text,function(financial_yer_text){
									
									var total_sales = 0
									var non_vat_sales = 0
									var number_transactions = 0
									var visits = 0
									
									
										_.each(result,function(row){
											if(venue==row._id.kpi_venue &&row._id.financial_yer==financial_yer_text&&row._id.year==year){
												
												var financial_year_display=""
													if(financial_yer_text=="this"){
													financial_year_display=	year+"-"+((year+1).toString().substring(2))
												
													returned_row[financial_year_display]=row[analysis_field]
													total_sales=row.total_sales
													non_vat_sales=row.non_vat_sales
													number_transactions=row.number_transactions
													visits=row.visits
													
													
													}
													else
													{
													financial_year_display=	(year-1)+"-"+(year.toString().substring(2))	
													returned_row[financial_year_display]+=row[analysis_field]
													total_sales+=row.total_sales
													non_vat_sales+=row.non_vat_sales
													number_transactions+=row.number_transactions
													visits+=row.visits
												}
												
												
											
												if(analysis_field=='Net sales'){
													returned_row[financial_year_display]=((total_sales - non_vat_sales)/1.2+non_vat_sales).toFixed(2)
												}
												if(analysis_field=='conversion'){
													returned_row[financial_year_display]=((number_transactions/visits)*100).toFixed(2)+"%";
												}
												if(analysis_field=='ATV'){
												
													returned_row[financial_year_display]=((total_sales - non_vat_sales)/number_transactions).toFixed(2)
												}
												
												
										
												
												if(analysis_field=='visits'){
												//returned_row[financial_year_display]=row.visits
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
							returned_row.stat="Net sales"
							returned_data.push(	 wind_up_Stats(	result,returned_row,"Net sales",venue))
						var returned_row={}
							returned_row.museum=venue
							returned_row.stat="Sales conversion"
							returned_data.push(	 wind_up_Stats(	result,returned_row,"conversion",venue))
						var returned_row={}
							returned_row.museum=venue
							returned_row.stat="ATV"
							returned_data.push(	 wind_up_Stats(	result,returned_row,"ATV",venue))

						})


					res.json(returned_data)
			
		})



});

router.get('/week', function(req, res, next) {

function get_kpis(cb){

Team.aggregate([
			


		{ $group: {
                _id: { 
				
				
				
				"kpi_year":{$year:route_functions.mongo_aggregator}, 
				"kpi_week":{$week:route_functions.mongo_aggregator}, 
				 
					   kpi_venue:'$museum_id',
					   
					 },  
				
               non_vat_sales: {$sum: '$non_vat_sales' },
			   total_sales: {$sum: '$total_sales' },
			   number_transactions: { $sum:    "$no_transactions" } ,
	
            }
		 },
		 

	 { $project : {kpi_venue:"$_id.kpi_venue", kpi_year :"$_id.kpi_year", kpi_week :"$_id.kpi_week",number_transactions:'$number_transactions',  non_vat_sales:"$non_vat_sales", total_sales:"$total_sales"}  },

		

    ], function (err, result) {
	if(err) console.log(err)
	//console.log(result)
	Kpi_aggregate.aggregate([
			


		{ $group: {
                _id: { year : {$year:route_functions.mongo_aggregator},         
					   week :{$week:route_functions.mongo_aggregator},       
					   venue:'$museum_id',
					   
					 },  
				
               visits: { $sum:  "$value" } ,
			
		      
            }
		 },

	 { $project : {venue:"$_id.venue", year :"$_id.year", week :"$_id.week",number_transactions:'$number_transactions', non_vat_sales:'$non_vat_sales',total_sales:'$total_sales',visits:"$visits"}  },

		
	  ], function (err, result2) {
	
        if (err) {
           // console.log(err);
        } else {
		
		
		cb(route_functions.retail_stats_weekly(result,result2))
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
	
	

	
	
	var returned_data=[]

	_.each(venues,function(venue){
		
	var returned_row={}
		returned_row.museum=venue
		returned_row.stat="Net sales"
		returned_data.push(	route_functions.wind_up_Stats_weekly_variable(	result,returned_row,"net_sales",venue))
	var returned_row={}
		returned_row.museum=venue
		returned_row.stat=" % net_sales last year"
		returned_data.push(	 route_functions.wind_up_Stats_weekly_variable(	result,returned_row," % net_sales last year",venue))
	
	
	var returned_row={}
		returned_row.museum=venue
		returned_row.stat="No. of transactions"
		returned_data.push(	 route_functions.wind_up_Stats_weekly_variable(	result,returned_row,"number_transactions",venue))
	var returned_row={}
		returned_row.museum=venue
		returned_row.stat="Average transaction"
		returned_data.push(	 route_functions.wind_up_Stats_weekly_variable(	result,returned_row,"ATV",venue))
	var returned_row={}
		returned_row.museum=venue
		returned_row.stat="Visits"
		returned_data.push(	 route_functions.wind_up_Stats_weekly_variable(	result,returned_row,"visits",venue))
	var returned_row={}
		returned_row.museum=venue
		returned_row.stat="Sales conversion"
		returned_data.push(	 route_functions.wind_up_Stats_weekly_variable(	result,returned_row,"conversion",venue))
	
	})


res.json(returned_data)
	
})



});

router.get('/all', function(req, res, next) {

console.log('get all')

function get_kpis(cb){

console.log('get get_kpis')

Team.aggregate([
		{ $match : {museum_id: { $ne: "" }} },
		{ $group: {
                _id: { 
	
				"kpi_year":{$year:route_functions.mongo_aggregator}, 
				"kpi_month":{$month:route_functions.mongo_aggregator}, 				 
					   kpi_venue:'$museum_id',				   
					 },  			
               non_vat_sales: {$sum: '$non_vat_sales' },
			   total_sales: {$sum: '$total_sales' },
			   number_transactions: { $sum:    "$no_transactions" } ,
            }
		 },
		 
	{ $sort : { "total_sales" : -1} }	,
	 { $project : {kpi_venue:"$_id.kpi_venue", kpi_year :"$_id.kpi_year", kpi_month :"$_id.kpi_month",number_transactions:'$number_transactions',  non_vat_sales:"$non_vat_sales", total_sales:"$total_sales"}  },

		

    ], function (err, result) {

	if(err) console.log(err)
	
	Kpi_aggregate.aggregate([
			
		{ $group: {
                _id: { year : {$year:route_functions.mongo_aggregator},         
					   month :{$month:route_functions.mongo_aggregator},       
					   venue:'$museum_id',				   
					 },  
				
               visits: { $sum:  "$value" } ,
			      
            }
		 },

	 { $project : {venue:"$_id.venue", year :"$_id.year", month :"$_id.month",number_transactions:'$number_transactions', non_vat_sales:'$non_vat_sales',total_sales:'$total_sales',visits:"$visits"}  },

		
	  ], function (err, result2) {
	
        if (err) {
           console.log(err);
        } else {	
		cb(route_functions.retail_stats_monthly(result,result2))
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
	
	

	
	
	var returned_data=[]

	_.each(venues,function(venue){
		
			var returned_row={}
				returned_row.museum=venue
				returned_row.stat=venue+ " Net sales"
				returned_row.typex="retail"
				returned_data.push(	route_functions.wind_up_Stats_monthly_variable(		result,returned_row,"net_sales",venue))
			var returned_row={}
				returned_row.museum="last year"
				returned_row.stat="last year"
				returned_row.typex="retail"
				returned_data.push(	 route_functions.wind_up_Stats_monthly_variable(	result,returned_row,"last_year_total",venue))
			var returned_row={}
				returned_row.museum=venue
				returned_row.stat="% last year"
				
				returned_data.push(	 route_functions.wind_up_Stats_monthly_variable(	result,returned_row,"last_year",venue))
			var returned_row={}
				returned_row.museum=venue
				returned_row.stat="No. of transactions"
				returned_data.push(	 route_functions.wind_up_Stats_monthly_variable(	result,returned_row,"number_transactions",venue))
			var returned_row={}
				returned_row.museum=venue
				returned_row.stat="Average transaction"
				returned_data.push(	 route_functions.wind_up_Stats_monthly_variable(	result,returned_row,"ATV",venue))
			var returned_row={}
				returned_row.museum=venue
				returned_row.stat="Visits"
				returned_data.push(	 route_functions.wind_up_Stats_monthly_variable(	result,returned_row,"visits",venue))
			var returned_row={}
				returned_row.museum=venue
				returned_row.stat="Sales conversion"
				returned_data.push(	 route_functions.wind_up_Stats_monthly_variable(	result,returned_row,"conversion",venue))
	
	})

			var returned_row={}
				returned_row.museum="Total"
				returned_row.stat="Total"
				returned_row.typex="retail"
				returned_row.xtype="currency"
				returned_row.cssclass="summary_row"
				returned_row.csstype="summary_row"
			
		
				returned_data.push(	 route_functions.wind_up_Stats_monthly_variable(	result,returned_row,"total_s","",'net_sales',"currency"))
			
			
			
				
				
			var returned_row={}
		returned_row.museum="Last year"
		returned_row.stat="Last year"
		returned_row.xtype="currency"
		returned_row.typex="retail"
		returned_row.cssclass="summary_row"
		returned_row.csstype="summary_row"
		returned_data.push(	 route_functions.wind_up_Stats_monthly_variable(	result,returned_row,"total_sales_last_year","",'net_sales',"currency"))

				
				//route_functions.ad_percentage_last_year(returned_data)
		
		
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
			
  Team.find()
	   .populate('leave_taken')
	   .exec (  function (err, todos) {
    if (err) return next(err);
	if(req.params.csv){
     res.setHeader('Content-disposition', 'attachment; filename=donations.csv');
res.set('Content-Type', 'text/csv');
var fields = ['museum_id','net_sales', 'no_transactions', 'average_transaction','date','total_sales','comments','logger_user_name','date_recorded'];
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
/*
router.get('/:museum_id/:date_value',isAuthenticated, function(req, res, next) {
var query = {'museum_id':req.params.museum_id,'date_value':req.params.date_value}
  Team.find(query)
	   .exec (  function (err, todos) {
    if (err) return next(err);
    res.json(todos);
  })
});
*/
router.get('/:museum_id/:date_value/:exact/:end_value',isAuthenticated, function(req, res, next) {

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


  Team.find(query)
		.sort({date_value: 'desc'})
	   .exec (  function (err, todos) {
    if (err) return next(err);
    res.json(todos);
  })
});


api_calls=new Api_calls(Team,router)


module.exports = router;

