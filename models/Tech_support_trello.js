var mongoose = require('mongoose');
var moment = require('moment');
require('moment-weekday-calc');

var Tech_support_Schema = new mongoose.Schema({
		
		  id:{ type: String, unique: true ,required:true},
		  name:{ type: String ,required:true},
		  link:{ type: String },
		  date_created: { type: Date, required: true },
		  end_date: { type: Date },		  
		  dateLastActivity: { type: Date },
		  category:{ type: String },
		  type:{ type: String },
		  job_no:{ type: String },
		  difficulty:{ type: String },
		   aknowledged:{ type: Date },
		  resolution:{ type: String },
		  list:{ type: String }, 		  
		  list_id:{ type: String }
		  		 		 
});
/*
need to be able to count days where date is between 2 dates
?store individual leave days as an array
?new table of leave days
?calculate on the fly when team table built
*/





Tech_support_Schema.virtual('weekday_duration').get(function() {
 
				var a = moment(this.date_created);
				var b = new Date();
				var b =this.dateLastActivity
				return moment().weekdayCalc(a,b,[1,2,3,4,5]); 

});

Tech_support_Schema.virtual('duration').get(function() {
	
	var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
var firstDate = new Date(2008,01,12);
var secondDate = new Date();

diffDays  = function (firstDate) {
var firstDate = new Date(firstDate);
         return secondDate.getMonth() - firstDate.getMonth()
       + (12 * (secondDate.getFullYear() - firstDate.getFullYear()));

    };
	

				var a = moment(this.date_created);
				
				return  diffDays(a).toString()

});

Tech_support_Schema.set('toObject', { virtuals: true });
Tech_support_Schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Tech_support', Tech_support_Schema);
