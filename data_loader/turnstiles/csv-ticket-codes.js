var valid_tickets_file = function (){
var _ = require('underscore');
var self = this
var fs = require('fs');
var parse = require('csv-parse');
var async = require('async');
var inputFile='./ticket_files/tickets.csv';
fs.createReadStream(inputFile).on('error', function(err) {
  var nofile=true
});

self.valid_tickets=[]


self.load_tickets = function(cb){


var parser = parse({delimiter: ','}, function (err, data) {
	
	 
	_.each(data, function (line) {
    // do something with the line
    self.valid_tickets.push(line[0])

	
  })
  
  console.log('ticket file loaded')
  
  cb( self.valid_tickets)
})
if(!nofile){
fs.createReadStream(inputFile).pipe(parser);
}
else
{
console.log('no ticket file')
return ('no ticket file')
}

}

}

module.exports = valid_tickets_file