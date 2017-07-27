var express = require('express');
var router = express.Router();
var Team = require('../models/user.js');
Route_permissions= require('./functions/route_permissions.js');
route_permissions=new Route_permissions()
Api_calls= require('./functions/standard_api_calls.js');


/* GET /todos listing. */
router.get('/',route_permissions.isAuthenticated, function(req, res, next) {

  Team.find()
	   .populate('leave_taken')
	   .exec (  function (err, todos) {
    if (err) return next(err);
    res.json(todos);
  })
});

api_calls=new Api_calls(Team,router)


module.exports = router;
