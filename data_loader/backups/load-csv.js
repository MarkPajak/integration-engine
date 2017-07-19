var import_file = function (file){

var _ = require('underscore');
var self = this
var fs = require('fs');
var parse = require('csv-parse');
var nofile=false
var stream =fs.createReadStream(file)



self.valid_tickets=[]


self.load_import_file = function(cb){


var parser = parse({delimiter: ','}, function (err, data) {
	
	 
	_.each(data, function (line) {
    // do something with the line
    self.valid_tickets.push(line)


  })
    console.log('file loaded')
    cb( self.valid_tickets)
})

stream.on('error', function (error) {console.log("Caught", error);});
stream.on('readable', function () {stream.pipe(parser);});

}

}

module.exports = import_file

