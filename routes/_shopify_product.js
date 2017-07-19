var express = require('express');
var router = express.Router();
var _ = require('underscore');
var Shopify_product = require('../models/Shopify_product.js');
var Shopify_aggregate = require('../models/Shopify_transaction.js');

var isAuthenticated = function (req, res, next) {
	
	if (req.isAuthenticated())
		return next();

	return res.json();
}

/* GET /todos listing. */
router.get('/',isAuthenticated, function(req, res, next) {
  Shopify_product.find()
   .sort({'date': 'desc'})
     .exec(function(err, product_list) {
  
     if (err) return next(err);
	 
	 
	 
	 Shopify_aggregate.aggregate([
        {
            $group: {
                _id: '$product_id' ,  
                 count: {$sum: 1}
            }
        }
    ], function (err, product_analytics) {
        if (err) {
            next(err);
        } else {
           var result = []
			
			_.each(product_analytics, function(_product) {	
				_.each(product_list, function(product) {
					
					if(product.product_id==_product._id){
						new_product=[]
						new_product=product.toJSON()
						new_product.count=_product.count
						console.log(new_product)
						result.push(new_product)
					}
				})		
			})
		
        }
    });
	 
	 
	 
	 
	 
	 
	 
   // res.json(todos);
  });
});

/* POST /todos */
router.post('/', function(req, res, next) {
  Shopify_product.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});



/* GET /todos/id */
router.get('/:id', function(req, res, next) {
  Shopify_product.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* PUT /todos/:id */
router.put('/:id', function(req, res, next) {
  Shopify_product.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE /todos/:id */
router.delete('/:id', function(req, res, next) {
  Shopify_product.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
