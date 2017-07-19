var express = require('express');
var router = express.Router();

var Timeline = require('../models/Timeline.js');

var isAuthenticated = function (req, res, next) {
	
	if (req.isAuthenticated())
	if (req.user.group=="DEFAULT") return false ;
		return next();

	return res.json();
}

/* GET /todos listing. */
router.get('/', function(req, res, next) {
  Timeline.find()
   .sort({'date': 'desc'})
     .exec(function(err, todos) {
  
     if (err) return next(err);
    res.json(todos);
  });
});

/* POST /todos */
router.post('/',isAuthenticated,  function(req, res, next) {
  Timeline.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});



/* GET /todos/id */
router.get('/:id', function(req, res, next) {
  Timeline.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* PUT /todos/:id */
router.put('/:id',isAuthenticated, function(req, res, next) {
  Timeline.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE /todos/:id */
router.delete('/:id',isAuthenticated, function(req, res, next) {
  Timeline.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
