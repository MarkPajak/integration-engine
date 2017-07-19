var express = require('express');
var router = express.Router();
var _ = require('underscore');
var Shopify_transaction = require('../models/Shopify_transaction.js');

var isAuthenticated = function (req, res, next) {
	
	if (req.isAuthenticated())
		return next();

	return res.json();
}


router.get('/monthly', function(req, res, next) {

function get_kpis(cb){

Shopify_transaction.aggregate([
 { $sort : { date : -1 } },
{ $match: {"date":{"$ne":null},"source_name":"web"}},
		 { $group: {
                _id: { 
				
				 "kpi_year": { "$year": { "$add": [ "$date", 7 * 60 * 60 * 1000 ] } }, 
				 "kpi_month": { "$month": { "$add": [ "$date", 7 * 60 * 60 * 1000 ] } }, 		   

						
					 }, 
			   gross_sales: { $sum:"$price"  },
               number_online_products_sold: { $sum: 1 }
            }
		 },
{$project:{"year":"$_id.kpi_year","month":"$_id.kpi_month",
"number_online_products_sold":"$number_online_products_sold","gross_sales":"$gross_sales"}}	

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
		returned_row.stat="Online products sold"
		returned_data.push(	 wind_up_Stats(	result,returned_row,"number_online_products_sold",venue))
	var returned_row={}
		returned_row.museum=venue
		returned_row.stat="Online gross sales"
		returned_data.push(	 wind_up_Stats(	result,returned_row,"gross_sales",venue))
	})


res.json(returned_data)
	
})



});

/* GET /todos listing. */
router.get('/',isAuthenticated, function(req, res, next) {
  Shopify_transaction.find()
   .sort({'date': 'desc'})
     .exec(function(err, todos) {
  
     if (err) return next(err);
    res.json(todos);
  });
});

/* POST /todos */
router.post('/', function(req, res, next) {
  Shopify_transaction.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});


/* GET /todos/id */
router.get('/:id', function(req, res, next) {
  Shopify_transaction.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* PUT /todos/:id */
router.put('/:id', function(req, res, next) {
  Shopify_transaction.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE /todos/:id */
router.delete('/:id', function(req, res, next) {
  Shopify_transaction.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
