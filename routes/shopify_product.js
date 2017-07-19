var express = require('express');
var router = express.Router();
var _ = require('underscore');
var json2csv =  require('json2csv');
var Shopify_product = require('../models/Shopify_product.js');

var isAuthenticated = function (req, res, next) {
	
	if (req.isAuthenticated())
		return next();

	return res.json();
}


router.get('/monthly', function(req, res, next) {

function get_kpis(cb){

Shopify_product.aggregate([
 { $sort : { date : -1 } },
{ $match: {"published_at":{"$ne":null}}},
		 { $group: {
                _id: { 
				
				 "kpi_year": { "$year": { "$add": [ "$published_at", 7 * 60 * 60 * 1000 ] } }, 
				 "kpi_month": { "$month": { "$add": [ "$published_at", 7 * 60 * 60 * 1000 ] } }, 		   

						
					 }, 
				
               number_published_online: { $sum: 1 }
            }
		 },
{$project:{"year":"$_id.kpi_year","month":"$_id.kpi_month",
"number_published_online":"$number_published_online"}}	

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
	

	
	function wind_up_Stats(	result,returned_row,analysis_field,venue){
			
			var years = [2014,2015,2016,2017,2018]
			_.each(years,function(year){
				_.each(moment.monthsShort(),function(month){
				returned_row[month+" "+year]=""
				_.each(result,function(row){
				row.kpi_venue="ONLINE"
					if(month==moment.monthsShort(row.month-1) &&venue==row.kpi_venue &&row.year==year){
						returned_row[month+" "+year]=row[analysis_field]
					}
					})
				})	
			})
		
		return(returned_row)
	}
	
	venues = []
	venues.push("ONLINE")
	
	var returned_data=[]

	_.each(venues,function(venue){
		
	var returned_row={}
		returned_row.museum=venue
		returned_row.stat="Number new published products"
		returned_data.push(	 wind_up_Stats(	result,returned_row,"number_published_online",venue))
	})


res.json(returned_data)
	
})



});



router.get('/weekly', function(req, res, next) {

function get_kpis(cb){

Shopify_product.aggregate([
 { $sort : { date : -1 } },
{ $match: {"published_at":{"$ne":null}}},
		 { $group: {
                _id: { 
				
				 "kpi_year": { "$year": { "$add": [ "$published_at", 7 * 60 * 60 * 1000 ] } }, 
				 "kpi_week": { "$week": { "$add": [ "$published_at", 7 * 60 * 60 * 1000 ] } }, 		   

						
					 }, 
			
               number_published_online: { $sum: 1 }
            }
		 },
{$project:{"_id":0,"year":"$_id.kpi_year","kpi_week":"$_id.kpi_week",
"number_published_online":"$number_published_online"}}	

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
	



	
res.json(result)
	
	
	
	
	
	
	
})



});



router.get('/daily', function(req, res, next) {

function get_kpis(cb){

Shopify_product.aggregate([
 { $sort : { date : -1 } },

		 { $group: {
                _id: { date: {$dateToString: { format: "%Y-%m-%d",date:  "$published_at"}  },				   

						
					 }, 
			
               number_published_online: { $sum: 1 }
            }
		 },
{$project:{"date_value":"$_id.date",
"number_published_online":"$number_published_online"}}	

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
	



	
res.json(result)
	
	
	
	
	
	
	
})



});

/* GET /todos listing. */
router.get('/',isAuthenticated, function(req, res, next) {
  Shopify_product.find()
   .sort({'date': 'desc'})
     .exec(function(err, todos) {
  
     if (err) return next(err);
    res.json(todos);
  });
});

/* POST /todos */
router.post('/', function(req, res, next) {
  Shopify_product.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});



/* GET /todos/id */
router.get('/:id', function(req, res, next) {
  Shopify_product.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* PUT /todos/:id */
router.put('/:id', function(req, res, next) {
  Shopify_product.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE /todos/:id */
router.delete('/:id', function(req, res, next) {
  Shopify_product.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
