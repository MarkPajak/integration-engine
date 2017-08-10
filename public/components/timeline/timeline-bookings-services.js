
exports.timeline_bookings_functions =  function ($http,Timeline,$rootScope) {


  return {
  
     get_events: function() {
		 
	
				  
		 	 var SheetToJSONServiceURL = "http://emudev-app1/team/digital/projects/scripts/php/emu/loans.php?start_date=2014-01-01"
			 
			 
			 console.log(SheetToJSONServiceURL)
			 
      return $http.get(SheetToJSONServiceURL);  //1. this returns promise
    },
  
  
  
  	add_events: function (eventss, fn){
	
								
									var visevents = new vis.DataSet();
									var self=this
										
												
												tempdates=[]
											if( 	$rootScope.added_track_groups.indexOf("bookings")==-1){
												$rootScope.added_track_groups.push("bookings")														
													$rootScope.track_groups.push({"track":"bookings"})
													}
												//console.log('visitor figures',eventss)
												$.each(eventss, function( index, event ) {	
													console.log('bookings',event)
												
															scale_class="";	
												
										
												var val_1 = 0
												var val_2 =100
												var val_3 =200
												var val_4 =300
												var val_5 =400
												var val_6  = 500
												var val_7 = 1000
												var val_8 = 2000
												var val_9 = 3000												
												var val_10 = 4000
												
												var count = "value"
												

												if(event[count] >val_1 && event[count]<=val_2){scale_class="scale_01"}												
												if(event[count] >val_2 && event[count]<=val_3){scale_class="scale_02"}												
												if(event[count] >val_3 && event[count]<=val_4){scale_class="scale_03"}											
												if(event[count] >val_4 && event[count]<=val_5){scale_class="scale_05"}
												if(event[count] >val_5 && event[count]<=val_6){scale_class="scale_06"}												
												if(event[count] >val_6 && event[count]<=val_7){scale_class="scale_07"}												
												if(event[count] >val_7 &&event[count]<=val_8){scale_class="scale_08"}
												if(event[count] >val_8 && event[count]<=val_9){scale_class="scale_09"}
												if(event[count] >val_9 && event[count]<=val_10){scale_class="scale_09"}
												if(event[count] >val_10){scale_class="scale_10"}
																						
													
													
													
																
																	var start_date=new Date(event.start_date)
																	var end_date=new Date(event.end_date)
																	end_date.setDate( end_date.getDate() + 1);
																
											
																var shopEvent =  {		content:"",																						
																						name:event.group ,
																						group:event.group,
																						track:"bookings",
																						//order: "museum",
																						className:"GREEN",
																						start:start_date,
																						end:end_date
																				}
												//console.log('shopEvent',shopEvent)																		
												visevents.add( shopEvent)
																		
															
																	
												})
														
														
													
													
										  					
										
										return	fn(visevents)

		},
  
   		 event_html: function(name,showimage,image,start_date,end_date,notes ){
			var notes=notes ||""
				var htmlContent = '<div class="titlediv" >'
																htmlContent+='<div class="title_heading">'
																htmlContent+=name
																htmlContent+='</div>';
																htmlContent+="<span> ";
																htmlContent+=start_date+ "-" + end_date;
																htmlContent+="<span>";
																htmlContent+="<p>"+notes
																
																if(showimage){
																	htmlContent+='<div class="image_box">'
																	htmlContent+='<img src="http://museums.bristol.gov.uk/multimedia/entry.php?request=resource&irn='+image +'&height=50&format=jpeg" />'
																	htmlContent+='</div>'	
																}													
													htmlContent+= '</div>'
													
			return htmlContent

			},
  
	
	updateOptions: function(options){

		timeline.setOptions(options)
			
				
	},
	updateItem: function(options){
		options.id=$rootScope.selected_t_id
		timeline.itemsData.getDataSet().update(options)
		
				
	},
	
  };
}
