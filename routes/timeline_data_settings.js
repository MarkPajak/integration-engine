var express = require('express');
var router = express.Router();
var _ =  require('underscore');

var Timeline_data_settings = require('../models/timeline_data_settings.js');

/* GET /todos listing. */
router.get('/', function(req, res, next) {
 
  var query={}

 if(req.query.googlesheet_id && req.query.googlesheet_id!="#"){
 
	_.extend(query, {googlesheet_id:  req.query.googlesheet_id})
 
 }
  if(req.query.googlesheet_name && req.query.googlesheet_name!="#"){
 
	_.extend(query, {googlesheet_name:  req.query.googlesheet_name})
 
 }

 
 console.log('query',query)
  Timeline_data_settings.find(query)
   .sort({'date': 'desc'})
     .exec(function(err, todos) {
  
     if (err) return next(err);
    res.json(todos);
  });
});

/* POST /todos */
router.post('/', function(req, res, next) {
  Timeline_data_settings.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});



/* GET /todos/id */
router.get('/:id', function(req, res, next) {
  Timeline_data_settings.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* PUT /todos/:id */
router.put('/:id', function(req, res, next) {
  Timeline_data_settings.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE /todos/:id */
router.delete('/:id', function(req, res, next) {
  Timeline_data_settings.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});


module.exports = router;
