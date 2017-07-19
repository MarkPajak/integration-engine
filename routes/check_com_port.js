var express = require('express');
var router = express.Router();
var fs = require('fs');

var Turnstiles=  require('../data_loader/turnstiles/turnstile-controller')
turnstiles= new Turnstiles()


router.get('/test', function(req, res, next) {
		

global.port.open(function (err) {
  if (err) {
     return res.json(err.messag); 
  }

  port.close(res.json('ok'))
    
});
	
	
})




module.exports = router;
