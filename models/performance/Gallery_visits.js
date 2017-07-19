var mongoose = require('mongoose');
var moment = require('moment');
var TEG_visits = new mongoose.Schema({
		  
		
			id: String,
			museum_id: { type: String, required: true},				  
			kpi_type: { type: String },	
			value: { type: Number, required: true},
			gallery: { type: String},
			date_logged: { type: Date, required: true},
			date_value: { type: Date, required: true},
			comments: { type: String},			
			logger_user_name: { type: String}
			
			
	
});
TEG_visits.virtual('date').get(function() {
 
				
			return   moment(this.date_value).format('DD/MM/YYYY');

});


TEG_visits.virtual('vendor_id').get(function() {
 
				
				//return encodeURIComponent(this.vendor.toLowerCase().replace(/ /g, ''))

});

TEG_visits.virtual('order_cost').get(function() {
 
				
				//return this.cost_price*this.number_sold

});

TEG_visits.virtual('date_day').get(function() {
 
				
				//return moment(this.date).startOf('day');

});
TEG_visits.set('toJSON', {
   virtuals: true
});
TEG_visits.set('toObject', {
   virtuals: true
});


module.exports = mongoose.model('TEG_visits', TEG_visits);
