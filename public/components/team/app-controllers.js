exports.TallyController =  function($scope, Tallys) {


    $scope.editing = [];
    $scope.tallys = Tallys.query();

	
	
	
	
    $scope.save = function() {
        if (!$scope.newTally || $scope.newTally.length < 1) return;
        var tally = new Tallys({
            name: $scope.newTally,
            completed: false
        });

        tally.$save(function() {
            $scope.tallys.push(tally);
            $scope.newTally = ''; // clear textbox
        });
    }

    $scope.update = function(index) {
        var tally = $scope.todos[index];
        Tallys.update({
            id: tally._id
        }, tally);
        $scope.editing[index] = false;
    }

    $scope.edit = function(index) {
        $scope.editing[index] = angular.copy($scope.tallys[index]);
    }

    $scope.cancel = function(index) {
        $scope.tallys[index] = angular.copy($scope.editing[index]);
        $scope.editing[index] = false;
    }

    $scope.remove = function(index) {
        var tally = $scope.tallys[index];
        Tallys.remove({
            id: tally._id
        }, function() {
            $scope.tallys.splice(index, 1);
        });
    }
}
exports.TodoDetailCtrl =   function($scope, $routeParams, Todos, $location) {

    $scope.todo = Todos.get({
        id: $routeParams.id
    });

    $scope.remove = function() {
        Todos.remove({
            id: $scope.todo._id
        }, function() {
            $location.url('/');
        });
    }
}
exports.trello =   function($scope, $http, $q, $routeParams, $location,
        screen_saver_loop,  $rootScope, detect_dragging, trello, get_trello_board, date_calc, Todos, Tallys,Team
    ) {


        trello.auth()
		
		$scope.removeTeam = function(id) {
			Team.remove({id:id})
		}
		  Team.query({}, function(team) {
			_.each(team, function(row) {
				$scope.removeTeam(row._id)
				})	
			})	

	
	
		
				
        
        kiosk_path = $routeParams.kiosk
            //  screensaver = app_settings.screensaver //services
        screensaver = ""
        $scope.start_screen_saver = function() {
            screen_saver_loop.start_screen_saver()

        };
        $scope.functionThatReturnsStyle = function() {
            // return app_functons.functionThatReturnsStyle($routeParams.kiosk)

        };
        $scope.changeheadingcolor = function() {
            // return app_functons.changeheadingcolor($routeParams.kiosk)

        };
        if ($rootScope.screensaver_on != true) {
            console.log('start screensaver')
            screen_saver_loop.start_screen_saver();
        }

        console.log($routeParams.view)

        var display_data = $rootScope[$routeParams.view]




        $scope.lists = []
        loadMoreShots = function(display_data) {

            angular.forEach(display_data, function(list, index) {


                var promise = get_trello_board.get_data(list)
				
				.then(function(response) {
					cards=response.response
					console.log('cards',cards)
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
                    list.points = (card_count / (list.average/1 + 1)).toFixed(2)
					console.log('card_count',card_count)
					console.log('list.average ',list.average )
					console.log('list.average ',(list.average + 1))
					console.log('list.points ',list.points)	
						
								 // (card_count / (list.average + 1)).toFixed(1)	
					
					var team = new Team({
					  name: list.title,
					  score:list.points,
					   card_count:card_count,
					  bonus:"",
					  penalty:list.average 
					});
					 team.$save(function() {                       
                        $scope.team.push(team);
                    });
					
                    var tally = new Tallys({
                        name: list.title,
                        date: new Date(),
                        points: list.points
                    });
                    $scope.tallys = Tallys.query();


                    tally.$save(function() {
                        console.log(tally)
                        $scope.tallys.push(tally);
                        $scope.newTodo = ''; // clear textbox
                    });


                    $scope.lists.push(list)
                })

            })
        }

        loadMoreShots(display_data)


        detect_dragging.drag_handler()
        $scope.go = function(path) {

            if ($rootScope.isDragging == false) {
                if (path > 0) {
                    $location.path("id/" + path + "/" + $routeParams.kiosk);
                    detect_dragging.drag_handler()
                } else {
                    //$location.path(path + "/" + $routeParams.kiosk);
                }
            }
        };


        $scope.pageClass = 'page-contact';

        $scope.save = function() {
            if (!$scope.newTally || $scope.newTally.length < 1) return;
            var tally = new Tallys({
                name: $scope.newTally,
                date: new Date()
            });

            tally.$save(function() {
               
                $scope.todos.push(tally);
                $scope.newTodo = ''; // clear textbox
            });
        }
    }
	
	
	
