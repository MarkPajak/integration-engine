var _ = require('underscore');
var ical = require('ical-generator')
var moment = require('moment')


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
			
			
	
				var years = [2016,2017,2018,2019,2020,2021,2022,2023]
				_.each(result,function(kpi,i){
					_.each(years,function(year){
						_.each(result,function(previous_data){
									if(previous_data.combined){
										
										compare_previous_year = year-1						
										if(previous_data.kpi_venue==kpi.kpi_venue &&  kpi.kpi_year== year && previous_data.kpi_year==compare_previous_year &&  previous_data.kpi_month==kpi.kpi_month  ){	
										
										//if(previous_data.combined){
											
												result[i].last_year_total=previous_data.combined
												result[i].last_year =((kpi.combined/previous_data.combined)*100-100).toFixed(2)+"%"			
											
										//}
									
										}
									}
						})
					})
				})	
							
	return result
	 }
	 	
	
this.get_kpis=function(Team,Gidftaid,Welcomedesk,Patron,Corporate,Donations_other,req,cb){
		console.log("get_kpis")
Team.aggregate([
			

					{ $group: {
							_id: { 

									"kpi_year": { "$year":  route_functions.mongo_aggregator }, 
									"kpi_month": { "$month":route_functions.mongo_aggregator }, 					   
								   kpi_venue:'$museum_id',  
								 },  			
							donations: {$sum: '$donation_box_amount' }
						}
					 },
					{ $sort : { "donations" : -1} }	,
					{ $project : {kpi_venue:"$_id.kpi_venue", kpi_year :"$_id.kpi_year", kpi_month :"$_id.kpi_month", donations:"$donations"}  },
				

				], function (err, result) {
				
				Gidftaid.aggregate([

					{ $group: {
							_id: { 
							 "year": { "$year": route_functions.mongo_aggregator }, 
									"month":  { "$month":route_functions.mongo_aggregator }, 	    
								   venue:'$museum_id',
								   
								 },  
							
						   gift_aid_amount: {$sum: '$amount' },
						 no_envelopes: {$sum: '$no_envelopes' }
						  
						}
					 },

				 { $project : {venue:"$_id.venue", year :"$_id.year", month :"$_id.month",donations:'$donations', gift_aid_amount:"$gift_aid_amount", no_envelopes:"$no_envelopes"}  },

					
				  ], function (err, gift_aid_amount) {
						  
					Welcomedesk.aggregate([
						

					{ $group: {
							_id: { 
							 "year": { "$year": route_functions.mongo_aggregator }, 
									"month":  { "$month":route_functions.mongo_aggregator }, 	    
								   venue:'$museum_id',
								   
								 },  
					
				 
				 cash :  { $sum:  '$cash' },
				 card :  { $sum:   '$card' },	
				 giftaid_amount :  { $sum:   '$giftaid_amount' },		      
						}
					 },

				 { $project : {venue:"$_id.venue", year :"$_id.year", month :"$_id.month",donations:'$donations', cash:"$cash", card:"$card", giftaid_amount:"$giftaid_amount"}  },
					
				  ], function (err, welsomedesk) {	

			Patron.aggregate([
						

					{ $group: {
							_id: { 

									"kpi_year": { "$year":  route_functions.mongo_aggregator }, 
									"kpi_month": { "$month":route_functions.mongo_aggregator }, 					   
								  // type:'$type',
								   
								 },  
							
							donations: {$sum: '$donation_box_amount' }
						 
						  
						}
					 },
					{ $sort : { "donations" : -1} }	,
					{ $project : { year :"$_id.kpi_year", month :"$_id.kpi_month", donations:"$donations"}  },		

				], function (err, Patron) {	  
					
					  
					  Corporate.aggregate([

					{ $group: {
							_id: { 

									"kpi_year": { "$year":  route_functions.mongo_aggregator }, 
									"kpi_month": { "$month":route_functions.mongo_aggregator }, 					   
								   type:'$type',
								   
								 },  
							
							donations: {$sum: '$donation_box_amount' }
						 
						  
						}
					 },
					{ $sort : { "donations" : -1} }	,
					{ $project : {type:"$_id.type", year :"$_id.kpi_year", month :"$_id.kpi_month", donations:"$donations"}  },

				], function (err, Corporate) {	  
							
					  Donations_other.aggregate([
						
					{ $group: {
							_id: { 

									"kpi_year": { "$year":  route_functions.mongo_aggregator }, 
									"kpi_month": { "$month":route_functions.mongo_aggregator }, 					   
								   type:'$type',
									venue:'$museum_id',
								   
								 },  
							
							donations: {$sum: '$donation_box_amount' }
						 
						  
						}
					 },
					{ $sort : { "donations" : -1} }	,
					{ $project : {type:"$_id.type", venue:"$_id.venue", year :"$_id.kpi_year", month :"$_id.kpi_month", donations:"$donations"}  },
					

				], function (err, Donations_other) {	  	
						
						var venues=[]	
					    var types=[]	
						
						_.each(result,function(row){
							if(venues.indexOf(row.kpi_venue)==-1){
								//console.log('adding venue ',row.kpi_venue)
								if(row.kpi_venue=="") return;
								venues.push(row.kpi_venue)
							}
						}) 
						
						venues.push("Patron" )
						
						_.each(Corporate,function(corporate,i){
						if(venues.indexOf(corporate.type)==-1){
							if(corporate.type=="") return;
											//	console.log('adding  types  ',corporate.type)
												venues.push(corporate.type)
								}
						})
							
					_.each(Donations_other,function(corporate,i){
						if(types.indexOf(corporate.type)==-1){
							if(corporate.type=="") return;
												console.log('adding  types  ',corporate.type)
												types.push(corporate.type)
								}
						})
									
						
						if (err) {
							console.log(err);
						} else {
					
							newresults=[]
				
							var years = [2016,2017,2018,2019,2020,2021,2022,2023]
							
							_.each(venues,function(venue){
							_.each(years,function(year){
							_.each(moment.monthsShort(),function(month,m){
							
							var newresult={}
							newresult.kpi_year=year
							newresult.kpi_month=m+1
							newresult.kpi_venue=venue
							newresults.push(newresult)

							})	
							})
							})
						
						_.each(newresults,function(newres,xx){
							
							
							newresults[xx].combined=0
							newresults[xx].donations=0
							newresults[xx].welcome=0
							newresults[xx].gift_aid_amountx=0
							newresults[xx].donations_other=0
								_.each(venues,function(venue){
								_.each(years,function(year){
								_.each(moment.monthsShort(),function(month, m){
									
									
									
									
												//_.each(result,function(kpi,i){
									//n.b. not data for some months or years so will need to create these and loop - see monthly gift aid
									if(newres.kpi_venue==venue &&  newres.kpi_month==m+1 && newres.kpi_year==year){								
										//if(kpi.kpi_venue==venue &&  kpi.kpi_month==m+1 && kpi.kpi_year==year){
											if(venue=="") return;
												_.each(types,function(type){
													_.each(Donations_other,function(other,i){
														//n.b. not data for some months or years so will need to create these and loop - see monthly gift aid
														if(other.venue==venue &&  newres.kpi_venue==venue && other.type== type && newres.kpi_month==m+1 && newres.kpi_year==year){		
															if( other.month==m+1 && other.year==year){
																			
																			newresults[xx].donations_other=other.donations	
																			newresults[xx].type=other.type
																			newresults[xx].combined=other.donations																	
																			
																}
															}								
													})
												})

														
														//newresults[xx].combined+=kpi.donations
														//newresults[xx].donations=kpi.donations
											//}
										}								
								//	})
									
									
									
									_.each(result,function(kpi,i){
									//n.b. not data for some months or years so will need to create these and loop - see monthly gift aid
									if(newres.kpi_venue==venue &&  newres.kpi_month==m+1 && newres.kpi_year==year){								
										if(kpi.kpi_venue==venue &&  kpi.kpi_month==m+1 && kpi.kpi_year==year){
											if(venue=="") return;
												_.each(types,function(type){
													_.each(Donations_other,function(other,i){
														//n.b. not data for some months or years so will need to create these and loop - see monthly gift aid
														if(other.venue==venue &&  newres.kpi_venue==venue && other.type== type && newres.kpi_month==m+1 && newres.kpi_year==year){		
															if( other.month==m+1 && other.year==year){
																			
																			//newresults[xx].donations_other=other.donations	
																			//newresults[xx].type=other.type
																			//newresults[xx].combined=other.donations																	
																			
																}
															}								
													})
												})

														
														newresults[xx].combined+=kpi.donations
														newresults[xx].donations=kpi.donations
											}
										}								
									})
							
												//this will only join where same month - what about months not included.	
									_.each(welsomedesk,function(welcome,ii){
										if(welcome.venue==venue &&  welcome.month==m+1 && welcome.year==year){
											if(newres.kpi_venue==venue &&  newres.kpi_month==m+1 && newres.kpi_year==year){	
											
													newresults[xx].welcome=welcome.cash+welcome.card	
													newresults[xx].welcome_gift_aid=welcome.giftaid_amount*1.25	
													newresults[xx].combined=newresults[xx].donations_other+newresults[xx].welcome+newresults[xx].gift_aid_amountx+newresults[xx].donations		
											
											}
										}								
									})
									
									
									//this will only join where same month - what about months not included.	
									_.each(gift_aid_amount,function(visits,ii){
										if(visits.venue==venue &&  visits.month==m+1 && visits.year==year){	
										if(newres.kpi_venue==venue &&  newres.kpi_month==m+1 && newres.kpi_year==year){	
											//console.log(venue)
												newresults[xx].gift_aid_amountx=visits.gift_aid_amount	*1.25							
											//console.log(	newresults[xx])
												newresults[xx].combined=newresults[xx].welcome+newresults[xx].gift_aid_amountx+newresults[xx].donations	
										}							
										}								
									})	

										
												
												

									_.each(Patron,function(patron,i){
																		
												//n.b. not data for some months or years so will need to create these and loop - see monthly gift aid
												if( newres.kpi_venue=="Patron" && venue=="Patron" && newres.kpi_month==m+1 && newres.kpi_year==year){		
													if( patron.month==m+1 && patron.year==year){
																	
																	newresults[xx].kpi_venue="Patron"					
																	newresults[xx].combined=patron.donations
																	newresults[xx].donations=patron.donations
														}
													}								
												})

												
																_.each(Corporate,function(corporate,i){
							
													//n.b. not data for some months or years so will need to create these and loop - see monthly gift aid
													if( newres.kpi_venue==venue && venue==corporate.type && newres.kpi_month==m+1 && newres.kpi_year==year){		
													
														if( corporate.month==m+1 && corporate.year==year){
														
																		//newresults[xx].kpi_venue=corporate.type						
																		newresults[xx].combined=corporate.donations
																		newresults[xx].donations=corporate.donations
																		
																		
															}
														}								
										
									
									
									})
												
												
												})
											})
										})
														
							
			})
			//res.json(result)
		
		
		if(req){
			if(!req.params){req.params={}}
		}
			if(req.params.csv){


				res.setHeader('Content-disposition', 'attachment; filename=donations.csv');
				res.set('Content-Type', 'text/csv');
				res.status(200).send(newresults);


			
			}
			else
			{

				cb(route_functions.donations_stats_monthly(newresults,gift_aid_amount,welsomedesk))
			}
						//mongoose.connection.close()	
					}
					
				});
				});
				});
				}); 
				});
});

}
	this.datacache=function(Cache,returned_data){
		console.log("datacache")
			var datacache = [{ type: 'monthly_development', row_name: "cheese" , date_cached: new Date(), cache:returned_data }];
				// save multiple documents to the collection referenced by Book Model
				Cache.collection.insert(datacache, function (err, docs) {
				
				if (err){ 
					  return console.error(err);
				  } else {
					console.log("Multiple documents inserted to Collection");
				  }
				});
		
		
	}
	
	this.wind_up_Stats=function(result,returned_row,analysis_field,venue,type){
					console.log("wind_up_Stats")	
						type=type || ""
						years = [2017,2018,2019,2010,2021,2022]
						returned_row.delete_row=true
						_.each(years,function(year){
						_.each(moment.monthsShort(),function(month){			
						returned_row[month+" "+year]=""
							_.each(result,function(row){
								if(month==moment.monthsShort(row.kpi_month-1) && venue==row.kpi_venue &&row.kpi_year==year){
									
									if( row.type && type!="" && row.type !=type) return;
									
									if( !isNaN(row[analysis_field])&& row[analysis_field]>0){
										returned_row.delete_row=false
									}
									returned_row[month+" "+year]=row[analysis_field]
									
								}
								})
							})			
						})
					
					
					return(returned_row)
					
					
				}

	this.wind_up_Stats_monthly_variable=function(result,returned_row,analysis_field,venue,data_field_name,currency,session_type,on_off_site){
		
			console.log('wind_up_Stats_monthly_variable')
			var years = [2015,2016,2017,2018,2019,2020,2021,2022]
			//n.b. if there is no data for a given month then it wont match to running totals wont carry over.
			var checkmonth = new Date()
			var checkmonth_num = checkmonth.getMonth()
			new_row=returned_row
			new_rowx=returned_row
			_.each(years,function(year){
				_.each(moment.monthsShort(),function(month){
					var found_month=false
					_.each(result,function(row){
						
					if(month==moment.monthsShort(row.kpi_month-1)  &&row.kpi_year==year){
							found_month=true
					}
					})
					if(found_month==false){
						//console.log(found_month)	
						new_row=[]
						returned_row[month+" "+year]=0
					}
					})
				
			_.each(moment.monthsShort(),function(month){
				
				sales_for_month=0
				sales_for_month_lt=0
				returned_row[month+" "+year]=0
				new_row[month+" "+year]=0
				new_rowx[month+" "+year]=0
				
				 if(analysis_field=="total_s"){
							
						_.each(result,function(row){
							if(!isNaN(parseInt(row[data_field_name]	))){
								
								
							
								console.log(row)
								
								    
									if(row._id) {;
									if(venue!="" && row._id.venue!=venue) return;
									if(session_type!="" && row._id.session_type!=session_type) return;
									if(on_off_site!="" && row._id.on_site_off_site!=on_off_site) return;
									
									
									if(month==moment.monthsShort(row._id.kpi_month-1)  &&row._id.kpi_year==year){
									
										months=moment.monthsShort() 
										lastmonth=months.indexOf(month)-1
										lastyear=years.indexOf(year)-1
										returned_row[month+" "+year]+=parseInt(row[data_field_name])										
										returned_row.cssclass="bold"						
										returned_row.typex=currency
									}
									
									if(month==moment.monthsShort(row._id.month-1)  &&row._id.year==year){
									
										months=moment.monthsShort() 
										lastmonth=months.indexOf(month)-1
										lastyear=years.indexOf(year)-1
										returned_row[month+" "+year]+=parseInt(row[data_field_name])										
										returned_row.cssclass="bold"						
										returned_row.typex=currency
									}
									
								}
								else
								{
								
								if(venue!="" && row.kpi_venue!=venue) return;							
								if(month==moment.monthsShort(row.kpi_month-1)  &&row.kpi_year==year){
								if(session_type!="" && row.session_type!=session_type) return;	
								if(on_off_site!="" && row.on_site_off_site!=on_off_site) return;
								
										months=moment.monthsShort() 
										lastmonth=months.indexOf(month)-1
										lastyear=years.indexOf(year)-1
										returned_row[month+" "+year]+=parseInt(row[data_field_name])										
										returned_row.cssclass="bold"						
										returned_row.typex=currency
							
									
								}
								}
							}
						})
				
				}	
				else if(analysis_field=="total_sales_last_year"){
				
				_.each(result,function(row){
							if(!isNaN(parseInt(row[data_field_name]	))){
								
							
								
								
								if(row._id) {;
								if(venue!="" && row._id.venue!=venue) return;
								if(session_type!="" && row._id.session_type!=session_type) return;
								if(on_off_site!="" && row._id.on_site_off_site!=on_off_site) return;
									
									if(month==moment.monthsShort(row._id.month-1)  &&row._id.year==year-1){
									
										months=moment.monthsShort() 
										lastmonth=months.indexOf(month)-1
										lastyear=years.indexOf(year)-1
										returned_row[month+" "+year]+=parseInt(row[data_field_name])										
										returned_row.cssclass="bold"						
										returned_row.typex=currency
							
									
									}
									
									if(month==moment.monthsShort(row._id.kpi_month-1)  &&row._id.kpi_year==year-1){
									
										months=moment.monthsShort() 
										lastmonth=months.indexOf(month)-1
										lastyear=years.indexOf(year)-1
										returned_row[month+" "+year]+=parseInt(row[data_field_name])										
										returned_row.cssclass="bold"						
										returned_row.typex=currency
							
									
									}
								}
								else
								{
								if(venue!="" && row.kpi_venue!=venue) return;
								if(month==moment.monthsShort(row.kpi_month-1)  &&row.kpi_year==year-1){
								if(session_type!="" && row.session_type!=session_type) return;
								if(on_off_site!="" && row.on_site_off_site!=on_off_site) return;
										months=moment.monthsShort() 
										lastmonth=months.indexOf(month)-1
										lastyear=years.indexOf(year)-1
										returned_row[month+" "+year]+=parseInt(row[data_field_name])										
										returned_row.cssclass="bold"						
										returned_row.typex=currency
							
									
								}
							}
							}
						})
				
				}				
				else if(analysis_field=="yearly_sessions"){
				
							_.each(result,function(row){
				
						if(month==moment.monthsShort(row.kpi_month-1)  &&row.kpi_year==year){
							

					
								sales_for_month+=parseInt(row['total_sessions'])
								
								months=moment.monthsShort() 
								lastmonth=months.indexOf(month)-1
								
								if(month=="Apr"){
									if(parseInt(row['total_sessions'])){
										if(returned_row[month+" "+year]){
										returned_row[month+" "+year]+=parseInt(row['total_sessions'])
										}
										else
										{
										returned_row[month+" "+year]=parseInt(row['total_sessions'])	
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
									//	returned_row.typex="currency"
							
						}
			
					})
								
				}
				else if(analysis_field=="yearly_children"){
				
							_.each(result,function(row){
				
						if(month==moment.monthsShort(row.kpi_month-1)  &&row.kpi_year==year){
							

					
								sales_for_month+=parseInt(row['total_children'])
								
								months=moment.monthsShort() 
								lastmonth=months.indexOf(month)-1
								
								if(month=="Apr"){
									if(parseInt(row['total_children'])){
										if(returned_row[month+" "+year]){
										returned_row[month+" "+year]+=parseInt(row['total_children'])
										}
										else
										{
										returned_row[month+" "+year]=parseInt(row['total_children'])	
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
									//	returned_row.typex="currency"
								
								
							
								
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
				else if(analysis_field=="running_total"){
	
						_.each(result,function(row){
				
							if(month==moment.monthsShort(row.kpi_month-1)  && row.kpi_year==year){
								
									if(row['total_income']){
										sales_for_month+=parseInt(row['total_income'])
									}
									else
									{
										sales_for_month=0
									}

									
									months=moment.monthsShort() 
									lastmonth=months.indexOf(month)-1
									
									
									if(month=="Apr"){
										if(parseInt(row['total_income'])){
											if(returned_row[month+" "+year]){
												returned_row[month+" "+year]+=parseInt(row['total_income'])
											}
											else
											{
												returned_row[month+" "+year]=parseInt(row['total_income'])	
											}
										}
									}
									
									
									else if(returned_row[months[lastmonth]+" "+year]){
										
										if(!returned_row[months[lastmonth]+" "+year]){
											returned_row[months[lastmonth]+" "+year]=0
										}
										
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
				else if(analysis_field=="total_learning_last_year"){
				
					_.each(result,function(row){
				

						if(month==moment.monthsShort(row.kpi_month-1)  &&row.kpi_year==year-1){
					
								sales_for_month+=parseInt(row['total_children'])	
								months=moment.monthsShort() 
								lastmonth=months.indexOf(month)-1
								lastyear=years.indexOf(year)-1
								
								if(month=="Apr"){
								
								if(!returned_row[month+" "+year]) returned_row[month+" "+year]=0
									if(row['total_children']){
										returned_row[month+" "+year]+=parseInt(row['total_children'])
									}
								}								
								else if(returned_row[months[lastmonth]+" "+year]){
									returned_row[month+" "+year]=returned_row[months[lastmonth]+" "+year]+sales_for_month
								}
								if(month=="Jan"){
									returned_row[month+" "+year]=returned_row["Dec "+ years[lastyear]]+sales_for_month
								}
								returned_row.cssclass="bold"						
							   // returned_row.typex="currency"
								
						
						}
			
					})
				
				}				
				else if(analysis_field=="yearly_learning_income"){			
					_.each(result,function(row){
				

						if(month==moment.monthsShort(row.kpi_month-1)  &&row.kpi_year==year){
					
								sales_for_month+=parseInt(row['total_income'])	
								months=moment.monthsShort() 
								lastmonth=months.indexOf(month)-1
								lastyear=years.indexOf(year)-1
								
								if(month=="Apr"){
								
								if(!returned_row[month+" "+year]) returned_row[month+" "+year]=0
									if(row['total_income']){
										returned_row[month+" "+year]+=parseInt(row['total_income'])
									}
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
				else if(analysis_field=="total_learing_income_last_year"){
				
					_.each(result,function(row){
				

						if(month==moment.monthsShort(row.kpi_month-1)  &&row.kpi_year==year-1){
					
								sales_for_month+=parseInt(row['total_income'])	
								months=moment.monthsShort() 
								lastmonth=months.indexOf(month)-1
								lastyear=years.indexOf(year)-1
								
								if(month=="Apr"){
								
								if(!returned_row[month+" "+year]) returned_row[month+" "+year]=0
									if(row['total_income']){
										returned_row[month+" "+year]+=parseInt(row['total_income'])
									}
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
				else if(analysis_field=="_total_donations_last_year"){
				
					_.each(result,function(row){
				

						if(month==moment.monthsShort(row.kpi_month-1)  &&row.kpi_year==year-1){
					
								sales_for_month+=parseInt(row['combined'])	
								months=moment.monthsShort() 
								lastmonth=months.indexOf(month)-1
								lastyear=years.indexOf(year)-1
								
								if(month=="Apr"){
								
								if(!returned_row[month+" "+year]) returned_row[month+" "+year]=0
									if(row['combined']){
										returned_row[month+" "+year]+=parseInt(row['combined'])
									}
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
				else if(analysis_field=="site_pemrissions_total_last_year"){				
					_.each(result,function(row){
						if(month==moment.monthsShort(row.kpi_month-1)  &&row.kpi_year==year-1){
					
								sales_for_month+=parseInt(row['income_site_permissions'])								
								months=moment.monthsShort() 
								lastmonth=months.indexOf(month)-1
								lastyear=years.indexOf(year)-1
								
								if(month=="Apr"){
									returned_row[month+" "+year]+=parseInt(row['income_site_permissions'])
								}								
								else if(returned_row[months[lastmonth]+" "+year]){
									returned_row[month+" "+year]=returned_row[months[lastmonth]+" "+year]+sales_for_month
								}
								if(month=="Jan"){
									returned_row[month+" "+year]=returned_row["Dec "+ years[lastyear]]+sales_for_month
								}
								else
									returned_row[month+" "+year]=returned_row["Dec "+ years[lastyear]]+sales_for_month
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
				else if(analysis_field=="percentage_total_last_year_learning"){
							
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
													plus_this_year+= parseInt(row['total_children'])
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
												sales_for_month+=parseInt(row['total_children'])		
												
												if(month=="Apr"){	
														
														last_year_plus+=parseInt(row['total_children'])
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
																
															if(lastmonth<checkmonth_num-1){
																returned_row[month+" "+year]=percentage+"%"	
															}																
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
				else if(analysis_field=="percentace_total_last_year_site_permissions"){						
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
									plus_this_year+=parseInt(row['income_site_permissions'])
								}								
								else if(returned_row[months[lastmonth]+" "+year]){
									plus_this_year=returned_row[months[lastmonth]+" "+year]+sales_for_month
								}
								if(month=="Jan"){
									plus_this_year=returned_row["Dec "+ years[lastyear]]+sales_for_month
								}
								else
									plus_this_year=returned_row["Dec "+ years[lastyear]]+sales_for_month
						console.log('plus_this_year',plus_this_year)
													
																						
										}	
										
										if(month==moment.monthsShort(row.kpi_month-1) && row.kpi_year==year-1){	
												
												lastyear=years.indexOf(year)-1		
												sales_for_month+=parseInt(row['income_site_permissions'])		
												
												if(month=="Apr"){	
														
														last_year_plus+=parseInt(row['income_site_permissions'])
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
																
															if(lastmonth<checkmonth_num-1){
																returned_row[month+" "+year]=percentage+"%"	
															}																
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
																
															if(lastmonth<checkmonth_num-1){
																returned_row[month+" "+year]=percentage+"%"	
															}																
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
				console.log('this is else mofo',analysis_field,row[analysis_field])
				//console.log(row)
						if(month==moment.monthsShort(row.kpi_month-1) &&venue==row.kpi_venue &&row.kpi_year==year){
							returned_row[month+" "+year]=row[analysis_field]
							
		
						}
				})
				}
			})
			
			
			
		})
		return(returned_row)
	}
	
		
var self = this	
	this.sort_data=function(result,venues,types,returned_data){
			console.log("sort_data")	
					
				

				_.each(venues,function(venue){
					
					
					var returned_row={}
					returned_row.museum=venue
					returned_row.stat=venue+ " Combined total"
					returned_row.xtype="currency"
					returned_row.csstype="bold"
					
					row= self.wind_up_Stats(	result,returned_row,"combined",venue)	
					if(row.delete_row==false){
						returned_data.push(	row)	
					}
					
					
					var returned_row={}
					returned_row.museum=venue
					returned_row.stat="Donations"
					returned_row.xtype="currency"
					row=self.wind_up_Stats(	result,returned_row,"donations",venue)
					
					
					if(row.delete_row==false){
						returned_data.push(row)
					}
					
					
					
					
					var returned_row={}
					returned_row.museum=venue
					returned_row.stat="Gift Aid Amount + 25%"
					returned_row.xtype="currency"
					row = self.wind_up_Stats(	result,returned_row,"gift_aid_amountx",venue)
					
					if(row.delete_row==false){
						returned_data.push(	row)
					}
					
					var returned_row={}
					returned_row.museum=venue
					returned_row.stat="Welcome"
					returned_row.xtype="currency"
					row =  self.wind_up_Stats(result,returned_row,"welcome",venue)
				
					if(row.delete_row==false){
						returned_data.push(	row)
					}
					
					var returned_row={}
					returned_row.museum=venue
					returned_row.stat="Welcome gift aid + 25%"
					returned_row.xtype="currency"
					row =  self.wind_up_Stats(result,returned_row,"welcome_gift_aid",venue)
				
					if(row.delete_row==false){
						returned_data.push(	row)
					}
					//var types = [] //hack
					_.each(types,function(typex){
					
							var returned_row={}
							returned_row.museum=venue
							returned_row.stat=typex
							returned_row.xtype="currency"
							returned_row.typex="currency"
							row = self.wind_up_Stats(result,returned_row,"donations_other",venue,typex)
						
							if(row.delete_row==false){
								returned_data.push(	row)
							}
					
					})
					
					
					var returned_row={}
					returned_row.museum="last year"
					returned_row.stat="last year"
					returned_row.xtype="currency"		
					returned_data.push(	 self.wind_up_Stats_monthly_variable(result,returned_row,"last_year_total",venue,"","currency"))

					var returned_row={}
					returned_row.museum=venue
					returned_row.stat="% last year"
					returned_data.push(	 self.wind_up_Stats_monthly_variable(	result,returned_row,"last_year",venue))
				
					
				})

				var returned_row={}
					returned_row.museum="Total"
					returned_row.stat="Total"
					returned_row.typex="retail"
					returned_row.xtype="currency"
					returned_row.cssclass="summary_row"
					returned_row.csstype="summary_row"
					returned_data.push(	 self.wind_up_Stats_monthly_variable(	result,returned_row,"total_s","",'combined',"currency"))
					
					
				var returned_row={}
					returned_row.museum="Last year"
					returned_row.stat="Last year"
					returned_row.xtype="currency"
					returned_row.typex="retail"
					returned_row.cssclass="summary_row"
					returned_row.csstype="summary_row"
					returned_data.push(	 self.wind_up_Stats_monthly_variable(	result,returned_row,"total_sales_last_year","",'combined',"currency"))
					
					
					return returned_data
				}

 
	 this.retail_stats_monthly=function(result,result2){				   
			
			
						_.each(result,function(kpi,i){
						var sales_count = 0
							_.each(result2,function(visits,ii){
							
								if(kpi.kpi_venue==visits.venue &&  kpi.kpi_month==visits.month && kpi.kpi_year==visits.year){
									
									result[i].visits=visits.visits
									//result[i].net_sales=((kpi.total_sales - kpi.non_vat_sales)/1.2+kpi.non_vat_sales).toFixed(2)
									result[i].net_sales= kpi.net_sales
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
	 


	 this.wind_up_Stats_weekly_variable=function(result,returned_row,analysis_field,venue){
		 
			
			var years = [2015,2016,2017,2018,2019,2020]
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
	
	this.ad_percentage_last_year_sitepermissions=function(returned_data){

					_.each(returned_data,function(row){
					
							var new_row = {}
								new_row.museum="Total income to BCC"
								
								new_row.typex="retail"
								new_row.xtype="currency"
								new_row.cssclass="summary_row"
								new_row.csstype="summary_row"
								new_row.stat="% difference"	
								
								if(row.stat=="Total income to BCC"){					
									for(var key in row) {
										_.each(returned_data,function(rowX){
											for(var keyX in rowX) {
												if(rowX.stat=="Last year" && key ==keyX ){	
													if(row[key]>0 && rowX[keyX]>0){
														//need to detect if it is a full month
														
														percantage=((key,row[key]/rowX[keyX])*100-100).toFixed(2)+"%";
														
														new_row[key]=percantage
													}
												}
											}
										})
									}
										returned_data.push(new_row)
								}
							
				})	
			//	return (new_row)
	
	}
	
this.ad_percentage_last_year_income=function(returned_data){

				_.each(returned_data,function(row){
				
						var new_row = {}
						
							new_row.museum="% difference"
							new_row.stat="% difference"
							new_row.typex="retail"
							new_row.xtype="currency"
							new_row.cssclass="summary_row"
							new_row.csstype="summary_row"
							
							
							if(row.stat=="Income - total"){					
								for(var key in row) {
									_.each(returned_data,function(rowX){
										for(var keyX in rowX) {
											if(rowX.stat=="Income - last year" && key ==keyX ){	
												if(row[key]){
													if(rowX[keyX]){
												if(row[key]>0 && rowX[keyX]>0){
													//need to detect if it is a full month
													percantage=((key,row[key]/rowX[keyX])*100-100).toFixed(2)+"%";
													new_row[key]=percantage
												}
												}
												}
												
												
											}
										}
									})
								}
									returned_data.push(new_row)
							}
						
			})	
		//	return (new_row)

}
 this.ad_percentage_last_year_learning=function(returned_data){
			_.each(returned_data,function(row){
				
						var new_row = {}
							new_row.museum="Total"
							new_row.stat="% difference"
							new_row.typex="retail"
							new_row.xtype="currency"
							new_row.cssclass="summary_row"
							new_row.csstype="summary_row"
							
							
							if(row.stat=="Children - Total"){					
								for(var key in row) {
									_.each(returned_data,function(rowX){
										for(var keyX in rowX) {
											if(rowX.stat=="Children - Last year" && key ==keyX ){	
												if(row[key]>0 && rowX[keyX]>0){
													//need to detect if it is a full month
													percantage=((key,row[key]/rowX[keyX])*100-100).toFixed(2)+"%";
													new_row[key]=percantage
												}
											}
										}
									})
								}
									returned_data.push(new_row)
							}
						
			})	
		//	return (new_row)
}
 this.ad_percentage_last_year=function(returned_data){
			_.each(returned_data,function(row){
				
						var new_row = {}
							new_row.museum="Total"
							new_row.stat="% difference"
							new_row.typex="retail"
							new_row.xtype="currency"
							new_row.cssclass="summary_row"
							new_row.csstype="summary_row"
							
							
							if(row.stat=="Total"){					
								for(var key in row) {
									_.each(returned_data,function(rowX){
										for(var keyX in rowX) {
											if(rowX.stat=="Last year" && key ==keyX ){	
												if(row[key]>0 && rowX[keyX]>0){
													//need to detect if it is a full month
													percantage=((key,row[key]/rowX[keyX])*100-100).toFixed(2)+"%";
													new_row[key]=percantage
												}
											}
										}
									})
								}
									returned_data.push(new_row)
							}
						
			})	
		//	return (new_row)
}

this.wind_up_Stats_monthly_visits=function(result,venues,booking_type,currency){
	 
	 
	 
var returned_data=[]
_.each(venues,function(venue){
	var returned_row={}
	var returned_row_compare_last_year={}
	var returned_row_compare_last_year_total={}
	returned_row.museum=venue
	
		var years = [2015,2016,2017,2018,2019,2020,2021,2022]
		_.each(years,function(year){
		_.each(moment.monthsShort(),function(month){
			returned_row[month+" "+year]=""
					var checkmonth = new Date()
								var checkmonth_num = checkmonth.getMonth()
								lastmonth=moment.monthsShort().indexOf(month)-1	
				_.each(result,function(row){
					if(month==moment.monthsShort(row._id.month-1) && booking_type==row._id.booking_type &&venue==row._id.venue &&row._id.year==year){
						returned_row[month+" "+year]=row.visits
						returned_row.stat="Visits"
						returned_row.cssclass="bold"
						if(currency){
						//returned_row.typex="currency"
						}
						
						//returned_row.cellfilter="number:2"
						for (compare_previous_years = 1; compare_previous_years <= 2; compare_previous_years++) { 


						_.each(result,function(previous_data){
							compare_previous_year = year-compare_previous_years
						
							if(previous_data._id.month){
							if(month==moment.monthsShort(previous_data._id.month-1)
								&&booking_type==previous_data._id.booking_type 
							   &&venue==previous_data._id.venue 
							   &&previous_data._id.year==compare_previous_year){
								
									returned_row_compare_last_year_total.museum=compare_previous_year+ " - " + year
									returned_row_compare_last_year.museum="% difference" 
									
									if(lastmonth<checkmonth_num-1){
										returned_row_compare_last_year[month+" "+year]=((row.visits/previous_data.visits)*100-100).toFixed(2)+"%";
									}
									
									returned_row_compare_last_year_total[month+" "+year]=previous_data.visits
									if(currency){
										//returned_row_compare_last_year_total.typex="currency"
									}
						
									
								
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
 

	 this.wind_up_Stats_monthly_venue=function(result,venues,booking_type,currency){
	 
	 
	 
var returned_data=[]
_.each(venues,function(venue){
	var returned_row={}
	var returned_row_compare_last_year={}
	var returned_row_compare_last_year_total={}
	returned_row.museum=venue
	
		var years = [2015,2016,2017,2018,2019,2020,2021,2022]
		_.each(years,function(year){
		_.each(moment.monthsShort(),function(month){
			returned_row[month+" "+year]=""
					var checkmonth = new Date()
								var checkmonth_num = checkmonth.getMonth()
								lastmonth=moment.monthsShort().indexOf(month)-1	
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
						
							if(previous_data._id.month){
							if(month==moment.monthsShort(previous_data._id.month-1)
								&&booking_type==previous_data._id.booking_type 
							   &&venue==previous_data._id.venue 
							   &&previous_data._id.year==compare_previous_year){
								
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
		
						months=moment.monthsShort()
	running_total.museum="Running total"
	running_total_last_year.museum="Last Year"
	running_total_last_year_percentage.museum="% difference"
	
		var years = [2015,2016,2017,2018,2019,2020]
		_.each(years,function(year){
		_.each(moment.monthsShort(),function(month){
			sites_total[month+" "+year]=""
			
			if(month=="Apr"){
				if(running_total[month+" "+year]){
					running_total[month+" "+year]=0
				}
			
			}
				_.each(result,function(row){
					lastmonth=months.indexOf(month)-1
					var checkmonth = new Date()
								var checkmonth_num = checkmonth.getMonth()
								lastmonth=months.indexOf(month)-1
			
				
					if(month==moment.monthsShort(row._id.month-1) &&row._id.year==year){
					
						if(sites_total[month+" "+year]){
							sites_total[month+" "+year]=parseInt(sites_total[month+" "+year])
						}
						
						sites_total[month+" "+year]+=parseInt(row.visits)
						months=moment.monthsShort() 
					
						if(month=="Apr"){ //start from zero for year
							
							
							running_total[month+" "+year]=sites_total[month+" "+year]
							lastyear=years.indexOf(year)-1
							if(sites_total[month+" "+years[lastyear]]){
								running_total_last_year[month+" "+year]=sites_total[month+" "+years[lastyear]]
								
								
								//if(lastmonth<checkmonth_num-1){
										running_total_last_year_percentage[month+" "+year]=((running_total[month+" "+year]/running_total_last_year[month+" "+year])*100-100).toFixed(2)+"%"	
								//}
								
								
							}
						
						}
						else if(running_total[months[lastmonth]+" "+year]){ //april done - start adding till december
							
							running_total[month+" "+year]=running_total[months[lastmonth]+" "+year]+sites_total[month+" "+year]
							
							
							lastyear=years.indexOf(year)-1
							if(running_total[months[lastmonth]+" "+years[lastyear]] && sites_total[month+" "+years[lastyear]]){
								running_total_last_year[month+" "+year]=running_total[months[lastmonth]+" "+years[lastyear]]+sites_total[month+" "+years[lastyear]]
							
							//if(lastmonth<checkmonth_num-1){
								running_total_last_year_percentage[month+" "+year]=((running_total[month+" "+year]/running_total_last_year[month+" "+year])*100-100).toFixed(2)+"%"	
							//}
							
							}
						
						
						}
						
						lastyear=years.indexOf(year)-1
						last2year=years.indexOf(year)-2
						
						if(month=="Jan"){ //year starts at jan so need to add to december stat
						
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
										
										//if(lastmonth<checkmonth_num-1){
											returned_row_compare_last_year[month+" "+year]=((row.visits/previous_data.visits)*100-100).toFixed(2)+"%";
										//}
										
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
		
			var years = [2015,2016,2017,2018,2019,2020]
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
										
										//if( lastmonth<=checkmonth_num-1){
										returned_row_compare_last_year[month+" "+year]=((row.visits/previous_data.visits)*100-100).toFixed(2)+"%";
										//}
										
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
		
			var years = [2015,2016,2017,2018,2019,2020,2021,2022]
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