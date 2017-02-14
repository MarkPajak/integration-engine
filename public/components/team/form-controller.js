exports.form_to_trellox =  function($scope, $http, $q, $routeParams, $location,
        screen_saver_loop,  $rootScope, detect_dragging, trello, get_trello_board, date_calc, Todos, Tallys,Team
    ) {



        trello.auth()
		
		console.log($rootScope.team)
		
		boards=[]
		
		 angular.forEach($rootScope.team, function(team,i) {
				 board={
				  "name": team.title,
				  "value": team.id
				  }
				 boards.push(board)
		 })
		
 $scope.form_to_trello = function (  ) {
 
    var vm = this;
    // funcation assignment
    vm.onSubmit = onSubmit;

    // variable assignment
    vm.author = { // optionally fill in your info below :-)
      name: '#',
      url: '#' // a link to your twitter/github/blog/whatever
    };
    vm.exampleTitle = 'Introduction';
    vm.env = {
      angularVersion: angular.version.full
    };

    vm.model = {
	  name: "",
	  file:"",
	  list_id:"",
	  description:""
    };
    vm.options = {
      formState: {
        awesomeIsForced: false
      }
    };
    
    vm.fields = [
     /*
	  {

                            type: 'radio',
                            key: 'satisfaction',							
                            templateOptions: {
                              label: "Explain the problem",  
                                
                                options: [
									 {
										"name": "very satisfied",
										"value": "very satisfied"
									  },
									  {
										"name": "satisfied",
										"value": "satisfied"
									  },
									  {
										"name": "neither satisfied nor disatisfied",
										"value": "neither satisfied nor disatisfied"
									  },
									  {
										"name": "disatisfied",
										"value": "disatisfied"
									  },
									  {
									  
										"name": "very disatisfied",
										"value": "very disatisfied"
									  }
                                ]
							}
	  },
	  */
	  {
        key: 'list_id',
        type: 'select',
        templateOptions:{
            label: 'Post to board',
            options: boards,
             }
		
		},
	  {
        key: 'name',
        type: 'textarea',
        templateOptions: {
          label: 'Task',
          placeholder: 'This will be the card name',
          description: ''
        },
        expressionProperties: {
          'templateOptions.focus': 'formState.awesomeIsForced',
          'templateOptions.description': function(viewValue, modelValue, scope) {
            if (scope.formState.awesomeIsForced) {
              return 'And look! This field magically got focus!';
            }
          }
        }
      },
	  {
        key: 'description',
        type: 'textarea',
        templateOptions: {
          label: 'Description',
          placeholder: 'This will be the card description',
          description: ''
        },
        expressionProperties: {
          'templateOptions.focus': 'formState.awesomeIsForced',
          'templateOptions.description': function(viewValue, modelValue, scope) {
            if (scope.formState.awesomeIsForced) {
              return 'And look! This field magically got focus!';
            }
          }
        }
      },
	    {
        key: 'file',
        type: 'file',
        templateOptions: {
          label: 'File',
          placeholder: 'This will be the card name',
          description: ''
        },
        expressionProperties: {
          'templateOptions.focus': 'formState.awesomeIsForced',
          'templateOptions.description': function(viewValue, modelValue, scope) {
            if (scope.formState.awesomeIsForced) {
              return 'And look! This field magically got focus!';
            }
          }
        }
      },
/*
      {
        key: 'awesome',
        type: 'checkbox',
        templateOptions: { label: '' },
        expressionProperties: {
          'templateOptions.disabled': 'formState.awesomeIsForced',
          'templateOptions.label': function(viewValue, modelValue, scope) {
            if (scope.formState.awesomeIsForced) {
              return 'Too bad, formly is really awesome...';
            } else {
              return 'Is formly totally awesome? (uncheck this and see what happens)';
            }
          }
        }
		
      },
	  
      {
        key: 'whyNot',
        type: 'textarea',
        expressionProperties: {
          'templateOptions.placeholder': function(viewValue, modelValue, scope) {
            if (scope.formState.awesomeIsForced) {
              return 'Too bad... It really is awesome! Wasn\'t that cool?';
            } else {
              return 'Type in here... I dare you';
            }
          },
          'templateOptions.disabled': 'formState.awesomeIsForced'
        },
        hideExpression: 'model.awesome',
        templateOptions: {
          label: 'Why Not?',
          placeholder: 'Type in here... I dare you'
        },
        watcher: {
          listener: function(field, newValue, oldValue, formScope, stopWatching) {
            if (newValue) {
              stopWatching();
              formScope.model.awesome = true;
			  formScope.model.satisfaction = undefined;
			  formScope.model.kiosk=app_settings.kiosk;
              formScope.model.whyNot = undefined;
              field.hideExpression = null;
              formScope.options.formState.awesomeIsForced = true;
            }
          }
        }
      },
	  */
     
      {
        key: 'exampleDirective',
        template: '<div example-directive></div>',
        templateOptions: {
          label: 'Example Directive',
        }
      }
    ];
// Setup
var TOKEN = "";
var KEY = "";
var CARD = "";
var FILE = "";
    // function definition
    function onSubmit() {
	
		formData=(vm.model);
		var myList = formData.list_id;
		var creationSuccess = function(data) {
		  console.log('Card created successfully. Data returned:' + JSON.stringify(data));
		
		if( exampleInputFile.files[0]){
				var formData = new FormData();

				  formData.append("token", Trello.token());
				  formData.append("key", Trello.key());

				formData.append("file", exampleInputFile.files[0]);
				console.log(formData)
				var request = new XMLHttpRequest();
				 request.open("POST", "https://api.trello.com/1/cards/" + data.id + "/attachments");
				  request.send(formData);
		
		vm.options.resetModel()		
		};
		}
			var error = function(err) {
		console.log(err.responseText)
		};
		
		var newCard = {
		  name: formData.name, 
		  file: formData.file, 
		  desc: formData.description,
		  // Place this card at the top of our list 
		  idList: myList,
		  pos: 'top'
		};
		console.log('Trello',Trello)
		Trello.post('/cards/', newCard, creationSuccess,error);  
		var trellokey=formData.key
var trelloroken=formData.token
	


    }  
 }
 
 

	
	}
