
var _ = require('underscore');
var ical = require('ical-generator')




var refactor_data_table = function (options){


this.calendar_feed = function (events){

				_events = []
				_.each(events,function(event,i){
								var _event = {
											start:event.start,
											end:event.end,
											timestamp: event.timestamp,
											summary:event.summary,
											organizer:event.organizer
											}
									
									_events.push(_event)
				})


				// You can also create events directly with ical()
				cal = ical({
					domain: 'sebbo.net',
					prodId: '//superman-industries.com//ical-generator//EN',
					events: _events
				}).toString();



				return (cal)



}

	
	this.mongo_aggregator=  { "$add": [ "$date_value", 7 * 60 * 60 * 1000 ] }         
	this.mongo_aggregator2=  { "$add": [ "$date_logged", 7 * 60 * 60 * 1000 ] }     	
	this.mongo_aggregator3=  { "$add": [ "$date_value_end", 7 * 60 * 60 * 1000 ] }     	
	 this.retail_stats_weekly=function(result,result2){				   

			_.each(result,function(kpi,i){
			_.each(result2,function(visits,ii){
			//console.log(visits.year)
			if(kpi.kpi_venue==visits.venue &&  kpi.kpi_week==visits.week && kpi.kpi_year==visits.year){
			result[i].visits=visits.visits
		
			result[i].net_sales=((kpi.total_sales - kpi.non_vat_sales)/1.2+kpi.non_vat_sales).toFixed(2)
			result[i].vat_sales=(kpi.total_sales - kpi.non_vat_sales).toFixed(2)
			result[i].conversion=((kpi.number_transactions/visits.visits)*100).toFixed(2);
			result[i].ATV=((kpi.total_sales - kpi.non_vat_sales)/kpi.number_transactions).toFixed(2)
			
				
							for (compare_previous_years = 1; compare_previous_years < 2; compare_previous_years++) { 
  

							_.each(result,function(previous_data){
								compare_previous_year = visits.year-compare_previous_years
								//console.log('compare_previous_year',compare_previous_year)
								if(previous_data.kpi_venue==visits.venue &&  previous_data.kpi_week==visits.week && previous_data.kpi_year==compare_previous_year){							
											result[i]["% net_sales last year"] =((kpi.net_sales/previous_data.net_sales)*100-100).toFixed(2);
											
								}
							})
							
							}
			
			
			
			

			}
			
			
			})
		})
	return result
	 }
	 
	 this.donations_stats_monthly=function(result,result2,welsomedesk){				   
			
			
	

				_.each(result,function(kpi,i){
					_.each(result,function(previous_data){
								if(previous_data.combined){
									
								compare_previous_year = kpi.kpi_year-1
								
								console.log("test....")
								if(previous_data.kpi_venue==kpi.kpi_venue &&  previous_data.kpi_year==compare_previous_year&&  previous_data.kpi_month==kpi.kpi_month  ){	
								//console.log("checking previous sales for ",visits.venue)
								//console.log('previous_data.kpi_year',previous_data.kpi_year)
								//console.log('previous_data.net_sales',previous_data.net_sales)
								
									
								if(previous_data.combined>0){
									console.log(previous_data.net_sales,compare_previous_year,compare_previous_year)
										result[i].last_year_total=previous_data.combined
										result[i].last_year =((kpi.combined/previous_data.combined)*100-100).toFixed(2)+"%"			
									
								}
								
								
								
								}
								}
							})
							})
						
							
	return result
	 }
	 
	 
	 this.retail_stats_monthly=function(result,result2){				   
			
			
			_.each(result,function(kpi,i){
			_.each(result2,function(visits,ii){
				
				
			
				
			
			if(kpi.kpi_venue==visits.venue &&  kpi.kpi_month==visits.month && kpi.kpi_year==visits.year){
			console.log("checking sales for ",visits.venue)
			result[i].visits=visits.visits
			result[i].net_sales=((kpi.total_sales - kpi.non_vat_sales)/1.2+kpi.non_vat_sales).toFixed(2)
			result[i].vat_sales=(kpi.total_sales - kpi.non_vat_sales).toFixed(2)
			result[i].conversion=((kpi.number_transactions/visits.visits)*100).toFixed(2)+"%";
			result[i].ATV=((kpi.total_sales - kpi.non_vat_sales)/kpi.number_transactions).toFixed(2)
			
						//for (compare_previous_years = 1; compare_previous_years < 2; compare_previous_years++) { 
							
					
							
							//}
			}		
			})
		})

				_.each(result,function(kpi,i){
					_.each(result,function(previous_data){
								if(previous_data.net_sales){
									
								compare_previous_year = kpi.kpi_year-1
								
								console.log("test....")
								if(previous_data.kpi_venue==kpi.kpi_venue &&  previous_data.kpi_year==compare_previous_year&&  previous_data.kpi_month==kpi.kpi_month  ){	
								//console.log("checking previous sales for ",visits.venue)
								//console.log('previous_data.kpi_year',previous_data.kpi_year)
								//console.log('previous_data.net_sales',previous_data.net_sales)
								
									
								if(previous_data.net_sales>0){
									console.log(previous_data.net_sales,compare_previous_year,compare_previous_year)
										result[i].last_year_total=previous_data.net_sales
										result[i].last_year =((kpi.net_sales/previous_data.net_sales)*100-100).toFixed(2)+"%"			
									
								}
								
								
								
								}
								}
							})
							})
						
							
	return result
	 }
	 
	  this.wind_up_Stats_monthly_variable=function(result,returned_row,analysis_field,venue){
		 
	var years = [2015,2016,2017,2018,2019]
			_.each(years,function(year){
			_.each(moment.monthsShort(),function(month){
			
			returned_row[month+" "+year]=""
				_.each(result,function(row){
					if(month==moment.monthsShort(row.kpi_month-1) &&venue==row.kpi_venue &&row.kpi_year==year){
						returned_row[month+" "+year]=row[analysis_field]
					}
				})
			})
			
			
			
		})
		return(returned_row)
	}
	
	

	 this.wind_up_Stats_weekly_variable=function(result,returned_row,analysis_field,venue){
		 
	var years = [2015,2016,2017,2018,2019]
			_.each(years,function(year){
			for (week = 0; week < moment().isoWeeksInYear(); week++) { 

			week_value = moment().day("Monday").year(year).week(week).format('DD/MM/YY')
			
			returned_row[week_value]=""
		
				_.each(result,function(row){
					if(week==row._id.kpi_week &&venue==row.kpi_venue &&row.kpi_year==year){
						returned_row[week_value]=row[analysis_field]
					}
				})
			}
			
			
			
		})
		return(returned_row)
	}
	
	
		
	 this.wind_up_Stats_monthly=function(result,venues){
	var returned_data=[]
	_.each(venues,function(venue){
		var returned_row={}
		var returned_row_compare_last_year={}
		var returned_row_compare_last_year_total={}
		returned_row.museum=venue
		
			var years = [2015,2016,2017,2018,2019]
			_.each(years,function(year){
			_.each(moment.monthsShort(),function(month){
				returned_row[month+" "+year]=""
					_.each(result,function(row){
						if(month==moment.monthsShort(row._id.month-1) &&venue==row._id.venue &&row._id.year==year){
							returned_row[month+" "+year]=row.visits
							returned_row.stat="Visits"
							returned_row.cssclass="bold"
							returned_row.cellfilter="number:2"
							for (compare_previous_years = 1; compare_previous_years <= 2; compare_previous_years++) { 
  

							_.each(result,function(previous_data){
								compare_previous_year = year-compare_previous_years
							
								
								if(month==moment.monthsShort(previous_data._id.month-1) &&venue==previous_data._id.venue &&previous_data._id.year==compare_previous_year){
									
										returned_row_compare_last_year_total.museum=compare_previous_year+ " - " + year
										returned_row_compare_last_year.museum="% difference" 
										//returned_row_compare_last_year.cssclass="red"
										returned_row_compare_last_year[month+" "+year]=((row.visits/previous_data.visits)*100-100).toFixed(2)+"%";
										returned_row_compare_last_year_total[month+" "+year]=previous_data.visits
										
									
								}
							})
							
							}
							
						}
					})
				})
			})
		returned_data.push(	returned_row)
		if(returned_row_compare_last_year.museum){
			returned_data.push(	returned_row_compare_last_year)
		}
		if(returned_row_compare_last_year_total.museum){
			returned_data.push(	returned_row_compare_last_year_total)
			
		}
	})
	return returned_data
	 }
	
	
	 this.wind_up_Stats_weekly=function(result,venues){
	
	var returned_data=[]
		_.each(venues,function(venue){
		var returned_row={}
		var returned_row_compare_last_year={}
		returned_row.museum=venue
		
			var years = [2015,2016,2017,2018,2019]
			_.each(years,function(year){
			for (week = 0; week < moment().isoWeeksInYear(); week++) { 	
				returned_row[moment().day("Monday").year(year).week(week).format('DD/MM/YY')]=""
					_.each(result,function(row){
						if(week==row._id.week-1 &&venue==row._id.venue &&row._id.year==year){
							returned_row[moment().day("Monday").year(year).week(week).format('DD/MM/YY')]=row.visits
							returned_row.stat="Visits"
							
							for (compare_previous_years = 1; compare_previous_years < 2; compare_previous_years++) { 
  

							_.each(result,function(previous_data){
								compare_previous_year = year-compare_previous_years
								if(week==moment.monthsShort(previous_data._id.week-1) &&venue==previous_data._id.venue &&previous_data._id.year==compare_previous_year){
									
									
										returned_row_compare_last_year.museum=venue +" % last year" 
										returned_row_compare_last_year[ moment().day("Monday").year(year).week(week).format('DD/MM/YY')]=((row.visits/previous_data.visits)*100-100).toFixed(2)+"%";
										
									
								}
							})
							
							}
							
						}
					})
			}
					
				
			})
		returned_data.push(	returned_row)
		if(returned_row_compare_last_year.museum){
			returned_data.push(	returned_row_compare_last_year)
		}
		
	
	})
		return returned_data
	
	 }
	
	}

module.exports = refactor_data_table;