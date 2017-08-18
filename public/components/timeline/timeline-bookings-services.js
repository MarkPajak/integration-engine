
exports.timeline_bookings_functions  =  function (timeline_functions,$http,Timeline,$rootScope) {


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
											if( $rootScope.added_track_groups.indexOf("ROOM BOOKING")==-1)
											{
													$rootScope.added_track_groups.push("ROOM BOOKING")														
													$rootScope.track_groups.push({"track":"ROOM BOOKING","selected":true})
											}
											if( $rootScope.added_track_groups.indexOf("EQUIPMENT BOOKING")==-1)
											{
													$rootScope.added_track_groups.push("EQUIPMENT BOOKING")														
													$rootScope.track_groups.push({"track":"EQUIPMENT BOOKING","selected":true})
											}
													
													
												console.log('BOOKINGS EVENTS',eventss)
												$.each(eventss, function( index, data ) {
													
																data.days=timeline_functions.days(data.start_date,data.end_date)
																var end_date
																if ( data.group != "") {
																	if( data.start_date!=""){
																	if(typeof(data.end_date)!="undefined"){
																			end_date=(moment(data.end_date).format("MMM Do YY"))
																	}
																	if(data._type=="ROOM BOOKING"){
																			install_instance_tally++
																			install_days_tally +=data.days
																	}
																	else if(data._type=="DERIG"){
																			derig_tally++						
																			derig_days_tally +=data.days
																	  }
																	if($rootScope.added_track_groups.indexOf(data._type)==-1){	
																	
																			$rootScope.added_track_groups.push(data._type)
																	
																	}
																		
																		var event_to_add=	{
																								  id : data._id,
																								  name :data.name,
																								  showimage :"",
																								  image :"",
																								  start_date :moment(data.start_date).format("MMM Do"),
																								  end_date :end_date ||"",
																								  notes  :data.notes ,
																								  days :data.days
																							}
																							
																							console.log('event_to_add',event_to_add)
																								 
																			 //if($rootScope.isloggedin==true){
																		visevents.add({
																						_id: data._id,
																						className:data.className,
																						select_group :false,
																						name:data.name,
																						_type:data._type,
																						track:data._type,
																						content: timeline_functions.event_html(event_to_add),
																						group: data.group,
																						order:data._type,
																						notes: data.notes,
																						//title:data.notes,
																						start: data.start_date,
																						days:data.days,
																						end: data.end_date 
																					})
																			//}
																	}
																}
																							
														
																		
															
																	
												})
														
														
													
													
										  					
										console.log('visevents',visevents)
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
