var express = require('express');
var router = express.Router();
var fs = require('fs');

var Turnstiles=  require('../data_loader/turnstiles/turnstile-controller')
turnstiles= new Turnstiles()


router.get('/test', function(req, res, next) {
		

  // write errors will be emitted on the port since there is no callback to write
 // port.write('main screen turn on');
 // port.close(res.json('ok'))
   
  res.json('ok')
});
	
	
})




module.exports = router;
