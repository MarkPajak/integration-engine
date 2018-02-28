var mongoose = require('mongoose');
var moment = require('moment');


var top_40 = new mongoose.Schema({
		 				
			exhibition_id: { type: String, required: true},	  		
			//record_id: { type: String, required: true},
			//description: { type: String, required: true},
			date_logged: { type: Date, Default: new Date()},
			album_name: { type: String},
			artist: { type: String, required: true},
			track: { type: String, required: true},
		//	link: { type: String, required: true},	
		//	image: { type: String, required: true}
									
});

top_40.virtual('date').get(function() {
 				
			return   moment(this.date_value).format('DD/MM/YYYY');

});



top_40.set('toJSON', {
   virtuals: true
});
top_40.set('toObject', {
   virtuals: true
});


module.exports = mongoose.model('top_40', top_40);
