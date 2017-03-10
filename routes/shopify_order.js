var express = require('express');
var router = express.Router();

var Shopify_order = require('../models/Shopify_order.js');

var isAuthenticated = function (req, res, next) {
	
	if (req.isAuthenticated())
		return next();

	return res.json();
}

/* GET /todos listing. */
router.get('/',isAuthenticated, function(req, res, next) {
  Shopify_order.find()
   .sort({'date': 'desc'})
     .exec(function(err, todos) {
  
     if (err) return next(err);
    res.json(todos);
  });
});

/* POST /todos */
router.post('/', function(req, res, next) {
  Shopify_order.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});



router.get('/vendor/:vendor_id', function(req, res, next) {

console.log(req.param('vendor_id'))
  Shopify_order.find({vendor_id:req.param.vendor_id}, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});



/* GET /todos/id */
router.get('/:id', function(req, res, next) {
  Shopify_order.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* PUT /todos/:id */
router.put('/:id', function(req, res, next) {
  Shopify_order.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE /todos/:id */
router.delete('/:id', function(req, res, next) {
  Shopify_order.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
