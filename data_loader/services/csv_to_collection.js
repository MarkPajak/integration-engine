var csv_to_collection = function (options){

var self = this;
var _ = require('underscore');
var self = this
var fs = require('fs');
var parse = require('csv-parse');
var async = require('async');

var nofile=false



self.load_tickets = function(inputFile,cb){
var stream =fs.createReadStream(inputFile)
		var returned_data = []
		
		console.log('load_tickets')
		var parser = parse({delimiter: ','}, function (err, data) {
	
		  cb(data)
		  
		})


		stream.on('error', function (error) {console.log("Caught", error);});
		stream.on('readable', function () {stream.pipe(parser);});


}

}

module.exports = csv_to_collection;

