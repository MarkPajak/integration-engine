var express = require('express');
var router = express.Router();

var Tech_support = require('../models/Tech_support_trello.js');

var isAuthenticated = function (req, res, next) {
	
	if (req.isAuthenticated())
		return next();

	return res.json();
}

/* GET /todos listing. */
router.get('/',isAuthenticated, function(req, res, next) {
  Tech_support.find()
   .sort({'date': 'desc'})
     .exec(function(err, todos) {
  
     if (err) return next(err);
    res.json(todos);
  });
});
/* POST /todos */
router.post('/', isAuthenticated,function(req, res, next) {
  Tech_support.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* GET /todos/id */
router.get('/:id', isAuthenticated,function(req, res, next) {
  Tech_support.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* PUT /todos/:id */
router.put('/:id',isAuthenticated, function(req, res, next) {
  Tech_support.findByIdAndUpdate(req.params.id, req.body,{upsert:true}, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});


/* DELETE /todos/:id */
router.delete('/:id',isAuthenticated, function(req, res, next) {
  Tech_support.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
