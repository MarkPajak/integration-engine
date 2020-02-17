var mongoose = require('mongoose');


var kiosk_nominate = new mongoose.Schema({
			
	
		nomination_name: { type: String ,required:true},
		date_logged: { type: Date, default :new Date()},
		kiosk: { type: String,required:true},
		date: { type: Date, default :new Date()},
		reason: { type: String}
});



kiosk_nominate.set('toJSON', {
   virtuals: true
});


module.exports = mongoose.model('kiosk_nominate', kiosk_nominate);

