var express = require('express');
var _ = require('underscore');
var router = express.Router();
router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
var Likes_log = require('../../models/feedback/kiosk.js');

var isAuthenticated = function (req, res, next) {
	
	if (req.isAuthenticated())
		return next();

	return res.json();
}

//aggregation
/* GET /todos listing. */
router.get('/tally', function(req, res, next) {

function get_kpis(cb){

Likes_log.aggregate([
 { $sort : { date : -1 } },
 	{ $match : {satisfaction: { $ne: null}} },
 		{$project:{
							   "kiosk":1,
							   "satisfaction": 1,							  
														
										
					}
			
					},
	
		 { $group: {
                _id: { 				   
					   kiosk:'$kiosk',
					    satisfaction:'$satisfaction',
						
					 }, 
			
               likes_tally: { $sum: 1 }
            }
			
		 },
	{$project:{
							  
							  _id : 0 ,  "kiosk":"$_id.kiosk",
							    "satisfaction":"$_id.satisfaction",
							   	"likes_tally": 1,									   
														
										
	}},

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



router.get('/tally/:exhibition_id', function(req, res, next) {



Likes_log.aggregate([
 { $project : { _id : 0 ,
				exhibition_id:1,
				record_id:1,
				image:1,
				description:1,
				album_name:1,
				link:1
			

				}},
		{ $match:{exhibition_id:req.params.exhibition_id }},

		 { $group: {
                _id: {      
					   record_id:'$record_id',
					   description:'$description',
					    album_name:'$album_name',
						link:'$link',
						  image:'$image'
					 },  
               tally: { $sum: 1 }
            },
			
		 },
{$project:{ _id : 0,"record_id":"$_id.record_id"
				   , "image":"$_id.image"
				   , "description":"$_id.description"
				    , "album_name":"$_id.album_name"
				   , "link":"$_id.link"
				    , "tally":"$tally"
 }},{
                "$sort" : { "tally" : -1 }
            },
			{
				$limit:21
				
			}

    ], function (err, result) {
        if (err) {
            console.log(err);
        } else {
		res.header('Access-Control-Allow-Origin', '*'); //AVOID CORS ERRORS LIKE A PRO
  
    res.header('Access-Control-Allow-Headers', 'Content-Type');
		res.send(result)
		   	//mongoose.connection.close()	
        }
		
    });
})

	


router.get('/all', function(req, res, next) {

function get_kpis(cb){

Likes_log.aggregate([
 { $sort : { date : -1 } },
		{ $match:{result:"open" }},
		 { $group: {
                _id: { year : { $year : "$date" },        
					   month : { $month : "$date" },        
					   record_name:'$record_name'
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
		if(venues.indexOf(row._id.record_name)==-1){
		
		if(row._id.record_name=="PLIOSAURUS!"){
		row._id.record_name="BMAG"
		}
		if(row._id.record_name=="SKELETONS"){
		row._id.record_name="M-SHED"
		}
		
			venues.push(row._id.record_name)
		}
	})
	
	
	var returned_data=[]



function wind_up_Stats(	result,returned_row,analysis_field,venue){
			
			var years = [2014,2015,2016,2017,2018]
			_.each(years,function(year){
				_.each(moment.monthsShort(),function(month){
				returned_row[month+" "+year]=""
				_.each(result,function(row){
					if(month==moment.monthsShort(row._id.month-1) &&venue==row._id.record_name &&row._id.year==year){
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
		returned_row.stat="Likes"
		returned_data.push(	 wind_up_Stats(	result,returned_row,"likes_tally",venue))


	})
	
	
	
res.json(returned_data)
	
	
	
	
	
	
	
})



});



var json2csv =  require('json2csv');
/* GET /todos listing. */
router.get('/csvx', function(req, res, next) {

	console.log('kiosk csv download')

  Likes_log.find({})
	 //  .populate('leave_taken')
	   .exec (  function (err, todos) {
    if (err) return next(err);
    
 res.setHeader('Content-disposition', 'attachment; filename=kiosk_feedback.csv');
  res.set('Content-Type', 'text/csv');
    var fields = ['kiosk', 'satisfaction', 'description','date'];
     var csv = json2csv({ data: todos, fields: fields });
  res.status(200).send(csv);

	
  })
});



router.get('/:exhibition_id/:date/:exact',isAuthenticated, function(req, res, next) {

var query = {}

if( req.params.exact=="false"){
	 _.extend(query, {date: {$gte: req.params.date}})
	 console.log(query)
}
else
{
  _.extend(query,{date:req.params.date})
}

if(decodeURIComponent(req.params.exhibition_id)!="#"){
 _.extend(query,{exhibition_id: decodeURIComponent(req.params.exhibition_id)})
}


  Likes_log.find(query)
		.sort({date: 'desc'})
	   .exec (  function (err, todos) {
    if (err) return next(err);
    res.json(todos);
  })
});
/* GET /todos listing. */

router.get('/', function(req, res, next) {
  Likes_log.find()
 
   .sort({'date': 'desc'})
     .exec(function(err, todos) {
  
     if (err) return next(err);
	 if(req.params.csv){ 
		 
		console.log('csv download')


		res.setHeader('Content-disposition', 'attachment; filename=donations.csv');
	  res.set('Content-Type', 'text/csv');
	  var fields = ['kiosk','satisfaction','description','date'];
	  var csv = json2csv({ data: todos, fields: fields });
	  res.status(200).send(csv);
	  
	  
	  }
	  else
	  {
		console.log('no dowload')
		  res.json(todos);
		  
	  }
  });
});

/* POST /todos */
router.get('/new', function(req, res, next) {

	var query={}

 if(req.query.satisfaction){
 
	_.extend(query, {satisfaction:  req.query.satisfaction})
 
 }
  if(req.query.kiosk){
 
	_.extend(query, {kiosk:  req.query.kiosk})
 
 }
  if(req.query.description){
 
	_.extend(query, {description:  req.query.description})
 
 }
 
 console.log('query',query)
	
  Likes_log.create(query, function (err, post) {
    if (err) {
	console.log(err)
	return next(err);
	}
	 res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.jsonp(post);
  });
});


router.get('/:date_value/:donation_box_no/:exact/:end_value',isAuthenticated, function(req, res, next) {

	var query = {}
	
	
	if( req.params.exact=="false"){
		 _.extend(query, {date: {$gte: req.params.date_value,$lte: req.params.end_value}})
		 console.log(query)
	}
	else
	{
	  _.extend(query,{date_value:req.params.date_value})
	}
	

	
	Likes_log.find(query)
			.sort({date_value: 'desc'})
		   .exec (  function (err, todos) {
		if (err) return next(err);
		res.json(todos);
	  })
	});

/* GET /todos/id */
router.get('/:id', function(req, res, next) {
  Likes_log.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* PUT /todos/:id */
router.put('/:id', function(req, res, next) {
  Likes_log.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE /todos/:id */
router.delete('/:id', function(req, res, next) {
  Likes_log.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
