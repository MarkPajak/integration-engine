
exports.timeline_learning_functions = function ($http,Timeline,$rootScope) {
	
	

  return {
  
     get_events: function() {
		 
		 /*
		 'https://www.googleapis.com/calendar/v3/calendars/en.uk#holiday@group.v.calendar.google.com/events?key=AIzaSyDi8arJr4JvnETpZVylXUVpxZDyBHNkQyk';
				  */
				  
		 	 var SheetToJSONServiceURL = "http://emudev-app1/~brlsmp4/learning/scripts/php/api/api.php?table=bookings"
			 
			 
			 console.log(SheetToJSONServiceURL)
			 
      return $http.get(SheetToJSONServiceURL);  //1. this returns promise
    },
  
  
  
  	add_events: function (eventss, fn){
	
								
									var visevents = new vis.DataSet();
									var self=this
										var today = new Date()
												var names=[];
												var name=[];
												var lastname="";
												var start_date="";
												var start_date="";
												var oldName="";
												var lastfrom_date="";
												var lastto_date="";
												var mylastfrom_date
												var currentStartDate;
												
												tempdates=[]
											if( 	$rootScope.added_track_groups.indexOf("school visits")==-1){
												$rootScope.added_track_groups.push("school visits")														
													$rootScope.track_groups.push({"track":"school visits"})
													}
												console.log('eventss',eventss)
												$.each(eventss.data, function( index, event ) {	
																	end_date=new Date(event.event_date) 
																	end_date.setDate( end_date.getDate() + 1);
														if(	event.school_name!=""){											
														visevents.add( {content:event.school_name  ,
																		name:event.school_name  ,
																		group:event.site,
																		group_id:event.site+"school visits",
																		//id:event.id,
																		event_type:"public holidays",
																		track:"school visits",
																		order: "school visits",
																		className:"orange",
																		start:event.event_date,
																		end:end_date,
																		subgroup:"na",
																		notes 	:	event.booking_form_info
																		})
																		}
															
																	
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
