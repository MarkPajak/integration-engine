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

var Team = require('../../models/performance/Learning.js');
var Cache = require('../../models/cache/cache.js');

router.get('/total/:session_type', function(req, res, next) {



function get_kpis(cb){

			Team.aggregate([
					//{ $match: { session_type:req.params.session_type } },

					
					{$project:{"date":1,
					"value":1,
					"museum_id":1,
					"session_type":1,
					"age_group":1,
					"total_children":1,
					"total_teachers":1,
					"total_income":1,
					"total_sessions":1,
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
					{$group:{"_id":{"year":"$year" ,"financial_yer":"$financial_yer" ,venue:'$museum_id',session_type:'$session_type'}, 
					total_sessions: {$sum: '$total_sessions' },
					total_income: {$sum: '$total_income' },
					total_teachers: {$sum: '$total_teachers' },
					total_children: {$sum: '$total_children' },
					
					}}

		

    ], function (err, result) {

        if (err) {
            console.log(err);
        } else {
		
		


	cb(result)
	

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
		if(venues.indexOf(row._id.venue)==-1){
			console.log('adding venue ',row._id.venue)
			venues.push(row._id.venue)
		}
		
		if(age_groups.indexOf(row.age_group)==-1){
			//console.log('adding age_group ',row.age_group)
			age_groups.push(row.age_group)
		}
		
		if(session_types.indexOf(row._id.session_type)==-1){
			console.log('adding session_type ',row._id.session_type)
			if(row._id.session_type!=""){
				session_types.push(row._id.session_type)
			}
		}
	})
	
	function wind_up_Stats(	result,returned_row,analysis_field,venue,session_type){
		
		
				var years = [2014,2015,2016,2017,2018,2019]
								_.each(years,function(year){
									var financial_yesr_text = ["last","this"]
									_.each(financial_yesr_text,function(financial_yer_text){
									
										_.each(result,function(row){
											if(session_type== row._id.session_type&&venue==row._id.venue &&row._id.financial_yer==financial_yer_text&&row._id.year==year){
												
												var financial_year_display=""
													if(financial_yer_text=="this"){
														financial_year_display=	year+"-"+((year+1).toString().substring(2))
														//console.log('financial_year_display this',financial_year_display)
														returned_row[financial_year_display]=row[analysis_field]
													}
													else
													{
														financial_year_display=	(year-1)+"-"+(year.toString().substring(2))	
														//console.log('financial_year_display',financial_year_display)
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
	_.each(session_types,function(session_type){			
		//_.each(age_groups,function(age_group){	
		var age_group=""
		var returned_row={}
			returned_row.museum=venue
			//returned_row.age_group=age_group
			returned_row.session_type=session_type
			returned_row.stat="Income"
			returned_data.push(	 wind_up_Stats(	result,returned_row,"total_income",venue,session_type))
		//})
		})
	})

res.json(returned_data)
	
})



});
/* GET /todos listing. */
router.get('/all/:session_type', function(req, res, next) {




	
function get_kpis(cb){
	
Team.aggregate([
			
		{ $match: { session_type:req.params.session_type  ,		
					
						age_group:{$ne: "[1.25] Adult"},
						date_value: {$gte: new Date("2017-04-01")}}
		},
		
		{ $group: {
                       _id: {
						"year": { "$year": route_functions.mongo_aggregator }, 
						"month": { "$month": route_functions.mongo_aggregator }, 
					      
					    venue:'$museum_id',
						session_type:'$session_type',
					   // age_group:'$age_group',
						
					   
					 },  
				
					total_sessions: {$sum: '$total_sessions' },
					total_children: {$sum: '$total_children' },
					total_teachers: {$sum: '$total_teachers' },
					total_income: {$sum: '$total_income' }
			 
            }
		},

	{ $project : {venue:"$_id.venue", session_type:"$_id.session_type", total_income:"$total_income",total_sessions:"$total_sessions", total_teachers:"$total_teachers",total_children:"$total_children",kpi_year :"$_id.year", kpi_month :"$_id.month"}  },
	{ $sort : { total_sessions : -1 } }
		

    ], function (err, result) {

        if (err) {
            console.log(err);
        } else {
		
		

		
		
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




if(req.query.cache){
	
	var query={ type: 'monthly_learning', row_name: req.params.session_type }
 
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
	


get_kpis( function ( result) {
	

	
	
		function wind_up_Stats(	rows,returned_row,analysis_field,venue,session_type){
			
		var returned_row_compare_last_year={}
		var returned_row_compare_last_year_total={}
		
				var years = [2017,2018,2019]
				_.each(years,function(year){
					_.each(months,function(month){
						_.each(rows,function(row){
									
							if(analysis_field !="last_year" && analysis_field !="% last year"){
								
								if(month==moment.monthsShort(row.kpi_month-1) && session_type==row.session_type  && venue==row.venue && row.kpi_year==year){
										
										if(row[analysis_field]>0){
											
											returned_row[month+" "+year]=row[analysis_field]
											
			
										}
								}
							}
							
							if(analysis_field =="last_year" || analysis_field =="% last year"){
							
								for (compare_previous_years = 1; compare_previous_years < 2; compare_previous_years++) { 
								
								_.each(rows,function(previous_data){
								compare_previous_year = year-compare_previous_years
								
								
								if(month==moment.monthsShort(row.kpi_month-1) && session_type==row.session_type  && venue==row.venue && row.kpi_year==year){
								if(month==moment.monthsShort(previous_data.kpi_month-1) && row.venue==previous_data.venue && previous_data.kpi_year==compare_previous_year && previous_data.session_type==row.session_type){
																
									returned_row.museum=compare_previous_year+ " - " + year
									
									if(analysis_field =="% last year"){
										
										if(row.total_children + previous_data.total_children >0){
											
											returned_row[month+" "+year]=((row.total_children/previous_data.total_children)*100-100).toFixed(0)+"%";	
											//console.log(compare_previous_year, month,venue,previous_data.total_children ,previous_data.session_type)	
											//console.log(year,month, venue,row.total_children,row.session_type)	
										//	console.log(returned_row[month+" "+year])											
											
										}
									}
									
									if(analysis_field =="last_year"){
										
										returned_row[month+" "+year]=previous_data.total_children
									}
									
									
								}
								}
							})
								
							
							}
								
							}
								
						
					})	
				})
			})
	
	
		return(returned_row)
	}
	

	
	//load venues
	var venues=[]
	//var age_groups=[]
	var session_types=[]
		var returned_data=[]
			var datasave = []
	_.each(result,function(row, i){
		
	
			
			
		if(venues.indexOf(row.venue)==-1){
					venues.push(row.venue)
		}
		/*
		if(age_groups.indexOf(row.age_group)==-1){
						age_groups.push(row.age_group)
		}
		*/
		if(session_types.indexOf(row.session_type)==-1){
			console.log('adding session_type ',row.session_type)
			session_types.push(row.session_type)
		}
		
	var months=moment.monthsShort()
	
	
	
	})
	
	


	_.each(venues,function(venue){	
		//_.each(session_types,function(session_type){	
			session_type=req.params.session_type 
				var returned_row={}
					returned_row.museum=venue
					returned_row.csstype="bold"
					returned_row.session_type=session_type
					returned_row.stat=venue + " number of children"
					returned_data.push(	 wind_up_Stats(	result,returned_row,"total_children",venue,session_type))
				
		
				var returned_row={}
					returned_row.museum=venue
					returned_row.session_type=session_type
					returned_row.stat="last year"
					returned_data.push(	 wind_up_Stats(	result,returned_row,"last_year",venue,session_type))
		
				var returned_row={}
					returned_row.museum=venue
					returned_row.session_type=session_type
					returned_row.stat="% last year"
					returned_data.push(	 wind_up_Stats(	result,returned_row,"% last year",venue,session_type))
		
				
				var returned_row={}
					returned_row.museum=venue					
					returned_row.session_type=session_type
					returned_row.stat="Sessions"
					returned_data.push(	 wind_up_Stats(	result,returned_row,"total_sessions",venue,session_type))
					

				var returned_row={}
					returned_row.museum=venue					
					returned_row.session_type=session_type
					returned_row.stat="Teachers"
					returned_data.push(	 wind_up_Stats(	result,returned_row,"total_teachers",venue,session_type))
					
				
				var returned_row={}
					returned_row.museum=venue					
					returned_row.stat="Income"
					returned_row.typex="currency"
					
					returned_data.push(	 wind_up_Stats(	result,returned_row,"total_income",venue,session_type))
					
				
			//})
		})
				var returned_row={}
				returned_row.museum="Yearly sessions"
				returned_row.stat="Sessions - Total"
				//returned_row.xtype="currency"
				//returned_row.typex="retail"
				returned_row.cssclass="summary_row"
				returned_row.csstype="summary_row"
				returned_data.push(	 route_functions.wind_up_Stats_monthly_variable(	result,returned_row,"yearly_sessions",""))
				
				var returned_row={}
				returned_row.museum="Yearly learning"
				returned_row.stat="Children - Total"
				//returned_row.xtype="currency"
				//returned_row.typex="retail"
				returned_row.cssclass="summary_row"
				returned_row.csstype="summary_row"
				returned_data.push(	 route_functions.wind_up_Stats_monthly_variable(	result,returned_row,"yearly_children",""))


				var returned_row={}
				returned_row.museum="Children - Last year"
				returned_row.stat="Children - Last year"
				//returned_row.xtype="currency"
				//returned_row.typex="retail"
				returned_row.cssclass="summary_row"
				returned_row.csstype="summary_row"
				returned_data.push(	 route_functions.wind_up_Stats_monthly_variable(	result,returned_row,"total_sales_last_year","","total_children"))
				
				//route_functions.ad_percentage_last_year_learning(returned_data)
					
					
				var returned_row={}
				returned_row.museum="Total"
				returned_row.stat="Income - total"
				returned_row.xtype="currency"
				//returned_row.typex="retail"
				returned_row.cssclass="summary_row"
				returned_row.csstype="summary_row"
				returned_data.push(	 route_functions.wind_up_Stats_monthly_variable(	result,returned_row,"total_s","","total_income","currency"))

				var returned_row={}
				returned_row.museum="Last year"
				returned_row.stat="Income - last year"
				returned_row.xtype="currency"
				//returned_row.typex="retail"
				returned_row.cssclass="summary_row"
				returned_row.csstype="summary_row"
				returned_data.push(	 route_functions.wind_up_Stats_monthly_variable(	result,returned_row,"total_sales_last_year","","total_income","currency"))

				
				//route_functions.ad_percentage_last_year_income(returned_data)
				

				_.each(returned_data,function(row,i){
				
				_.each([2015,2016,2017,2018,2019,2020,2021,2022],function(num){

row[num+" Yearly total"]="cheese"

if(row["Apr "+num]){
	row[num+" Yearly total"]=parseInt(row["Apr "+num])
}		
if(row["May "+num]){			
	row[num+" Yearly total"]+=parseInt(row["May "+num])
}
if(row["Jun "+num]){					
	row[num+" Yearly total"]+=parseInt(row["Jun "+num])	
}
if(row["Jul "+num]){					
	row[num+" Yearly total"]+=parseInt(row["Jul "+num])
}					
if(row["Aug "+num]){					
	row[num+" Yearly total"]+=parseInt(row["Aug +"+num])	
}
if(row["Sept "+num]){					
	row[num+" Yearly total"]+=parseInt(row["Sept "+num]	)
}
if(row["Oct "+num]){					
	row[num+" Yearly total"]+=parseInt(row["Oct "+num])	
}					
if(row["Nov "+num]){					
	row[num+" Yearly total"]+=parseInt(row["Nov "+num])
}					
if(row["Dec "+num]){					
	row[num+" Yearly total"]+=parseInt(row["Dec "+num])
}					
if(row["Jan "+(num+1)]){					
	row[num+" Yearly total"]+=parseInt(row["Jan "+(num+1)])
}					
if(row["Feb "+(num+1)]){					
	row[num+" Yearly total"]+=parseInt(row["Feb "+(num+1)])	
}
if(row["Mar "+(num+1)]){					
	row[num+" Yearly total"]+=parseInt(row["Mar "+(num+1)])
}					
					
					
					
					
				})
				console.log(row)
				})
				
				
				
		
		
		
	
	var datacache = [{ type: 'monthly_learning', row_name: req.params.session_type , date_cached: new Date(), cache:returned_data }];
	
	

			
 
    // save multiple documents to the collection referenced by Book Model
    Cache.collection.insert(datacache, function (err, docs) {
      if (err){ 
          return console.error(err);
      } else {
        console.log("Multiple documents inserted to Collection");
      }
    });
	
res.json(returned_data)
	
})

}	

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
		
		
			var years = [2014,2015,2016,2017,2018,2019,2020]
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
router.get('/:csv', function(req, res, next) {

  Team.find()
	   .populate('leave_taken')
	   .exec (  function (err, todos) {
    if (err) return next(err);
	
	if(req.params.csv){
			res.setHeader('Content-disposition', 'attachment; filename=data.csv');
			res.set('Content-Type', 'text/csv');
	
			var fields = ['museum_id', 'date', 'session_type', 'age_group', 'total_children', 'total_teachers', 'total_income', 'total_income', 'total_sessions'];
			var csv = json2csv({ data: todos, fields: fields });
			res.status(200).send(csv);

	}
	else
	{
		res.json(todos);
	}
  })
});


router.get('/:museum_id/:date_value/:session_type/:age_group/:exact/:end_value/:csv*?',isAuthenticated, function(req, res, next) {

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


if(decodeURIComponent(req.params.session_type)!="#"){
 _.extend(query,{session_type: req.params.session_type})
}
if(decodeURIComponent(req.params.age_group)!="#"){
 _.extend(query,{age_group: req.params.age_group})
}

console.log(query)
  Team.find(query)
		.sort({date_value: 'desc'})
	   .exec (  function (err, todos) {
    if (err) return next(err);
    	if(req.params.csv){
/*
total_sessions: { type: Number},
			total_children: { type: Number},
			total_teachers: { type: Number},
			total_income: { type: Number},
			*/

res.setHeader('Content-disposition', 'attachment; filename=donations.csv');
res.set('Content-Type', 'text/csv');
var fields = ['museum_id', 'session_type','age_group','total_sessions', 'total_children','total_teachers','total_income','date','comments','logger_user_name','date_recorded'];
var csv = json2csv({ data: todos, fields: fields });
res.status(200).send(csv);


}
else
{
	res.json(todos);
	
}
  })
});




api_calls=new Api_calls(Team,router)


module.exports = router;