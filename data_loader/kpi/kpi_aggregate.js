var express = require('express');
var router = express.Router();

var Kpi_aggregate = require('../../models/Kpi_log.js');
var moment = require('moment');
var _ = require('underscore');

var mongoose = require('mongoose');
var dbConfig = require('../../db');
mongoose.connect(dbConfig.url);	

var returned_data=[]

var fs = require('fs');


var config=[]

config.save_to_sheets=true
config.title = "data"
config.google_sheet_id="1PwpgPwaejQa5F3mPBmbTew7RaQTlpRVZzQ4jPrdKz54"

var Save_any_data_to_google_sheetInstance = require("../services/save_any_data_to_google_sheet.js");
var save_any_data_to_google_sheetInstance = new Save_any_data_to_google_sheetInstance(config);

function get_kpis(cb){

Kpi_aggregate.aggregate([
 
		 { $group: {
                _id: { year : { $year : "$date_value" },        
					   month : { $month : "$date_value" },        
					   venue:'$museum_id'
					 },  
               visits: {$sum: '$value' }
            }
		 }			

    ], function (err, result) {
        if (err) {
            console.log(err);
        } else {

		cb(result)
		   	mongoose.connection.close()	
        }
		
    });
}

get_kpis( function ( result) {
	

	
	
	

	
	//load venues
	var venues=[]
	_.each(result,function(row){
		if(venues.indexOf(row._id.venue)==-1){
			console.log('adding venue ',row._id.venue)
			venues.push(row._id.venue)
		}
	})
	
	
	var returned_data=[]
	_.each(venues,function(venue){
		var returned_row={}
		returned_row.museum=venue
				var years = [2016,2017,2018,2019]
			_.each(years,function(year){
				_.each(moment.monthsShort(),function(month){			
				returned_row[month+"_"+year]="0"
					_.each(result,function(row){
						if(month==moment.monthsShort(row._id.month-1) &&venue==row._id.venue &&row._id.year==year){
							returned_row[month+"_"+year]=row.visits
						}
					})
				})
			})
			
	returned_data.push(	returned_row)
	})

	var headers=[]
		headers.push("museum")
	
		headers.push("Mar_2017")
		headers.push("Apr_2017")
		headers.push("May_2017")
		headers.push("Jun_2017")
		headers.push("Jul_2017")
		headers.push("Aug_2017")
		headers.push("Sep_2017")
		headers.push("Oct_2017")
		headers.push("Nov_2017")
		headers.push("Dec_2017")
	    headers.push("Jan_2018")
		headers.push("Feb_2018")
		headers.push("Mar_2018")


	save_any_data_to_google_sheetInstance.add_data_to_sheet(headers,returned_data,function(analytics_data) {
			console.log('add_data_to_sheet callback')
					
	})
	
	
})
