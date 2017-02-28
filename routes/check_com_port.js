var express = require('express');
var router = express.Router();
var fs = require('fs');



router.get('/test', function(req, res, next) {
		


console.log(port)
port.on('open', function() {
  port.write('main screen turn on', function(err) {
    if (err) {
      return   res.json(err.messag); 
    }
    console.log('message written');
	return res.json('message written'); 
  });
});




	
	
})




module.exports = function(port){

    // do as you wish
    // this runs in background, not on each
    // request

    return router;
}
