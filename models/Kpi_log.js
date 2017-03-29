var mongoose = require('mongoose');
var moment = require('moment');
var Kpi_log = new mongoose.Schema({
		  
		
			id: String,
			museum_id: { type: String, required: true},				  
			kpi_type: { type: String },	
			value: { type: Number, required: true},
			date_logged: { type: Date, required: true},
			date_value: { type: Date},	
			logger_user_name: { type: String}
			
			
	
});

Kpi_log.virtual('vendor_id').get(function() {
 
				
				//return encodeURIComponent(this.vendor.toLowerCase().replace(/ /g, ''))

});

Kpi_log.virtual('order_cost').get(function() {
 
				
				//return this.cost_price*this.number_sold

});

Kpi_log.virtual('date_day').get(function() {
 
				
				//return moment(this.date).startOf('day');

});
Kpi_log.set('toJSON', {
   virtuals: true
});
Kpi_log.set('toObject', {
   virtuals: true
});


module.exports = mongoose.model('Kpi_log', Kpi_log);
