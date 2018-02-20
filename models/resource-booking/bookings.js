var mongoose = require('mongoose');


var bookings_files = new mongoose.Schema({
	
		name:  	{ type: String},
		size:	{ type: String},
		type:	{ type: String}

});




var BookingsSchema = new mongoose.Schema({
		
		  start_date: { type: Date, required: true },
		  end_date: { type: Date},
		  group: { type: String, required: true },
		  files:  [bookings_files],	
		  _type: { type: String, required: true },
		  className:{ type: String, required: true },
		  content: { type: String, required: true },
		  internal_external:{ type: String},
		  approved:{ type: Boolean, default: false },
		  payment:{ type: Boolean, default: false },
		  deposit:{ type: Number},
		  balance:{ type: Number},
		  confirmed:{ type: Boolean, default: false },
		  name: { type: String, required: true },
		  notes:{ type: String},
		  days:{ type: Number },
		  
		 
			date_logged: { type: Date, required: true},
			comments: { type: String},
			logger_user_name: { type: String}
});

BookingsSchema.virtual('calendarlink').get(function() {
 
				var link = encodeURIComponent(this.group);
				
				return link;

});


BookingsSchema.virtual('total').get(function() {
 
				var total = this.balance+this.deposit;
				
				return total;

});



BookingsSchema.virtual('duration').get(function() {
 
				var a = moment(this.start_date);
				var b = moment(this.end_date);
				return b.diff(a,'days');

});

BookingsSchema.set('toJSON', {
   virtuals: true
});


module.exports = mongoose.model('Bookings', BookingsSchema);
