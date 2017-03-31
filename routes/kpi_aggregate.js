var express = require('express');
var router = express.Router();
var _ = require('underscore');
var Kpi_aggregate = require('../models/Kpi_log.js');
//var Kpi_data_loader = require('../data_loader/kpi/kpi_aggregate.js');
var moment = require('moment');


var isAuthenticated = function (req, res, next) {
	
	if (req.isAuthenticated())
		return next();

	return res.json();
}

/* GET /todos listing. */
router.get('/all', function(req, res, next) {

function get_kpis(cb){

Kpi_aggregate.aggregate([
 
		 { $group: {
                _id: { year : { $year : "$date_value" },        
					   month : { $month : "$date_value" },        
					   venue:'$museum_id'
					 },  
               visits: {$sum: '$value' }
            }
		 }			

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
	

	
	
	

	
	//load venues
	var venues=[]
	_.each(result,function(row){
		if(venues.indexOf(row._id.venue)==-1){
			console.log('adding venue ',row._id.venue)
			venues.push(row._id.venue)
		}
	})
	
	
	var returned_data=[]

	_.each(venues,function(venue){
		var returned_row={}
		returned_row.museum=venue
				var years = [2016,2017,2018,2019]
			_.each(years,function(year){
			_.each(moment.monthsShort(),function(month){
			
			returned_row[month+" "+year]=""
				_.each(result,function(row){
					if(month==moment.monthsShort(row._id.month-1) &&venue==row._id.venue &&row._id.year==year){
						returned_row[month+" "+year]=row.visits
					}
				})
			})
			
			
			
		})
	returned_data.push(	returned_row)
	})


res.json(returned_data)
	
})



});

router.get('/year_month/:year/:month', function(req, res, next) {
	
	
Kpi_aggregate.aggregate([

         {$project:
              {
                    _id: "$museum_id",
					value: "$value",
				   month : {$month:'$date_value'},
                   year : {$year:'$date_value'}
              }
         },
		   { $match: { $and: [ { 'month' : parseInt(req.params.month) }, {  'year' : parseInt(req.params.year)     } ] } },
           { $group: { _id: "$_id", visits: { $sum: '$value' } } }

    ], function (err, result) {
        if (err) {
            next(err);
        } else {
            res.json(result);
        }
    });
});


router.get('/', function(req, res, next) {
Kpi_aggregate.aggregate([
        
		{
            $group: {
                _id: { 
				museum : "$museum_id" , 
				year : { $year : "$date_value" },        
				month : { $month : "$date_value" },        
					 
					 
					 },  
               visits: {$sum: '$value' }
            }
        }
    ], function (err, result) {
        if (err) {
            next(err);
        } else {
            res.json(result);
        }
    });
});
/* POST /todos */
router.post('/', function(req, res, next) {
  Kpi_aggregate.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* GET /todos/id */
router.get('/:id', function(req, res, next) {
  Kpi_aggregate.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* PUT /todos/:id */
router.put('/:id', function(req, res, next) {
  Kpi_aggregate.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});


/* DELETE /todos/:id */
router.delete('/:id', function(req, res, next) {
  Kpi_aggregate.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});



module.exports = router;
