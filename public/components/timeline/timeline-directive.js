	exports.timeLine = function() {
  return {
   controller: 'timeline_controller',
    templateUrl: './components/timeline/timeline-page.html'
  }
	}
	
		exports.timelineMenu = function() {
  return {
   controller: 'BasicDemoCtrl',
    templateUrl: './components/timeline/menu.html'
  }
	}
	
			exports.addtimelineItems = function() {
  return {
   controller: 'add_timeline_items_controller',
    templateUrl: './components/timeline/add-items-block.html'
  }
	}
	
		
exports.timelineInfobox = function() {
  return {
   controller: 'add_timeline_info_box',
    templateUrl: './components/timeline/info-box.html'
  }
	}
	
	
	exports.timelineDatabar= function( $compile ) {
 
 return{
	restrict: 'E',
      templateUrl: './components/timeline/timeline-item.html',
	  scope: {
		 startdate: "@",
		 id: "@",
		  enddate: "@",
		  name: "@",
		  image: "@",
		  showimage: "@",
		  notes: "@",		 
		  days: "@"
		
		}
    }
	}
	

	
	

