var mongoose = require('mongoose');

var Resource = new mongoose.Schema({
		
		  name: { type: String, required: true,unique:true },
		  type: { type: String, required: true},
		
			date_logged: { type: Date, required: true},
			comments: { type: String},
			logger_user_name: { type: String}
		
});



module.exports = mongoose.model('Resource', Resource);
