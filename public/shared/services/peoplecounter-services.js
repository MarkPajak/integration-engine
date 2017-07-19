

		  angular.module('app').factory('people_activity', ['$http', function ($http) {
  return {
    yesterday: function() {
      url='http://mshedprod-app01/PeopleCounter%20Log%20Files/Zone/BMAG%20Whole.txt?callback=JSON_CALLBACK';  //1.
return $http.jsonp(url)
    .success(function(data){
        console.log(data);
    });	  
    },
	 async_all: function(categories,machine_types,dates) {
	 var categories=categories||""
	 var dates=dates||""
	 var machine_types=machine_types||""
	
	
	
      return $http.get('http://www.markpajak.co.uk/mark/kiosk-feedback/all_logs.php?categories='+JSON.stringify(categories)+'&machine_types='+JSON.stringify(machine_types)+'&dates='+JSON.stringify(dates));  //1. this returns promise
    },
	 comments_all: function() {
      return $http.get('http://www.markpajak.co.uk/mark/kiosk-feedback/all_comments.php');  //1. this returns promise
    }
  };
}]);
