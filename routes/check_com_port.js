var express = require('express');
var router = express.Router();
var fs = require('fs');




router.get('/test', function(req, res, next) {
		
var SerialPort = require('serialport');
var port = new SerialPort('COM2', { autoOpen: false });

port.open(function (err) {
  if (err) {
     return res.json(err.messag); 
  }
  // write errors will be emitted on the port since there is no callback to write
  port.write('main screen turn on');
});
	
	
})




module.exports = router;
