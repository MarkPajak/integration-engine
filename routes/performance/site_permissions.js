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

var Site_permissions = require('../../models/performance/Site_permissions.js');



//aggregation
/* GET /todos listing. */
router.get('/all', function(req, res, next) {

function get_kpis(cb){

Site_permissions.aggregate([
			


		{ $group: {
                _id: { 

						"kpi_year": { "$year": route_functions.mongo_aggregator }, 
						"kpi_month": { "$month": route_functions.mongo_aggregator }, 					   
					  // kpi_venue:'$museum_id',
					   
					 },  
				
					no_events: {$sum: '$no_events' },
					no_cancelled_events: {$sum: '$no_cancelled_events' },
					audience_figures: {$sum: '$audience_figures' },
					income_bcc: {$sum: '$income_bcc' },
					income_site_permissions: {$sum: '$income_site_permissions' }
			
			 
		      
            }
		 },

	 { $project : {kpi_year :"$_id.kpi_year", kpi_month :"$_id.kpi_month",  income_site_permissions:"$income_site_permissions",income_bcc:"$income_bcc",audience_figures:"$audience_figures", no_cancelled_events:"$no_cancelled_events",  no_events:"$no_events", no_cancelled_events:"$no_cancelled_events"}  },

		

    ], function (err, result) {

        if (err) {
            console.log(err);
        } else {
		
		
		_.each(result,function(kpi,i){
					
			result[i].no_events=kpi.no_events
			result[i].no_cancelled_events=kpi.no_cancelled_events
			result[i].audience_figures=kpi.audience_figures
			result[i].income_bcc=kpi.income_bcc
			result[i].income_site_permissions=kpi.income_site_permissions
			result[i].income_parks=kpi.income_bcc-kpi.income_site_permissions
			
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
		var years = [2014,2015,2016,2017,2018,2019,2020,2021,2022]
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
		returned_row.stat="No. events"
		returned_data.push(	 wind_up_Stats(	result,returned_row,"no_events",venue))
	
	
	var returned_row={}
		returned_row.museum=venue
		returned_row.stat="Cancelled events"
		returned_data.push(	 wind_up_Stats(	result,returned_row,"no_cancelled_events",venue))
		
	var returned_row={}
		returned_row.museum=venue
		returned_row.stat="Audience figures"
		returned_data.push(	 wind_up_Stats(	result,returned_row,"audience_figures",venue))
		
	var returned_row={}
		returned_row.museum=venue
		returned_row.stat="Total income to BCC"
			returned_row.xtype="currency"
		returned_data.push(	 wind_up_Stats(	result,returned_row,"income_bcc",venue))
		
	var returned_row={}
		returned_row.museum=venue
		returned_row.stat="Site permissions 15%"
			returned_row.xtype="currency"
		returned_data.push(	 wind_up_Stats(	result,returned_row,"income_site_permissions",venue))
		
			var returned_row={}
		returned_row.museum=venue
		returned_row.stat="Parks and Open spaces 85%"
			returned_row.xtype="currency"
		returned_data.push(	 wind_up_Stats(	result,returned_row,"income_parks",venue))
	
	
		var returned_row={}
		returned_row.museum="last year"
		returned_row.stat="last year"
		returned_row.xtype="currency"
		
		returned_data.push(	 route_functions.wind_up_Stats_monthly_variable(result,returned_row,"site_pemrissions_total_last_year",venue))

		var returned_row={}
		returned_row.museum=venue
		returned_row.stat="% last year"
		returned_data.push(	 route_functions.wind_up_Stats_monthly_variable(	result,returned_row,"percentace_total_last_year_site_permissions",venue))
	
			
		
				
					

	})

		res.json(returned_data)
			
		})

});

router.get('/', function(req, res, next) {

Site_permissions.find()
.populate('leave_taken')
.sort({date_value: 'desc'})
.exec (  function (err, todos) {
if (err) return next(err);
if(req.params.csv){  
res.setHeader('Content-disposition', 'attachment; filename=donations.csv');
res.set('Content-Type', 'text/csv');
var fields = ['type', 'amount', 'no_envelopes','date','comments','logger_user_name','date_recorded'];
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

  Site_permissions.find()
	   .populate('leave_taken')
	   .exec (  function (err, todos) {
    if (err) return next(err);
    



 res.setHeader('Content-disposition', 'attachment; filename=donations.csv');
  res.set('Content-Type', 'text/csv');
    var fields = ['type', 'amount', 'no_envelopes','date','comments','logger_user_name','date_recorded'];
     var csv = json2csv({ data: todos, fields: fields });
  res.status(200).send(csv);

	
  })
});

router.get('/:type/:date_value/:donation_box_no/:exact/:end_value',isAuthenticated, function(req, res, next) {

var query = {}


if( req.params.exact=="false"){
	 _.extend(query, {date_value: {$gte: req.params.date_value}})
	 console.log(query)
}
else
{
  _.extend(query,{date_value:req.params.date_value})
}

if(decodeURIComponent(req.params.type)!="#"){
 _.extend(query,{type: decodeURIComponent(req.params.type)})
}


  Site_permissions.find(query)
		.sort({date_value: 'desc'})
	   .exec (  function (err, todos) {
    if (err) return next(err);
    res.json(todos);
  })
});


api_calls=new Api_calls(Site_permissions,router)


module.exports = router;
