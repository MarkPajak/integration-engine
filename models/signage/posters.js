var mongoose = require('mongoose');


var posters = new mongoose.Schema({
	
		name:  	{ type: String},
		size:	{ type: String},
		type:	{ type: String}

});


//download
//size
//fileid
//file
//parents
//link
//folder

var PostersSchema = new mongoose.Schema({
		
		  start_date: { type: Date, required: true },
		  end_date: { type: Date},
		  venue: { type: String },
		  files:  [posters],
		  notes:{ type: String},
		  date_logged: { type: Date, required: true},
		  comments: { type: String},
		  logger_user_name: { type: String}
});

PostersSchema.virtual('calendarlink').get(function() {
 
				var link = encodeURIComponent(this.group);
				
				return link;

});


PostersSchema.virtual('total').get(function() {
 
				var total = this.balance+this.deposit;
				
				return total;

});



PostersSchema.virtual('duration').get(function() {
 
				var a = moment(this.start_date);
				var b = moment(this.end_date);
				return b.diff(a,'days');

});

PostersSchema.set('toJSON', {
   virtuals: true
});


module.exports = mongoose.model('Posters', PostersSchema);
