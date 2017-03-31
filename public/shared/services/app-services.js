
exports.date_calc = function($http) {	
		

var date_calc = {};

var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
var firstDate = new Date(2008,01,12);
var secondDate = new Date();

date_calc.diffDays  = function (firstDate) {
var firstDate = new Date(firstDate);
         return secondDate.getMonth() - firstDate.getMonth()
       + (12 * (secondDate.getFullYear() - firstDate.getFullYear()));

    };
	

    return date_calc;

}

exports.data_table_reload = function() {	


  var date= moment().startOf( 'day')._d
  
  
  function getDate() {
    return date;
  }
  function setDate(newDate) {
    date = newDate;
  }
  return {
    getDate: getDate,
    setDate: setDate,
  }
		

}
    
exports.trello = function($http) {	

	

			var trello = {};
			trello.auth = function () {
		
				var authenticationSuccess = function() { 
				console.log("sucessful authentication");
				var token = Trello.token();
				window.location.replace(decodeURIComponent(window.location.hash));
				console.log("Successful authentication");
				};
					var authenticationFailure = function() {alert("Failed authentication"); };

					 Trello.authorize({
					  type: 'redirect',
					  name: 'Bristol Culture Trello Monitor',
					  scope: {
						read: 'true',
						write: 'true' },
					  expiration: 'never',
					  success: authenticationSuccess,
					  error: authenticationFailure
					});
				

			};
			return trello;

}

exports.get_trello_board = function (Team,Tallys,date_calc,$http,$rootScope) {	


    var urlBase =  'https://trello.com/b/GHES2npy/tarantulas.json';
    var trello = []
	var trello_data=[]
    trello.get_data = function (listx) {
	
		//all lists	return  Trello.get("boards/56051e0244bb2e4efc9e6e97/lists", function(cards) {
			
		 return Trello.get("lists/"+listx.id+"/cards", function(cards) {
		 var list = []
			
					list._cards = []
                    tally = 0
                    card_count = 0
					
					
		   angular.forEach(cards, function(card, index) {
                        card_count++

                        card_to_print = {
                            name: card.name,
                            tint: 1 - date_calc.diffDays(card.dateLastActivity) / 10,
                            age: date_calc.diffDays(card.dateLastActivity).toString(),
                            dateLastActivity: card.dateLastActivity
                        }
                        tally += date_calc.diffDays(card.dateLastActivity)


                        list._cards.push(card_to_print)

                    });
				


                    list.average = (tally / card_count).toFixed(2)
                    list.tint = list.average / 100
                    list.card_count = card_count
                    list.points =  (card_count / (list.average/1 + 1)).toFixed(2)
					

					  Team.query({}, function(_team) {
							_.each(_team, function(row) {
								if(row.name==listx.title){
									
									   var tally = new Tallys({
										name: listx.title,
										date: new Date(),
										points: list.points
									});
									//$scope.tallys = Tallys.query();


									tally.$save();
					
					
										var team = Team.get({ id:row._id });
											  team.name= list.title
											  team.score=list.points
											  team.card_count=  list.card_count
											  team.bonus=""
											  teampenalty=list.average 
										$id = row._id;
										 Team.update({ id:$id }, team);
										$rootScope.message="update"	
								}
									
								});
						});
		 
		 console.log('end of service')
		 }).then(
			function (response){
				return response
				
			}
		 )
				
			

    };


		

    return trello;

}



exports.detect_dragging= function($rootScope) {


	
var detect_dragging=[]
 $rootScope.isDragging = false;
var currentPos = [];
detect_dragging.drag_handler= function(){
 $('md-content').on('mousedown', function (evt) {

   currentPos = [evt.pageX, evt.pageY]

 $('md-content').on('mousemove', function handler(evt) {

    currentPos=[evt.pageX, evt.pageY];
    $('#content-scroller').off('mousemove', handler);

  });

 $('md-content').on('mouseup', function handler(evt) {
	
    if(evt.pageX+ evt.pageY==currentPos[0]+currentPos[1]){
			console.log('clicking')
       $rootScope.isDragging = false;
	}
    else
	{
      $rootScope.isDragging = true;
		console.log('dragging')
	}
 $('md-content').off('mouseup', handler);
 
  });

});
}

/* App Module */

  return detect_dragging

}


exports.screen_saver_loop=function($rootScope,$location,$interval,Team) {

	



				//NB make sure any views called int he screensaver dont contain the screensaver service!
				 var sharedService = {};
				 

	var team_list=[]
	var support_list=[]
	var roadmap_list=[]
		var list=[]
	list.title="BMAG DIGITAL SUPPORT"
	list.id="56051e0244bb2e4efc9e6e99"	  
    support_list.push(list)
	
	var list=[]
	list.title="MSHED DIGITAL SUPPORT"
	list.id="562667caadda958dad274f22"	  
    support_list.push(list)
	
	var list=[]
	list.title="ZAHID"
	list.id="5257d4e719e0ee3b5800009c"	  
    team_list.push(list)
	
	var list=[]
	list.title="DARREN"
	list.id="55cdc7672fff3ffc946f6e94"	  
    team_list.push(list)
	
	var list=[]
	list.title="TOM"
	list.id="563234399bfcf125dc06f03b"	  
    team_list.push(list)	
		
		
	var list=[]
	list.title="LACEY"
	list.id="57f3b32311fbe4f9966de748"	  
    team_list.push(list)	

		
	var list=[]
	list.title="FAY"
	list.id="53344421ba92789d64cf8f99"	  
    team_list.push(list)
	
		var list=[]
	list.title="MARK"
	list.id="5790fb082acddb2d98c04826"	  
    team_list.push(list)
	
	var list=[]
	list.title="DAVID"
	list.id="52c3f521160978433b073a9b"	  
    team_list.push(list)
	
	
	
	
	var list=[]
	list.title="Q3"
	list.id="5763ca5d82c12dc42e874e0a"	  
   	  
    roadmap_list.push(list)
	
	var list=[]
	list.title="Q4"
	list.id="5763ca6c8981e9d4c9da0e23"	  
   


   roadmap_list.push(list)
	

	$rootScope.team=team_list
	$rootScope.support=support_list
	$rootScope.roadmap=roadmap_list
	
				 var currentView= ['/a/team','/a/support','/a/roadmap','/board']
				  $rootScope.i = 0
				 var timer
				 
				function switchview(i){
					
						 var videoElement = $('iframe').contents().find("video").get(0)
					
						if(!audioplayer ){var audioplayer=""}
						 var audioElement_not_playing = audioplayer.paused
						 

				if  ((!videoElement || videoElement.paused) && !audioplayer|| audioplayer.paused==true) {
					
			
						
						$rootScope.updateInterval 
						console.log(i)
						if(i>=screensaver.length){i=0;$rootScope.i=0}
						//app_start_log(kiosk,"SCREENSAVER")						
						$location.path( currentView[$rootScope.i])
						$rootScope.i++
					}
					else{
						
						console.log('video playing..cancel')
					}
					
						

				}

				//	$interval.cancel(timer);

				  sharedService.start_screen_saver = function() {
					
			
					  $interval.cancel($rootScope.timer );
					
					if($location.path()!="/screen_saver_images"){	
							$rootScope.screensaver_on=true
						
							$rootScope.timer = $interval(function() { switchview( $rootScope.i) }, 5   * 60*   1000)
					}
					
				  
				  };

				  sharedService.screensaverOff = function() {
						$rootScope.screensaver_on=false
					   $interval.cancel($rootScope.timer );
					   console.log('screensaver off')
					  
				
				   
				  };

				  return sharedService;
}
  
  


