var mongoose = require('mongoose');
var moment = require('moment');





var Data_cache = new mongoose.Schema({
		  
		
		
			data_id: { type: String, required: true},
			row_name: { type: String, required: true},
			date_cached: { type: Date},
			cache: { type: Object},
			
			
			
	
});

Data_cache.set('toJSON', {
   virtuals: true
});
Data_cache.set('toObject', {
   virtuals: true
});


module.exports = mongoose.model('Data_cache', Data_cache);
