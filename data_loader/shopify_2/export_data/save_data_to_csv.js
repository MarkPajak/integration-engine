var save_data_to_google_sheet = function (keys,options){
    console.log("start");
var self = this;
var async = require('async');
var moment = require('moment');
var GoogleSpreadsheet = require('google-spreadsheet');
var json2csv =  require('json2csv');
var _ = require('underscore');
var doc = new GoogleSpreadsheet( options.google_sheet_id);
var duplicate = false
var logger = require('../../../models/logging.js');
var fs = require('fs');
var sheet_name = options.title//+"_"+moment(new Date()).format('DD_MM_YYYY')
console.log('options.manual',options.manual)
if(options.manual==true){
	sheet_name+="_MANUAL_"+moment(new Date()).format('DD_MM_YYYY')
}

self.save_csv = function(google_data,done){


  var fields = ['name'];
     var csv = json2csv({ data: google_data });
fs.writeFile("/home/mark/apps/"+ keys.shopify_store+"monthly.csv", csv, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
	done()
}); 
}

}

module.exports = save_data_to_google_sheet;