var express = require('express');
var router = express.Router();
var Collection = require('../../../models/signage/machines.js');
Route_permissions= require('../../functions/route_permissions.js');
route_permissions=new Route_permissions()
Api_calls= require('../../functions/standard_api_calls.js');



router.get('/',route_permissions.isAuthenticated, function(req, res, next) {

  Collection.find()
	   .populate('leave_taken')
	   .exec (  function (err, todos) {
    if (err) return next(err);
    res.json(todos);
  })
});


/* GET /todos listing. */
router.get('/:name/:type/:exact',route_permissions.isAuthenticated, function(req, res, next) {

  Collection.find( {"type":req.params.type})
	   .populate('leave_taken')
	   .exec (  function (err, todos) {
    if (err) return next(err);
    res.json(todos);
  })
  
});


router.get('/:type/:date_value/:exact/:museum_id',route_permissions.isAuthenticated, function(req, res, next) {

var query = {}
/*

if( req.params.type){
	 _.extend(query, {type:{ $eq:req.params.type}})
	 console.log(query)
}
*/
/*
if(decodeURIComponent(req.params.museum_id)!="#"){
 _.extend(query,{museum_id: decodeURIComponent(req.params.museum_id)})
}

*/
 console.log("req.params.type",req.params.type)

  Collection.find( {"type":req.params.type})
		.sort({date_value: 'desc'})
	   .exec (  function (err, todos) {
    if (err) return next(err);
    res.json(todos);
  })
});

api_calls=new Api_calls(Collection,router)


module.exports = router;
