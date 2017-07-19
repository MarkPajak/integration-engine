
var async = require('async')
exports.tech_get_trello_board = function (date_calc,$http,Tech_support) {	

	var self = this
    var urlBase =  'https://trello.com/b/GHES2npy/tarantulas.json';
    var trello = []
	var trello_data=[]
	

	
	
    trello.get_data = function (listx,cb) {
		console.log('trello.get_data')
		var self = this
		var lists = listx.length
		var count = 0
		
		
	 async.forEach(listx, function(list, callback2) { 
	
		//all lists	return  Trello.get("boards/56051e0244bb2e4efc9e6e97/lists", function(cards) {
			list_id=list.id
		   Trello.get("lists/"+list.id+"/cards", function(cards) {
			console.log('get list data')		
					var list = []
			
					list._cards = []
                    tally = 0
                    card_count = 0
					
				 async.forEach(cards, function(card, callback) { //The second argument, `callback`, is the "task callback" for a specific `messageId`
       
	   
	   	//calculate date created
					idBoard = card.id;
						
console.log('trello card',card)
					support_card = {
						id:card.id,
						name: card.name,
						list_id:card.idList,
						last_updated:card.dateLastActivity,
						tint: 1 - date_calc.diffDays(card.dateLastActivity) / 10,
						dateLastActivity: card.dateLastActivity,
						link:card.shortUrl,
						date_created:new Date(1000*parseInt(idBoard.substring(0,8),16))
					}
					
					

				
	   
					Tech_support.update({id:card.id}, support_card,callback())

					}, function(err) {
						if (err) return next(err);
						console.log('done updating mongo')
							callback2()	
					});
	
		});	
				}, function(err) {
						if (err) return next(err);
					console.log('all done ')	
				cb()
					});		


    };


		

    return trello;

}

