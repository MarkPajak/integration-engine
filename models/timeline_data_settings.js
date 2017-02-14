var mongoose = require('mongoose');

var timeline_data = new mongoose.Schema({
					type:String,
					googlesheet_id:String,
					googlesheet_name:String,
					group:String,
					track:{ type: String, index: { unique: true }},
					colour:String,
					title_column:String,
					start_column:String,
					group_column:String,
					end_column:String,
					value_column:String,
					subgroup_column:String,
					date_column:String,
					data_feed_url:String,
					checked_event_types:[],
					event_type: String,
					use_moment:Boolean,
					data_settings:String,
					group_id:String,
					group_id_column:String,					
					val_1:Number,
					val_2:Number,
					val_3:Number,
					val_4:Number,
					val_5:Number,
					val_6:Number,
					val_7:Number,
					val_8:Number,
					val_9:Number,
					val_10:Number
});






module.exports = mongoose.model('Timeline_data', timeline_data);
