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
	 link: function($scope, $el) {
		
	
		
		
		
		
      var script = document.createElement('script');
	  
      script.text = "$(function() {;"
	  script.text +=" $('#infobutton'+ '"+ $scope.id +"').hide();"
	  script.text +=" $('#timeline'+ '"+ $scope.id +"').mouseover(function() {"; 
	  script.text +=" $('#infobutton'+ '"+ $scope.id +"').show();"; 
      script.text +="});"; 
	  	  script.text +=" $('#timeline'+ '"+ $scope.id +"').mouseout(function() {"; 
	  script.text +=" $('#infobutton'+ '"+ $scope.id +"').hide();"; 
      script.text +="});"; 
	  script.text +="$('#infobutton'+ '"+ $scope.id +"').on('click', function(event){ "
	  script.text +=" $('#infobox_name').text('').append('" + $scope.name  +"'); "; 
	  script.text +=" $('#infobox_description').text('').append('" + $scope.description  +"');"; 
	  script.text +="});});"
		 
		 
      $el.append(script);
    },

      templateUrl: './components/timeline/timeline-item.html',
	  scope: {
		  startdate: "@",
		  id: "@",
		  enddate: "@",
		  name: "@",
		  description: "@",
		  image: "@",
		  showimage: "@",
		  notes: "@",		 
		  days: "@"
		
		}
    }
	}
	

	
	

