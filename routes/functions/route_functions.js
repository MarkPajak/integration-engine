
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
									if(previous_data.kpi_venue==kpi.kpi_venue &&  previous_data.kpi_year==compare_previous_year&&  previous_data.kpi_month==kpi.kpi_month  ){	
									
									if(previous_data.combined>0){
										
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
						var sales_count = 0
							_.each(result2,function(visits,ii){
							
								if(kpi.kpi_venue==visits.venue &&  kpi.kpi_month==visits.month && kpi.kpi_year==visits.year){
									
									result[i].visits=visits.visits
									result[i].net_sales=((kpi.total_sales - kpi.non_vat_sales)/1.2+kpi.non_vat_sales).toFixed(2)
									
									result[i].vat_sales=(kpi.total_sales - kpi.non_vat_sales).toFixed(2)
									
									result[i].conversion=((kpi.number_transactions/visits.visits)*100).toFixed(2)+"%";
									result[i].ATV=((kpi.total_sales - kpi.non_vat_sales)/kpi.number_transactions).toFixed(2)
								}
							})
						})

						_.each(result,function(kpi,i){
							_.each(result,function(previous_data){
								if(previous_data.net_sales){
								
									compare_previous_year = kpi.kpi_year-1
									if(previous_data.kpi_venue==kpi.kpi_venue &&  previous_data.kpi_year==compare_previous_year&&  previous_data.kpi_month==kpi.kpi_month  ){		
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
			new_row=returned_row
			new_rowx=returned_row
			_.each(years,function(year){
			_.each(moment.monthsShort(),function(month){
				sales_for_month=0
				sales_for_month_lt=0
				returned_row[month+" "+year]=0
				new_row[month+" "+year]=0
				new_rowx[month+" "+year]=0
			
				if(analysis_field=="total_donations"){
				
				
				
						_.each(result,function(row){
							if(!isNaN(parseInt(row['combined']	))){
								if(month==moment.monthsShort(row.kpi_month-1)  &&row.kpi_year==year){
									
										months=moment.monthsShort() 
										lastmonth=months.indexOf(month)-1
										lastyear=years.indexOf(year)-1
										returned_row[month+" "+year]+=parseInt(row['combined']	)										
										returned_row.cssclass="bold"						
										returned_row.typex="currency"
							
									
								}
							}
						})
				
				}
				
				else if(analysis_field=="total_sales"){
				
				
				
						_.each(result,function(row){
							if(!isNaN(parseInt(row['net_sales']	))){
								if(month==moment.monthsShort(row.kpi_month-1)  &&row.kpi_year==year){
									
										months=moment.monthsShort() 
										lastmonth=months.indexOf(month)-1
										lastyear=years.indexOf(year)-1
										returned_row[month+" "+year]+=parseInt(row['net_sales'])										
										returned_row.cssclass="bold"						
										returned_row.typex="currency"
							
									
								}
							}
						})
				
				}
				
				
				else if(analysis_field=="yearly_donations"){
				
				
				
								_.each(result,function(row){
				
						if(month==moment.monthsShort(row.kpi_month-1)  &&row.kpi_year==year){
							

					
								sales_for_month+=parseInt(row['combined'])
								
								months=moment.monthsShort() 
								lastmonth=months.indexOf(month)-1
								
								if(month=="Apr"){
									if(parseInt(row['combined'])){
										if(returned_row[month+" "+year]){
										returned_row[month+" "+year]+=parseInt(row['combined'])
										}
										else
										{
										returned_row[month+" "+year]=parseInt(row['combined'])	
										}
									}
								}
								
								else if(returned_row[months[lastmonth]+" "+year]){
									returned_row[month+" "+year]=returned_row[months[lastmonth]+" "+year]+sales_for_month
								}
								
								lastyear=years.indexOf(year)-1
								
								if(month=="Jan"){
									returned_row[month+" "+year]=returned_row["Dec "+ years[lastyear]]+sales_for_month
								}
								returned_row.cssclass="bold"						
										returned_row.typex="currency"
								
								
							
								
						}
			
					})
				
				
				}
				
				else if(analysis_field=="yearly_total"){
				
					_.each(result,function(row){
				
						if(month==moment.monthsShort(row.kpi_month-1)  &&row.kpi_year==year){
					
								sales_for_month+=parseInt(row['net_sales'])
								
								months=moment.monthsShort() 
								lastmonth=months.indexOf(month)-1
								
								if(month=="Apr"){
									returned_row[month+" "+year]+=parseInt(row['net_sales'])
								}
								
								else if(returned_row[months[lastmonth]+" "+year]){
									returned_row[month+" "+year]=returned_row[months[lastmonth]+" "+year]+sales_for_month
								}
								
								lastyear=years.indexOf(year)-1
								
								if(month=="Jan"){
									returned_row[month+" "+year]=returned_row["Dec "+ years[lastyear]]+sales_for_month
								}
								returned_row.cssclass="bold"						
										returned_row.typex="currency"
								
								
							
								
						}
			
					})
				
				}
				else if(analysis_field=="total_last_year"){
				
					_.each(result,function(row){
				

						if(month==moment.monthsShort(row.kpi_month-1)  &&row.kpi_year==year-1){
					
								sales_for_month+=parseInt(row['net_sales'])								
								months=moment.monthsShort() 
								lastmonth=months.indexOf(month)-1
								lastyear=years.indexOf(year)-1
								
								if(month=="Apr"){
									returned_row[month+" "+year]+=parseInt(row['net_sales'])
								}								
								else if(returned_row[months[lastmonth]+" "+year]){
									returned_row[month+" "+year]=returned_row[months[lastmonth]+" "+year]+sales_for_month
								}
								if(month=="Jan"){
									returned_row[month+" "+year]=returned_row["Dec "+ years[lastyear]]+sales_for_month
								}
								returned_row.cssclass="bold"						
							    returned_row.typex="currency"
						
						}
			
					})
				
				}
				else if(analysis_field=="percentace_total_last_year"){
							
							var plus_this_year=0
							var last_year_plus=0
							var cheesegrater=0
							var percentage

								
							_.each(result,function(row){
								lastyear=years.indexOf(year)-1	
								months=moment.monthsShort() 
								lastmonth=months.indexOf(month)-1
								
										if(month==moment.monthsShort(row.kpi_month-1) && row.kpi_year==year){	
																						
												if(month=="Apr"){			
														plus_this_year+= parseInt(row['net_sales'])
												}
												else if(returned_row[months[lastmonth]+" "+year]){
													plus_this_year=returned_row[months[lastmonth]+" "+year]+sales_for_month
												}
												if(month=="Jan"){
													plus_this_year=returned_row["Dec "+ years[lastyear]]+sales_for_month
												}
																						
										}	
										
										if(month==moment.monthsShort(row.kpi_month-1) && row.kpi_year==year-1){	
												
												lastyear=years.indexOf(year)-1		
												sales_for_month+=parseInt(row['net_sales'])		
												
												if(month=="Apr"){	
														
														last_year_plus+=parseInt(row['net_sales'])
														percentage =((plus_this_year/last_year_plus)*100-100).toFixed(2)
														
														console.log('percentage',percentage)
														
														if(!isNaN(percentage)){
															returned_row[month+" "+year]=percentage+"%"										
														}																										
												}
												
												else if(returned_row[months[lastmonth]+" "+year]){
													
														plus_this_year=returned_row[months[lastmonth]+" "+year]+sales_for_month
														percentage =((plus_this_year/last_year_plus)*100-100).toFixed(2)
													
														console.log('percentage 2',plus_this_year,last_year_plus,sales_for_month)
														
														if(!isNaN(percentage)){
																returned_row[month+" "+year]=percentage+"%"										
														}
												}
												/*
												if(month=="Jan"){
													plus_this_year=returned_row["Dec "+ years[lastyear]]+sales_for_month
													percentage =((plus_this_year/last_year_plus)*100-100).toFixed(2)
													console.log(percentage)
														if(!isNaN(percentage)){
															returned_row[month+" "+year]=percentage+"%"										
													}
												}
*/												
										}											
							})
			
				}				
				else
				{
				_.each(result,function(row){
				
						if(month==moment.monthsShort(row.kpi_month-1) &&venue==row.kpi_venue &&row.kpi_year==year){
							returned_row[month+" "+year]=row[analysis_field]
		
						}
				})
				}
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
	
	
		 this.wind_up_Stats_monthly_venue=function(result,venues,booking_type,currency){
		 
		 
		 
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
						var checkmonth = new Date()
									var checkmonth_num = checkmonth.getMonth()
									lastmonth=months.indexOf(month)-1	
					_.each(result,function(row){
						if(month==moment.monthsShort(row._id.month-1) && booking_type==row._id.booking_type &&venue==row._id.venue &&row._id.year==year){
							returned_row[month+" "+year]=row.visits
							returned_row.stat="Visits"
							returned_row.cssclass="bold"
							if(currency){
							returned_row.typex="currency"
							}
							
							returned_row.cellfilter="number:2"
							for (compare_previous_years = 1; compare_previous_years <= 2; compare_previous_years++) { 
  

							_.each(result,function(previous_data){
								compare_previous_year = year-compare_previous_years
							
								
								if(month==moment.monthsShort(previous_data._id.month-1)&&booking_type==previous_data._id.booking_type  &&venue==previous_data._id.venue &&previous_data._id.year==compare_previous_year){
									
										returned_row_compare_last_year_total.museum=compare_previous_year+ " - " + year
										returned_row_compare_last_year.museum="% difference" 
										
										if(lastmonth<checkmonth_num-1){
											returned_row_compare_last_year[month+" "+year]=((row.visits/previous_data.visits)*100-100).toFixed(2)+"%";
										}
										
										returned_row_compare_last_year_total[month+" "+year]=previous_data.visits
										if(currency){
											returned_row_compare_last_year_total.typex="currency"
										}
							
										
									
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
	 
	 
	 
	 
	 this.wind_up_Stats_monthly=function(result,venues,currency){
	 
	 
		var returned_data=[]
		var sites_total={}
		var running_total={}
		var running_total_last_year={}
		var running_total_last_year_percentage={}
		var returned_row_compare_last_year={}
		var returned_row_compare_last_year_total={}
		
		sites_total.museum="Total all sites"
		
		running_total.museum="Running total"
		running_total_last_year.museum="Last Year"
		running_total_last_year_percentage.museum="% difference"
		
			var years = [2015,2016,2017,2018,2019]
			_.each(years,function(year){
			_.each(moment.monthsShort(),function(month){
				sites_total[month+" "+year]=""
				
				if(month=="Apr"){
					if(running_total[month+" "+year]){
						running_total[month+" "+year]=0
					}
				
				}
				
			
				
					_.each(result,function(row){
					
				
					
						if(month==moment.monthsShort(row._id.month-1) &&row._id.year==year){
				
						
							if(sites_total[month+" "+year]){
								sites_total[month+" "+year]=parseInt(sites_total[month+" "+year])
							}
						

							
							sites_total[month+" "+year]+=parseInt(row.visits)
							months=moment.monthsShort() 
							lastmonth=months.indexOf(month)-1
							var checkmonth = new Date()
									var checkmonth_num = checkmonth.getMonth()
									lastmonth=months.indexOf(month)-1
							if(month=="Apr"){
								running_total[month+" "+year]=sites_total[month+" "+year]
								lastyear=years.indexOf(year)-1
								if(sites_total[month+" "+years[lastyear]]){
									running_total_last_year[month+" "+year]=sites_total[month+" "+years[lastyear]]
									
									
									if(lastmonth<checkmonth_num-1){
											running_total_last_year_percentage[month+" "+year]=((running_total[month+" "+year]/running_total_last_year[month+" "+year])*100-100).toFixed(2)+"%"	
									}
								}
							
							}
							else if(running_total[months[lastmonth]+" "+year]){
								
								running_total[month+" "+year]=running_total[months[lastmonth]+" "+year]+sites_total[month+" "+year]
								lastyear=years.indexOf(year)-1
								if(running_total[months[lastmonth]+" "+years[lastyear]] && sites_total[month+" "+years[lastyear]]){
									running_total_last_year[month+" "+year]=running_total[months[lastmonth]+" "+years[lastyear]]+sites_total[month+" "+years[lastyear]]
									if(lastmonth<checkmonth_num-1){
									running_total_last_year_percentage[month+" "+year]=((running_total[month+" "+year]/running_total_last_year[month+" "+year])*100-100).toFixed(2)+"%"	
								}
								}
							
							
							}
							
							lastyear=years.indexOf(year)-1
							last2year=years.indexOf(year)-2
							if(month=="Jan"){
								running_total[month+" "+year]=running_total["Dec "+ years[lastyear]]+sites_total[month+" "+year]
				
									if(running_total["Dec "+years[last2year]] && sites_total[month+" "+years[lastyear]]){
										running_total_last_year[month+" "+year]=running_total["Dec "+years[last2year]]+sites_total[month+" "+years[lastyear]]
										if(lastmonth<checkmonth_num-1){
										running_total_last_year_percentage[month+" "+year]=((running_total[month+" "+year]/running_total_last_year[month+" "+year])*100-100).toFixed(2)+"%"	
									}
									}
							
							}
						
							months=moment.monthsShort() 
							lastmonth=months.indexOf(month)-1
							var checkmonth = new Date()
									var checkmonth_num = checkmonth.getMonth()
									lastmonth=months.indexOf(month)-1	
								
							sites_total.stat="Visits"
							running_total.stat="Visits"
							running_total.cssclass="summary_row"
							sites_total.csstype="summary_row"
							running_total.csstype="summary_row"
							if(currency){
								sites_total.typex="currency"
							}
							
							sites_total.cellfilter="number:2"
							running_total.cellfilter="number:2"
							
							running_total_last_year.stat="Visits"
							running_total_last_year.cssclass="summary_row"
							running_total_last_year.csstype="summary_row"
							running_total_last_year.cellfilter="number:2"
							
							running_total_last_year_percentage.stat="Visits"
							running_total_last_year_percentage.cssclass="summary_row"
							running_total_last_year_percentage.csstype="summary_row"
							running_total_last_year_percentage.cellfilter="number:2"
							
							for (compare_previous_years = 1; compare_previous_years <= 2; compare_previous_years++) { 
  

								_.each(result,function(previous_data){
									compare_previous_year = year-compare_previous_years
								
									
									if(month==moment.monthsShort(previous_data._id.month-1)&&previous_data._id.year==compare_previous_year){
										
											returned_row_compare_last_year_total.museum="last year"
											returned_row_compare_last_year.museum="% difference" 											
											returned_row_compare_last_year_total[month+" "+year]=previous_data.visits											
											if(lastmonth<checkmonth_num-1){
												returned_row_compare_last_year[month+" "+year]=((row.visits/previous_data.visits)*100-100).toFixed(2)+"%";
											}
											
											if(currency){
												returned_row_compare_last_year_total.typex="currency"
											}
								
											
										
									}
								})
							
							}
							
						}
					})
				})
			})
	


		

		
		
	
	
	
	_.each(venues,function(venue){
		var returned_row={}
		
		var returned_row_compare_last_year={}
		var returned_row_compare_last_year_total={}
		returned_row.museum=venue
		
			var years = [2015,2016,2017,2018,2019]
			_.each(years,function(year){
			_.each(moment.monthsShort(),function(month){
				returned_row[month+" "+year]=""
					var checkmonth = new Date()
									var checkmonth_num = checkmonth.getMonth()
									lastmonth=months.indexOf(month)-1	
					_.each(result,function(row){
					
				
					
						if(month==moment.monthsShort(row._id.month-1) &&venue==row._id.venue &&row._id.year==year){
							returned_row[month+" "+year]=row.visits
							
							
							
							
							
							returned_row.stat="Visits"
							returned_row.cssclass="bold"
							if(currency){
								returned_row.typex="currency"
							}
							
							returned_row.cellfilter="number:2"
							for (compare_previous_years = 1; compare_previous_years <= 2; compare_previous_years++) { 
  

							_.each(result,function(previous_data){
								compare_previous_year = year-compare_previous_years
							
								
								if(month==moment.monthsShort(previous_data._id.month-1) &&venue==previous_data._id.venue &&previous_data._id.year==compare_previous_year){
									
										returned_row_compare_last_year_total.museum="last year"
										returned_row_compare_last_year.museum="% difference" 
										//returned_row_compare_last_year.cssclass="red"
										
										returned_row_compare_last_year_total[month+" "+year]=previous_data.visits
										if(lastmonth<checkmonth_num-1){
										returned_row_compare_last_year[month+" "+year]=((row.visits/previous_data.visits)*100-100).toFixed(2)+"%";
										}
										if(currency){
											returned_row_compare_last_year_total.typex="currency"
										}
							
										
									
								}
							})
							
							}
							
						}
					})
				})
			})
		returned_data.push(	returned_row)
		
		if(returned_row_compare_last_year_total.museum){
			returned_data.push(	returned_row_compare_last_year_total)
			
		}
		if(returned_row_compare_last_year.museum){
			returned_data.push(	returned_row_compare_last_year)
		}
		
	
		
	})
		if(sites_total.museum){
			returned_data.push(	sites_total)
		}
		
	if(running_total.museum){
			returned_data.push(	running_total)
	}
	if(running_total_last_year.museum){
			returned_data.push(	running_total_last_year)
	}
	if(running_total_last_year_percentage.museum){
			returned_data.push(	running_total_last_year_percentage)
	}
		

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