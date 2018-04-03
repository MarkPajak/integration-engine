exports.record_bookings_controller =  function($scope, $http, $q,  
          Resources,Bookings,data_table_reload,get_table_data,timeline_functions,$routeParams
    ) {

//$scope.setDate = data_table_reload.setDate;
 $scope.dates=[]
  $scope.recurring=false
  $scope.approved=false
	if($routeParams.mode=="rooms")
	{
		var mode = "room"
		var mode_name = "ROOM BOOKING"
		$scope.name_of_form = "Select room" 
	}
	else
	{
		var mode = "equipment"
		var mode_name = "EQUIPMENT BOOKING"
		$scope.name_of_form = "Select Equipment"

	}




			$scope.extraQuery = { "museum_id":"#"}

	  $scope.rooms=[]
	  $scope.Resources=Resources
	  console.log('user', $scope.user)
		var query = {'name':"#",'type':mode,'exact':false};
				
		Resources.query(query, function(rooms) {
					
				
				  _.each(rooms, function(room){					  
				  var _room = []
				  _room.name=room.name
					$scope.rooms.push(_room)
				  })

		})	
			
			$scope.selected_room=""			
			$scope.room_change = function(room) {
				//Your logic
			  $scope.selected_room=room.name
			}
		


		
 $scope.onSubmit=function() {
		
	var files =  []
	_.each($('#upload-input').get(0).files, function(file){
	
	var _file = {}
	_file.name=	file.name
	_file.type=	file.type	
	files.push(_file)	
	console.log(_file)	
	
	})		
	
	console.log(files)	

var event_to_add=	{
													 
						id : new Date().getUTCMilliseconds(),
						name :visit_form.name.value,
						
						internal_external :visit_form.type_radios.value,														  
						showimage :"",
						image :"",
						start_date : new Date(visit_form.start_date.value),
						end_date :  new Date(visit_form.end_date.value),	
						notes  :visit_form.comments.value	
					
					}




					
var kpis = new Bookings({
					
					//DEPARTMENTAL VARIABLES	
					start_date: new Date(visit_form.start_date.value),	
					end_date: new Date(visit_form.end_date.value),	
					group:$scope.selected_room,	
					_type: mode_name,	
					className:"GREEN",	
					files:files,
					approved: $scope.approved,	
					internal_external :visit_form.type_radios.value,	
					name:visit_form.name.value,	
					deposit:visit_form.deposit.value,		
					balance:visit_form.balance.value,							
					notes:visit_form.comments.value,	
					showimage :"",
					content: timeline_functions.event_html(event_to_add),	
					image :"",

					date_logged:new Date(),	
					//date_value:visit_form.date_value.value,
					comments:visit_form.comments.value,			
					logger_user_name: $scope.user.username,					
					requested_by:$scope.user.username
					
            });
			

	if($scope.dates.length>1){

		
		bookings= []
		
		_.each($scope.dates, function(date){
		
		_date={
					//DEPARTMENTAL VARIABLES	
					start_date: new Date(date),	
					end_date: new Date(date),	
					group:$scope.selected_room,	
					_type: mode_name,	
					className:"GREEN",	
					files:files,
					internal_external :visit_form.type_radios.value,	
					name:visit_form.name.value,	
					deposit:visit_form.deposit.value,		
					balance:visit_form.balance.value,	
					approved: $scope.approved,						
					notes:visit_form.comments.value,	
					showimage :"",
					content: timeline_functions.event_html(event_to_add),	
					image :"",

					date_logged:new Date(),	
					//date_value:visit_form.date_value.value,
					comments:visit_form.comments.value,			
					logger_user_name: $scope.user.username,					
					requested_by:$scope.user.username
					
				}
				
	end_hours = new Date(visit_form.end_date.value).getHours();
	end_minutes = new Date(visit_form.end_date.value).getMinutes();

	_date.end_date.setHours(end_hours);
	_date.end_date.setMinutes(end_minutes);
            
		bookings.push(_date)
		
		})
	

		async_save=function(i){
		
		_bookings=new Bookings(bookings[i])
		_bookings.$save(function(err, user) {
			if(err){
				console.log(err)
			}		
			
			i++
			if(i<bookings.length){
				async_save(i)
			}
		})
		
		}
		
		async_save(0)

	}	
                     
			
			var query = {
			
						'name': visit_form.name.value,	
						'_type':mode_name,
						'group':visit_form.room.value,
						'start_date':visit_form.start_date.value,
						'end_date':visit_form.end_date.value
						
						};
			
			Bookings.query(query, function(visits) {
				  $scope.$emit('form_submit');
				console.log('Raw_visits',visits.length)
				$scope.results=visits
		if($scope.dates.length==1){
						save(kpis)
		}
			
			})	
			
            
		
	

	

    }
		function save(kpis){

	kpis.$save(function(err, user) {
		
						if(err) console.log(err)
						
						var  message = "data saved successfully";
							  message+= "\n ";
							 
							  alert(message);
							  //get_table_data.getData(moment(new Date()).subtract({'months':1})._d,$scope)			
							$scope.message="data saved successfully";
							visit_form.name.value=""
							visit_form.group.value=""
							visit_form.start_date.value=""
							visit_form.end_date.value=""
		
		 
							 
						})
						

}
	
	$( document ).ready(function() {
     $scope.$emit('record_rooms_form');
	 $scope.savex=function(kpis) {
			save(kpis)
	 }
	
});
	
$('.upload-btn').on('click', function (){
    $('#upload-input').click();
    $('.progress-bar').text('0%');
    $('.progress-bar').width('0%');
});

$('#upload-input').on('change', function(){

  var files = $(this).get(0).files;

  if (files.length > 0){
    // create a FormData object which will be sent as the data payload in the
    // AJAX request
    var formData = new FormData();

    // loop through all the selected files and add them to the formData object
    for (var i = 0; i < files.length; i++) {
      var file = files[i];

      // add the files to formData object for the data payload
      formData.append('uploads[]', file, file.name);
    }

    $.ajax({
      url: '/upload',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(data){
          console.log('upload successful!\n' + data);
      },
      xhr: function() {
        // create an XMLHttpRequest
        var xhr = new XMLHttpRequest();

        // listen to the 'progress' event
        xhr.upload.addEventListener('progress', function(evt) {

          if (evt.lengthComputable) {
            // calculate the percentage of upload completed
            var percentComplete = evt.loaded / evt.total;
            percentComplete = parseInt(percentComplete * 100);

            // update the Bootstrap progress bar with the new percentage
            $('.progress-bar').text(percentComplete + '%');
            $('.progress-bar').width(percentComplete + '%');

            // once the upload reaches 100%, set the progress bar text to done
            if (percentComplete === 100) {
              $('.progress-bar').html('Done');
            }

          }

        }, false);

        return xhr;
      }
    });

  }
});
	
$scope.$watch('ctrl.input_start', function (input_start) {console.log('input_start',input_start)});	
	//recurrign event
	
	var getFormValues, getOptionsCode, makeRows;

  getFormValues = function($form) {
    var paramObj;

    paramObj = {};
    $.each($form.serializeArray(), function(_, kv) {
	if (kv.name!="type_radios" && kv.name!="approved") {
    if (paramObj.hasOwnProperty(kv.name) ) {
        paramObj[kv.name] = $.makeArray(paramObj[kv.name]);
        return paramObj[kv.name].push(kv.value);
      } else {
        return paramObj[kv.name] = kv.value;
      }
	  }
    });
    return paramObj;
  };

  getOptionsCode = function(options) {
    var days, items, k, v;

    days = ["RRule.MO", "RRule.TU", "RRule.WE", "RRule.TH", "RRule.FR", "RRule.SA", "RRule.SU"];
    items = (function() {
      var _results;

      _results = [];
      for (k in options) {
        v = options[k];
        if (v === null) {
          v = 'null';
        } else if (k === 'freq') {
          v = 'RRule.' + RRule.FREQUENCIES[v];
        } else if (k === "dtstart" || k === "until") {
          v = "new Date(" + [v.getFullYear(), v.getMonth(), v.getDate(), v.getHours(), v.getMinutes(), v.getSeconds()].join(', ') + ")";
        } else if (k === "byweekday") {
          if (v instanceof Array) {
            v = v.map(function(wday) {
              var s;

              console.log('wday', wday);
              s = days[wday.weekday];
              if (wday.n) {
                s += '.nth(' + wday.n + ')';
              }
              return s;
            });
          } else {
            v = days[v.weekday];
          }
        } else if (k === "wkst") {
          if (v === RRule.MO) {
            continue;
          }
          v = days[v.weekday];
        }
        if (v instanceof Array) {
          v = '[' + v.join(', ') + ']';
        }
        console.log(k, ' =', v);
        _results.push("" + k + ": " + v);
      }
      return _results;
    })();
    return "{\n  " + (items.join(',\n  ')) + "\n}";
  };

  makeRows = function(dates) {
    var cells, cls, date, i, index, part, parts, prevParts, prevStates, rows, states;

    prevParts = [];
    prevStates = [];
    index = 1;
    rows = (function() {
      var _i, _len, _results;

      _results = [];
      for (_i = 0, _len = dates.length; _i < _len; _i++) {
        date = dates[_i];
        states = [];
        parts = date.toString().split(' ');
        cells = (function() {
          var _j, _len1, _results1;

          _results1 = [];
          for (i = _j = 0, _len1 = parts.length; _j < _len1; i = ++_j) {
            part = parts[i];
            if (part !== prevParts[i]) {
              states[i] = !prevStates[i];
            } else {
              states[i] = prevStates[i];
            }
            cls = states[i] ? 'a' : 'b';
            _results1.push("<td class='" + cls + "'>" + part + "</td>");
          }
          return _results1;
        })();
        prevParts = parts;
        prevStates = states;
        _results.push("<tr><td>" + (index++) + "</td>" + (cells.join('\n')) + "</tr>");
      }
      return _results;
    })();
    return rows.join('\n\n');
  };

  $(function() {
    var $tabs, activateTab, processHash;

    $tabs = $("#tabs");
    activateTab = function($a) {
      var id;

      id = $a.attr("href").split("#")[1];
      $tabs.find("a").removeClass("active");
      $a.addClass("active");
      $("#input-types section").hide();
      return $("#input-types #" + id).show().find("input:first").focus().change();
    };
    $("#input-types section").hide().each(function() {
      return $("<a />", {
        href: "#" + $(this).attr("id")
      }).text($(this).find("h3").hide().text()).appendTo($tabs).on("click", function() {
        activateTab($(this));
        return false;
      });
    });
    $(".examples code").on("click", function() {
      var $code;

      $code = $(this);
      return $code.parents("section:first").find("input").val($code.text()).change();
    });
    $("input, select").on('keyup change', function() {
      var $in, $section, date, dates, days, e, getDay, html, init, inputMethod, key, makeRule, max, options, rfc, rule, text, v, value, values,
        _this = this;

      $in = $(this);
      $section = $in.parents("section:first");
      inputMethod = $section.attr("id").split("-")[0];
      switch (inputMethod) {
        case "text":
          makeRule = function() {
            return RRule.fromText($in.val());
          };
          init = "RRule.fromText(\"" + this.value + "\")";
          break;
        case "rfc":
          makeRule = function() {
            return RRule.fromString(_this.value);
          };
          init = "RRule.fromString(\"" + this.value + "\")";
          break;
        case 'options':
          values = getFormValues($in.parents("form"));
          options = {};
          days = [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR, RRule.SA, RRule.SU];
          getDay = function(i) {
            return days[i];
          };
          for (key in values) {
            value = values[key];
            if (!value) {
              continue;
            } else if (key === 'dtstart' || key === 'until') {
              date = new Date(Date.parse(value));
              value = new Date(date.getTime() + (date.getTimezoneOffset() * 60 * 1000));
            } else if (key === 'byweekday') {
              if (value instanceof Array) {
                value = value.map(getDay);
              } else {
                value = getDay(value);
              }
            } else if (/^by/.test(key)) {
              if (!(value instanceof Array)) {
                value = value.split(/[,\s]+/);
              }
              value = (function() {
                var _i, _len, _results;

                _results = [];
                for (_i = 0, _len = value.length; _i < _len; _i++) {
                  v = value[_i];
                  if (v) {
                    _results.push(v);
                  }
                }
                return _results;
              })();
              value = value.map(function(n) {
                return parseInt(n, 10);
              });
            } else {
              value = parseInt(value, 10);
            }
            if (key === 'wkst') {
              value = getDay(value);
            }
            if (key === 'interval' && (value === 1 || !value)) {
              continue;
            }
            options[key] = value;
          }
          makeRule = function() {
            return new RRule(options);
          };
          init = "new RRule(" + getOptionsCode(options) + ")";
          console.log(options);
      }
      $("#init").html(init);
      $("#rfc-output a").html("");
      $("#text-output a").html("");
      $("#options-output").html("");
      $("#dates").html("");
      try {
        rule = makeRule();
		
      } catch (_error) {
        e = _error;
        $("#init").append($('<pre class="error"/>').text('=> ' + String(e || null)));
        return;
      }
      rfc = rule.toString();
      text = rule.toText();
      $("#rfc-output a").text(rfc).attr('href', "#/rfc/" + rfc);
      $("#text-output a").text(text).attr('href', "#/text/" + text);
      $("#options-output").text(getOptionsCode(rule.origOptions));
      if (inputMethod === 'options') {
        $("#options-output").parents('tr').hide();
      } else {
        $("#options-output").parents('tr').show();
      }
      max = 500;
      dates = rule.all(function(date, i) {
        if (!rule.options.count && i === max) {
          return false;
        }
        return true;
      });
	  console.log('dates',dates)
	  $scope.dates=dates
      html = makeRows(dates);
      if (!rule.options.count) {
        html += "<tr><td colspan='7'><em>Showing first " + max + " dates, set\n<code>count</code> to see more.</em></td></tr>";
      }
      return $("#dates").html(html);
    });
    activateTab($tabs.find("a:first"));
    processHash = function() {
      var arg, hash, match, method;

      hash = location.hash.substring(1);
      if (hash) {
        match = /^\/(rfc|text)\/(.+)$/.exec(hash);
        if (match) {
          method = match[1];
          arg = match[2];
          activateTab($("a[href='#" + method + "-input']"));
          return $("#" + method + "-input input:first").val(arg).change();
        }
      }
    };
    processHash();
    return $(window).on('hashchange', processHash);
  });



	}
 
