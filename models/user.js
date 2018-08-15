
var mongoose = require('mongoose');
var moment = require('moment');
var Schema = mongoose.Schema;

var views = {"timeline":true}

 var user = new Schema({
		id: String,
		username:  { type: String, unique: true,dropDups: true } ,
		password: String,
		email:	String,
		firstName: String,
		lastName: String,
		group:  { type: String, default: 'DEFAULT'} ,
		team: String,
		add_rooms:{ type: Boolean, default: false},
		add_equipment:{ type: Boolean, default: false},
		add_room_bookings:{ type: Boolean, default: false},
		add_equipment_bookings:{ type: Boolean, default: false},
		approve_equipment_bookings:{ type: Boolean, default: false},
		approve_room_bookings:{ type: Boolean, default: false},
		permissions:{ type: Object, default: views},
		job: String,
		trello_doing_id:String,
		score:Number,
		bonus:Number,
		penalty:Number,
		leave_start:Date,
		number_days_leave:Number,
		number_days_leave_remaining:Number,
		leave_taken : [{ type: Schema.Types.ObjectId, ref: 'Leave' }],
		resetPasswordToken: { type: String, default: 'cheese'} ,
		resetPasswordExpires:{ type:  Date }
});

user.methods.hasChanged = function(firstName, lastName, email) {
	return (this.firstName !== firstName || this.lastName !== lastName || this.email !== email);
};


user.virtual('username_lower' ).get(function() {
 
		
			return   (this.username.toLowerCase());

});


user.methods.getFullName = function() {
	return (this.firstName + ' ' + this.lastName);    
};
user.virtual('leave_year_end').get(function() {
 
			
				return new Date(moment(this.leave_start).add(1, 'years'));

});
user.set('toObject', { virtuals: true });
user.set('toJSON', { virtuals: true });




module.exports = mongoose.model('user', user);