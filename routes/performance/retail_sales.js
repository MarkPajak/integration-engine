
var express = require('express');
var router = express.Router();
var _ = require('underscore');


var isAuthenticated = function (req, res, next) {
	console.log('if user is authenticated in the session, call the next() to call the next request handler ')
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();

	return false
}

var Team = require('../../models/performance/Retail_sales.js');



//aggregation
/* GET /todos listing. */
router.get('/all', function(req, res, next) {

function get_kpis(cb){

Team.aggregate([
 
		 { $group: {
                _id: { year : { $year : "$date_value" },        
					   month : { $month : "$date_value" },        
					   venue:'$museum_id'
					 },  
               visits: {$sum: '$net_sales' }
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
				var years = [2016,2017,2018]
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

/* GET /todos listing. */
router.get('/',isAuthenticated, function(req, res, next) {

  Team.find()
	   .populate('leave_taken')
	   .exec (  function (err, todos) {
    if (err) return next(err);
    res.json(todos);
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
