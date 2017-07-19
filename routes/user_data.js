var express = require('express');
var router = express.Router();




var isAuthenticated = function (req, res, next) {
	console.log('if user is authenticated in the session, call the next() to call the next request handler ')
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();

	return false
}

/* GET /todos listing. */
router.get('/',isAuthenticated, function(req, res, next) {
  res.send(req.user);
});

module.exports = router;

