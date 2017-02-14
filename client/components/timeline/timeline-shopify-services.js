
exports.timeline_shopify_functions =  function ($http,Timeline,$rootScope) {


  return {
  
     get_events: function() {
		 
		 /*
		 'https://www.googleapis.com/calendar/v3/calendars/en.uk#holiday@group.v.calendar.google.com/events?key=AIzaSyDi8arJr4JvnETpZVylXUVpxZDyBHNkQyk';
				  */
				  
		 	 var SheetToJSONServiceURL = "http://emudev-app1/team/digital/projects/scripts/php/emu/loans.php?start_date=2014-01-01"
			 
			 
			 console.log(SheetToJSONServiceURL)
			 
      return $http.get(SheetToJSONServiceURL);  //1. this returns promise
    },
  
  
  
  	add_events: function (eventss, fn){
	
								
									var visevents = new vis.DataSet();
									var self=this
										
												
												tempdates=[]
											if( 	$rootScope.added_track_groups.indexOf("Shopify product types")==-1){
												$rootScope.added_track_groups.push("Shopify product types")														
													$rootScope.track_groups.push({"track":"Shopify product types"})
													}
												console.log('shop products',eventss)
												$.each(eventss, function( index, event ) {	
													console.log('shop event',event)
												
															scale_class="";	
												
										
												var val_1 = 0
												var val_2 =2
												var val_3 =4
												var val_4 =6
												var val_5 =8
												var val_6  = 10
												var val_7 = 20
												var val_8 = 30
												var val_9 = 40												
												var val_10 = 50
												
												var count = "count"
												

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
																						
													
													
													
																
																	var start_date=new Date(event._id.month+"/"+event._id.day+"/"+event._id.year)
																	var end_date=new Date(start_date)
																	end_date.setDate( end_date.getDate() + 1);
																
																
																var shopEvent =  {content:"",
																			title:event.count  ,
																			name:event.count  ,
																			group:event._id.type,
																			track:"Shopify product types",
																			order: "Shopify product types",
																			className:scale_class,
																			start:start_date,
																			end:end_date
																		}
console.log('shopEvent',shopEvent)																		
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
