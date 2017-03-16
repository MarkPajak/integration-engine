var order_form_controller = function (options){

var self=this
var fs = require('fs');
var allkeys=JSON.parse(fs.readFileSync('./secret/api_keys.JSON').toString());

var shop = "BMAG"
var keys = allkeys[shop]
//keys.user=req.user.username
console.log('keys',keys)


var Order_data = require("../shopify/order_form.js");
var order_data = new Order_data(keys); 



self.go=function(cb){
console.log('get_vendor_ids')
order_data.get_vendor_ids(keys,function(done){
console.log(done)
cb
});

}


}

module.exports = order_form_controller;

	