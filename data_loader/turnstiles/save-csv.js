save_csv = function(){
	
//setup instructions
/*

*/


var fs = require('fs');
var keys=JSON.parse(fs.readFileSync('./secret/pretix_settings.JSON').toString());
var self = this
self.valid_tickets=[]
var request = require('request');

var async = require('async');
var eachAsync = require('each-async');
const querystring = require('querystring');
var _ = require('underscore');
var mongo = require('mongodb'),
 Server = mongo.Server,
  Db = mongo.Db;

var server = new Server('localhost', 27017);
		// retrieve a database reference
        var dataToWrite;
        var fs = require('fs');  



self.savecsv = function(data) {

    var database = new mongo.Db('tickets', server);
	database.open(function(err, dbref2) {
    dbref2.collection('myCollectionName', function(err, collectionref) { 
    console.log('save data to csv ' + data);
    collectionref.find({}).toArray((err, data) => {
          if (err){
            console.log(err)
                     throw err
          };
 
          const dataCSV = data.reduce((acc, user) => {
            acc += `${user._id},  ${user.date_scanned},${user.date_first_scan}, ${user.date_last_attempt}, ${user.scan_attempts}\n`;
            return acc;
          }, 
          `id, date_scanned,date_first_scan,date_last_attempt, scan_attempts\n` // column names for csv
        );
        

          fs.writeFile('ticket_files/scan_data.csv', dataCSV, 'utf8', function (err) {
            if (err) {
              console.log('Some error occured - file either not saved or corrupted file saved.');
            } else{
              console.log('It\'s saved!');
            }
          }); 
        
    })
})

})
}

}

module.exports = save_csv;