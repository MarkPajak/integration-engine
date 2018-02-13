var http = require('http');
var fs = require('fs');



var express = require('express');
var router = express.Router();

Route_permissions= require('../functions/route_permissions.js');
route_permissions=new Route_permissions()
Api_calls= require('../functions/standard_api_calls.js');
var request = require('request');
var moment = require('moment')
var _ =  require('underscore');
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var staticBasePath = './uploads';

var download = function( dest, res,cb) {


 var fileLoc = path.resolve(staticBasePath);
 fileLoc = path.join(fileLoc,dest);

       // parse URL

  // extract URL path
  let pathname = fileLoc;
  // maps file extention to MIME types
  const mimeType = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.eot': 'appliaction/vnd.ms-fontobject',
    '.ttf': 'aplication/font-sfnt'
  };
  fs.exists(fileLoc, function (exist) {
    if(!exist) {
      // if the file is not found, return 404
      res.statusCode = 404;
      res.end('File ${fileLoc} not found!');
      return;
    }
    // if is a directory, then look for index.html
    if (fs.statSync(fileLoc).isDirectory()) {
      fileLoc += '/index.html';
    }
    // read file from file system
    fs.readFile(fileLoc, function(err, data){
      if(err){
        res.statusCode = 500;
        res.end('Error getting the file: ${err}.');
      } else {
        // based on the URL path, extract the file extention. e.g. .js, .doc, ...
        const ext = path.parse(fileLoc).ext;
        // if the file is found, set Content-type and send data
        res.setHeader('Content-type', mimeType[ext] || 'text/plain' );
        res.end(data);
      }
    });
  });


};

router.get('/:file',route_permissions.isAuthenticated, function(req, res, next) {


download(req.params.file,res,function(){
	

	
})



});


//api_calls=new Api_calls(Collection,router)


module.exports = router;
