var mongoose = require('mongoose');

var BookingsSchema = new mongoose.Schema({
		
		  start_date: { type: Date, required: true },
		  end_date: { type: Date},
		  group: { type: String, required: true },
		  _type: { type: String, required: true },
		  className:{ type: String, required: true },
		  content: { type: String, required: true },
		  name: { type: String, required: true },
		  notes:{ type: String},
		  days:{ type: Number },
		  
		 
			date_logged: { type: Date, required: true},
			comments: { type: String},
			logger_user_name: { type: String}
});




BookingsSchema.virtual('duration').get(function() {
 
				var a = moment(this.start_date);
				var b = moment(this.end_date);
				return b.diff(a,'days');

});



module.exports = mongoose.model('Bookings', BookingsSchema);
