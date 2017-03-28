var mongoose = require('mongoose');
var moment = require('moment');
require('moment-weekday-calc');

var LeaveSchema = new mongoose.Schema({
		
		  start_date: { type: Date, required: true },
		  end_date: { type: Date, required: true },
		  team: { type: String },
		  _type: { type: String, required: true },
		  team_member : { type: String, ref: 'accounts' },
		  notes:{ type: String}
		 
});
/*
need to be able to count days where date is between 2 dates
?store individual leave days as an array
?new table of leave days
?calculate on the fly when team table built
*/


LeaveSchema.virtual('weekday_duration').get(function() {
 
				var a = moment(this.start_date);
				var b = moment(this.end_date);
				return moment().weekdayCalc(a,b,[1,2,3,4,5]); 

});

LeaveSchema.virtual('duration').get(function() {
 
				var a = moment(this.start_date);
				var b = moment(this.end_date);
				return b.diff(a,'days')+1;

});

LeaveSchema.set('toObject', { virtuals: true });
LeaveSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Leave', LeaveSchema);
