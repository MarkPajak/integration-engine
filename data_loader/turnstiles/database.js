var mongo = require('mongodb'),
  Server = mongo.Server,
  Db = mongo.Db;

var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('exampleDb', server);

var database_connect = function (){


var self = this

self.connect= function (cb){

cb(db)

}
}


module.exports= database_connect