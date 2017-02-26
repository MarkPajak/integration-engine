
var mongoose = require('mongoose');
var moment = require('moment');
var Schema = mongoose.Schema;

var logging = {"timeline":true}

 var logging = new Schema({
		id: String,
		username: String,
		date: Date,
		message: String
});


logging.set('toObject', { virtuals: true });
logging.set('toJSON', { virtuals: true });



module.exports = mongoose.model('logging', logging);