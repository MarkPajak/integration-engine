var express = require('express');
var router = express.Router();


var logging = require('../models/logging.js');

router.get('/', function(req, res, next) {

  logging.find()
	   .populate('team_member')
	   .exec (  function (err, todos) {
    if (err) return next(err);
    res.json(todos);
  })
});

/* POST /todos */
router.post('/', function(req, res, next) {
  logging.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* GET /todos/id */
router.get('/:id', function(req, res, next) {
  logging.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* PUT /todos/:id */
router.put('/:id', function(req, res, next) {
  logging.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});


/* DELETE /todos/:id */
router.delete('/:id', function(req, res, next) {
  logging.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});



module.exports = router;
