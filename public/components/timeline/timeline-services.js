

exports.timeline_functions = function ($http,Timeline,$rootScope) {
	

  return {
  
  
  export_JSON_to_CSV: function(JSONData, ReportTitle, ShowLabel){
  
  
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    console.log('arrData',arrData)
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
  
  enable_event_drop:function(event){
		var self = this
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
							
							//type=(timeline.getEventProperties(event).type)
                            $(ui.draggable[0]).hide()
							
							if(ui.draggable[0].innerHTML=="PROVISIONAL DATE"){
                            self.prettyPrompt('Add item', 'Enter text content for new item:',"", function(value) {
                            if (value) {
                               	add_item(group,group,time,value,"blue",30,ui.draggable[0].innerHTML)
							}
							})
							}
							else if(ui.draggable[0].innerHTML=="INSTALL" ||ui.draggable[0].innerHTML=="DERIG" )
							{
								add_item(group,group,time,ui.draggable[0].innerHTML,"red",7,ui.draggable[0].innerHTML)
							}
							else
							{
								add_item(group,$rootScope.filter_pieSelected,time,"placeholder","orange",1,"PROVISIONAL DATE")
							}
							
							function add_item(dropped_group,group,time,value,colour,days,type){
							
									 date_dropped=(moment(time).startOf('day')._d)
									
									var id = ui.draggable[0].id
									var dateDroppedOn =time
									target_date = time
									_days=self.days(moment(date_dropped).startOf('day')._d,moment(date_dropped).add(days, 'days')._d)
									var new_date = {
										content: self.event_html(value,"","",moment(date_dropped).startOf('day')._d,moment(date_dropped).add(days, 'days')._d, "",_days),
										name:value,
										group: group,
										dropped_group:dropped_group,
										className:colour||"",
										_type:type,
										start_date: new Date(moment(date_dropped).startOf('day')._d),
										end_date: new Date (moment(date_dropped).add(days, 'days')._d),
										days:_days

									}
									var _timeline = new Timeline(new_date)
										.$save(function(_item) {
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
		
                        
								timeline.setOptions({'editable':unlock});
								
			
							
		  	
	  
	  },
	  
	   	changeTracks: function(selection){

				var groups = new vis.DataSet($rootScope.groups);
				var group = new vis.DataSet( $rootScope.leave_groups);
				var list =groups.get({
						filter: function(item) {
							
							return (  selection.indexOf(item.track)!=-1);
						}
					})
					
						timeline.setGroups(list);
						
					
						this.enable_event_drop()
		
				},  
  
	   



   add_group_to_timeline: function(new_group){
//TO DO
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
			
				
			
		
				},  
				
	   changeTracks: function(selection){

				var groups = new vis.DataSet($rootScope.groups);
				var group = new vis.DataSet( $rootScope.leave_groups);
				var list =groups.get({
						filter: function(item) {
							
							return (  selection.indexOf(item.track)!=-1);
						}
					})
					
						timeline.setGroups(list);
						
					
						this.enable_event_drop()
		
				},  
		changeGroups: function(selection){

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
  
  		  loadgroups: function(items){
	
			var _groups=[]
			var addednames=[]
			
			 _.each(items._data, function(value) {
			
			if(value.start_date!="0000-00-00" && value.end_date!="0000-00-00"&& value.start_date!="" &&value.end_date!=""&&value.project_name!=""){
				
				if($.inArray(value.group, $rootScope.addednames)==-1 ){
					$rootScope.addednames.push(value.group)
					//n.b. may be able to order groups when locatiobn hierarchy given in emu
					content=value.group ||"NA"
					if( value.group.toLowerCase()=="temporary exhibition gallery"){ content="<b>M SHED:</b> "+value.group}
					if( value.group.toLowerCase()=="window on bristol"){ content="<b>M SHED:</b> "+value.group}
					if( value.group.toLowerCase()=="first floor foyer"){ content="<b>M SHED:</b> "+value.group}
					 
					 _groups.push({
										id				:	value.group,
										//display		:	'shown',
										track			:    value.track,
										order		    :    value.order,
										event_type		:	 value.event_type,
										content			:    content,
										event_typeSORT	:    content,
										selected         : value.select_group 
									})
				}
				}
			})

			console.log(_groups)
			return _groups		

		},
  
   		 event_html: function(name,showimage,image,start_date,end_date,notes ,days){
			var notes=notes ||""
				var htmlContent = '<div class="titlediv" >'
																htmlContent+='<div class="title_heading">'
																	if(showimage){
																	htmlContent+='<div class="image_box">'
																	htmlContent+='<img src="http://museums.bristol.gov.uk/multimedia/entry.php?request=resource&irn='+image +'&height=50&format=jpeg" />'
																	htmlContent+='</div>'	
																}	
																htmlContent+=name
																	if(days>0 &&end_date){
																		//htmlContent+='<div class="days">'
																		htmlContent+=" - "+ days + " days"
																		//htmlContent+='</div>';
																}
																htmlContent+='</div>';
																
																htmlContent+="<span> ";
																htmlContent+=start_date 
																if(end_date) {htmlContent+= "-" + end_date};
																htmlContent+="<span>";
																htmlContent+= '</div>'
																htmlContent+='<div class="notes">'
																htmlContent+="<p>"+notes
																
																											
													htmlContent+= '</div>'
													
			return htmlContent

			},
				selected_data:	 function (event) {
			 var self=this
			 	console.log('get ID to update')
					selected_timeline_id=event.items[0]
			 if(selected_timeline_id){
			 //newly selected - get ID to update
				
			//fetch the timeline dataSetitem 
					selected_item =	timeline.itemsData.getDataSet().get(selected_timeline_id)
			//update the data entry form
			console.log(selected_item)
			
			$rootScope.selected_timeline_id=selected_timeline_id
			$rootScope.selected_item=selected_item.name
			$rootScope.selected_type=selected_item._type
			if(selected_item.days>0){
			$rootScope.selected_days=" - " +selected_item.days + " days"
			}
			$rootScope.selected_id=selected_item._id
			$rootScope.selected_notes=selected_item.notes
			console.log('startDate'+new Date(selected_item.start))
			$rootScope.datePicker.date={startDate:new Date(selected_item.start),endDate:new Date (selected_item.end)}
			
}
            },
   get_events: function() {
      return $http.get('http://museums.bristol.gov.uk/sync/data/events.JSON');  //1. this returns promise
    },
	
	updateOptions: function(options){

		$rootScope.timeline.setOptions(options)
			
				
	},
	updateItem: function(options){
		if(typeof(timeline)!="undefined"){
		timeline.itemsData.getDataSet().update(options)
		}
			
	},
	
    setup: function(Timeline,groups,dates) {
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
						
					//groupEditable:true,
					stack:false,
					orientation:{"axis":"top"},
                    editable: false,  
					 groupOrder:'order',					
                    onMove: function(item, callback) {
$rootScope.datePicker.date={startDate:new Date(item.start),endDate:new Date (item.end)}
                        var _timeline = new Timeline({
                          //  content: item.content,
							 content:  self.event_html(item.name,"","",item.start, item.end,item.notes ),
                            group: item.group,
                            start_date: item.start,
                            end_date: item.end,
                            _id: item._id
                        })
                       
                        Timeline.update({
                            id: item._id
                        }, _timeline);

                        callback(item);

                    },
                    onUpdate: function(item, callback) {

                        self.prettyPrompt('Update item', 'Edit items text:', item.content, function(value) {
                            if (value) {
                                item.content = value;
                                callback(item); // send back adjusted item

									days=self.days(item.start, item.end)
                                var _timeline = new Timeline({
                                    content:  self.event_html(value,"","",item.start, item.end,item.notes ,days),
									name: item.name,
                                    group: item.group,
                                    start_date: item.start,
                                    end_date: item.end,
									days:self.days(item.start,item.end)

                                })
                               
                                Timeline.update({
                                    id: item._id
                                }, _timeline);
                                callback(item);
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
																		
     
                                var _timeline = new Timeline({
                                        content: self.event_html(value,"","",item.start, moment(item.start).add(5, 'days'),"" ,days),
										name:value,
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
                            Timeline.remove({
                                id: item._id
                            })
                            callback(item);
                        } else {
                            sweetAlert('you can\'t remove this item from here, sorry :)')
                            return false;

                        }
                    }
                };

  var container = document.getElementById('example-timeline');
  
  
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
				groups=self.loadgroups(dates)
				$rootScope.rawData=dates
				$rootScope.groups=groups
				var groups = new vis.DataSet(groups);
				
           
						
				var list = groups.get({
						filter: function(item) {
							return (item);
						}
				})
					
				timeline.setGroups(list);
					$rootScope.myGroup = {
					selected:{}
				};
				$rootScope.groups=list
			
		
				 
                timeline.setItems(dates);
                timeline.setOptions(options);
				timeline.fit()
				
				//self.changeGroups($rootScope.groups.selected)
				
				timeline.on('select', function (properties) {
						self.selected_data( properties)

				});
				
				
					$rootScope.timeline=timeline					
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
                    self.logEvent(event, properties);
                });

			
				self.enable_event_drop()
              
    }
	 
  };
}
