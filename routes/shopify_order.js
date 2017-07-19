var express = require('express');
var router = express.Router();
var _ =require('underscore');
var shopify_order = require('../models/Shopify_order.js');

var isAuthenticated = function (req, res, next) {
	
	if (req.isAuthenticated())
		return next();

	return res.json();
}


/* POST /todos */
router.post('/', function(req, res, next) {
  shopify_order.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

router.get('/', function(req, res, next) {

  shopify_order.find()
	   .sort({date_value: 'desc'})
	   .exec (  function (err, todos) {
    if (err) return next(err);
    
	if(req.params.csv){


 res.setHeader('Content-disposition', 'attachment; filename=donations.csv');
  res.set('Content-Type', 'text/csv');
    var fields = ['museum_id', 'donation_box_amount', 'donation_box_no','date','comments','logger_user_name','date_recorded'];
     var csv = json2csv({ data: todos, fields: fields });
  res.status(200).send(csv);


}
else
{
	res.json(todos);
	
}
	
	
	
  })
});

router.get('/vendor/:vendor_id', function(req, res, next) {

console.log(req.params['vendor_id'])
var vendor_id=req.params['vendor_id']

			shopify_order.find()
            .exec(function (err, athletes) {
				  if (err) return handleError(err);
				  var filtered = _.filter(athletes, function(element){
					return  element['vendor_id'] == vendor_id;
				});


				  res.json(filtered)
				})

})

/* GET /todos/id */
router.get('/:id', function(req, res, next) {
  shopify_order.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* PUT /todos/:id */
router.put('/:id', function(req, res, next) {
  shopify_order.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE /todos/:id */
router.delete('/:id', function(req, res, next) {
  shopify_order.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
