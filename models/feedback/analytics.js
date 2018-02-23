var mongoose = require('mongoose');


var kiosk_analytics = new mongoose.Schema({
			
		page_id: { type: String },
		page_name: { type: String },
		kiosk: { type: String },
		type: { type: String },
		app_type: { type: String },
		location: { type: String },
		machine_type: { type: String },
		kiosk_id: { type: String ,required:true},
		date: { type: Date, default :new Date()},
		description: { type: String}
});



kiosk_analytics.set('toJSON', {
   virtuals: true
});


module.exports = mongoose.model('kiosk_analytics', kiosk_analytics);
