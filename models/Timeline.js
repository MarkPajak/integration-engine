var mongoose = require('mongoose');

var TimelineSchema = new mongoose.Schema({
		
		  start_date: { type: Date, required: true },
		  end_date: { type: Date, required: true },
		  group: { type: String, required: true },
		  _type: { type: String, required: true },
		  className:{ type: String, required: true },
		  content: { type: String, required: true },
		  name: { type: String, required: true },
		  notes:{ type: String},
		  days:{ type: Number }
});




TimelineSchema.virtual('duration').get(function() {
 
				var a = moment(this.start_date);
				var b = moment(this.end_date);
				return b.diff(a,'days');

});


//module.exports = TimelineSchema;

module.exports = mongoose.model('Timeline', TimelineSchema);
