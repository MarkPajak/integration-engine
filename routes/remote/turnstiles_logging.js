var express = require('express');
var _ = require('underscore');
var router = express.Router();

var Ticket_scan = require('../../models/Ticket_scan.js');

var isAuthenticated = function (req, res, next) {
	
	if (req.isAuthenticated())
		return next();

	return res.json();
}

//aggregation
/* GET /todos listing. */
router.get('/daily', function(req, res, next) {

function get_kpis(cb){

Ticket_scan.aggregate([
 { $sort : { date : -1 } },
		{ $match:{result:"open" }},
		 { $group: {
                _id: { date: {$dateToString: { format: "%Y-%m-%d",date:  "$date"}  },				   
					   exhibition:'$exhibition',
					    museum_id:'$museum_id',
						
					 }, 
			
               turnstile_ticket_scans: { $sum: 1 }
            }
		 },
{$project:{"date_value":"$_id.date",
"visits":"$turnstile_ticket_scans",
"museum_id":"$_id.museum_id",	
"exhibition":"$_id.exhibition"	}}	

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

router.get('/all', function(req, res, next) {

function get_kpis(cb){

Ticket_scan.aggregate([
 { $sort : { date : -1 } },
		{ $match:{result:"open" }},
		 { $group: {
                _id: { year : { $year : "$date" },        
					   month : { $month : "$date" },        
					   exhibition:'$exhibition'
					 },  
               turnstile_ticket_scans: { $sum: 1 }
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
		if(venues.indexOf(row._id.exhibition)==-1){
		
		if(row._id.exhibition=="PLIOSAURUS!"){
		row._id.exhibition="BMAG"
		}
		if(row._id.exhibition=="SKELETONS"){
		row._id.exhibition="M-SHED"
		}
		
			venues.push(row._id.exhibition)
		}
	})
	
	
	var returned_data=[]



function wind_up_Stats(	result,returned_row,analysis_field,venue){
			
			var years = [2014,2015,2016,2017,2018]
			_.each(years,function(year){
				_.each(moment.monthsShort(),function(month){
				returned_row[month+" "+year]=""
				_.each(result,function(row){
					if(month==moment.monthsShort(row._id.month-1) &&venue==row._id.exhibition &&row._id.year==year){
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
		returned_row.stat="Turnstiles"
		returned_data.push(	 wind_up_Stats(	result,returned_row,"turnstile_ticket_scans",venue))


	})
	
	
	
res.json(returned_data)
	
	
	
	
	
	
	
})



});
var json2csv =  require('json2csv');
/* GET /todos listing. */
router.get('/csv', function(req, res, next) {

  Ticket_scan.find()
	   .populate('leave_taken')
	   .exec (  function (err, todos) {
    if (err) return next(err);
    



 res.setHeader('Content-disposition', 'attachment; filename=tunstiles.csv');
  res.set('Content-Type', 'text/csv');
    var fields = ['museum_id', 'exhibition', 'result','date_of_scan','comments','logger_user_name','date_recorded'];
     var csv = json2csv({ data: todos, fields: fields });
  res.status(200).send(csv);

	
  })
});



router.get('/:exhibition/:date/:exact',isAuthenticated, function(req, res, next) {

var query = {}

if( req.params.exact=="false"){
	 _.extend(query, {date: {$gte: req.params.date}})
	 console.log(query)
}
else
{
  _.extend(query,{date:req.params.date})
}

if(decodeURIComponent(req.params.exhibition)!="#"){
 _.extend(query,{exhibition: decodeURIComponent(req.params.exhibition)})
}


  Ticket_scan.find(query)
		.sort({date: 'desc'})
	   .exec (  function (err, todos) {
    if (err) return next(err);
    res.json(todos);
  })
});
/* GET /todos listing. */
router.get('/', function(req, res, next) {
  Ticket_scan.find()
   .sort({'date': 'desc'})
     .exec(function(err, todos) {
  
     if (err) return next(err);
    res.json(todos);
  });
});

/* POST /todos */
router.post('/', function(req, res, next) {
  Ticket_scan.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});



/* GET /todos/id */
router.get('/:id', function(req, res, next) {
  Ticket_scan.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* PUT /todos/:id */
router.put('/:id', function(req, res, next) {
  Ticket_scan.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE /todos/:id */
router.delete('/:id', function(req, res, next) {
  Ticket_scan.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
