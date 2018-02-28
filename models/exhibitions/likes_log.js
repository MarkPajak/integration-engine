var mongoose = require('mongoose');
var moment = require('moment');


var likes_log = new mongoose.Schema({
		 				
			exhibition_id: { type: String, required: true},	  		
			record_id: { type: String, required: true},
			description: { type: String, required: true},
			date_logged: { type: Date, Default: new Date()},
			album_name: { type: String, required: true},
			link: { type: String, required: true},	
			image: { type: String, required: true}
									
});

likes_log.virtual('date').get(function() {
 				
			return   moment(this.date_value).format('DD/MM/YYYY');

});



likes_log.set('toJSON', {
   virtuals: true
});
likes_log.set('toObject', {
   virtuals: true
});


module.exports = mongoose.model('likes_log', likes_log);
