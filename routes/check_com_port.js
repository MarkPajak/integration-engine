var express = require('express');
var router = express.Router();
var fs = require('fs');



router.get('/test', function(req, res, next) {
		
var port =  req.app.get('port');

console.log(port)
port.open(function (err) {
  if (err) {
     return res.json(err.messag); 
  }
  // write errors will be emitted on the port since there is no callback to write
  port.write('main screen turn on');
  port.close(res.json('ok'))
   
  
});
	
	
})




module.exports = router;
