var mongoose = require('mongoose');


var kiosk_nominate = new mongoose.Schema({
			
		nominateion_name: { type: String ,required:true},
		date: { type: Date, default :new Date()},
		kiosk: { type: String,required:true},
		reason: { type: String}
});



kiosk_nominate.set('toJSON', {
   virtuals: true
});


module.exports = mongoose.model('kiosk_nominate', kiosk_nominate);

