
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

var PWYT = require('../../models/performance/Donations.js');


//aggregation
/* GET /todos listing. */
router.get('/week', function(req, res, next) {

function get_kpis(cb){

Team.aggregate([
			


		{ $group: {
                _id: { 
				
				 "kpi_year": { "$year": { "$add": [ "$date_value", 7 * 60 * 60 * 1000 ] } }, 
				"kpi_week": { "$week": { "$add": [ "$date_value", 7 * 60 * 60 * 1000 ] } }, 
				
				
				 
					   kpi_venue:'$museum_id',
					   
					 },  
				
                gallery_visits: {$sum: '$value' },
			  // number_transactions: { $sum:    "$no_transactions" } ,
			/*
			ATV: {
					$sum:  {
							$cond: [ {$eq: [ { $sum:    "$no_transactions" }, 0 ] }, 0,
													{
													$divide: [   {$sum: '$net_sales'  }   ,{ $sum:    "$no_transactions" } ]
													}
													]
													}
					},
			*/
		      
            }
		 },
		 

	 { $project : {kpi_venue:"$_id.kpi_venue", kpi_year :"$_id.kpi_year", kpi_week :"$_id.kpi_week",gallery_visits:'$gallery_visits'}  },

		

    ], function (err, result) {
	if(err) console.log(err)
	console.log(result)


	Kpi_aggregate.aggregate([
			


		{ $group: {
                _id: { year : { $year : "$date_value" },        
					   week : { $week : "$date_value" },        
					   venue:'$museum_id',
					   
					 },  
				
               visits: { $sum:  { $sum: [ "$value" ] }} ,
			
		      
            }
		 },

	 { $project : {venue:"$_id.venue", year :"$_id.year", week :"$_id.week",ATV:'$ATV',number_transactions:'$number_transactions', net_sales:'$net_sales',visits:"$visits"}  },

		
	  ], function (err, result2) {
		  
		  
		  
		  
	PWYT.aggregate([
			


		{ $group: {
                _id: { 

						"pwyt_year": { "$year": { "$add": [ "$date_value", 7 * 60 * 60 * 1000 ] } }, 
						"pwyt_week": { "$week": { "$add": [ "$date_value", 7 * 60 * 60 * 1000 ] } }, 					   
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
		
		
		_.each(result,function(kpi,i){
			_.each(result2,function(visits,ii){
		
			
			if(kpi.kpi_venue==visits.venue &&  kpi.kpi_week==visits.week && kpi.kpi_year==visits.year){
			result[i].gallery_visits=visits.visits
			result[i].conversion=((kpi.gallery_visits/visits.visits)*100).toFixed(2)+"%";
			
			
			
				
							for (compare_previous_years = 1; compare_previous_years < 2; compare_previous_years++) { 
  

							_.each(result,function(previous_data){
								compare_previous_year = visits.year-compare_previous_years
								console.log('compare_previous_year',compare_previous_year)
								if(previous_data.kpi_venue==visits.venue &&  previous_data.kpi_week==visits.week && previous_data.kpi_year==compare_previous_year){
									console.log("adding % last year")
									
											result[i]["% net_sales last year"] =((kpi.net_sales/previous_data.net_sales)*100-100).toFixed(2)+"%";
										
									
								}
							})
							
							}
			}
			
				_.each(result_pwyt,function(pwyt,ii){

			if(pwyt.pwyt_venue==kpi._id.kpi_venue &&  pwyt.pwyt_week== kpi._id.kpi_week && pwyt.pwyt_year==kpi._id.kpi_year){
			
					result[i].pwyt_income=pwyt.pwyt_income
					


			}
			

			})
			
			
			
			
			})
		})
		
		
//res.json(result)
	cb(result)
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
			//console.log('adding venue ',row.kpi_venue)
			
			if(row.kpi_venue!=""){
			venues.push(row.kpi_venue)
			}
		}
	})
	
	function wind_up_Stats(	result,returned_row,analysis_field,venue){
		var years = [2014,2015,2016,2017,2018]
		_.each(years,function(year){
		//console.log('year',year)
		
			for (week = 0; week <= moment().isoWeeksInYear(); week++) { 
			//console.log('week',week)
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

//aggregation
/* GET /todos listing. */
router.get('/all', function(req, res, next) {

function get_kpis(cb){

Team.aggregate([
	
		{ $group: {
                _id: { 
				
				 "kpi_year": { "$year": { "$add": [ "$date_value", 7 * 60 * 60 * 1000 ] } }, 
						"kpi_month": { "$month": { "$add": [ "$date_value", 7 * 60 * 60 * 1000 ] } }, 
				
				
				 
					   kpi_venue:'$museum_id',
					   
					   
					 },  
				
                gallery_visits: {$sum: '$value' },
			  // number_transactions: { $sum:    "$no_transactions" } ,
			/*
			ATV: {
					$sum:  {
							$cond: [ {$eq: [ { $sum:    "$no_transactions" }, 0 ] }, 0,
													{
													$divide: [   {$sum: '$net_sales'  }   ,{ $sum:    "$no_transactions" } ]
													}
													]
													}
					},
			*/
		      
            }
		 },
		 

	 { $project : {kpi_venue:"$_id.kpi_venue", kpi_year :"$_id.kpi_year", kpi_month :"$_id.kpi_month",gallery_visits:'$gallery_visits'}  },

		

    ], function (err, result) {
	if(err) console.log(err)
	//console.log(result)


	Kpi_aggregate.aggregate([
			


		{ $group: {
                _id: { year :  { "$year": { "$add": [ "$date_value", 7 * 60 * 60 * 1000 ] } },        
					   month : { "$month": { "$add": [ "$date_value", 7 * 60 * 60 * 1000 ] } },        
					   venue:'$museum_id',
					   gallery:'$gallery',
					 },  
				
               visits: { $sum:  { $sum: [ "$value" ] }} ,
			
		      
            }
		 },

	 { $project : { gallery:"$_id.$gallery",venue:"$_id.venue", year :"$_id.year", month :"$_id.month",ATV:'$ATV',number_transactions:'$number_transactions', net_sales:'$net_sales',visits:"$visits"}  },

		
	  ], function (err, result2) {
		  
 
	PWYT.aggregate([

		{ $group: {
                _id: { 

						"pwyt_year": { "$year": { "$add": [ "$date_value", 7 * 60 * 60 * 1000 ] } }, 
						"pwyt_month": { "$month": { "$add": [ "$date_value", 7 * 60 * 60 * 1000 ] } }, 					   
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
		
		
		_.each(result,function(kpi,i){
			_.each(result2,function(visits,ii){

			if(kpi.kpi_venue==visits.venue &&  kpi.kpi_month==visits.month && kpi.kpi_year==visits.year){
			result[i].visits=visits.visits
			result[i].conversion=((kpi.gallery_visits/visits.visits)*100).toFixed(2)+"%";
			
			
			
				
							for (compare_previous_years = 1; compare_previous_years < 2; compare_previous_years++) { 
  

							_.each(result,function(previous_data){
								compare_previous_year = visits.year-compare_previous_years
								if(previous_data.kpi_venue==visits.venue &&  previous_data.kpi_month==visits.month && previous_data.kpi_year==compare_previous_year){
									console.log("adding % last year")
									result[i]["% net_sales last year"] =((kpi.net_sales/previous_data.net_sales)*100-100).toFixed(2)+"%";
		
								}
							})
							
							}
			}
			
			
			
			
			
			
			})
			
				_.each(result_pwyt,function(pwyt,iii){
				console.log(pwyt.pwyt_venue,kpi.kpi_venue, pwyt.pwyt_month,kpi.kpi_month,pwyt.pwyt_year,kpi.kpi_year)
					if(pwyt.pwyt_venue==kpi.kpi_venue &&  pwyt.pwyt_month== kpi.kpi_month && pwyt.pwyt_year==kpi.kpi_year){
						result[i].pwyt_income=pwyt.pwyt_income
					}
				})
		})
		
		
//res.json(result)
	cb(result)
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
							   "quarter":{$cond:[{$lte:[{$month:"$date_value"},3]},
												 "fourth",
												 {$cond:[{$lte:[{$month:"$date_value"},6]},
														 "first",
														 {$cond:[{$lte:[{$month:"$date_value"},9]},
																 "second",
										"third"]}]}]},
								"financial_yer":{$cond:[{$lte:[{$month:"$date_value"},3]},
												"last",
										"this"]
										
								},
								"year":{$cond:[{$lte:[{$month:"$date_value"},3]},
												{$year:"$date_value"},
										{$year:"$date_value"}]
										
					}}
			
					},
					{$group:{"_id":{"year":"$year" ,"financial_yer":"$financial_yer" ,kpi_venue:'$museum_id'}, gallery_visits: {$sum: '$value' }}},

				
							

						], function (err, gallery_visits) {
						
		PWYT.aggregate([
								
					{$project:{"date":1,"donation_box_amount":1,"museum_id":1,
							   "quarter":{$cond:[{$lte:[{$month:"$date_value"},3]},
												 "fourth",
												 {$cond:[{$lte:[{$month:"$date_value"},6]},
														 "first",
														 {$cond:[{$lte:[{$month:"$date_value"},9]},
																 "second",
										"third"]}]}]},
								"financial_yer":{$cond:[{$lte:[{$month:"$date_value"},3]},
												"last",
										"this"]
										
								},
								"year":{$cond:[{$lte:[{$month:"$date_value"},3]},
												{$year:"$date_value"},
										{$year:"$date_value"}]
										
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
													}
													else
													{
													financial_year_display=	(year-1)+"-"+(year.toString().substring(2))	
												}

												returned_row[financial_year_display]=row[analysis_field]
												
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
