var express = require('express');
var router = express.Router();
var Collection = require('../../models/resource-booking/resource.js');
Route_permissions= require('../functions/route_permissions.js');
route_permissions=new Route_permissions()
Api_calls= require('../functions/standard_api_calls.js');

var Customers = require("../../data_loader/shopify_2/load_data/load_customers.js");


var yeardate = new Date()
var year = yeardate.getFullYear()
var moment = require('moment');
var fs = require('fs');
var allkeys=JSON.parse(fs.readFileSync('./secret/api_keys.JSON').toString());
 var mongoose = require('mongoose');
var config = []


var data_number=60//changed by zak 13.04.2017
shops=[]
shops.push("BMAG_MONTHLY_PRODUCTS")
shops.push("MSHED")
shops.push("ONLINE")
const monthNames = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"
];


var monthName
config.created_at_min=year+"-"+monthName+"-01"
var start_date = new Date(config.created_at_min);
config.created_at_max = new Date(year, start_date.getMonth()+1, 0);

 config.created_at_max .setDate(config.created_at_max .getDate() + 1);

config.month=monthName
config.year=start_date.getFullYear()
config.generate_order_forms=false
config.save_to_sheets=true
//config.source_name=""										
									
config.title = "last_"+data_number+"_days"
config.update_product_types=true
var keys = allkeys["BMAG"]
config.google_sheet_id=keys.google_sheet_id											
console.log('keys',keys)


router.get('/',route_permissions.isAuthenticated, function(req, res, next) {

  
  var customers  = new Customers(keys,config)

                                        customers.get_customers(function(data) {
											  
                                       								
                                          res.json(data);
											  
										},function done() {

                      

                    })



 
});


/* GET /todos listing. */
router.get('/:name/:type/:exact',route_permissions.isAuthenticated, function(req, res, next) {

  Collection.find( {"type":req.params.type})
	   .populate('leave_taken')
	   .exec (  function (err, todos) {
    if (err) return next(err);
    res.json(todos);
  })
  
});


router.get('/:type/:date_value/:exact/:museum_id',route_permissions.isAuthenticated, function(req, res, next) {

var query = {}
/*

if( req.params.type){
	 _.extend(query, {type:{ $eq:req.params.type}})
	 console.log(query)
}
*/
/*
if(decodeURIComponent(req.params.museum_id)!="#"){
 _.extend(query,{museum_id: decodeURIComponent(req.params.museum_id)})
}

*/
 console.log("req.params.type",req.params.type)

  Collection.find( {"type":req.params.type})
		.sort({date_value: 'desc'})
	   .exec (  function (err, todos) {
    if (err) return next(err);
    res.json(todos);
  })
});

api_calls=new Api_calls(Collection,router)


module.exports = router;
