
exports.timeline_exhibitions_functions =  function (timeline_functions,$http,Timeline,$rootScope,$routeParams) {


  return {
  
 get_events: function() {
      return $http.get('http://museums.bristol.gov.uk/sync/data/events.JSON');  //1. this returns promise
    },
  
  
  
  	add_events: function (eventss, fn){
		
			  var visevents = new vis.DataSet();
			    var groups = new vis.DataSet()
									var self=this
		
		var checked_event_types=[]
			
			if($("#add_emu_exhibitions").is(':checked')){
				
				checked_event_types.push('Exhibition')
				checked_event_types.push('Gallery')
				
			}
		
			
			//if($("#whats_on").is(':checked')){
				checked_event_types.push('Family')
				checked_event_types.push('Tour')
				checked_event_types.push('Walk')
				checked_event_types.push('Rides')
				checked_event_types.push('Tours')
				checked_event_types.push('Talk')
				checked_event_types.push('Lecture')
				checked_event_types.push('Special Event')
				checked_event_types.push('Event')
				
			//}
	
								
					
																	
				$.each(eventss.data.events, function( index, event ) {	
											
											if( event.startDate!=""){
												
											//if( checked_event_types.indexOf(event.type)>=0){	
											if( event.type=="Exhibition"||event.type=="Gallery" || event.type=="Gallery Refurbishment"){
											var end_date=new Date(event.endDate)
											
											if(event.endDate==""||event.endDate==event.startDate){
										
											var end_date=new Date(event.startDate)
											//end_date.setDate(end_date.getDate() + 1)
										
											}
											var group =	"NA"
											if( event.type=="Exhibition"||event.type=="Gallery" || event.type=="Gallery Refurbishment"){
											 group =	event.event_space||"NA" 
											if(event.venue=="Bristol Museum & Art Gallery")venue_pic= 176421 
											if(event.venue=="Red Lodge Museum" )venue_pic=  37235
											if(event.venue=="Georgian House" )venue_pic= 189420 
											if(event.venue=="Bristol Archives" )venue_pic= 217822 
											if(event.venue=="M Shed" )venue_pic= 206079 
											 
											
											
											group_name="<table><tr><td><b>"+event.event_space+"</b><br></br>"
											group_name+=event.venue+"</td><td>"
											group_name+=	'<img  class="pull-right" src="http://museums.bristol.gov.uk/multimedia/entry.php?request=resource&irn='+venue_pic+'&height=50&format=jpeg" />'
											group_name+="</td></tr></table>"
											 
											}
											else{
												 group =	event.type ||"NA"
											}
													
												var eventimages = false
												if(event.images[0]){
												eventimages=event.images[0].irn
												}
												
												var event_to_add = {}
												
										
												
												var event_to_add=	{id : event.ID,
													  name :event.name,
													  showimage :true&&event.images[0],
													  image :eventimages,
													  start_date :event.startDate,
													  end_date :event.endDate,
													  notes  :"",
													  description  :event.description,
													 days: ""
													 }
												
												
												var htmlContent =  timeline_functions.event_html(event_to_add)
													if( 	$rootScope.added_track_groups.indexOf(event.venue)==-1){
												$rootScope.added_track_groups.push(event.venue)														
													$rootScope.track_groups.push({"track":event.venue})
													}
													select_group = true
													if($routeParams.track){
													select_group = false
													if($routeParams.track=="Arts and Events"){
													//select_group = true
													}
													}
													
													if(event.startDate){ //timeline errors if no start date
													visevents.add({
																		group		:	group, 
																		ID:event.ID,
																		group_name		:	group_name, 
																		select_group :select_group,
																		title		:	event.name,
																		name:event.name,
																		type		: "background",

																		content		:	htmlContent,
																		order:event.venue+event.event_space,
																		track:event.venue,
																		start		:	new Date(event.startDate), 
																		end			:	event.endDate, 
																		className 	:	"green",
																		event_type  :   "WHATS ON"
																		})
														}
																		
											}
											}

			  })
			   
							//NB STARTER						
					  					
										
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
