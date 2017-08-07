var express = require('express');
var router = express.Router();
var Collection = require('../../models/resource-booking/bookings.js');
Route_permissions= require('../functions/route_permissions.js');
route_permissions=new Route_permissions()
Api_calls= require('../functions/standard_api_calls.js');


/* GET /todos listing. */
router.get('/',route_permissions.isAuthenticated, function(req, res, next) {

  Collection.find()
	   .populate('leave_taken')
	   .exec (  function (err, todos) {
    if (err) return next(err);
    res.json(todos);
  })
});

router.get('/:date_value/:exact/:museum_id',route_permissions.isAuthenticated, function(req, res, next) {

var query = {}

/*
if( req.params.exact=="false"){
	 _.extend(query, {date_value: {$gte: req.params.date_value}})
	 console.log(query)
}
else
{
  _.extend(query,{date_value:req.params.date_value})
}

if(decodeURIComponent(req.params.museum_id)!="#"){
 _.extend(query,{museum_id: decodeURIComponent(req.params.museum_id)})
}

*/


  Collection.find(query)
		.sort({date_value: 'desc'})
	   .exec (  function (err, todos) {
    if (err) return next(err);
    res.json(todos);
  })
});

api_calls=new Api_calls(Collection,router)


module.exports = router;
