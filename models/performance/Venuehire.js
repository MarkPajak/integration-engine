var mongoose = require('mongoose');
var moment = require('moment');

var visitor_groupDoc = new mongoose.Schema({
  name: String,
  count: Number,
});



var Venue_hire = new mongoose.Schema({
		  
		
		
			museum_id: { type: String, required: true},				  
			kpi_type: { type: String },	
			value: { type: Number, required: true}, //income
			date_logged: { type: Date, required: true},
			date_value: { type: Date},
			comments: { type: String},	
			customer: { type: String},	
			booking_type: { type: String},	
			visitor_groups:  [visitor_groupDoc],			
			logger_user_name: { type: String}
			
			
	
});
Venue_hire.virtual('date').get(function() {
 
				
			return   moment(this.date_value).format('DD/MM/YYYY');

});


Venue_hire.virtual('vendor_id').get(function() {
 
				
				//return encodeURIComponent(this.vendor.toLowerCase().replace(/ /g, ''))

});

Venue_hire.virtual('order_cost').get(function() {
 
				
				//return this.cost_price*this.number_sold

});

Venue_hire.virtual('date_day').get(function() {
 
				
				//return moment(this.date).startOf('day');

});
Venue_hire.set('toJSON', {
   virtuals: true
});
Venue_hire.set('toObject', {
   virtuals: true
});


module.exports = mongoose.model('Venue_hire', Venue_hire);
