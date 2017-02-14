
exports.timeline_googlesheets_functions =  function (timeline_functions,$http,Timeline,$rootScope,$routeParams) {

  return {
	  
	  get_events: function(data_settings) {
	  var self = this
	  
	   if(data_settings.data_feed_url){
		   
	  return $http.get(data_settings.data_feed_url).then(function(datax) {
					
						self.add_events(data_settings,datax, function(public_dates){
							 $rootScope.leave_groups = timeline_functions.loadgroups(public_dates)
							_.each($rootScope.leave_groups, function(_group) {
								$rootScope.groups.push(_group)
							})
							 _.each(public_dates._data, function(date) {
								$rootScope.timeline.itemsData.getDataSet().add(date)
							})
						})
					})
		}
		else
		{
		 
	  return $http.get("https://script.google.com/macros/s/AKfycbzij_r2bTK6fiWU-h29rglHktd8pwbLfrti82Or68TkEjEHrOc/exec?id="+data_settings.googlesheet_id).then(function(datax) {
					
						self.add_events(data_settings,datax, function(public_dates){
							 $rootScope.leave_groups = timeline_functions.loadgroups(public_dates)
							_.each($rootScope.leave_groups, function(_group) {
								$rootScope.groups.push(_group)
							})
							 _.each(public_dates._data, function(date) {
								$rootScope.timeline.itemsData.getDataSet().add(date)
							})
						})
					})
		}
   },
  
  	add_events: function (data_settings,eventss, fn){
	
							
									var visevents = new vis.DataSet();
									var self=this
									var today = new Date()
								
												$.each(eventss.data[data_settings.googlesheet_name].events || eventss.data[data_settings.googlesheet_name], function( index, event ) {	
												//$.each(eventss.data['england-and-wales'].events, function( index, event ) {	
													if($rootScope.added_track_groups.indexOf(data_settings.track)==-1){	
														$rootScope.added_track_groups.push(data_settings.track)	
														$rootScope.track_groups.push({"track":data_settings.track})
													}
												
												if(data_settings.type=="numerical"){
												
												scale_class="";	
												
										
												
												if(event[data_settings.value_column] >data_settings.val_1 && event[data_settings.value_column]<=data_settings.val_2){scale_class="scale_01"}
												
												if(event[data_settings.value_column] >data_settings.val_2 && event[data_settings.value_column]<=data_settings.val_3){scale_class="scale_02"}
												
												if(event[data_settings.value_column] >data_settings.val_3 && event[data_settings.value_column]<=data_settings.val_4){scale_class="scale_03"}
												
												if(event[data_settings.value_column] >data_settings.val_4 && event[data_settings.value_column]<=data_settings.val_5){scale_class="scale_05"}

												if(event[data_settings.value_column] >data_settings.val_5 && event[data_settings.value_column]<=data_settings.val_6){scale_class="scale_06"}
												
												if(event[data_settings.value_column] >data_settings.val_6 && event[data_settings.value_column]<=data_settings.val_7){scale_class="scale_07"}
												
												if(event[data_settings.value_column] >data_settings.val_7 &&event[data_settings.value_column]<=data_settings.val_8){scale_class="scale_08"}
												if(event[data_settings.value_column] >data_settings.val_8 && event[data_settings.value_column]<=data_settings.val_9){scale_class="scale_09"}
													if(event[data_settings.value_column] >data_settings.val_9 && event[data_settings.value_column]<=data_settings.val_10){scale_class="scale_09"}
												if(event[data_settings.value_column] >data_settings.val_10){scale_class="scale_10"}
																						
													
													
													if(data_settings.use_moment==true){
													
													start_date=moment(event[data_settings.date_column])._d
													end_date=moment(event[data_settings.date_column])._d
													end_date.setDate(end_date.getDate() + 1)
													
													}
													else
													{
														
													start_date=event[data_settings.start_column]
													end_date=event[data_settings.end_column]
													
														
													}
																								
													select_group = false
													if($routeParams.track){
													select_group = false
													if($routeParams.track==data_settings.track){
													select_group = true
													}
													}
														
														visevents.add( {content:"" ,
																		select_group:select_group,
																		group:event[data_settings.group_column]|| data_settings.group,
																		group_id:event[data_settings.group_id_column]||data_settings.track ,
																		name:event[data_settings.value_column].toFixed(2),
																		title:event[data_settings.value_column].toFixed(2),
																		event_type:data_settings.track,
																		track:data_settings.track,
																		order: data_settings.track,
																		type:data_settings.event_type ||"",
																		subgroup: event[data_settings.subgroup_column],
																		start:start_date,
																		end:end_date,
																		className 	:	scale_class
																		})
													
														
														
												}
												
												else
													
												{
													
														
													if(data_settings.use_moment==true){
														start_date=moment(event[data_settings.date_column])._d
														end_date=moment(event[data_settings.date_column])._d
														end_date.setDate(end_date.getDate() + 1)
													}else
													{
													start_date=new Date(event[data_settings.start_column])
													//end_date=new Date(start_date) //required e.g. art and events
													var end_date=new Date(start_date).setDate( start_date.getDate() + 1);
													
													end_date=new Date(start_date) //required e.g. art and events
													end_date.setDate( start_date.getDate() + 1);
													}
													
													
													
												
													
									var event_image=false
											var event_image_irn
											if(event.images){
											if(event.images[0]){
												event_image=true
												event_image_irn=event.images[0].irn
												}
											}
												
													var htmlContent =  self.event_html(event[data_settings.title_column],event_image,event_image_irn,start_date,end_date)
												
													select_group = false
													if($routeParams.track){
													select_group = false
													if($routeParams.track==data_settings.track){
													select_group = true
													}
													}  
													
													
													//if(!data_settings.checked_event_types || (event[data_settings.group_column]!="" && data_settings.checked_event_types.indexOf(event[data_settings.group_column])!=-1 && new Date(event[data_settings.start_column]))){
												
														this_event={content:htmlContent ,
																		select_group:select_group,
																		group_id:event[data_settings.group_column]+data_settings.track || data_settings.track,
																		name:event[data_settings.title_column] ||"NA"  ,
																		title:event[data_settings.title_column] ||"NA"  ,
																		event_type:data_settings.track,
																		track:data_settings.track,
																		order: data_settings.track,
																		type:data_settings.event_type ||"",
																		start:start_date,
																		className :data_settings.colour
																		}
																		
														
														if(data_settings.subgroup_column!=""){
															this_event.subgroup=event[data_settings.subgroup_column]
														}
														if(data_settings.group!=""){
															this_event.group=data_settings.group
														}
														if(data_settings.group_column){
															this_event.group= event[data_settings.group_column]
														}
														
														
														
														
														//if(data_settings.end_column){
															this_event.end=end_date
													//}
														if(this_event.start && this_event.group )	{		
														visevents.add(this_event)
														}
														else{
															console.log('no start or group',this_event)
														}
														
														
												//}
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
																htmlContent+=start_date;
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
