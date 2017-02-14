
exports.timeline_leave_functions =  function ($http,Timeline,$rootScope) {

  return {
  
     get_eventss: function() {
      return $http.get("https://script.google.com/macros/s/AKfycbzij_r2bTK6fiWU-h29rglHktd8pwbLfrti82Or68TkEjEHrOc/exec?id=1v69qKCc-8FYx8VuKPZMr1QkTMfJsh7qZTZJ7q7o3YTg");  //1. this returns promise
    },
  
  
  
  	add_leave: function (eventss, fn){
	
								
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
										
												
												$.each(eventss.data.tally, function( index, leave_record ) {	
																						
															if(leave_record.NAME!=oldName){
																	if(name.start_date!=""){
																	
																			names.push(name)
																			name=[]
																	}
																			oldName =leave_record.NAME
																			lastfrom_date=leave_record.DATE
																			 mylastfrom_date = new Date(leave_record.DATE);
																			name.start_date= new Date(leave_record.DATE);
																			name.name=leave_record.NAME
																			name.group=leave_record.TYPE
																			
																			
																			var end_date = new Date(lastfrom_date);
																			end_date.setDate(end_date.getDate() + 1);
																			name.end_date=end_date
																	
															}else
															{			
																														
														
															    //where dates are consecutive
																if(new Date(mylastfrom_date) - new Date(leave_record.DATE)==-86400000)	{
																	 mylastfrom_date = new Date(leave_record.DATE);
																	 
																	name.end_date=new Date(leave_record.DATE) 
																	name.end_date.setDate( name.end_date.getDate() + 1);
																}
																else{
																
																names.push(name)
																name=[]	
																name.name=leave_record.NAME
																name.group=leave_record.TYPE
																name.start_date=new Date(leave_record.DATE)	
																var non_consecutive_end_date = new Date(leave_record.DATE);
																name.end_date=non_consecutive_end_date.setDate( non_consecutive_end_date.getDate() + 1);
																
																
																}
	
																	
															}
																				
																
												})
										  

												$.each(names, function( index, value ) {
												
											
											
											
												if(value.name!=""){
													if(value.start_date){
														
														
												/*
												if($("#av_leave").is(':checked') && value.group=="CONTENT DESIGN" ||
												$("#user_research_leave").is(':checked') && value.group=="USER RESEARCH"  ||
												$("#digital_manager_leave").is(':checked') && value.group=="MANAGER"  ||
												$("#digitisation_leave").is(':checked') && value.group=="DIGITISATION"  ||
												$("#technicians_leave").is(':checked') && value.group=="TECHNICIAN"  
												){		
												*/
													if( 	$rootScope.added_track_groups.indexOf("leave")==-1){	
													 $rootScope.added_track_groups.push("leave")	
												$rootScope.track_groups.push({"track":"leave"})
													}
														visevents.add( {content:value.name  ,
																		group:value.group,
																		group_id:value.group+"leave",
																		id:value.id,
																		name:value.name  ,
																		event_type:"leave",
																		track:"leave",
																		order: "leave",
																		subgroup: value.name,
																		start:value.start_date,
																		end:value.end_date,
																		className 	:	"orange"
																		})
																	
														
												//}
														}
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
   get_events: function() {
      return $http.get('http://museums.bristol.gov.uk/sync/data/events.JSON');  //1. this returns promise
    },
	
	updateOptions: function(options){

		timeline.setOptions(options)
			
				
	},
	updateItem: function(options){
		options.id=$rootScope.selected_t_id
		timeline.itemsData.getDataSet().update(options)
		
				
	},
	/*
    setup: function(Timeline,groups,dates) {
	var self=this
	
   function prettyConfirm(title, text, callback) {
                swal({
                    title: title,
                    text: text,
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55"
                }, callback);
            }

            function prettyPrompt(title, text, inputValue, callback) {
                swal({
                    title: title,
                    text: text,
                    type: 'input',
                    showCancelButton: true,
                    inputValue: inputValue
                }, callback);
            }
			
			 function selected_data(event) {
			
			
						$rootScope.selected_t_id=event.items[0]
						$rootScope.selected =timeline.itemsData.getDataSet().get(event.items[0])
						$rootScope.selected_item=$rootScope.selected.name
						$rootScope.selected_notes=$rootScope.selected.notes
						$rootScope.datePicker.date={startDate:new Date($rootScope.selected.start),endDate:new Date ($rootScope.selected.end)}
						$rootScope.selected_id=$rootScope.selected._id
					
	
            }

            function logEvent(event, properties) {
                var log = document.getElementById('log');
                var msg = document.createElement('div');
                //msg.innerHTML = 'event=' + JSON.stringify(event) + ', ' +
                  //  'properties=' + JSON.stringify(properties);
               // log.firstChild ? log.insertBefore(msg, log.firstChild) : log.appendChild(msg);
            }
        

  var container = document.getElementById('example-timeline');
  
  		 function loadgroups(items){
	
			var _groups=[]
			var addednames=[]
			 _.each(items._data, function(value) {
			
			if(value.start_date!="0000-00-00" && value.end_date!="0000-00-00"&& value.start_date!="" &&value.end_date!=""&&value.project_name!=""){
				
				if($.inArray(value.group, addednames)==-1){
					addednames.push(value.group)
					//n.b. may be able to order groups when locatiobn hierarchy given in emu
					content=value.group ||"NA"
					if( value.group=="Temporary Exhibition Gallery"){ content="M SHED: "+value.group}
					if( value.group=="Window on Bristol"){ content="M SHED: "+value.group}
					if( value.group=="First Floor Foyer"){ content="M SHED: "+value.group}
					
					 _groups.push({
										id			:	value.group,
										display		:	'shown',
										event_type	:	value.event_type,
										content		:   content,
										event_typeSORT	: content
									})
				}
				}
			})

			
			return _groups		

		}
		var self = this
		
			$("body").keydown(function(e) {
			 // e.preventDefault();
        //e.returnValue = false;
				  if(e.keyCode == 37) { // left
					move( 0.2);
				  }
				  else if(e.keyCode == 39) { // right
					move(-0.2); 
				  }
				  else if(e.keyCode == 38) { // right
					zoom(-0.2); 
				  }
				  else if(e.keyCode == 40) { // right
					zoom(0.2); 
					
					    return false;
				  }
				});
				
				


                timeline = new vis.Timeline(container);
				groups=loadgroups(dates)
				$rootScope.groups=groups
				var groups = new vis.DataSet(groups);
				
               // timeline.setGroups(groups);
				$rootScope.changeGroups=function(selected){
				
					var selection = []
					selection=$rootScope.myGroup.selected
				
					var list = groups.get({
						filter: function(item) {
							return (item.id in selection && selection[item.id]==item.id);
						}
					})
						timeline.setGroups(list);
						enable_event_drop()
				}
						
				var list = groups.get({
						filter: function(item) {
							return (item.display == "shown");
						}
				})
					
				timeline.setGroups(list);
					$rootScope.myGroup = {
					selected:{}
				};
				
			
		
				 
                timeline.setItems(dates);
                timeline.setOptions(options);
				timeline.fit()
				
				timeline.on('select', function (properties) {
						selected_data( properties)

				});
										
			move=function(percentage) {
				var range = this.timeline.getWindow();
				var interval = range.end - range.start;
				this.timeline.setWindow({
					start: range.start.valueOf() - interval * percentage,
					end:   range.end.valueOf()   - interval * percentage
				});
			}

  
			zoom=function(percentage) {
				var range = this.timeline.getWindow();
				var interval = range.end - range.start;
				this.timeline.setWindow({
					start: range.start.valueOf() - interval * percentage,
					end:   range.end.valueOf()   + interval * percentage
				});
			}

			// attach events to the navigation buttons
			zoomIn=function () { this.zoom(-0.2); }
			zoomOut=function () {  this.zoom( 0.2); }
			moveLeft=function () {  this.move( 0.2); }
			moveRight=function () {  this.move(-0.2); }

                dates.on('*', function(event, properties) {
                    logEvent(event, properties);
                });

			enable_event_drop=function(event){
		
                $(".vis-group").droppable({
                    accept: '.date_add',
                    drop: function(event, ui) {

                        if (!$('.already-dropped').length) {
                            $('body').addClass('already-dropped');
                            setTimeout(function() {
                                $('.already-dropped').removeClass('already-dropped');
                            }, 100);
                            event.preventDefault()
                          time=(timeline.getEventProperties(event).time)
						group=(timeline.getEventProperties(event).group)
                            $(ui.draggable[0]).hide()
							
							if(ui.draggable[0].innerHTML=="PROVISIONAL DATE"){
                            prettyPrompt('Add item', 'Enter text content for new item:',"", function(value) {
                            if (value) {
                               	add_item(group,time,value,"blue",30)
							}
							})
							}
							else
							{
								add_item(group,time,ui.draggable[0].innerHTML,"red",7)
							}
							
							function add_item(group,time,value,colour,days){
							 date_dropped=(moment(time).startOf('day')._d)
							
                            var id = ui.draggable[0].id
                            var dateDroppedOn =time
                            target_date = time
							
                            var new_date = {
                                content: value,
								name:value,
                                group: group,
                                className:colour||"",
                                start_date: new Date(moment(date_dropped).startOf('day')._d),
                                end_date: new Date (moment(date_dropped).add(days, 'days')._d)

                            }
                            var _timeline = new Timeline(new_date)
                                .$save(function(_item) {
                                    new_date.start = new Date(_item.start_date)
									type:ui.draggable[0].innerHTML,
                                    new_date.end = new Date(_item.end_date)
                                    new_date._id = _item._id

                                    timeline.itemsData.getDataSet().add(new_date)
									console.log(new_date)
                                    setTimeout(function() {
                                        $(ui.draggable[0]).show()
                                    }, 1 * 1000);

                                });
							
							
							}
                        }



                    }
                })
				}
				enable_event_drop()
              
    }
	*/ 
  };
}
