exports.feedback =function ($http) {

  return {
    async_categories: function() {
      return $http.get('http://www.markpajak.co.uk/mark/kiosk-feedback/downtime.php');  //1. this returns promise
    },
	 async_all: function(categories,dates) {
	 var categories=categories||""
	 var dates=dates||""
	 var machine_types=machine_types||""
	
      return $http.get('http://www.markpajak.co.uk/mark/kiosk-feedback/all_logs.php?categories='+JSON.stringify(categories)+'&machine_types='+JSON.stringify(machine_types)+'&dates='+JSON.stringify(dates));  //1. this returns promise
    },
	
	
		 feedback: function(categories,machine_types,dates) {
	 var categories=categories||""
	 var dates=dates||""
	 var machine_types=machine_types||""
	
      return $http.get('http://www.markpajak.co.uk/mark/kiosk-feedback/all_comments.php');  //1. this returns promise
    },
	 comments_all: function() {
      return $http.get('http://www.markpajak.co.uk/mark/kiosk-feedback/all_comments.php');  //1. this returns promise
    }
  };
}
