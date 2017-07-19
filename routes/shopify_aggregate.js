var express = require('express');
var router = express.Router();

var Shopify_aggregate = require('../models/Shopify_transaction.js');
var moment = require('moment');


var isAuthenticated = function (req, res, next) {
	
	if (req.isAuthenticated())
		return next();

	return res.json();
}

/* GET /todos listing. */
router.get('/', function(req, res, next) {
Shopify_aggregate.aggregate([
        {
            $group: {
                _id: { year : { $year : "$date" },        
						month : { $month : "$date" },        
					   day : { $dayOfMonth : "$date" },
					  type:'$product_type'
					 },  
               count: {$sum: 1}
            }
        }
    ], function (err, result) {
        if (err) {
            next(err);
        } else {
            res.json(result);
        }
    });
});


module.exports = router;
