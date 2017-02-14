
var mongoose = require('mongoose');
var moment = require('moment');
var Schema = mongoose.Schema;

 var user = new Schema({
	id: String,
	username: String,
	password: String,
	email: String,
	firstName: String,
	lastName: String,
	 team: String,
  job: String,
  trello_doing_id:String,
  score:Number,
  bonus:Number,
  penalty:Number,
  leave_start:Date,
  number_days_leave:Number,
  number_days_leave_remaining:Number,
  leave_taken : [{ type: Schema.Types.ObjectId, ref: 'Leave' }],
});


user.virtual('leave_year_end').get(function() {
 
			
				return new Date(moment(this.leave_start).add(1, 'years'));

});
user.set('toObject', { virtuals: true });
user.set('toJSON', { virtuals: true });




module.exports = mongoose.model('user', user);