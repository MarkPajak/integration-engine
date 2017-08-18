var mongoose = require('mongoose');

var Resource = new mongoose.Schema({
		
		name: { type: String, required: true,unique:true },
		type: { type: String, required: true},
		
		date_logged: { type: Date, required: true},
		comments: { type: String},
		logger_user_name: { type: String},
		asset_name: { type: String},
		asset_type: { type: String},
		asset_no: { type: String, unique: true},
		label_location: { type: String},
		label_notes: { type: String},
		serial_no: { type: String},
		model_no: { type: String},
		location: { type: String},
		description: { type: String}
		
});


module.exports = mongoose.model('Resource', Resource);
