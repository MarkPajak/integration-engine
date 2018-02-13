

exports.timeline_functions_resources = function ( $templateCache,$compile,$http,Bookings,$rootScope,$timeout) {
	

  
  return {
  
  timeline_track: Bookings,
  
		  loadgroups: function(items){
	
			var _groups=[]
			var addednames=[]
			
			 _.each(items._data, function(value) {
			
			if(value.start_date!="0000-00-00" && value.end_date!="0000-00-00"&& value.start_date!="" &&value.end_date!=""&&value.project_name!=""){
				
				if($.inArray(value.group, $rootScope.addednames)==-1 ){
					$rootScope.addednames.push(value.group)
					//n.b. may be able to order groups when locatiobn hierarchy given in emu
					content=value.group ||"NA"
	
					 
					 _groups.push({
										id				:	value.group,
										//display		:	'shown',
										track			:    value.track,
										order		    :    value.order,										
										event_type		:	 value.event_type,
										content			:    value.group_name,
										event_typeSORT	:    content,
										
										selected         : value.select_group 
									})
					console.log(_groups)
				}
				}
			})

		
			return _groups		

		},
	
		update_andCompile: function(item,mode) {
		console.log('update_andCompile',mode)	
			var self = this
			
				setTimeout(function() {
			 	$compile($("timeline-databar"))($rootScope);
			 }, 1700);
			setTimeout(function() {
			
				
		
						unique_groups=[]
						added_ids=[]
						_.each($rootScope.groups, function(group){
							if(added_ids.indexOf(group.id)==-1){
							added_ids.push(group.id)
							unique_groups.push(group)
							}
						})
						
						var groups = new vis.DataSet(unique_groups);
	
						var list = groups.get({
								filter: function(item) {								
									return (item.selected == true);
								}
						})	
						
						self.enable_event_drop(timeline_track,mode)
						$rootScope.timeline.redraw()
			
            }, 2000);
			 
			
		},	
		
		populate_timeline_track: function(rootScope,dataset,dataset_functions,timeline_track) {
			 
				 var self = this
				 $rootScope.groups = $rootScope.groups || []
				 var groups =rootScope.groups
				  rootScope.timeline.setGroups(groups);
				  
					dataset.query({}, function(datax) {
						self.add_events_loop(rootScope,datax,dataset_functions,timeline_track)
						self.update_andCompile("",$rootScope.mode)
					})
					
		},
		
	


		populate_timeline_track_method_b: function(rootScope,data_functions,timeline_track) {
			
				 var self = this
				 $rootScope.groups = $rootScope.groups || []
				 var groups =rootScope.groups
				  rootScope.timeline.setGroups(groups);
			  
				  data_functions.get_events().then(function(datax) {					  
					self.add_events_loop(rootScope,datax,data_functions,timeline_track)
					})
		
		},
		 
		add_events_loop: function(rootScope,datax,dataset_functions,timeline_track) {
	
				var self = this
				dataset_functions.add_events(datax, function(public_dates){
							 rootScope.leave_groups = self.loadgroups(public_dates)
							_.each(rootScope.leave_groups, function(_group) {
								rootScope.groups.push(_group)
							})
							 _.each(public_dates._data, function(date) {
								if($rootScope.timeline.itemsData){
								rootScope.timeline.itemsData.getDataSet().add(date)
								}
							})
							//rootScope.timeline.itemsData.on("update", function(){self.update_andCompile()})
							rootScope.timeline.fit({},function(){
										self.update_andCompile("",$rootScope.mode)
							})//needed due to angular wierdness with directives
				})
	
	
		},
		 
		 
		
			
		export_JSON_to_CSV: function(JSONData, ReportTitle, ShowLabel){
  
					  
						//If JSONData is not an object then JSON.parse will parse the JSON string in an Object
						var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
						//console.log('arrData',arrData)
						var CSV = '';    
						//Set Report title in first row or line
						
						CSV += ReportTitle + '\r\n\n';

						//This condition will generate the Label/Header
						if (ShowLabel) {
							var row = "";
							
							//This loop will extract the label from 1st index of on array
							for (var index in arrData[0]) {
								// console.log('row += index',row += index)
								//Now convert each value to string and comma-seprated
								row += index + ',';
							}

							row = row.slice(0, -1);
							
							//append Label row with line break
							CSV += row + '\r\n';
						}
						
						//1st loop is to extract each row
						for (var i = 0; i < arrData.length; i++) {
							var row = "";
							
							//2nd loop will extract each column and convert it in string comma-seprated
							for (var index in arrData[i]) {
								row += '"' + arrData[i][index] + '",';
							}

							row.slice(0, row.length - 1);
							
							//add a line break after each row
							CSV += row + '\r\n';
						}

						if (CSV == '') {        
							alert("Invalid data");
							return;
						}   
						
						//Generate a file name
						var fileName = "MyReport_";
						//this will remove the blank-spaces from the title and replace it with an underscore
						fileName += ReportTitle.replace(/ /g,"_");   
						
						//Initialize file format you want csv or xls
						var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
						
						// Now the little tricky part.
						// you can use either>> window.open(uri);
						// but this will not work in some browsers
						// or you will not get the correct file extension    
						
						//this trick will generate a temp <a /> tag
						var link = document.createElement("a");    
						link.href = uri;
						
						//set the visibility hidden so it will not effect on your web-layout
						link.style = "visibility:hidden";
						link.download = fileName + ".csv";
						
						//this part will append the anchor tag and remove it after automatic click
						document.body.appendChild(link);
						link.click();
						document.body.removeChild(link);


},
  
  
     prettyConfirm: function (title, text, callback) {
                swal({
                    title: title,
                    text: text,
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55"
                }, callback);
            },

           prettyPrompt: function (title, text, inputValue, callback) {
                swal({
                    title: title,
                    text: text,
                    type: 'input',
                    showCancelButton: true,
                    inputValue: inputValue
                }, callback);
            },
			
			
	

            logEvent:function(event, properties) {
                var log = document.getElementById('log');
                var msg = document.createElement('div');
                //msg.innerHTML = 'event=' + JSON.stringify(event) + ', ' +
                  //  'properties=' + JSON.stringify(properties);
               // log.firstChild ? log.insertBefore(msg, log.firstChild) : log.appendChild(msg);
            },
  
  enable_event_drop:function(event,track){
		var self = this
                $(".vis-group").droppable({
                    accept: '.date_add',
                    drop: function(event, ui) {
					
							event.preventDefault()

                        if (!$('.already-dropped').length) {
                            $('body').addClass('already-dropped');
                            setTimeout(function() {
                                $('.already-dropped').removeClass('already-dropped');
                            }, 100);
                          
                            time=(timeline.getEventProperties(event).time)
						
							group=(timeline.getEventProperties(event).group)
							//track=$rootScope.timeline_mode
							console.log(track)
							//type=(timeline.getEventProperties(event).type)
                            $(ui.draggable[0]).hide()
							
							if(ui.draggable[0].innerHTML=="PROVISIONAL DATE"){
                            self.prettyPrompt('Add a provisional date', 'Name:',"", function(value) {
                            if (value) {
                               	add_item(group,group,time,value,"blue",30,ui.draggable[0].innerHTML,track)
							}
							})
							}
							else if(ui.draggable[0].innerHTML=="INSTALL" ||ui.draggable[0].innerHTML=="DERIG" )
							{
								add_item(group,group,time,ui.draggable[0].innerHTML,"red",7,ui.draggable[0].innerHTML,track)
							}
							else
							{
								add_item(group,$rootScope.filter_pieSelected,time,ui.draggable[0].innerHTML,"orange",1,"PROVISIONAL DATE",track)
							}
							
							function add_item(dropped_group,group,time,value,colour,days,type,track)
							{
									
									
									 console.log('add_item',track)
									 date_dropped=(moment(time).startOf('day')._d)
									
									 
									
									var id = ui.draggable[0].id
									var dateDroppedOn =time
									target_date = time
									_days=self.days(moment(time).startOf('day')._d,moment(time).add(days, 'days')._d)
									
									var event_to_add=	
									{
															id : id,
															name : value,
															showimage :"",
															image :"",
															start_date :moment(time).startOf('day').format("MMM Do"),
															end_date :moment(time).add(days, 'days').format("MMM Do"),
															notes  :"",
															days :_days
									}
									
									
									var new_date = 
									{
									
															content: self.event_html(event_to_add),
															name:value,
															group: dropped_group,
															dropped_group:dropped_group,
															date_logged: new Date(),	
															className:colour||"",
															_type:track,
															start_date: new Date(moment(date_dropped).startOf('day')._d),
															end_date: new Date (moment(date_dropped).add(days, 'days')._d),
															days:_days

									}
									
									console.log('save')
									
								
									
									var _timeline = new Bookings(new_date)
										.$save(function(_item) 
										{
										

											new_date.start =_item.start_date
											new_date.end = _item.end_date
											new_date._id = _item._id
											new_date._type=_item._type,
											timeline.itemsData.getDataSet().add(new_date)
											
											setTimeout(function() {
											
													$(ui.draggable[0]).show()
													self.add_group_to_timeline(new_date)
											
											}, 1 * 1000);

											
										});
							
							
							}
                        }



                    }
                })
				},
	  
	  unlock: function(unlock){
		
                        
								timeline.setOptions({'editable':unlock,'selectable': unlock });
								timeline.options.editable=true
			
							
		  	
	  
	  },
	
	   



   add_group_to_timeline: function(new_group){
//TO DO
console.log('add_group_to_timeline')
				var groups = new vis.DataSet($rootScope.groups);
				var group = new vis.DataSet( $rootScope.leave_groups);
					var list =groups.get()
				
				_.some(list, function(lookup_group){
			
					if(new_group.dropped_group==lookup_group.id){
						console.log('copy this ',lookup_group)
						var _new_group=lookup_group
						_new_group.track=new_group.track
						//_new_group.id=new_group.group
						_new_group.content=new_group.content
						//list=list.concat(_new_group)
				
									
						return true;
					}
				})
			//timeline.setGroups(list);
			//this.enable_event_drop()	
			
				this.update_andCompile("",$rootScope.mode)
			
		
				},  
				
			   changeTracks: function(selection)
			   {
console.log('changeTracks selection',selection)
						var groups = new vis.DataSet($rootScope.groups);
						var group = new vis.DataSet( $rootScope.leave_groups);
						var list =groups.get({
								filter: function(item) {
									
									return (  selection.indexOf(item.track)!=-1);
								}
							})
							
						timeline.setGroups(list);
						$rootScope.mode=selection[0]
						this.update_andCompile("",selection[0])		
						this.enable_event_drop()
				
				},  
				
				changeGroups: function(selection)
				{

					var groups = new vis.DataSet($rootScope.groups);
					//var group = new vis.DataSet( $rootScope.leave_groups);
					var list =groups.get({
						filter: function(item) {
							
							return (  selection.indexOf(item.content)!=-1);
						}
					})
					
						timeline.setGroups(list);
						
					
						this.enable_event_drop()
		
				},
  
  
  days: function (start,end){
  
				var a = moment(start);
				var b = moment(end);
				return b.diff(a,'days');
  
  },
  
  	
  
   		 event_html: function(event_to_add){
		 
		 
			var  id = event_to_add.id
		 	var  name = event_to_add.name
			var  className = event_to_add.className
		 	var  showimage = event_to_add.showimage
		 	var  image = event_to_add.image
		 	var  start_date = event_to_add.start_date
		 	var  end_date = event_to_add.end_date
		 	var  notes  = event_to_add.notes ||""
		 	var  days = event_to_add.days
			var  description =event_to_add.description ||""
		 
			var notes=notes ||""
			var image=image ||""
	
			var showimage=showimage ||""
			
			var htmlContent= "<timeline-databar     className='" + className + "' description='" + description + "' description='" + description + "' id='" + id + "' name='" + name + "' image='" + image + "' showimage='" + showimage + "' startdate='" + start_date + "' enddate='" + end_date + "' notes='" + notes + "' days='" + days + "'></timeline-databar>"; //'<timeline-databar></timeline-databar>'
		
			return htmlContent

			},
			
		selected_data:	 function (event) {
				
							var self=this
							selected_timeline_id=event.items[0]
							 if(selected_timeline_id)
							 {
							 
										selected_item =	timeline.itemsData.getDataSet().get(selected_timeline_id)
										$rootScope.selected_timeline_id=selected_timeline_id
										$rootScope.selected_item=selected_item.name
										$rootScope.selected_type=selected_item._type
										if(selected_item.days>0)
										{
												$rootScope.selected_days=" - " +selected_item.days + " days"
										}
										$rootScope.selected_id=selected_item._id
										$rootScope.selected_notes=selected_item.notes
										$rootScope.datePicker.date={startDate:new Date(selected_item.start),endDate:new Date (selected_item.end)}
							
							
							}
					

           },
		   
   get_events: function() {
      return $http.get('http://museums.bristol.gov.uk/sync/data/events.JSON');  //1. this returns promise
    },
	
	updateOptions: function(options){

		$rootScope.timeline.setOptions(options)
			
				
	},
	
	event_edited: function(scope,selected_note){

	console.log('event_edited')
	
	//latest attempt to fix mem leak 
	//mooved from controller
	
	
			var self = this
	
			if( scope.locked.add_item){	
					date=$rootScope.datePicker.date
					days=self.days(moment(date.startDate),moment(date.endDate))
					scope.selected_start = moment(date.startDate ).format("MMM Do")
					scope.selected_end = moment(date.endDate).format("MMM Do")
					if(moment(date.startDate).isValid()){ //true
								
									var event_to_add=	{
														  id :  scope.selected_id,
														  name :scope.selected_item,
														  showimage :"",
														  image :"",
														  start_date :moment(date.startDate).format("MMM Do"),
														  end_date : moment(date.endDate).format("MMM Do")|| "",
														  notes  :$rootScope.selected_notes ,
														  days :days
														}
				
					
					//THIS CAUSES A REFRESH OF THE TIMELINE DIRECTIVE (GOOD)
					html=self.event_html(event_to_add)
					var options={id:scope.selected_timeline_id,content:html,notes:selected_note,start:moment(date.startDate)._d,end:moment(date.endDate)._d}
					self.timeline_track.update({
								id: scope.selected_id			
								}, options, function(){self.updateItem(options) });
				
				}
				}
				else
				{
				console.log('timeline locked')
				}
	
	
	
	
	},
	
	
	
	
	
	updateItem: function(options){
		if(typeof(timeline)!="undefined"){
			if(timeline.itemsData){
				timeline.itemsData.getDataSet().update(options)
				console.log('updateItem - $rootScope.mode',$rootScope.mode)
				this.update_andCompile("",$rootScope.mode)
				
			}
		
		}
	
			
	},
	
    setup: function( Timeline,groups,dates,isloggedin) {
		
		var self=this
		

         var options = {
					min: new Date(2014, 0, 1),                // lower limit of visible range
					max: new Date(2022, 0, 1),                // upper limit of visible range
					zoomMin: 1000 * 60 * 60 * 24,             // one day in milliseconds
					zoomMax: 1000 * 60 * 60 * 24 * 31 * 500 ,    // about six months in milliseconds
                    width: '100%',
					maxHeight:"900px",
					moveable:true,
					itemsAlwaysDraggable:true,
					snap: function (date, scale, step) {
						return date;
							},
					stack:true,
					orientation:{"axis":"top"},
					selectable: true,  
                    editable: false,  
					groupOrder:'order',					
                    onMove: function(item, callback) {
					
							$rootScope.datePicker.date={startDate:new Date(item.start),endDate:new Date (item.end)}

							days=self.days(moment(item.start),moment(item.end))
							$rootScope.selected_days = days
							if(moment(item.start).isValid()){ //true
							
									
									var event_to_add=	{
									
															  id : item._id,
															  name : item.name,
															  showimage :"",
															  image :"",
															  className		:	item.className,
															  group: item.group,
															  start_date : moment(item.start).startOf('day').format("MMM Do"),
															  end_date : moment(item.end).startOf('day').format("MMM Do"),
															  notes  :item.notes ,
															  days :days
															
														}
									

								//NB DIFFERENT IDS FOR Timeline and Timeline vis vs mongo
								html=self.event_html(event_to_add)
								var options={ id:item.id,
												group: item.group,
												content:html,
												notes:event_to_add.notes,
												start:moment(item.start)._d,
												// className		:	 item.approved == false ? "red" : "blue",
												end:moment(item.end)._d,
												start_date:moment(item.start)._d,
												end_date:moment(item.end)._d
												}
								self.timeline_track.update({
								id:  item._id				
								}, options, function(){self.updateItem(options) });
								
								
								
								
								
								
								
									
								callback(item);
								
							}
							else
							{
							console.log('invalid date')
									callback(item);
								
							}
									
								

                    },
                    onUpdate: function(item, callback) {

                        self.prettyPrompt('Update item', 'Edit items text:', item.content, function(value) {
                            if (value) {
                                item.content = value;
                                //callback(item); // send back adjusted item

									days=self.days(item.start, item.end)
									if(moment(item.start).isValid()){ //true
										
								var event_to_add=	{
								
													  id : item.id,
													  name :value,
													  showimage :"",
													  image :"",
													  start_date :item.start,
													  end_date : item.end,
													  notes  :item.notes ,
													  days :days
													  
													}
									
									
                                var _timeline = new self.timeline_track({
                                    content:  self.event_html(event_to_add),
									name: item.name,
                                    group: item.group,
                                    start_date: item.start,
                                    end_date: item.end,
									days:self.days(item.start,item.end)

                                })
                               
                               self.timeline_track.update({
                                    id: item._id
                                }, _timeline);
                               
				
									var _options={id:item._id,content:self.event_html(event_to_add),start:moment(event_to_add.startDate)._d,end:moment(event_to_add.endDate)._d,start_date:moment(event_to_add.startDate)._d,end_date:moment(event_to_add.endDate)._d}
						
									self.updateItem(_options, function(){
										self.update_andCompile("",item._type)
									})									

								 callback(item);
							}
										else
										{
										console.log('invalid date')
										}							
                            } else {
                                callback(null); // cancel updating the item
                            }
                        });

                    },
                    onAdd: function(item, callback) {


                        self.prettyPrompt('Add note', 'Add some notes to this date:', item.content, function(value) {
                            if (value) {
                                item.content = value;
                                callback(item); // send back adjusted new item
								
								days=self.days(item.start, moment(item.start).add(5, 'days'))
							


								
								var event_to_add=	{id : item.id,
													  name :value,
													  showimage :"",
													  image :"",
													  start_date :item.start,
													  end_date :  moment(item.start).add(5, 'days'),
													  notes  :"" ,
													 days :days}
													
                                var _timeline = new self.timeline_track({
                                        content: self.event_html(event_to_add),
										name:value,
										date_logged: new Date(),	
                                        group: item.group,
										_type:"note",
                                        start_date: item.start,
										 end_date:   moment(item.start).add(1, 'days'),
										className:"green"
                                       // end_date: moment(item.start).add(5, 'days'),
										//days:self.days(item.start, moment(item.start).add(5, 'days'))

                                    })
									    .$save(function(_item) {
                                    new_date.start =_item.start_date
                                    new_date.end = _item.end_date
                                    new_date._id = _item._id
									new_date._type=ui.draggable[0].innerHTML,
                                    timeline.itemsData.getDataSet().add(new_date)
									
                                    setTimeout(function() {
                                        $(ui.draggable[0]).show()
										console.log('bread')
										
                                    }, 1 * 1000);

                                });
					
                            } else {
                                callback(null); // cancel item creation
                            }
                        })


                    },
                    onRemove: function(item, callback) {

                        if (item._id) {
                            self.timeline_track.remove({
                                id: item._id
                            })
                            callback(item);
                        } else {
                            sweetAlert('you can\'t remove this item from here, sorry :)')
                            return false;

                        }
                    }
                };


  
  
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
				
				

				 $rootScope.timeline.setOptions(options);
				 
				 $rootScope.timeline.on('select', function (properties) {
						console.log('timeline selected')
						self.selected_data( properties)

				});
				
			   $rootScope.timeline.setItems(dates);
				$rootScope.timeline.fit()
				
				
				
							
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
				//event.preventDefault()
                   // self.logEvent(event, properties);
                });

			
			self.enable_event_drop()
			$compile($("timeline-databar"))($rootScope);

			
              
    }
	 
  };
}
