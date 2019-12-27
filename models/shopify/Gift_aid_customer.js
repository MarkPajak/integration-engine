var mongoose = require('mongoose');
var moment = require('moment');
var Gift_aid_customer = new mongoose.Schema({
		  
			_id: { type: String, required: true ,unique:true},	
			note: { type: String},				  
			
});



Gift_aid_customer.virtual('date_published').get(function() {
 				
				return moment(this.published_at).startOf('day');

});

Gift_aid_customer.set('toJSON', {
   virtuals: true
});

module.exports = mongoose.model('Gift_aid_customer', Gift_aid_customer);
