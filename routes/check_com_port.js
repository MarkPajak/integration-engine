module.exports = function(port){
var express = require('express');
var router = express.Router();
var fs = require('fs');



router.get('/test', function(req, res, next) {
		

  // write errors will be emitted on the port since there is no callback to write
 // port.write('main screen turn on');
 // port.close(res.json('ok'))
   
  return res.json('ok')

	
})

}



