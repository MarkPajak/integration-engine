var express = require('express');
var router = express.Router();


var Leave = require('../models/Leave.js');

var isAuthenticated = function (req, res, next) {
	
	if (req.isAuthenticated())
	if (req.user.group=="DEFAULT") return false ;
		return next();

	return res.json();
}
router.get('/', function(req, res, next) {

  Leave.find()
	   .populate('team_member')
	   .exec (  function (err, todos) {
    if (err) return next(err);
    res.json(todos);
  })
});

/* POST /todos */
router.post('/',isAuthenticated, function(req, res, next) {
  Leave.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* GET /todos/id */
router.get('/:id',isAuthenticated, function(req, res, next) {
  Leave.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* PUT /todos/:id */
router.put('/:id', isAuthenticated,function(req, res, next) {
  Leave.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});


/* DELETE /todos/:id */
router.delete('/:id',isAuthenticated, function(req, res, next) {
  Leave.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});



module.exports = router;
