var mongoose = require('mongoose');


var kiosk_feedback = new mongoose.Schema({
			
		satisfaction: { type: String ,required:true},
		date: { type: Date, default :new Date()},
		kiosk: { type: String,required:true},
		description: { type: String}
});



kiosk_feedback.set('toJSON', {
   virtuals: true
});


module.exports = mongoose.model('kiosk_feedback', kiosk_feedback);
